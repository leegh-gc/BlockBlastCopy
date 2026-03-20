import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { useAnimationDuration } from '../../hooks/useAnimationDuration'

const GameOverModal: React.FC = () => {
  const getDuration = useAnimationDuration()
  const isGameOver = useGameStore((state) => state.isGameOver)
  const score = useGameStore((state) => state.score)
  const highScore = useGameStore((state) => state.highScore)
  const resetGame = useGameStore((state) => state.resetGame)
  const isNewBest = score >= highScore && score > 0

  return (
    <AnimatePresence>
      {isGameOver && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: getDuration(0.2) }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <motion.div
            className="relative rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl min-w-[280px] bg-gray-900 dark:bg-[#2C2C2E]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, duration: getDuration(0.3) }}
          >
            <h2 className="text-3xl font-bold text-white tracking-widest">GAME OVER</h2>

            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-sm">최종 점수</span>
              <span className="text-4xl font-bold text-yellow-400">{score.toLocaleString()}</span>
              {isNewBest && (
                <span className="text-xs font-bold text-green-400 bg-green-400/20 px-2 py-0.5 rounded-full">
                  New Best!
                </span>
              )}
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-gray-400 text-sm">최고 점수</span>
              <span className="text-2xl font-semibold text-white">{highScore.toLocaleString()}</span>
            </div>

            <button
              onClick={resetGame}
              className="mt-2 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-yellow-300 active:scale-95 transition-all"
            >
              다시 시작
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameOverModal
