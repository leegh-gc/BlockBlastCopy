import React from 'react'
import { motion } from 'framer-motion'

interface CellProps {
  filled: boolean
  color: string | null
  row: number
  col: number
  isPreview?: boolean
  isInvalid?: boolean
  isAnimating?: boolean
}

const Cell: React.FC<CellProps> = React.memo(({ filled, color, isPreview, isInvalid, isAnimating }) => {
  const bg = filled && color ? color : 'bg-gray-100'

  return (
    <motion.div
      className={['rounded-sm relative', bg].join(' ')}
      style={{ border: '1px solid #E5E5EA', aspectRatio: '1 / 1' }}
      animate={isAnimating ? { opacity: 0, scale: 0.7 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {isPreview && !isInvalid && (
        <motion.div
          className="absolute inset-0 rounded-sm bg-green-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        />
      )}
      {isInvalid && (
        <motion.div
          className="absolute inset-0 rounded-sm bg-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        />
      )}
    </motion.div>
  )
})

Cell.displayName = 'Cell'

export default Cell
