import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import Cell from './Cell'
import LineClearEffect from './LineClearEffect'
import { useGameStore } from '../../stores/gameStore'
import { canPlaceBlock, getBlockCells } from '../../utils/boardUtils'
import { BOARD_SIZE } from '../../constants/game'
import { useAnimationDuration } from '../../hooks/useAnimationDuration'

interface BoardProps {
  boardRef: React.RefObject<HTMLDivElement | null>
}

const Board: React.FC<BoardProps> = ({ boardRef }) => {
  const getDuration = useAnimationDuration()
  const board = useGameStore((state) => state.board)
  const dragState = useGameStore((state) => state.dragState)
  const currentBlocks = useGameStore((state) => state.currentBlocks)
  const animatingLines = useGameStore((state) => state.animatingLines)
  const isShaking = useGameStore((state) => state.isShaking)

  const previewInfo = useMemo(() => {
    if (!dragState.isDragging || !dragState.blockId || !dragState.boardPos) return null
    const block = currentBlocks.find((b) => b.id === dragState.blockId)
    if (!block) return null
    const { row, col } = dragState.boardPos
    const valid = canPlaceBlock(board, block, row, col)
    const cells = getBlockCells(block, row, col)
    return { cells, valid }
  }, [dragState, currentBlocks, board])

  const previewSet = useMemo(() => {
    if (!previewInfo) return new Set<string>()
    return new Set(previewInfo.cells.map((p) => `${p.row}-${p.col}`))
  }, [previewInfo])

  const animatingSet = useMemo(() => {
    if (!animatingLines) return new Set<string>()
    const keys = new Set<string>()
    animatingLines.rows.forEach((r) => {
      for (let c = 0; c < BOARD_SIZE; c++) keys.add(`${r}-${c}`)
    })
    animatingLines.cols.forEach((c) => {
      for (let r = 0; r < BOARD_SIZE; r++) keys.add(`${r}-${c}`)
    })
    return keys
  }, [animatingLines])

  return (
    <motion.div
      ref={boardRef}
      className="relative w-full max-w-[500px] mx-auto rounded-2xl overflow-hidden dark:bg-[#2C2C2E]"
      style={{ background: 'var(--board-bg, #FFFFFF)', touchAction: 'none' }}
      data-testid="game-board"
      animate={isShaking ? { x: [-8, 8, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: getDuration(0.5), ease: 'easeInOut' }}
    >
      <div
        className="grid gap-0.5 p-1 rounded-lg dark:bg-[#2C2C2E]"
        style={{ background: 'inherit', gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const key = `${rowIdx}-${colIdx}`
            const inPreview = previewSet.has(key)
            return (
              <Cell
                key={key}
                filled={cell.filled}
                color={cell.color}
                row={rowIdx}
                col={colIdx}
                isPreview={inPreview}
                isInvalid={inPreview && previewInfo ? !previewInfo.valid : false}
                isAnimating={animatingSet.has(key)}
              />
            )
          })
        )}
      </div>
      <LineClearEffect />
    </motion.div>
  )
}

export default Board
