import React from 'react'
import { useGameStore } from '../../stores/gameStore'
import BlockPreview from './BlockPreview'
import { useDragDrop } from '../../hooks/useDragDrop'

interface BlockTrayProps {
  boardRef: React.RefObject<HTMLDivElement | null>
}

const BlockTray: React.FC<BlockTrayProps> = ({ boardRef }) => {
  const currentBlocks = useGameStore((state) => state.currentBlocks)
  const { onMouseDown, onTouchStart } = useDragDrop({ boardRef })

  return (
    <div
      className="flex items-center justify-around w-full mt-6 p-4 bg-gray-900 rounded-lg"
      data-testid="block-tray"
    >
      {currentBlocks.map((block) => (
        <div
          key={block.id}
          className="flex items-center justify-center p-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={onMouseDown(block)}
          onTouchStart={onTouchStart(block)}
          style={{ touchAction: 'none' }}
          data-testid={`tray-slot-${block.id}`}
        >
          <BlockPreview block={block} cellSize={22} />
        </div>
      ))}
    </div>
  )
}

export default BlockTray
