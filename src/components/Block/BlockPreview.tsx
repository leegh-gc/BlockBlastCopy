import React from 'react'
import type { Block } from '../../types/game'

interface BlockPreviewProps {
  block: Block
  cellSize?: number
}

const BlockPreview: React.FC<BlockPreviewProps> = ({ block, cellSize = 24 }) => {
  const { shape, color } = block
  const rows = shape.length
  const cols = shape[0]?.length ?? 0

  return (
    <div
      className="inline-grid gap-0.5"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
      }}
      data-testid={`block-preview-${block.id}`}
    >
      {shape.map((row, rowIdx) =>
        row.map((val, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            className={[
              'rounded-sm',
              val === 1 ? color : 'bg-transparent',
            ].join(' ')}
            style={{ width: cellSize, height: cellSize }}
          />
        ))
      )}
    </div>
  )
}

export default BlockPreview
