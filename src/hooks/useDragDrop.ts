import { useCallback, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'
import type { Block } from '../types/game'

const BOARD_SIZE = 8

interface UseDragDropOptions {
  boardRef: React.RefObject<HTMLDivElement | null>
}

export function useDragDrop({ boardRef }: UseDragDropOptions) {
  const setDragState = useGameStore((state) => state.setDragState)
  const placeBlock = useGameStore((state) => state.placeBlock)
  const currentBlocks = useGameStore((state) => state.currentBlocks)

  // 드래그 중 블록 정보를 ref로 저장 (리렌더링 없이 접근)
  const draggingBlockRef = useRef<Block | null>(null)

  /**
   * 화면 좌표(clientX, clientY)를 보드의 그리드 인덱스(row, col)로 변환
   */
  const getBoardPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!boardRef.current) return null
      const rect = boardRef.current.getBoundingClientRect()
      const relX = clientX - rect.left
      const relY = clientY - rect.top
      const cellW = rect.width / BOARD_SIZE
      const cellH = rect.height / BOARD_SIZE
      const col = Math.floor(relX / cellW)
      const row = Math.floor(relY / cellH)
      if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null
      return { row, col }
    },
    [boardRef]
  )

  const handleDragStart = useCallback(
    (block: Block, clientX: number, clientY: number) => {
      draggingBlockRef.current = block
      setDragState({
        isDragging: true,
        blockId: block.id,
        currentPos: { x: clientX, y: clientY },
        boardPos: getBoardPosition(clientX, clientY),
        offsetX: 0,
        offsetY: 0,
      })
    },
    [setDragState, getBoardPosition]
  )

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggingBlockRef.current) return
      setDragState({
        currentPos: { x: clientX, y: clientY },
        boardPos: getBoardPosition(clientX, clientY),
      })
    },
    [setDragState, getBoardPosition]
  )

  const handleDragEnd = useCallback(
    (clientX: number, clientY: number) => {
      const block = draggingBlockRef.current
      if (!block) return

      const boardPos = getBoardPosition(clientX, clientY)
      if (boardPos) {
        placeBlock(block.id, boardPos.row, boardPos.col)
      } else {
        // 보드 밖에 드롭: 원위치
        setDragState({
          isDragging: false,
          blockId: null,
          currentPos: null,
          boardPos: null,
        })
      }
      draggingBlockRef.current = null
    },
    [getBoardPosition, placeBlock, setDragState]
  )

  // 마우스 이벤트 핸들러
  const onMouseDown = useCallback(
    (block: Block) => (e: React.MouseEvent) => {
      e.preventDefault()
      handleDragStart(block, e.clientX, e.clientY)

      const onMouseMove = (ev: MouseEvent) => handleDragMove(ev.clientX, ev.clientY)
      const onMouseUp = (ev: MouseEvent) => {
        handleDragEnd(ev.clientX, ev.clientY)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [handleDragStart, handleDragMove, handleDragEnd]
  )

  // 터치 이벤트 핸들러
  const onTouchStart = useCallback(
    (block: Block) => (e: React.TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleDragStart(block, touch.clientX, touch.clientY)

      const onTouchMove = (ev: TouchEvent) => {
        ev.preventDefault()
        const t = ev.touches[0]
        handleDragMove(t.clientX, t.clientY)
      }
      const onTouchEnd = (ev: TouchEvent) => {
        const t = ev.changedTouches[0]
        handleDragEnd(t.clientX, t.clientY)
        window.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('touchend', onTouchEnd)
      }

      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    },
    [handleDragStart, handleDragMove, handleDragEnd]
  )

  return { onMouseDown, onTouchStart, currentBlocks }
}
