import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; char: string; color: string
}

const CHARS = ['{}', '()', '[]', '=>', '!=', '??', '&&', '||', '++', '--', '//']
const COLORS = ['#00ff9d', '#00f0ff', '#ff3b5c', '#ffffff44']

export default function Particles({ fixed = false }: { fixed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => {
      if (particles.length < 30) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.8 + 0.3),
          life: 0,
          maxLife: 120 + Math.random() * 80,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    let frame = 0
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      if (frame % 20 === 0) spawn()

      particles = particles.filter((p) => p.life < p.maxLife)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life++
        const alpha = 1 - p.life / p.maxLife
        ctx.globalAlpha = alpha * 0.6
        ctx.fillStyle = p.color
        ctx.font = '12px monospace'
        ctx.fillText(p.char, p.x, p.y)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${fixed ? 'fixed' : 'absolute'} inset-0 w-full h-full`}
      style={{ zIndex: 0 }}
    />
  )
}
