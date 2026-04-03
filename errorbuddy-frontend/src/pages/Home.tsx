import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef, useEffect } from 'react'

// ── Animated canvas background ───────────────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { x: 0.15, y: 0.25, r: 420, color: '#00ff9d', speed: 0.00014 },
      { x: 0.85, y: 0.18, r: 360, color: '#00f0ff', speed: 0.00019 },
      { x: 0.55, y: 0.78, r: 300, color: '#7c3aed', speed: 0.00012 },
      { x: 0.05, y: 0.85, r: 240, color: '#00f0ff', speed: 0.00017 },
    ]

    const chars = ['{}', '()', '[]', '=>', '!=', '&&', '||', '++', 'fn', 'if', 'for', 'let', 'def', 'int', 'var', 'try']
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; char: string; size: number }
    let particles: Particle[] = []

    const spawn = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.45 + 0.18),
        life: 0,
        maxLife: 180 + Math.random() * 120,
        char: chars[Math.floor(Math.random() * chars.length)],
        size: 11 + Math.random() * 4,
      })
    }

    let t = 0, frame = 0
    const loop = () => {
      t++; frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach(orb => {
        const ox = (Math.sin(t * orb.speed * Math.PI * 2) * 0.13 + orb.x) * canvas.width
        const oy = (Math.cos(t * orb.speed * Math.PI * 2 * 0.65) * 0.11 + orb.y) * canvas.height
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r)
        g.addColorStop(0, orb.color + '1a')
        g.addColorStop(0.45, orb.color + '09')
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(ox, oy, orb.r, 0, Math.PI * 2); ctx.fill()
      })

      // subtle grid
      ctx.strokeStyle = 'rgba(0,240,255,0.025)'; ctx.lineWidth = 1
      const gs = 56
      for (let x = 0; x < canvas.width; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke() }
      for (let y = 0; y < canvas.height; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke() }

      if (frame % 22 === 0 && particles.length < 24) spawn()
      particles = particles.filter(p => p.life < p.maxLife)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life++
        ctx.globalAlpha = (1 - p.life / p.maxLife) * 0.28
        ctx.fillStyle = p.life % 70 < 35 ? '#00ff9d' : '#00f0ff'
        ctx.font = `${p.size}px 'JetBrains Mono', monospace`
        ctx.fillText(p.char, p.x, p.y)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}

// ── How it works steps ───────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    color: '#00f0ff',
    title: 'Paste Your Code',
    desc: 'Drop in any broken code — Python, JavaScript, Java, C++, Go, and more. The Monaco editor gives you a full VS Code experience right in the browser.',
  },
  {
    num: '02',
    color: '#00ff9d',
    title: 'Add the Error',
    desc: 'Paste the error message or traceback. ErrorBuddy reads both your code and the error together to understand the full context.',
  },
  {
    num: '03',
    color: '#7c3aed',
    title: 'Get the Fix',
    desc: 'Gemini 2.5 Flash returns a plain-English explanation, the corrected code with a diff, a live animation, and an interactive error flowchart — all in seconds.',
  },
]

// ── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    color: '#00f0ff',
    title: 'Plain-English Explanation',
    desc: 'No jargon. Every error is broken down into what went wrong, the root cause, a pro tip, and the most common mistakes that lead to it.',
  },
  {
    color: '#00ff9d',
    title: 'Side-by-Side Diff',
    desc: 'The fixed code is shown as a clean diff — green lines added, red lines removed. Copy the corrected version in one click.',
  },
  {
    color: '#7c3aed',
    title: 'Live Algorithm Animations',
    desc: 'Gradient descent, BST traversal, merge sort, k-means, neural net forward pass — rendered at 60fps with play, pause, and step controls.',
  },
  {
    color: '#ff3b5c',
    title: 'Interactive Error Map',
    desc: 'A clickable flowchart that walks you through the debugging decision tree. Tap any node to see what it means and what to do next.',
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate()

  const btnPrimary: React.CSSProperties = {
    background: '#00ff9d', color: '#07070e', border: 'none', cursor: 'pointer',
    padding: '15px 38px', borderRadius: '14px', fontSize: '15px', fontWeight: 700,
    letterSpacing: '0.02em', boxShadow: '0 0 28px rgba(0,255,157,0.45), 0 0 56px rgba(0,255,157,0.15)',
  }

  const btnSecondary: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
    padding: '15px 34px', borderRadius: '14px', fontSize: '15px', fontWeight: 500,
    backdropFilter: 'blur(12px)',
  }

  return (
    <div style={{ background: '#07070e', minHeight: '100vh', overflowX: 'hidden' }}>
      <AnimatedBackground />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center"
               style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.5 }}
          style={{ fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: '24px' }}
        >
          <span style={{ color: '#ffffff' }}>Error</span>
          <span style={{ color: '#00ff9d', textShadow: '0 0 48px #00ff9d55' }}>Buddy</span>
          <span style={{ color: '#00f0ff', textShadow: '0 0 48px #00f0ff55' }}> AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          style={{ fontSize: '18px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.38)', marginBottom: '12px' }}
        >
          Debug. Visualize. Learn.{' '}
          <span style={{ color: '#00ff9d', fontWeight: 600 }}>In 30 seconds.</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.36 }}
          style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)', maxWidth: '420px', lineHeight: 1.7, marginBottom: '48px' }}
        >
          The AI debugging companion built for VIT Bhopal students mastering
          DSA, Machine Learning, and Full-Stack development.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app')} style={btnPrimary}>
            Start Debugging
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/history')} style={btnSecondary}>
            View History
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(0,255,157,0.5), transparent)', margin: '0 auto' }}
          />
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="relative z-10" style={{ padding: '100px 24px', maxWidth: '860px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,240,255,0.5)', marginBottom: '12px' }}>
            How it works
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em' }}>
            Three steps to a fix
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '24px',
                padding: '28px 32px', borderRadius: '18px', position: 'relative', overflow: 'hidden',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* glow */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '160px', height: '160px', borderRadius: '50%', background: s.color + '0a', filter: 'blur(32px)', transform: 'translate(-40%, -40%)', pointerEvents: 'none' }} />

              {/* number */}
              <div style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'monospace', color: s.color, opacity: 0.7, minWidth: '28px', paddingTop: '2px' }}>
                {s.num}
              </div>

              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: '47px', bottom: '-8px', width: '1px', height: '24px', background: 'linear-gradient(to bottom, ' + s.color + '40, transparent)', zIndex: 1 }} />
              )}

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section className="relative z-10" style={{ padding: '0 24px 100px', maxWidth: '860px', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,240,255,0.5)', marginBottom: '12px' }}>
            What you get
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em' }}>
            Everything in one place
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.015, y: -3 }}
              style={{
                padding: '28px', borderRadius: '18px', position: 'relative', overflow: 'hidden',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', borderRadius: '50%', background: f.color + '0c', filter: 'blur(28px)', transform: 'translate(-30%, -30%)', pointerEvents: 'none' }} />

              {/* accent bar */}
              <div style={{ width: '32px', height: '3px', borderRadius: '2px', background: f.color, marginBottom: '20px', boxShadow: '0 0 10px ' + f.color + '66' }} />

              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '10px' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.36)', lineHeight: 1.75, margin: 0 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="relative z-10" style={{ padding: '0 24px 120px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '560px', margin: '0 auto', padding: '56px 40px', borderRadius: '24px',
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(0,255,157,0.12)',
            backdropFilter: 'blur(20px)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* glow center */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,255,157,0.05)', filter: 'blur(48px)', pointerEvents: 'none' }} />

          <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,255,157,0.5)', marginBottom: '16px' }}>
            Ready to debug?
          </p>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Stop guessing. Start fixing.
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '360px', margin: '0 auto 32px' }}>
            Paste your code, get an explanation, a fix, and a live simulation — all in under 30 seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app')}
            style={btnPrimary}
          >
            Open the Debugger
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}
