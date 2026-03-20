import { create } from 'zustand'
import type { GameState, Cell, DragState } from '../types/game'
import { getRandomBlocks } from '../utils/blockUtils'
import { canPlaceBlock } from '../utils/boardUtils'
import { getCompletedLines, clearLines } from '../utils/lineUtils'
import { calcPlacementScore, calcLineClearScore, calcComboScore } from '../utils/scoreUtils'

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
    comboCount: 0,
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

    placeBlock: (blockId: string, row: number, col: number) => {
      const { board, currentBlocks, score, highScore, comboCount } = get()
      const block = currentBlocks.find((b) => b.id === blockId)
      if (!block) return

      if (!canPlaceBlock(board, block, row, col)) {
        set({ dragState: initialDragState })
        return
      }

      // 1. 블록 배치
      const newBoard = board.map((r) => r.map((cell) => ({ ...cell })))
      block.shape.forEach((shapeRow, dr) => {
        shapeRow.forEach((val, dc) => {
          if (val === 1) {
            newBoard[row + dr][col + dc] = { filled: true, color: block.color }
          }
        })
      })

      // 2. 라인 감지
      const { rows: completedRows, cols: completedCols } = getCompletedLines(newBoard)
      const lineCount = completedRows.length + completedCols.length
      const clearedBoard = lineCount > 0 ? clearLines(newBoard, completedRows, completedCols) : newBoard

      // 3. 점수 계산
      const newCombo = lineCount > 0 ? comboCount + 1 : 0
      const addedScore =
        calcPlacementScore(block) +
        calcLineClearScore(lineCount) +
        (lineCount > 0 ? calcComboScore(newCombo) : 0)
      const newScore = score + addedScore
      const newHighScore = newScore > highScore ? newScore : highScore

      // 4. 다음 블록
      const newBlocks = currentBlocks.filter((b) => b.id !== blockId)

      set({
        board: clearedBoard,
        score: newScore,
        highScore: newHighScore,
        currentBlocks: newBlocks.length === 0 ? getRandomBlocks(3) : newBlocks,
        dragState: initialDragState,
        comboCount: newCombo,
      })
    },

    generateNewBlocks: () => {
      set({ currentBlocks: getRandomBlocks(3) })
    },
  }
})
