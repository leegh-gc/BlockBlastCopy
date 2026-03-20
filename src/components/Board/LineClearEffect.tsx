import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { BOARD_SIZE } from '../../constants/game'
import { useAnimationDuration } from '../../hooks/useAnimationDuration'

/**
 * 라인 제거 시 flash 효과 오버레이.
 * 파티클 대신 단순 flash로 성능 우선 구현.
 */
const LineClearEffect: React.FC = () => {
  const getDuration = useAnimationDuration()
  const animatingLines = useGameStore((state) => state.animatingLines)

  if (!animatingLines) return null

  const { rows, cols } = animatingLines
  const flashCells = new Set<string>()

  rows.forEach((r) => {
    for (let c = 0; c < BOARD_SIZE; c++) flashCells.add(`${r}-${c}`)
  })
  cols.forEach((c) => {
    for (let r = 0; r < BOARD_SIZE; r++) flashCells.add(`${r}-${c}`)
  })

  return (
    <AnimatePresence>
      {[...flashCells].map((key) => {
        const [r, c] = key.split('-').map(Number)
        return (
          <motion.div
            key={key}
            className="absolute pointer-events-none"
            style={{
              left: `${(c / BOARD_SIZE) * 100}%`,
              top: `${(r / BOARD_SIZE) * 100}%`,
              width: `${100 / BOARD_SIZE}%`,
              height: `${100 / BOARD_SIZE}%`,
              background: 'white',
              borderRadius: 2,
              zIndex: 10,
            }}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: getDuration(0.3), ease: 'easeOut' }}
          />
        )
      })}
    </AnimatePresence>
  )
}

export default LineClearEffect
