import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../gameStore'

// Zustand 스토어를 테스트 간 초기화
beforeEach(() => {
  useGameStore.setState(useGameStore.getState().getInitialState())
})

describe('gameStore - 초기 상태', () => {
  it('보드는 8x8이고 모든 셀이 비어있다', () => {
    const { board } = useGameStore.getState()
    expect(board).toHaveLength(8)
    board.forEach((row) => {
      expect(row).toHaveLength(8)
      row.forEach((cell) => {
        expect(cell.filled).toBe(false)
        expect(cell.color).toBeNull()
      })
    })
  })

  it('초기 점수는 0이다', () => {
    const { score } = useGameStore.getState()
    expect(score).toBe(0)
  })

  it('currentBlocks는 3개이다', () => {
    const { currentBlocks } = useGameStore.getState()
    expect(currentBlocks).toHaveLength(3)
  })

  it('isGameOver는 false이다', () => {
    const { isGameOver } = useGameStore.getState()
    expect(isGameOver).toBe(false)
  })
})

describe('gameStore - resetGame', () => {
  it('resetGame 호출 시 보드와 점수가 초기화된다', () => {
    const store = useGameStore.getState()
    // 점수를 임의로 변경
    useGameStore.setState({ score: 100, isGameOver: true })
    store.resetGame()
    const { score, isGameOver } = useGameStore.getState()
    expect(score).toBe(0)
    expect(isGameOver).toBe(false)
  })
})
