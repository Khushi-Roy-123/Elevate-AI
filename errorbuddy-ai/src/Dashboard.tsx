import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  History, 
  Radar, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Send, 
  Lightbulb, 
  Copy, 
  Zap, 
  Package2,
  Bot,
  Cpu,
  Layout,
  Network
} from 'lucide-react';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Mock data for initial state
const INITIAL_CODE = `return ListView.builder(
  itemCount: data.length,
  itemBuilder: (context, index) {
    return Text(data[index].name);
  }
);`;

const INITIAL_ERROR = `TypeError: The list 'data' is accessed before it is initialized.`;

export default function Dashboard({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'insights' | 'network'>('terminal');
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [inputCode, setInputCode] = useState(INITIAL_CODE);
  const [errorLog, setErrorLog] = useState(INITIAL_ERROR);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [proposedPatch, setProposedPatch] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: 'bot' | 'user', content: string }[]>([
    { role: 'bot', content: "Detected a TypeError. The list 'data' is accessed before it is initialized. How should we handle the null state?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleAnalyze = async () => {
    if (!inputCode || !errorLog) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an expert debugger. Analyze this code and error:
        
        CODE:
        ${inputCode}
        
        ERROR:
        ${errorLog}
        
        Provide a JSON response with:
        1. "diagnosis": A plain English explanation of the bug.
        2. "patch": The corrected code block.
        3. "tutorMessage": A helpful question or comment for the user to learn from this.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      setAnalysis(result.diagnosis);
      setProposedPatch(result.patch);
      if (result.tutorMessage) {
        setChatMessages(prev => [...prev, { role: 'bot', content: result.tutorMessage }]);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysis("Failed to analyze the error. Please check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    setChatInput("");
    // In a real app, we'd call Gemini here for a chat response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'bot', content: "I'm processing your request. Let's look at the null-safety patterns in Flutter." }]);
    }, 1000);
  };

  return (
    <div className="bg-black text-on-surface font-sans overflow-hidden h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="w-full z-40 bg-black/40 backdrop-blur-3xl flex justify-between items-center px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-6">
          <h1 
            onClick={onBack}
            className="text-xl font-bold text-[#69f6b8] tracking-tighter font-headline uppercase cursor-pointer hover:opacity-80 transition-opacity"
          >
            ErrorBuddy
          </h1>
          <div className="hidden md:flex gap-4 ml-8">
            <nav className="flex gap-4">
              <button 
                onClick={() => setActiveTab('terminal')}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest cursor-pointer transition-all",
                  activeTab === 'terminal' ? "text-[#69f6b8] border-b border-[#69f6b8]" : "text-[#a3aac4] hover:text-[#69f6b8]"
                )}
              >
                Terminal
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest cursor-pointer transition-all",
                  activeTab === 'insights' ? "text-[#69f6b8] border-b border-[#69f6b8]" : "text-[#a3aac4] hover:text-[#69f6b8]"
                )}
              >
                Insights
              </button>
              <button 
                onClick={() => setActiveTab('network')}
                className={cn(
                  "font-mono text-xs uppercase tracking-widest cursor-pointer transition-all",
                  activeTab === 'network' ? "text-[#69f6b8] border-b border-[#69f6b8]" : "text-[#a3aac4] hover:text-[#69f6b8]"
                )}
              >
                Network
              </button>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#69f6b8]"></span>
            <span className="text-[10px] font-mono text-primary tracking-tighter">Gemini</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 opacity-60">
            <span className="w-2 h-2 rounded-full bg-outline"></span>
            <span className="text-[10px] font-mono text-on-surface-variant tracking-tighter">Ollama</span>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <Settings 
              onClick={() => setShowSettings(!showSettings)}
              className={cn("w-5 h-5 cursor-pointer transition-colors", showSettings ? "text-[#69f6b8]" : "text-[#a3aac4] hover:text-[#69f6b8]")} 
            />
            <HelpCircle 
              onClick={() => setShowHelp(!showHelp)}
              className={cn("w-5 h-5 cursor-pointer transition-colors", showHelp ? "text-[#69f6b8]" : "text-[#a3aac4] hover:text-[#69f6b8]")} 
            />
            <div className="w-8 h-8 rounded-full border border-primary/30 p-0.5 overflow-hidden">
              <img alt="User avatar" className="w-full h-full object-cover rounded-full" src="https://picsum.photos/seed/dev/100/100" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4 relative">
        {/* Modals */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowSettings(false)}
            >
              <div 
                className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold font-headline text-primary">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">AI Model</span>
                    <span className="text-xs font-mono text-primary">Gemini 3 Flash</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant">Auto-Patch</span>
                    <div className="w-10 h-5 bg-primary/20 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              onClick={() => setShowHelp(false)}
            >
              <div 
                className="glass-panel p-8 rounded-2xl max-w-md w-full space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold font-headline text-primary">Help Center</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  ErrorBuddy AI uses advanced reasoning to analyze your code. Paste your code and stack trace to get started. 
                  Use the terminal for analysis, Insights for deep dives, and Network for dependency graphs.
                </p>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SideNavBar */}
        <nav className="hidden lg:flex flex-col h-full py-6 w-16 bg-black/40 backdrop-blur-2xl border border-white/10 items-center gap-8 glass-panel rounded-xl">
          <div className="text-[#69f6b8] font-bold font-headline text-xs tracking-tighter rotate-[-90deg] mb-8">HACKMATRIX</div>
          <div className="flex flex-col gap-6 items-center">
            <button className="p-3 text-[#a3aac4] hover:bg-white/5 hover:text-[#69f6b8] transition-all cursor-pointer rounded-lg group relative">
              <History className="w-6 h-6" />
            </button>
            <button className="p-3 text-[#69f6b8] bg-[#69f6b8]/10 border-r-2 border-[#69f6b8] transition-all cursor-pointer rounded-lg relative">
              <Radar className="w-6 h-6" />
            </button>
            <button className="p-3 text-[#a3aac4] hover:bg-white/5 hover:text-[#69f6b8] transition-all cursor-pointer rounded-lg group relative">
              <BarChart3 className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-auto flex flex-col gap-4 items-center">
            <Terminal className="w-5 h-5 text-outline hover:text-primary cursor-pointer" />
            <Layout className="w-5 h-5 text-outline hover:text-primary cursor-pointer" />
          </div>
        </nav>

        {/* Column 1: Left Shard */}
        <section className="flex-1 min-w-[320px] flex flex-col gap-4">
          {/* Code Input Preview */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Input Source
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant">Flutter_Main.dart</span>
            </div>
            <div className="bg-black rounded p-3 font-mono text-[11px] text-on-surface-variant overflow-hidden border border-white/10">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-[#69f6b8]"
                rows={6}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
              />
            </div>
            <div className="bg-black/40 rounded p-3 font-mono text-[11px] text-error border border-error/20">
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 resize-none text-error"
                rows={2}
                value={errorLog}
                onChange={(e) => setErrorLog(e.target.value)}
              />
            </div>
          </div>

          {/* Personalized Learning Chat */}
          <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-on-surface uppercase tracking-widest">Tutor Module</span>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === 'user' && "justify-end")}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={cn(
                    "p-3 rounded-lg text-sm leading-relaxed",
                    msg.role === 'bot' ? "bg-white/5 border border-white/5 rounded-tl-none text-on-surface-variant" : "bg-primary/10 border border-primary/20 rounded-tr-none text-on-surface max-w-[80%]"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="bg-black rounded-full px-4 py-2 flex items-center gap-3 border border-white/10">
                <input 
                  className="bg-transparent border-none focus:ring-0 text-sm text-on-surface flex-1 placeholder:text-outline/40" 
                  placeholder="Ask about this error..." 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>
                  <Send className="w-4 h-4 text-primary cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Column 2: Central Shard */}
        <section className="flex-[1.5] flex flex-col items-center justify-center p-8 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'terminal' ? (
              <>
                {!analysis ? (
                  <motion.div 
                    key="terminal-empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-panel rounded-2xl p-10 max-w-2xl w-full border-primary/10 relative overflow-hidden text-center"
                  >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                      <Terminal className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-4">
                      Ready to Debug?
                    </h2>
                    <p className="text-on-surface-variant text-lg mb-8">
                      Paste your code and error log on the left, then hit analyze to get a deep dive into the logic.
                    </p>
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="bg-primary text-on-primary-container px-8 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all glow-primary disabled:opacity-50"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Logic"}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="terminal-result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-panel rounded-2xl p-10 max-w-2xl w-full border-primary/10 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                    <div className="flex flex-col gap-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <Lightbulb className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-headline text-3xl font-bold tracking-tight text-white leading-tight">
                        Logic Blocked: <span className="text-error italic">Analysis Complete</span>
                      </h2>
                      <div className="text-left p-6 bg-black rounded-xl border border-white/5">
                        <div className="flex items-start gap-4">
                          <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded">DIAGNOSIS</span>
                          <div className="text-sm text-on-surface-variant leading-relaxed">
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setAnalysis(null)}
                        className="text-xs text-primary hover:underline"
                      >
                        Reset Analysis
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : activeTab === 'insights' ? (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel rounded-2xl p-10 max-w-2xl w-full border-primary/10 relative overflow-hidden text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-4">Code Insights</h2>
                <div className="space-y-4 text-left">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <h4 className="text-primary font-bold text-sm mb-1">Complexity Analysis</h4>
                    <p className="text-xs text-on-surface-variant">Cyclomatic complexity is within healthy limits (Score: 4).</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                    <h4 className="text-primary font-bold text-sm mb-1">Performance Bottlenecks</h4>
                    <p className="text-xs text-on-surface-variant">ListView.builder is efficient, but consider adding a debounce to the data stream.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="network"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel rounded-2xl p-10 max-w-2xl w-full border-primary/10 relative overflow-hidden text-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 border border-primary/20">
                  <Network className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tight text-white mb-4">Network Graph</h2>
                <div className="h-48 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-primary rounded-full relative"></div>
                    <div className="absolute -top-10 -left-10 w-2 h-2 bg-tertiary rounded-full"></div>
                    <div className="absolute -bottom-10 -right-10 w-2 h-2 bg-tertiary rounded-full"></div>
                  </div>
                </div>
                <p className="mt-6 text-xs text-on-surface-variant uppercase tracking-widest">Visualizing dependency tree...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Visualize Button */}
          <button className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-primary-container px-6 py-3 rounded-full text-on-primary-container font-headline font-bold text-sm tracking-widest uppercase glow-primary transition-all active:scale-95 group">
            <Network className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Visualize DSA/ML
          </button>
        </section>

        {/* Column 3: Right Shard */}
        <section className="flex-1 min-w-[320px] flex flex-col gap-4">
          <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
            {/* Editor Header */}
            <div className="p-4 bg-black/60 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-error/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary/40"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
                </div>
                <span className="ml-4 text-[10px] font-mono text-on-surface-variant tracking-widest uppercase">Proposed_Patch.dart</span>
              </div>
              <Copy className="w-4 h-4 text-outline cursor-pointer hover:text-primary" />
            </div>
            {/* Code Editor */}
            <div className="flex-1 p-6 font-mono text-sm bg-black leading-relaxed overflow-auto">
              {proposedPatch ? (
                <pre className="text-on-surface">
                  <code>{proposedPatch}</code>
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-outline/40 italic">
                  Run analysis to see proposed fix
                </div>
              )}
            </div>
            {/* Editor Footer / Actions */}
            <div className="p-6 bg-white/5 flex flex-col gap-3">
              <button className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <Zap className="w-4 h-4" />
                Patch Project
              </button>
              <button className="w-full bg-transparent border border-white/10 text-on-surface-variant py-3 rounded-lg font-headline font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                <Copy className="w-4 h-4" />
                Copy Fix
              </button>
            </div>
          </div>
          {/* Dependency Insight */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
            <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest flex items-center gap-2">
              <Package2 className="w-3 h-3" /> Context Insight
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">Flutter SDK</span>
              <span className="text-primary">v3.19.0 (Stable)</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-3/4"></div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none bg-gradient-to-t from-black to-transparent z-0"></div>
    </div>
  );
}
