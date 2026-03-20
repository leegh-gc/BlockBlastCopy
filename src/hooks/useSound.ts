import { useRef, useCallback } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

/**
 * Web Audio API 기반 사운드 효과 훅.
 * 브라우저 autoplay 정책: 첫 사용자 인터랙션 후 AudioContext 초기화.
 */
export function useSound() {
  const isSoundEnabled = useSettingsStore((s) => s.isSoundEnabled)
  const ctxRef = useRef<AudioContext | null>(null)

  function getCtx(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }

  const playPlace = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  }, [isSoundEnabled])

  const playClear = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getCtx()
    if (!ctx) return
    // Rising sweep: 400 → 900Hz
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  }, [isSoundEnabled])

  const playCombo = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getCtx()
    if (!ctx) return
    // Two-note chime
    const freqs = [600, 900]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.1
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
      osc.start(t)
      osc.stop(t + 0.25)
    })
  }, [isSoundEnabled])

  const playGameOver = useCallback(() => {
    if (!isSoundEnabled) return
    const ctx = getCtx()
    if (!ctx) return
    // Descending tones
    const freqs = [500, 400, 300, 220]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      const t = ctx.currentTime + i * 0.15
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.2, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.start(t)
      osc.stop(t + 0.2)
    })
  }, [isSoundEnabled])

  return { playPlace, playClear, playCombo, playGameOver }
}
