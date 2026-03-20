import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Cell, DragState, AudioEvent } from '../types/game'
import { STORAGE_KEY } from '../utils/storage'
import { getRandomBlocks } from '../utils/blockUtils'
import { BOARD_SIZE } from '../constants/game'
import { canPlaceBlock } from '../utils/boardUtils'
import { getCompletedLines, clearLines } from '../utils/lineUtils'
import { calcPlacementScore, calcLineClearScore, calcComboScore } from '../utils/scoreUtils'
import { canAnyBlockBePlaced } from '../utils/gameOverUtils'

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
  clearAudioEvent: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => {
  const getInitialState = (): GameState => ({
    board: createEmptyBoard(),
    score: 0,
    highScore: 0,
    currentBlocks: getRandomBlocks(3),
    dragState: initialDragState,
    isGameOver: false,
    comboCount: 0,
    animatingLines: null,
    isAnimating: false,
    isShaking: false,
    lastAudioEvent: null,
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
      const remaining = currentBlocks.filter((b) => b.id !== blockId)
      const nextBlocks = remaining.length === 0 ? getRandomBlocks(3) : remaining

      const placeAudioEvent: AudioEvent = 'place'
      const clearAudioEvent: AudioEvent = newCombo > 1 ? 'combo' : 'clear'

      if (lineCount > 0) {
        // 라인 애니메이션: 먼저 animatingLines 설정, 300ms 후 실제 제거
        set({
          board: newBoard,
          score: newScore,
          highScore: newHighScore,
          dragState: initialDragState,
          comboCount: newCombo,
          animatingLines: { rows: completedRows, cols: completedCols },
          isAnimating: true,
          lastAudioEvent: clearAudioEvent,
        })
        setTimeout(() => {
          const isGameOver = !canAnyBlockBePlaced(clearedBoard, nextBlocks)
          if (isGameOver) {
            set({
              board: clearedBoard,
              currentBlocks: nextBlocks,
              animatingLines: null,
              isAnimating: false,
              isShaking: true,
              lastAudioEvent: 'gameover',
            })
            setTimeout(() => set({ isGameOver: true, isShaking: false }), 500)
          } else {
            set({
              board: clearedBoard,
              currentBlocks: nextBlocks,
              animatingLines: null,
              isAnimating: false,
              isGameOver: false,
            })
          }
        }, 300)
      } else {
        // 5. 게임 오버 판정
        const isGameOver = !canAnyBlockBePlaced(clearedBoard, nextBlocks)
        if (isGameOver) {
          set({
            board: clearedBoard,
            score: newScore,
            highScore: newHighScore,
            currentBlocks: nextBlocks,
            dragState: initialDragState,
            comboCount: newCombo,
            animatingLines: null,
            isAnimating: false,
            isShaking: true,
            lastAudioEvent: 'gameover',
          })
          setTimeout(() => set({ isGameOver: true, isShaking: false }), 500)
        } else {
          set({
            board: clearedBoard,
            score: newScore,
            highScore: newHighScore,
            currentBlocks: nextBlocks,
            dragState: initialDragState,
            comboCount: newCombo,
            animatingLines: null,
            isAnimating: false,
            isGameOver: false,
            lastAudioEvent: placeAudioEvent,
          })
        }
      }
    },

    generateNewBlocks: () => {
      set({ currentBlocks: getRandomBlocks(3) })
    },

    clearAudioEvent: () => set({ lastAudioEvent: null }),
  }
},
{
  name: STORAGE_KEY,
  partialize: (state) => ({
    board: state.board,
    score: state.score,
    highScore: state.highScore,
    currentBlocks: state.currentBlocks,
    isGameOver: state.isGameOver,
    comboCount: state.comboCount,
  }),
}
)
)
