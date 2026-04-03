import { useStore } from '../../store/useStore'
import { motion } from 'framer-motion'
import { useMemo } from 'react'

export default function FlowchartTab() {
  const { result } = useStore()

  const url = useMemo(() => {
    if (!result?.flowchartHTML) return null
    const blob = new Blob([result.flowchartHTML], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }, [result?.flowchartHTML])

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
        <p className="text-white/30 text-xs">No flowchart available.</p>
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
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" style={{ boxShadow: '0 0 6px #00f0ff' }} />
        <span className="text-xs text-white/35 tracking-wide">Interactive Error Map — click nodes to explore</span>
      </div>
      <iframe
        src={url}
        className="flex-1 w-full rounded-xl"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0f', minHeight: '380px' }}
        sandbox="allow-scripts"
        title="Error Flowchart"
      />
    </motion.div>
  )
}
