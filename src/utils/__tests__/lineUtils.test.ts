import { describe, it, expect } from 'vitest'
import { getCompletedLines, clearLines } from '../lineUtils'
import type { Cell } from '../../types/game'

function emptyBoard(): Cell[][] {
  return Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => ({ filled: false, color: null }))
  )
}

function fillRow(board: Cell[][], row: number): Cell[][] {
  board[row] = board[row].map(() => ({ filled: true, color: 'bg-blue-500' }))
  return board
}

function fillCol(board: Cell[][], col: number): Cell[][] {
  board.forEach((row) => { row[col] = { filled: true, color: 'bg-blue-500' } })
  return board
}

describe('getCompletedLines', () => {
  it('아무것도 완성되지 않으면 빈 배열을 반환한다', () => {
    const result = getCompletedLines(emptyBoard())
    expect(result.rows).toHaveLength(0)
    expect(result.cols).toHaveLength(0)
  })

  it('단일 행이 완성되면 해당 행 인덱스를 반환한다', () => {
    const board = fillRow(emptyBoard(), 3)
    const result = getCompletedLines(board)
    expect(result.rows).toEqual([3])
    expect(result.cols).toHaveLength(0)
  })

  it('단일 열이 완성되면 해당 열 인덱스를 반환한다', () => {
    const board = fillCol(emptyBoard(), 5)
    const result = getCompletedLines(board)
    expect(result.rows).toHaveLength(0)
    expect(result.cols).toEqual([5])
  })

  it('행과 열이 동시에 완성되면 모두 반환한다', () => {
    let board = emptyBoard()
    board = fillRow(board, 0)
    board = fillCol(board, 0)
    const result = getCompletedLines(board)
    expect(result.rows).toContain(0)
    expect(result.cols).toContain(0)
  })
})

describe('clearLines', () => {
  it('완성된 행의 셀을 초기화한다', () => {
    const board = fillRow(emptyBoard(), 2)
    const cleared = clearLines(board, [2], [])
    cleared[2].forEach((cell) => {
      expect(cell.filled).toBe(false)
      expect(cell.color).toBeNull()
    })
  })

  it('완성된 열의 셀을 초기화한다', () => {
    const board = fillCol(emptyBoard(), 4)
    const cleared = clearLines(board, [], [4])
    cleared.forEach((row) => {
      expect(row[4].filled).toBe(false)
    })
  })

  it('블록이 아래로 떨어지지 않는다', () => {
    let board = emptyBoard()
    board = fillRow(board, 7) // 맨 아랫줄 완성
    board[0][0] = { filled: true, color: 'bg-red-500' } // 맨 윗줄에 블록
    const cleared = clearLines(board, [7], [])
    // 맨 윗줄 블록은 그대로 있어야 한다
    expect(cleared[0][0].filled).toBe(true)
  })
})
