import React from 'react'

interface CellProps {
  filled: boolean
  color: string | null
  row: number
  col: number
  isPreview?: boolean
  isInvalid?: boolean
}

const Cell: React.FC<CellProps> = React.memo(({ filled, color, isPreview, isInvalid }) => {
  let bg = filled && color ? color : 'bg-gray-800'

  return (
    <div
      className={['border border-gray-700 rounded-sm relative', bg].join(' ')}
      style={{ aspectRatio: '1 / 1' }}
    >
      {isPreview && !isInvalid && (
        <div className="absolute inset-0 rounded-sm bg-green-400 opacity-40" />
      )}
      {isInvalid && (
        <div className="absolute inset-0 rounded-sm bg-red-400 opacity-40" />
      )}
    </div>
  )
})

Cell.displayName = 'Cell'

export default Cell
