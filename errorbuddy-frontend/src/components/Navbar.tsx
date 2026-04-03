import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Navbar() {
  const { isOnline } = useStore()
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-5xl"
    >
      <div className="glass flex items-center justify-between px-6 py-3 glow-cyan">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#00ff9d" />
              <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="#00ff9d" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-bold text-base tracking-wide">
            <span className="text-neon-green">Error</span>
            <span className="text-neon-cyan">Buddy</span>
            <span className="text-white/30 text-xs font-normal ml-1">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-7">
          {[
            { to: '/',        label: 'Home'    },
            { to: '/app',     label: 'Debug'   },
            { to: '/history', label: 'History' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium transition-colors no-underline ${
                pathname === to
                  ? 'text-neon-green tab-underline'
                  : 'text-white/50 hover:text-white/90'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs px-2.5 py-1 rounded-full border border-neon-cyan/20 text-neon-cyan/60 tracking-wide">
            VIT Bhopal
          </span>
          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
            isOnline ? 'border-emerald-500/25 text-emerald-400' : 'border-amber-500/25 text-amber-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
