import { describe, it, expect } from 'vitest'
import { canAnyBlockBePlaced } from '../gameOverUtils'
import type { Cell, Block } from '../../types/game'

function emptyBoard(): Cell[][] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ filled: false, color: null }))
  )
}

function fullBoard(): Cell[][] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ filled: true, color: 'bg-blue-500' }))
  )
}

const singleBlock: Block = {
  id: 'b1',
  definitionId: 'block_1x1',
  shape: [[1]],
  color: 'bg-red-500',
}

const twoByTwoBlock: Block = {
  id: 'b2',
  definitionId: 'block_2x2',
  shape: [[1, 1], [1, 1]],
  color: 'bg-red-500',
}

describe('canAnyBlockBePlaced', () => {
  it('빈 보드에서는 항상 true를 반환한다', () => {
    expect(canAnyBlockBePlaced(emptyBoard(), [singleBlock])).toBe(true)
  })

  it('꽉 찬 보드에서는 false를 반환한다', () => {
    expect(canAnyBlockBePlaced(fullBoard(), [singleBlock])).toBe(false)
  })

  it('블록 목록이 비어있으면 false를 반환한다', () => {
    expect(canAnyBlockBePlaced(emptyBoard(), [])).toBe(false)
  })

  it('2x2 블록이 들어갈 자리가 없으면 false를 반환한다', () => {
    // 모든 셀을 채우되 한 셀만 비움 (2x2 배치 불가)
    const board = fullBoard()
    board[0][0] = { filled: false, color: null }
    expect(canAnyBlockBePlaced(board, [twoByTwoBlock])).toBe(false)
  })

  it('하나라도 배치 가능한 블록이 있으면 true를 반환한다', () => {
    const board = fullBoard()
    board[7][7] = { filled: false, color: null }
    expect(canAnyBlockBePlaced(board, [singleBlock, twoByTwoBlock])).toBe(true)
  })
})
