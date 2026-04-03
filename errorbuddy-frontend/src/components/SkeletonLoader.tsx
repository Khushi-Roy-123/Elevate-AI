import { motion } from 'framer-motion'

function Shimmer({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', ...style }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
    />
  )
}

export default function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-3 p-1">
      <Shimmer className="h-5 w-2/5" />
      <Shimmer className="h-3.5 w-full" />
      <Shimmer className="h-3.5 w-5/6" />
      <Shimmer className="h-3.5 w-4/6" />

      <div className="mt-3 flex flex-col gap-2">
        <Shimmer className="h-4 w-1/3" />
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3.5 w-3/4" />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <Shimmer className="h-4 w-1/4" />
        <Shimmer style={{ height: '80px', width: '100%' }} />
      </div>
    </div>
  )
}
