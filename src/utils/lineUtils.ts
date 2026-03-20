import type { Cell } from '../types/game'
import { BOARD_SIZE } from '../constants/game'

export function getCompletedLines(board: Cell[][]): { rows: number[]; cols: number[] } {
  const rows: number[] = []
  const cols: number[] = []

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every((cell) => cell.filled)) rows.push(r)
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    if (board.every((row) => row[c].filled)) cols.push(c)
  }

  return { rows, cols }
}

export function clearLines(board: Cell[][], completedRows: number[], completedCols: number[]): Cell[][] {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })))
  const rowSet = new Set(completedRows)
  const colSet = new Set(completedCols)

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (rowSet.has(r) || colSet.has(c)) {
        newBoard[r][c] = { filled: false, color: null }
      }
    }
  }

  return newBoard
}
