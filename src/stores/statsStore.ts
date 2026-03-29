import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameStats {
  totalGames: number
  totalScore: number
  bestScore: number
  bestCombo: number
  totalLinesCleared: number
}

interface StatsStore extends GameStats {
  recordGameEnd: (score: number, maxCombo: number, linesCleared: number) => void
  resetStats: () => void
}

const initialStats: GameStats = {
  totalGames: 0,
  totalScore: 0,
  bestScore: 0,
  bestCombo: 0,
  totalLinesCleared: 0,
}

export const useStatsStore = create<StatsStore>()(
  persist(
    (set, get) => ({
      ...initialStats,
      recordGameEnd: (score, maxCombo, linesCleared) => {
        const { bestScore, bestCombo } = get()
        set((s) => ({
          totalGames: s.totalGames + 1,
          totalScore: s.totalScore + score,
          bestScore: score > bestScore ? score : bestScore,
          bestCombo: maxCombo > bestCombo ? maxCombo : bestCombo,
          totalLinesCleared: s.totalLinesCleared + linesCleared,
        }))
      },
      resetStats: () => set(initialStats),
    }),
    { name: 'block-blast-stats' }
  )
)
