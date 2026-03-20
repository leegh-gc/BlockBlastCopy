import React from 'react'
import Cell from './Cell'
import { useGameStore } from '../../stores/gameStore'

const BOARD_SIZE = 8

interface BoardProps {
  boardRef: React.RefObject<HTMLDivElement | null>
}

const Board: React.FC<BoardProps> = ({ boardRef }) => {
  const board = useGameStore((state) => state.board)

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
          row.map((cell, colIdx) => (
            <Cell
              key={`${rowIdx}-${colIdx}`}
              filled={cell.filled}
              color={cell.color}
              row={rowIdx}
              col={colIdx}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Board
