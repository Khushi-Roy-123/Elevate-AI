import { useStore } from '../../store/useStore'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function SimulationTab() {
  const { result } = useStore()

  const url = useMemo(() => {
    if (!result?.simulationHTML) return null
    const blob = new Blob([result.simulationHTML], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }, [result?.simulationHTML])

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
        <div className="w-10 h-10 rounded-xl border border-white/8 flex items-center justify-center"
             style={{ background: 'rgba(0,255,157,0.05)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="14" height="14" rx="2" stroke="#00ff9d" strokeWidth="1.2" opacity="0.4"/>
            <path d="M6 9l2 2 4-4" stroke="#00ff9d" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>
        <p className="text-white/30 text-xs">No simulation available for this error type.</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-green" style={{ boxShadow: '0 0 6px #00ff9d' }} />
        <span className="text-xs text-white/35 tracking-wide">Live Simulation</span>
      </div>
      <iframe
        src={url}
        className="flex-1 w-full rounded-xl"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0f', minHeight: '380px' }}
        sandbox="allow-scripts"
        title="Visual Simulation"
      />
    </motion.div>
  )
}
