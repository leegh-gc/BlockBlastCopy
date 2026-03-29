import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../stores/gameStore'

const ScoreDisplay: React.FC = () => {
  const score = useGameStore((state) => state.score)
  const highScore = useGameStore((state) => state.highScore)
  const [displayScore, setDisplayScore] = useState(score)
  const [floats, setFloats] = useState<{ id: number; delta: number }[]>([])
  const prevScoreRef = useRef(score)
  const floatIdRef = useRef(0)

  useEffect(() => {
    const delta = score - prevScoreRef.current
    if (delta > 0) {
      const id = floatIdRef.current++
      setFloats((prev) => [...prev, { id, delta }])
      setTimeout(() => setFloats((prev) => prev.filter((f) => f.id !== id)), 1000)
    }
    prevScoreRef.current = score

    // 카운트업 애니메이션
    let start = displayScore
    const end = score
    if (start === end) return
    const step = Math.ceil(Math.abs(end - start) / 10)
    const timer = setInterval(() => {
      start = start + (end > start ? step : -step)
      if ((end > displayScore && start >= end) || (end < displayScore && start <= end)) {
        setDisplayScore(end)
        clearInterval(timer)
      } else {
        setDisplayScore(start)
      }
    }, 30)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score])

  return (
    <div className="flex justify-between items-center w-full px-2 py-3">
      <div className="flex flex-col items-center relative">
        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">Score</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">{displayScore.toLocaleString()}</span>
        {floats.map((f) => (
          <span
            key={f.id}
            className="absolute -top-4 text-yellow-400 text-sm font-bold animate-bounce pointer-events-none"
          >
            +{f.delta}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">Best</span>
        <span className="text-2xl font-bold text-yellow-500">{highScore.toLocaleString()}</span>
      </div>
    </div>
  )
}

export default ScoreDisplay
