import React, { useMemo } from 'react'
import Cell from './Cell'
import { useGameStore } from '../../stores/gameStore'
import { canPlaceBlock, getBlockCells } from '../../utils/boardUtils'

const BOARD_SIZE = 8

interface BoardProps {
  boardRef: React.RefObject<HTMLDivElement | null>
}

const Board: React.FC<BoardProps> = ({ boardRef }) => {
  const board = useGameStore((state) => state.board)
  const dragState = useGameStore((state) => state.dragState)
  const currentBlocks = useGameStore((state) => state.currentBlocks)

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

  return (
    <div
      ref={boardRef}
      className="relative w-full max-w-[500px] mx-auto"
      style={{ touchAction: 'none' }}
      data-testid="game-board"
    >
      <div
        className="grid gap-0.5 p-1 bg-gray-900 rounded-lg"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
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
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default Board
