import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { explainCode, saveHistory } from '../api/explain'
import CodeEditor from '../components/CodeEditor'
import ResultPanel from '../components/ResultPanel'
import Confetti from 'react-confetti'

export default function AppPage() {
  const { code, error, language, loading, setLoading, setResult, addHistory } = useStore()
  const [showConfetti, setShowConfetti] = useState(false)

  const handleExplain = useCallback(async () => {
    if (!code.trim() && !error.trim()) return
    setLoading(true)
    try {
      const res = await explainCode(code, error, language)
      setResult(res)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3200)
      const entry = {
        id: Date.now().toString(),
        code, error, language,
        result: res,
        timestamp: new Date().toISOString(),
      }
      addHistory(entry)
      saveHistory(entry)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setResult({
        explanation: {
          whatWentWrong: 'Failed to reach the backend.',
          whyItHappened: msg,
          proTip: 'Ensure the backend is running on port 3001 and GEMINI_API_KEY is set in .env',
          commonMistakes: [],
        },
        fixedCode: code,
        diffSummary: '',
        simulationHTML: '',
        flowchartHTML: '',
      })
    } finally {
      setLoading(false)
    }
  }, [code, error, language, setLoading, setResult, addHistory])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleExplain()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleExplain])

  return (
    <div className="flex flex-col h-screen pt-16 px-3 pb-3 overflow-hidden" style={{ background: '#07070e' }}>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={260}
          colors={['#00ff9d', '#00f0ff', '#ff3b5c', '#ffffff88']}
        />
      )}

      <div className="flex gap-3 flex-1 min-h-0 mt-3">

        {/* Left panel — Editor */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-[48%] flex flex-col rounded-2xl p-4"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff3b5c' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#00ff9d' }} />
            <span className="text-xs text-white/20 ml-2 font-mono">editor.{language}</span>
          </div>
          <CodeEditor />
        </motion.div>

        {/* Right panel — Results */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col rounded-2xl p-4 min-w-0"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <ResultPanel />
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleExplain}
        disabled={loading}
        className="fixed bottom-7 right-7 z-50 pulse-neon flex items-center gap-2.5 font-bold text-sm tracking-wide rounded-full px-7 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: '#00ff9d', color: '#07070e', border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(0,255,157,0.3)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black spin" />
            Analyzing...
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.5 1L9.5 5.5H14L10.5 8.5L12 13L7.5 10.5L3 13L4.5 8.5L1 5.5H5.5L7.5 1Z"
                    fill="currentColor"/>
            </svg>
            Explain &amp; Fix
            <span className="text-xs opacity-50 font-normal font-mono">Ctrl+↵</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
