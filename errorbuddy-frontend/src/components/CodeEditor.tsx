import Editor from '@monaco-editor/react'
import { useStore } from '../store/useStore'

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust']

export default function CodeEditor() {
  const { code, error, language, setCode, setError, setLanguage } = useStore()

  return (
    <div className="flex flex-col h-full gap-3">

      {/* Language selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-white/35 uppercase tracking-widest">Language</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ background: '#0d0d1a', color: '#d4d4d8' }}
          className="border border-white/10 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-neon-cyan/40 cursor-pointer transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 rounded-xl overflow-hidden border border-white/8 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(v) => setCode(v || '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            padding: { top: 14, bottom: 14 },
            smoothScrolling: true,
            cursorBlinking: 'phase',
            cursorSmoothCaretAnimation: 'on',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
          }}
        />
      </div>

      {/* Error message input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-white/35 uppercase tracking-widest">
          Error Message
        </label>
        <textarea
          value={error}
          onChange={(e) => setError(e.target.value)}
          placeholder="Paste your error / traceback here..."
          rows={3}
          style={{ background: 'rgba(255,59,92,0.05)', color: '#d4d4d8' }}
          className="border border-[#ff3b5c22] text-sm rounded-xl px-4 py-3 outline-none resize-none placeholder:text-white/20 focus:border-[#ff3b5c44] transition-colors font-mono leading-relaxed"
        />
      </div>
    </div>
  )
}
