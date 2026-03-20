import { describe, it, expect } from 'vitest'
import { canPlaceBlock, getBlockCells } from '../boardUtils'
import type { Cell, Block } from '../../types/game'

function emptyBoard(): Cell[][] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ filled: false, color: null }))
  )
}

const singleBlock: Block = {
  id: 'test',
  definitionId: 'block_1x1',
  shape: [[1]],
  color: 'bg-red-500',
}

const lBlock: Block = {
  id: 'test-l',
  definitionId: 'l_bottom_left',
  shape: [[1, 0], [1, 0], [1, 1]],
  color: 'bg-orange-500',
}

describe('canPlaceBlock', () => {
  it('빈 보드 중앙에 배치 가능하다', () => {
    expect(canPlaceBlock(emptyBoard(), singleBlock, 3, 3)).toBe(true)
  })

  it('모서리(0,0)에 1x1 블록 배치 가능하다', () => {
    expect(canPlaceBlock(emptyBoard(), singleBlock, 0, 0)).toBe(true)
  })

  it('모서리(7,7)에 1x1 블록 배치 가능하다', () => {
    expect(canPlaceBlock(emptyBoard(), singleBlock, 7, 7)).toBe(true)
  })

  it('보드 범위를 벗어나면 배치 불가하다', () => {
    expect(canPlaceBlock(emptyBoard(), lBlock, 6, 6)).toBe(false) // row 6+2=8 초과
  })

  it('이미 채워진 셀 위에 배치 불가하다', () => {
    const board = emptyBoard()
    board[3][3] = { filled: true, color: 'bg-blue-500' }
    expect(canPlaceBlock(board, singleBlock, 3, 3)).toBe(false)
  })

  it('L블록이 유효 위치에 들어간다', () => {
    expect(canPlaceBlock(emptyBoard(), lBlock, 0, 0)).toBe(true)
  })

  it('L블록이 우측 끝에 걸치면 배치 불가하다', () => {
    expect(canPlaceBlock(emptyBoard(), lBlock, 0, 7)).toBe(false) // col 7+1=8 초과
  })
})

describe('getBlockCells', () => {
  it('1x1 블록의 셀 좌표를 반환한다', () => {
    const cells = getBlockCells(singleBlock, 2, 3)
    expect(cells).toEqual([{ row: 2, col: 3 }])
  })

  it('L블록의 모든 셀 좌표를 반환한다', () => {
    const cells = getBlockCells(lBlock, 0, 0)
    expect(cells).toContainEqual({ row: 0, col: 0 })
    expect(cells).toContainEqual({ row: 1, col: 0 })
    expect(cells).toContainEqual({ row: 2, col: 0 })
    expect(cells).toContainEqual({ row: 2, col: 1 })
    expect(cells).toHaveLength(4)
  })
})
