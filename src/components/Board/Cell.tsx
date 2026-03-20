import React from 'react'

interface CellProps {
  filled: boolean
  color: string | null
  row: number
  col: number
}

const Cell: React.FC<CellProps> = React.memo(({ filled, color }) => {
  return (
    <div
      className={[
        'border border-gray-700 rounded-sm',
        filled && color ? color : 'bg-gray-800',
      ].join(' ')}
      style={{ aspectRatio: '1 / 1' }}
    />
  )
})

Cell.displayName = 'Cell'

export default Cell
