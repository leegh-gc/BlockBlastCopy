import { create } from 'zustand'
import type { GameState, Cell, DragState } from '../types/game'
import { getRandomBlocks } from '../utils/blockUtils'

const BOARD_SIZE = 8

function createEmptyBoard(): Cell[][] {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ filled: false, color: null }))
  )
}

const initialDragState: DragState = {
  isDragging: false,
  blockId: null,
  currentPos: null,
  boardPos: null,
  offsetX: 0,
  offsetY: 0,
}

interface GameStore extends GameState {
  getInitialState: () => GameState
  resetGame: () => void
  setDragState: (dragState: Partial<DragState>) => void
  placeBlock: (blockId: string, row: number, col: number) => void
  generateNewBlocks: () => void
}

export const useGameStore = create<GameStore>((set, get) => {
  const getInitialState = (): GameState => ({
    board: createEmptyBoard(),
    score: 0,
    highScore: 0,
    currentBlocks: getRandomBlocks(3),
    dragState: initialDragState,
    isGameOver: false,
  })

  return {
    ...getInitialState(),
    getInitialState,

    resetGame: () => {
      set(getInitialState())
    },

    setDragState: (partial) => {
      set((state) => ({
        dragState: { ...state.dragState, ...partial },
      }))
    },

    // Sprint 1에서는 배치 유효성 검사 없이 단순 배치만 구현
    // 유효성 검사는 Sprint 2에서 boardUtils.ts로 분리 구현
    placeBlock: (blockId: string, row: number, col: number) => {
      const { board, currentBlocks, score } = get()
      const block = currentBlocks.find((b) => b.id === blockId)
      if (!block) return

      const newBoard = board.map((r) => r.map((cell) => ({ ...cell })))
      let placedCells = 0

      block.shape.forEach((shapeRow, dr) => {
        shapeRow.forEach((val, dc) => {
          if (val === 1) {
            const targetRow = row + dr
            const targetCol = col + dc
            if (
              targetRow >= 0 && targetRow < BOARD_SIZE &&
              targetCol >= 0 && targetCol < BOARD_SIZE
            ) {
              newBoard[targetRow][targetCol] = { filled: true, color: block.color }
              placedCells++
            }
          }
        })
      })

      const newBlocks = currentBlocks.filter((b) => b.id !== blockId)

      set({
        board: newBoard,
        score: score + placedCells,
        currentBlocks: newBlocks.length === 0 ? getRandomBlocks(3) : newBlocks,
        dragState: initialDragState,
      })
    },

    generateNewBlocks: () => {
      set({ currentBlocks: getRandomBlocks(3) })
    },
  }
})
