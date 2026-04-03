import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import ExplainTab from './tabs/ExplainTab'
import FixedCodeTab from './tabs/FixedCodeTab'
import SimulationTab from './tabs/SimulationTab'
import FlowchartTab from './tabs/FlowchartTab'
import SkeletonLoader from './SkeletonLoader'

const TABS = [
  { id: 'explain',    label: 'Explain'     },
  { id: 'fixed',      label: 'Fixed Code'  },
  { id: 'simulation', label: 'Simulation'  },
  { id: 'flowchart',  label: 'Error Map'   },
] as const

export default function ResultPanel() {
  const { result, loading, activeTab, setActiveTab } = useStore()

  return (
    <div className="flex flex-col h-full">

      {/* Tab bar */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            className={`relative flex-1 py-2 px-3 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
              activeTab === tab.id ? 'text-neon-green' : 'text-white/35 hover:text-white/65'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg"
                style={{ background: 'rgba(0,255,157,0.08)', border: '1px solid rgba(0,255,157,0.2)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto min-h-0 pr-0.5">
        {loading ? (
          <SkeletonLoader />
        ) : !result ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {activeTab === 'explain'    && <ExplainTab />}
              {activeTab === 'fixed'      && <FixedCodeTab />}
              {activeTab === 'simulation' && <SimulationTab />}
              {activeTab === 'flowchart'  && <FlowchartTab />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
      <div className="w-14 h-14 rounded-2xl border border-white/8 flex items-center justify-center"
           style={{ background: 'rgba(0,255,157,0.05)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                fill="#00ff9d" opacity="0.4"/>
        </svg>
      </div>
      <div>
        <p className="text-white/50 text-sm font-medium mb-1">Ready to debug</p>
        <p className="text-white/25 text-xs max-w-xs leading-relaxed">
          Paste your code and error message, then click{' '}
          <span className="text-neon-green">Explain & Fix</span> or press{' '}
          <span className="text-white/40 font-mono">Ctrl+Enter</span>
        </p>
      </div>
    </div>
  )
}
