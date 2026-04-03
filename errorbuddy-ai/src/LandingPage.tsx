import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  PlayCircle, 
  Bolt, 
  RefreshCw, 
  Brain, 
  Network, 
  FlaskConical, 
  ArrowRight,
  Copy,
  Lightbulb
} from 'lucide-react';
import { cn } from './lib/utils';

// Mapping Material Symbols to Lucide
const LucidePsychology = Brain;
const LucideAccountTree = Network;

export default function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="bg-black text-[#F8F9FA] font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5 shadow-[0_0_40px_rgba(16,185,129,0.05)]">
        <div className="flex justify-between items-center px-8 h-20 w-full max-w-full mx-auto">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-bold tracking-tighter text-emerald-400 font-headline cursor-pointer hover:opacity-80 transition-opacity"
          >
            ErrorBuddy AI
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-emerald-400 font-bold border-b-2 border-emerald-400 pb-1 font-headline tracking-tight cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-400 hover:text-emerald-300 transition-colors font-headline tracking-tight cursor-pointer"
            >
              Examples
            </button>
            <button 
              onClick={() => document.getElementById('future')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-slate-400 hover:text-emerald-300 transition-colors font-headline tracking-tight cursor-pointer"
            >
              Resources
            </button>
          </div>
          <button 
            onClick={onLaunch}
            className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-bold hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 scale-95 active:scale-90 font-headline"
          >
            Start Debugging
          </button>
        </div>
      </nav>

      <main className="relative pt-20">
        {/* Hero Section */}
        <section id="demo" className="relative min-h-[921px] flex items-center px-8 lg:px-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 bg-black">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/15 rounded-full blur-[140px]"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-tertiary/15 rounded-full blur-[140px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNwSUot_3SFGKVp4SrkTFMrFCDJ9NriJweqM93mYPoPWghWJ0ASGiK51-WjzcU1RNLAs3I2TeM3gcaRiBEhGcAiU1oTgr9j-7IDwLg2PbUCDxEbOmYKeDywdU0p9CsY3X1WQrf9GQDr6aqlvBEAry2gtJFOW9SqOaS-JPdbdXhg5DoezowpDHrKAt4G_tUa4AJBG-U3k_OEPZ8OFV755QR6J6zGJIS0lm2d8GM6Bn4M00aZ2ilA79bSJP6bqltj385wpdK0UUjMko"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                <Bolt className="text-primary w-4 h-4" />
                <span className="text-primary font-mono text-[10px] tracking-widest uppercase">Now Powered by GPT-4o Debugger</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold font-headline text-[#F8F9FA] leading-[1.1] tracking-tighter">
                From <span className="text-primary terminal-text">Error</span> to Clarity in Seconds
              </h1>
              <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl leading-relaxed">
                Paste any error. Get instant plain-English explanation, corrected code, and live visual simulations for DSA & ML models.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onLaunch}
                  className="px-8 py-4 bg-primary text-on-primary-container font-bold rounded-xl flex items-center justify-center space-x-2 glow-primary transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Terminal className="w-5 h-5" />
                  <span>Launch Terminal</span>
                </button>
                <button className="px-8 py-4 border border-outline-variant bg-black/40 backdrop-blur-3xl text-[#F8F9FA] font-bold rounded-xl flex items-center justify-center space-x-2 transition-all hover:bg-white/5">
                  <span>Watch Demo</span>
                  <PlayCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4 pt-4 grayscale opacity-70">
                <span className="text-xs font-mono uppercase tracking-widest">Trusted by teams at:</span>
                <div className="flex space-x-6">
                  <span className="font-bold tracking-tighter text-lg">VERCEL</span>
                  <span className="font-bold tracking-tighter text-lg">STRIPE</span>
                  <span className="font-bold tracking-tighter text-lg">OPENAI</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Demo Area */}
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-2xl p-6 lg:p-8 shadow-2xl relative">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-3xl"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-error-dim/40"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary/40"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                  </div>
                  <div className="text-xs font-mono text-outline uppercase tracking-widest">Interactive_Debugger_v2.0</div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-primary uppercase tracking-tighter">Input Code</label>
                      <textarea 
                        className="w-full h-48 bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-sm text-[#F8F9FA] focus:border-primary focus:ring-0 transition-colors resize-none" 
                        placeholder="def mystery(x):&#10;  return x / 0"
                        defaultValue="def mystery(x):&#10;  return x / 0"
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-error uppercase tracking-tighter">Stack Trace / Error</label>
                      <textarea 
                        className="w-full h-48 bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-sm text-[#F8F9FA] focus:border-error focus:ring-0 transition-colors resize-none" 
                        placeholder="ZeroDivisionError: division by zero"
                        defaultValue="ZeroDivisionError: division by zero"
                      ></textarea>
                    </div>
                  </div>
                  <button className="w-full py-4 bg-primary text-on-primary-container font-bold rounded-xl flex items-center justify-center space-x-3 glow-primary hover:brightness-110 transition-all group">
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>Explain & Fix</span>
                  </button>
                  <div className="mt-6 border-t border-white/5 pt-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="text-primary w-4 h-4" />
                      <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-primary">Result Analysis</h4>
                    </div>
                    <div className="bg-black/60 backdrop-blur-3xl rounded-xl p-6 border border-white/5">
                      <p className="text-sm leading-relaxed text-[#F8F9FA] font-body mb-4">
                        <span className="text-primary font-bold">Explanation:</span> You are attempting to divide a number by zero, which is mathematically undefined. In Python, this triggers a <code className="bg-error/20 text-error px-1 rounded">ZeroDivisionError</code>.
                      </p>
                      <div className="relative group">
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:text-primary transition-colors"><Copy className="w-4 h-4" /></button>
                        </div>
                        <pre className="text-xs font-mono bg-black/80 p-4 rounded-lg overflow-x-auto border border-white/5">
                          <span className="text-primary">def</span> <span className="text-tertiary">mystery</span>(x):{"\n"}
                          {"    "}<span className="text-on-surface-variant"># Added safety check for zero division</span>{"\n"}
                          {"    "}<span className="text-primary">if</span> x == <span className="text-secondary">0</span>:{"\n"}
                          {"        "}<span className="text-primary">return</span> <span className="text-secondary">0</span>{"\n"}
                          {"    "}<span className="text-primary">return</span> x / <span className="text-secondary">10</span> <span className="text-on-surface-variant"># Fixed divisor</span>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="py-24 px-8 lg:px-20 relative bg-black">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-headline mb-4 text-white">Supercharged Intelligence</h2>
            <p className="text-on-surface-variant max-w-2xl">Traditional debuggers show you where it broke. ErrorBuddy tells you why, how it relates to your project, and visualizes the logic flow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-8 glass-panel rounded-2xl p-8 relative overflow-hidden group">
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaiMFxFWP9Cq0CASHtNJF2c5z_CBAlE0JxoCQkunnP-4O54WfR1Vlu-HZTAfCLO-cdxmfch0Lc3K7OV3F7S8cymVCQAoW4qjHhXB8tFnfKRk7OqYLCZh1HI56nVJu6f4G3RLyQa4W9dvF7owICSneK_fngQeLK6O0jT73TJj50Ed0q6DMyxZxrguUXLyi-34BfPKESbXsBrmBEn3m7AY7u0fyneVC1NsIX7YTWEe0tR3jzrsRZeyzSe7CQI4t2TZKfzg_zpiudFqM"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Network className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold font-headline mb-2 text-white">DSA Visual Simulations</h3>
                <p className="text-on-surface-variant max-w-md">Step through your algorithms frame-by-frame. Watch your binary tree rebalance or your graph traverse in real-time 3D.</p>
              </div>
            </div>
            <div className="md:col-span-4 bg-primary-container rounded-2xl p-8 flex flex-col justify-end group cursor-pointer hover:brightness-110 transition-all">
              <div className="mb-auto text-on-primary-container">
                <Terminal className="w-10 h-10 mb-4" />
                <h3 className="text-2xl font-bold font-headline">CLI Integration</h3>
                <p className="mt-2 text-on-primary-container/80 text-sm">Pipe your terminal errors directly into ErrorBuddy with a single command.</p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-on-primary-container/10 px-2 py-1 rounded">npm install -g errorbuddy</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
            <div className="md:col-span-4 glass-panel rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <FlaskConical className="text-tertiary w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold font-headline text-white">ML Model Debugging</h3>
                <p className="mt-2 text-on-surface-variant text-sm">Visualize tensor shapes and identify vanishing gradients with intuitive heatmaps.</p>
              </div>
            </div>
            <div className="md:col-span-8 glass-panel rounded-2xl p-8 flex items-center space-x-8 overflow-hidden">
              <div className="flex-1">
                <h3 className="text-xl font-bold font-headline mb-2 text-white">Context-Aware Solutions</h3>
                <p className="text-on-surface-variant text-sm">ErrorBuddy scans your entire repository to provide solutions that actually respect your architectural patterns.</p>
              </div>
              <div className="flex-none hidden md:block">
                <img 
                  className="w-48 h-32 rounded-lg object-cover border border-white/10 opacity-60" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADXy1EC4S_LsOMx3zIUsDcATkb1zeFTlLMPbLgWkRMWegC89rQltcpr6KhXAtZH6lwCXXhW9BKFqN7S-6OCvYVkVaP2rvLF5nH9j5S0weYkS4w4gLKXQ2_D0EiKIUHVZ5rM-14dSmplDpyapHLBw00Fd_sv_Ct1BuCrMIHf4f9fcWUUVK85uS2kfllsrXnFWjrKgXE1g9GLdeHu5tTXPhiV6NyyrSrhro_uFzephKyAwhL819DYk84eumRSQNTaMIntw_H40a04vY"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Parallax Screenshot Section */}
        <section id="future" className="py-40 relative overflow-hidden bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none"></div>
          <div className="container mx-auto px-8 lg:px-20 relative z-20 text-center mb-24">
            <h2 className="text-4xl lg:text-6xl font-bold font-headline mb-6 text-white">The Future of Debugging</h2>
            <p className="text-on-surface-variant text-xl max-w-3xl mx-auto leading-relaxed">
              A panoramic 3D dashboard that turns chaotic logs into an organized technical landscape.
            </p>
          </div>
          <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-0">
            <div className="relative transform -rotate-2 scale-105 perspective-2000">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(105,246,184,0.1)] rotate-x-12">
                <img 
                  className="w-full h-auto opacity-90" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBczX9oQR2DDXiluZoMqmEccGZw6KphhBMowTH7jCVGnoXEP7j1QcXi-uwwpN9vOHkEl7jkjDH0w0RRqU-1MYVB5pcUFHxPNMKP6IXu7sKtjGTlMemjro01PFzF4rHLfaXJhTfmim-WnjkjamUrqWUttx7xs5l9Ld9yTarJvvmdtiyN9PISru7xIbn2L7MaACaAOtfskZ0NImFSruk1nDBfCw0irWyaKWLPZPSolz5knRWO6qHvRsN6XMFXilKwKTkf2X__C8CDhsY"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 glass-panel p-4 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '5s' }}>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-white">Live_Visual_Sim</span>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 glass-panel p-4 rounded-xl shadow-2xl animate-bounce" style={{ animationDuration: '7s' }}>
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                <span className="text-[10px] font-mono tracking-widest uppercase text-white">AI_Refactor_Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 lg:px-20 text-center relative overflow-hidden bg-black">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[200px] -z-10"></div>
          <h2 className="text-4xl lg:text-7xl font-bold font-headline mb-8 tracking-tighter text-white">Ready to debug like a god?</h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto mb-12">Join 40,000+ developers turning frustration into progress.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onLaunch}
              className="px-12 py-5 bg-primary text-on-primary-container font-bold rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all glow-primary"
            >
              Get Started for Free
            </button>
            <button className="px-12 py-5 border border-outline-variant bg-black/40 backdrop-blur-3xl text-white font-bold rounded-2xl text-lg hover:bg-white/5 transition-all">
              Talk to Sales
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black w-full py-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-8 w-full">
          <div className="text-emerald-500 font-bold text-xl font-headline">
            ErrorBuddy AI
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-emerald-400 transition-opacity opacity-80 hover:opacity-100 hover:underline decoration-emerald-500/50 underline-offset-4" href="#">Documentation</a>
            <a className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-emerald-400 transition-opacity opacity-80 hover:opacity-100 hover:underline decoration-emerald-500/50 underline-offset-4" href="#">API Reference</a>
            <a className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-emerald-400 transition-opacity opacity-80 hover:opacity-100 hover:underline decoration-emerald-500/50 underline-offset-4" href="#">Changelog</a>
            <a className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-emerald-400 transition-opacity opacity-80 hover:opacity-100 hover:underline decoration-emerald-500/50 underline-offset-4" href="#">Status</a>
            <a className="font-mono text-xs tracking-widest uppercase text-slate-500 hover:text-emerald-400 transition-opacity opacity-80 hover:opacity-100 hover:underline decoration-emerald-500/50 underline-offset-4" href="#">Privacy</a>
          </div>
          <div className="font-mono text-xs tracking-widest uppercase text-slate-500">
            © 2024 ErrorBuddy AI. Built for the neon terminal.
          </div>
        </div>
      </footer>
    </div>
  );
}
