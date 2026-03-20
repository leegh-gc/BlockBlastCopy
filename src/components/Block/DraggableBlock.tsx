import React from 'react'
import { useGameStore } from '../../stores/gameStore'
import BlockPreview from './BlockPreview'

/**
 * 드래그 중인 블록을 화면 절대 좌표에 표시하는 고스트 레이어.
 * 드래그 중일 때만 렌더링된다.
 */
const DraggableBlock: React.FC = () => {
  const dragState = useGameStore((state) => state.dragState)
  const currentBlocks = useGameStore((state) => state.currentBlocks)

  if (!dragState.isDragging || !dragState.blockId || !dragState.currentPos) {
    return null
  }

  const block = currentBlocks.find((b) => b.id === dragState.blockId)
  if (!block) return null

  const x = dragState.currentPos.col // col에 픽셀 X 저장
  const y = dragState.currentPos.row // row에 픽셀 Y 저장

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: x - 30,
        top: y - 30,
        transform: 'scale(1.1)',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
        opacity: 0.9,
      }}
    >
      <BlockPreview block={block} cellSize={22} />
    </div>
  )
}

export default DraggableBlock
