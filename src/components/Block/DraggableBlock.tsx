import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import BlockPreview from './BlockPreview'
import type { Block, PixelPosition } from '../../types/game'

const CELL_SIZE = 22
const DRAG_LIFT_MARGIN = 20

/**
 * 드래그 중인 블록을 화면 절대 좌표에 표시하는 고스트 레이어.
 * 배치 실패 시 바운스 애니메이션 후 사라진다.
 */
const DraggableBlock: React.FC = () => {
  const dragState = useGameStore((state) => state.dragState)
  const currentBlocks = useGameStore((state) => state.currentBlocks)

  const [showBounce, setShowBounce] = useState(false)
  const lastPosRef = useRef<PixelPosition | null>(null)
  const lastBlockRef = useRef<Block | null>(null)
  const prevDraggingRef = useRef(false)

  // Track last known position and block during drag (ref update in render is safe)
  if (dragState.isDragging) {
    if (dragState.currentPos) lastPosRef.current = dragState.currentPos
    const b = currentBlocks.find((b) => b.id === dragState.blockId)
    if (b) lastBlockRef.current = b
  }

  // Detect failed drop: was dragging → not dragging, but block still in tray
  useEffect(() => {
    const wasDragging = prevDraggingRef.current
    prevDraggingRef.current = dragState.isDragging

    if (wasDragging && !dragState.isDragging) {
      const block = lastBlockRef.current
      if (block && currentBlocks.some((b) => b.id === block.id)) {
        setShowBounce(true)
        const timer = setTimeout(() => setShowBounce(false), 400)
        return () => clearTimeout(timer)
      }
    }
  }, [dragState.isDragging, currentBlocks])

  const pos = dragState.isDragging ? dragState.currentPos : lastPosRef.current
  const block = dragState.isDragging
    ? currentBlocks.find((b) => b.id === dragState.blockId)
    : lastBlockRef.current

  if ((!dragState.isDragging && !showBounce) || !pos || !block) return null

  const yOffset = (block.shape.length / 2) * CELL_SIZE + DRAG_LIFT_MARGIN

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: pos.x - 30,
        top: pos.y - yOffset,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        willChange: 'transform',
      }}
      animate={
        showBounce
          ? {
              x: [0, -12, 12, -8, 8, 0],
              scale: [1.1, 1.2, 1.1, 0.8, 0.5, 0],
              opacity: [0.9, 1, 0.9, 0.7, 0.4, 0],
            }
          : { x: 0, scale: 1.1, opacity: 0.9 }
      }
      transition={showBounce ? { duration: 0.4, ease: 'easeOut' } : { duration: 0 }}
    >
      <BlockPreview block={block} cellSize={CELL_SIZE} />
    </motion.div>
  )
}

export default DraggableBlock
