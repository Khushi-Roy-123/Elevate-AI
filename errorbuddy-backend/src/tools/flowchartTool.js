// Generates a self-contained interactive error flowchart HTML
function generate_interactive_flowchart({ type, code_snippet, error_description }) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error Flowchart</title>
<style>
*{box-sizing:border-box}
body{margin:0;background:#0a0a0f;color:#fff;font-family:monospace;padding:20px;overflow:auto}
h2{color:#00ff9d;text-align:center;margin:0 0 16px}
.info{color:#00f0ff;font-size:13px;text-align:center;margin-bottom:16px;max-width:600px;margin-left:auto;margin-right:auto}
svg{display:block;margin:0 auto;max-width:100%}
.node rect{fill:#1a1a2e;stroke:#00f0ff;stroke-width:2;rx:8;cursor:pointer;transition:all 0.2s}
.node rect:hover,.node.active rect{fill:#00f0ff22;stroke:#00ff9d;stroke-width:3}
.node text{fill:#fff;font-family:monospace;font-size:13px;text-anchor:middle;dominant-baseline:middle;pointer-events:none}
.edge{stroke:#00f0ff55;stroke-width:2;fill:none;marker-end:url(#arrow)}
.edge-label{fill:#00ff9d;font-size:11px;font-family:monospace}
.detail{background:#1a1a2e;border:1px solid #00ff9d44;border-radius:8px;padding:16px;margin:16px auto;max-width:600px;color:#e0e0e0;font-size:13px;line-height:1.6;display:none}
.detail.show{display:block}
.detail h3{color:#00ff9d;margin:0 0 8px}
</style></head>
<body>
<h2>🗺️ Error Flowchart</h2>
<p class="info">${error_description||'Click any node to see details about that step'}</p>
<svg id="chart" width="620" height="480" viewBox="0 0 620 480">
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#00f0ff55"/>
    </marker>
  </defs>
  <!-- Edges -->
  <path class="edge" d="M310,60 L310,110"/>
  <path class="edge" d="M310,150 L310,200"/>
  <path class="edge" d="M310,240 L200,290"/>
  <path class="edge" d="M310,240 L420,290"/>
  <path class="edge" d="M200,330 L200,380"/>
  <path class="edge" d="M420,330 L420,380"/>
  <text class="edge-label" x="220" y="270">Yes</text>
  <text class="edge-label" x="390" y="270">No</text>
  <!-- Nodes -->
  <g class="node" onclick="showDetail('start')" id="n-start">
    <rect x="210" y="20" width="200" height="40" rx="8"/>
    <text x="310" y="40">🚀 Code Execution Starts</text>
  </g>
  <g class="node" onclick="showDetail('error')" id="n-error">
    <rect x="210" y="110" width="200" height="40" rx="8"/>
    <text x="310" y="130">⚠️ Error Encountered</text>
  </g>
  <g class="node" onclick="showDetail('check')" id="n-check">
    <rect x="210" y="200" width="200" height="40" rx="8"/>
    <text x="310" y="220">🔍 Is it a Logic Error?</text>
  </g>
  <g class="node" onclick="showDetail('logic')" id="n-logic">
    <rect x="100" y="290" width="200" height="40" rx="8"/>
    <text x="200" y="310">🧠 Fix Logic / Algorithm</text>
  </g>
  <g class="node" onclick="showDetail('syntax')" id="n-syntax">
    <rect x="320" y="290" width="200" height="40" rx="8"/>
    <text x="420" y="310">✏️ Fix Syntax / Types</text>
  </g>
  <g class="node" onclick="showDetail('test')" id="n-test">
    <rect x="100" y="380" width="200" height="40" rx="8"/>
    <text x="200" y="400">✅ Test with Edge Cases</text>
  </g>
  <g class="node" onclick="showDetail('debug')" id="n-debug">
    <rect x="320" y="380" width="200" height="40" rx="8"/>
    <text x="420" y="400">🐛 Debug with Logs</text>
  </g>
</svg>
<div class="detail" id="detail-box">
  <h3 id="detail-title"></h3>
  <p id="detail-body"></p>
</div>
<script>
const details={
  start:{title:'Code Execution Starts',body:'Your program begins running. The runtime reads your code top-to-bottom, allocating memory and executing statements.'},
  error:{title:'Error Encountered',body:'An exception or unexpected behavior occurs. This could be a runtime error (like null pointer), syntax error, or logical bug producing wrong output.'},
  check:{title:'Is it a Logic Error?',body:'Logic errors produce wrong results without crashing. Syntax/type errors usually crash immediately with a clear message. Check the error message carefully.'},
  logic:{title:'Fix Logic / Algorithm',body:'Review your algorithm. Trace through with a small example by hand. Check loop bounds, conditions, and data structure operations.'},
  syntax:{title:'Fix Syntax / Types',body:'Read the error message line number. Check for missing brackets, wrong types, undefined variables, or incorrect API usage.'},
  test:{title:'Test with Edge Cases',body:'After fixing, test with: empty input, single element, maximum values, negative numbers, and the original failing case.'},
  debug:{title:'Debug with Logs',body:'Add console.log/print statements before and after the error line. Print variable values to understand the program state.'},
};
function showDetail(key){
  const d=details[key];
  document.getElementById('detail-title').textContent=d.title;
  document.getElementById('detail-body').textContent=d.body;
  document.getElementById('detail-box').className='detail show';
  document.querySelectorAll('.node').forEach(n=>n.classList.remove('active'));
  document.getElementById('n-'+key).classList.add('active');
}
</script></body></html>`;
}

module.exports = { generate_interactive_flowchart };
