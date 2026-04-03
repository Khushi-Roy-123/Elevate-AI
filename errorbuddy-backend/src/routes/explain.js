'use strict';

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { generate_visual_simulation } = require('../tools/simulationTool');
const { generate_interactive_flowchart } = require('../tools/flowchartTool');

// ── Tool declarations for Gemini function calling ────────────────────────────
const toolDeclarations = [
  {
    name: 'generate_visual_simulation',
    description: 'Generate a live interactive canvas simulation for DSA/ML concepts.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          description: 'One of: gradient_descent, linear_regression, bst_traversal, merge_sort, bubble_sort, neural_net_forward_pass, k_means_clustering',
        },
        code_snippet:      { type: 'string', description: 'The relevant code snippet' },
        error_description: { type: 'string', description: 'Short description of the error' },
      },
      required: ['type', 'error_description'],
    },
  },
  {
    name: 'generate_interactive_flowchart',
    description: 'Generate an interactive debugging flowchart for the error.',
    parameters: {
      type: 'object',
      properties: {
        type:              { type: 'string', description: 'Error category or concept type' },
        code_snippet:      { type: 'string', description: 'The relevant code snippet' },
        error_description: { type: 'string', description: 'Short description of the error' },
      },
      required: ['error_description'],
    },
  },
];

// ── Detect best simulation type from code + error text ───────────────────────
function detectSimType(code, error) {
  const t = ((code || '') + ' ' + (error || '')).toLowerCase();
  if (t.includes('gradient') || t.includes('regression') || t.includes('loss')) return 'gradient_descent';
  if (t.includes('merge') && t.includes('sort')) return 'merge_sort';
  if (t.includes('bubble') || (t.includes('sort') && !t.includes('merge'))) return 'bubble_sort';
  if (t.includes('bst') || t.includes('binary search tree') || t.includes('traversal') || t.includes('inorder')) return 'bst_traversal';
  if (t.includes('neural') || t.includes('forward pass') || t.includes('activation')) return 'neural_net_forward_pass';
  if (t.includes('kmeans') || t.includes('k-means') || t.includes('cluster')) return 'k_means_clustering';
  if (t.includes('sort')) return 'bubble_sort';
  if (t.includes('tree') || t.includes('graph')) return 'bst_traversal';
  return 'bubble_sort'; // sensible default for DSA students
}

// ── Main route ───────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { code = '', error = '', language = 'python' } = req.body;

  if (!code.trim() && !error.trim()) {
    return res.status(400).json({ error: 'Provide code or an error message.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in .env' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-preview-04-17',
      tools: [{ functionDeclarations: toolDeclarations }],
      generationConfig: { temperature: 0.3 },
    });

    // ── Step 1: send the analysis prompt ──────────────────────────────────
    const analysisPrompt = [
      `You are ErrorBuddy AI — a precise debugging assistant for VIT Bhopal students.`,
      ``,
      `Analyze the following ${language} code and error message.`,
      ``,
      `CODE:`,
      '```' + language,
      code || '(none)',
      '```',
      ``,
      `ERROR MESSAGE:`,
      error || '(none)',
      ``,
      `Return ONLY a valid JSON object — no markdown fences, no extra text:`,
      `{`,
      `  "explanation": {`,
      `    "whatWentWrong": "one clear sentence",`,
      `    "whyItHappened": "technical root cause in 2-3 sentences",`,
      `    "proTip": "one actionable tip to prevent this",`,
      `    "commonMistakes": ["mistake 1", "mistake 2"]`,
      `  },`,
      `  "fixedCode": "complete corrected code as a string",`,
      `  "diffSummary": "one sentence describing the fix"`,
      `}`,
      ``,
      `After returning the JSON, call generate_visual_simulation and generate_interactive_flowchart`,
      `with the most relevant simulation type for this code/error.`,
    ].join('\n');

    const chat = model.startChat();
    const firstResult = await chat.sendMessage(analysisPrompt);
    const firstResponse = firstResult.response;

    let explanation = null;
    let fixedCode = '';
    let diffSummary = '';
    let simulationHTML = null;
    let flowchartHTML = null;

    // ── Step 2: collect text + any tool calls from first response ─────────
    const functionCalls = [];
    const firstParts = firstResponse.candidates?.[0]?.content?.parts || [];

    for (const part of firstParts) {
      if (part.text) {
        const raw = part.text.trim()
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        if (raw.startsWith('{')) {
          try {
            const parsed = JSON.parse(raw);
            explanation  = parsed.explanation  || null;
            fixedCode    = parsed.fixedCode    || '';
            diffSummary  = parsed.diffSummary  || '';
          } catch {
            // not valid JSON — treat as plain explanation text
            if (!explanation) {
              explanation = {
                whatWentWrong: raw,
                whyItHappened: '',
                proTip: '',
                commonMistakes: [],
              };
            }
          }
        }
      }
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }

    // ── Step 3: execute tool calls if Gemini requested them ───────────────
    if (functionCalls.length > 0) {
      const functionResponses = [];

      for (const fc of functionCalls) {
        const { name, args } = fc;
        let toolResult = '';

        if (name === 'generate_visual_simulation') {
          simulationHTML = generate_visual_simulation(args);
          toolResult = 'Simulation HTML generated successfully.';
        } else if (name === 'generate_interactive_flowchart') {
          flowchartHTML = generate_interactive_flowchart(args);
          toolResult = 'Flowchart HTML generated successfully.';
        }

        functionResponses.push({
          functionResponse: { name, response: { result: toolResult } },
        });
      }

      // Send tool results back so Gemini can continue
      await chat.sendMessage(functionResponses);
    }

    // ── Step 4: fallback generation if Gemini didn't call the tools ───────
    if (!simulationHTML) {
      simulationHTML = generate_visual_simulation({
        type: detectSimType(code, error),
        code_snippet: code,
        error_description: error || 'Code error',
      });
    }
    if (!flowchartHTML) {
      flowchartHTML = generate_interactive_flowchart({
        type: 'general',
        code_snippet: code,
        error_description: error || 'Code error',
      });
    }

    // ── Step 5: fallback explanation if JSON parse failed ─────────────────
    if (!explanation) {
      explanation = {
        whatWentWrong: 'Could not parse AI response. Check the fixed code tab.',
        whyItHappened: '',
        proTip: 'Try rephrasing your error message for better results.',
        commonMistakes: [],
      };
    }

    return res.json({ explanation, fixedCode, diffSummary, simulationHTML, flowchartHTML });

  } catch (err) {
    console.error('[ErrorBuddy] Gemini error:', err?.message || err);

    // Surface a useful error to the frontend
    const msg = err?.message || 'AI processing failed';
    const isApiKey = msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('permission');

    return res.status(500).json({
      error: isApiKey
        ? 'Invalid or missing GEMINI_API_KEY. Check your .env file.'
        : msg,
    });
  }
});

module.exports = router;
