import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function History() {
  const { history, clearHistory, setResult, setCode, setError, setLanguage } = useStore()
  const navigate = useNavigate()

  const replay = (entry: (typeof history)[0]) => {
    setCode(entry.code)
    setError(entry.error)
    setLanguage(entry.language)
    setResult(entry.result)
    navigate('/app')
  }

  return (
    <div className="min-h-screen grid-bg pt-20 px-6 pb-16" style={{ background: '#07070e' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Debug <span className="text-neon-green">History</span>
            </h1>
            <p className="text-white/30 text-xs mt-1">{history.length} session{history.length !== 1 ? 's' : ''} saved locally</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{ background: 'transparent', border: '1px solid rgba(255,59,92,0.2)', color: 'rgba(255,59,92,0.6)', cursor: 'pointer', padding: '6px 14px', borderRadius: '8px', fontSize: '12px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,59,92,0.5)'; (e.currentTarget as HTMLButtonElement).style.color = '#ff3b5c' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,59,92,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,59,92,0.6)' }}
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-2xl border border-white/8 flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2a9 9 0 100 18A9 9 0 0011 2zm0 4v5l3 3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-white/25 text-sm">No debug sessions yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.015 }}
                onClick={() => replay(entry)}
                className="rounded-xl p-4 cursor-pointer group transition-all"
                style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,255,157,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                        style={{ background: 'rgba(0,240,255,0.08)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.15)' }}>
                    {entry.language}
                  </span>
                  <span className="text-xs text-white/25">{timeAgo(entry.timestamp)}</span>
                </div>

                {/* Error */}
                <p className="text-xs font-mono truncate mb-2" style={{ color: '#ff3b5c99' }}>
                  {entry.error || 'No error message'}
                </p>

                {/* Code preview */}
                <pre className="text-xs font-mono overflow-hidden leading-5 mb-3"
                     style={{ color: 'rgba(255,255,255,0.25)', height: '60px' }}>
                  {entry.code.slice(0, 140)}
                </pre>

                {/* Fix summary */}
                {entry.result?.diffSummary && (
                  <p className="text-xs truncate mb-2" style={{ color: 'rgba(0,255,157,0.6)' }}>
                    {entry.result.diffSummary}
                  </p>
                )}

                <p className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.15)' }}
                   onMouseEnter={e => (e.currentTarget as HTMLParagraphElement).style.color = '#00ff9d'}
                   onMouseLeave={e => (e.currentTarget as HTMLParagraphElement).style.color = 'rgba(255,255,255,0.15)'}>
                  Replay session
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
