import { motion } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../../store/useStore'

function computeDiff(original: string, fixed: string) {
  const origLines  = original.split('\n')
  const fixedLines = fixed.split('\n')
  const result: { type: 'same' | 'add' | 'del'; line: string; num: number }[] = []

  const maxLen = Math.max(origLines.length, fixedLines.length)
  let lineNum = 1
  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i]
    const f = fixedLines[i]
    if (o === undefined) {
      result.push({ type: 'add', line: f, num: lineNum++ })
    } else if (f === undefined) {
      result.push({ type: 'del', line: o, num: lineNum++ })
    } else if (o !== f) {
      result.push({ type: 'del', line: o, num: lineNum })
      result.push({ type: 'add', line: f, num: lineNum++ })
    } else {
      result.push({ type: 'same', line: o, num: lineNum++ })
    }
  }
  return result
}

export default function FixedCodeTab() {
  const { result, code } = useStore()
  const [copied, setCopied] = useState(false)

  if (!result?.fixedCode) return null

  const diff = computeDiff(code, result.fixedCode)
  const changes = diff.filter(d => d.type !== 'same').length

  const copy = () => {
    navigator.clipboard.writeText(result.fixedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-3 pb-4 h-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/35 uppercase tracking-widest">Diff View</span>
          {changes > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,255,157,0.1)', color: '#00ff9d', border: '1px solid rgba(0,255,157,0.2)' }}>
              {changes} change{changes !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,255,157,0.08)' }}
          onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = copied ? 'rgba(0,255,157,0.15)' : 'transparent' }}
          style={{
            background: copied ? 'rgba(0,255,157,0.15)' : 'transparent',
            border: '1px solid rgba(0,255,157,0.25)',
            color: '#00ff9d',
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        >
          {copied ? 'Copied' : 'Copy Fixed Code'}
        </button>
      </div>

      {/* Diff */}
      <div className="flex-1 rounded-xl overflow-auto font-mono text-xs leading-6"
           style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {diff.map((d, i) => (
          <motion.div
            key={i}
            initial={d.type === 'add' ? { opacity: 0, x: -6 } : {}}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.003, 0.3) }}
            className={`flex gap-0 ${
              d.type === 'add' ? 'diff-add' : d.type === 'del' ? 'diff-del' : ''
            }`}
          >
            {/* Line number */}
            <span className="select-none w-10 text-right pr-3 py-0.5 shrink-0"
                  style={{ color: 'rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              {d.num}
            </span>
            {/* +/- marker */}
            <span className="select-none w-6 text-center py-0.5 shrink-0"
                  style={{ color: d.type === 'add' ? '#00ff9d' : d.type === 'del' ? '#ff3b5c' : 'transparent' }}>
              {d.type === 'add' ? '+' : d.type === 'del' ? '-' : ' '}
            </span>
            {/* Code */}
            <span className={`py-0.5 pl-1 whitespace-pre flex-1 ${
              d.type === 'add' ? 'text-green-300' : d.type === 'del' ? 'text-red-300/60 line-through' : 'text-white/55'
            }`}>
              {d.line}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
