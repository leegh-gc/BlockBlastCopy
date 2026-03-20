import type { Cell, Block, Position } from '../types/game'

const BOARD_SIZE = 8

export function canPlaceBlock(board: Cell[][], block: Block, row: number, col: number): boolean {
  for (let dr = 0; dr < block.shape.length; dr++) {
    for (let dc = 0; dc < block.shape[dr].length; dc++) {
      if (block.shape[dr][dc] !== 1) continue
      const r = row + dr
      const c = col + dc
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false
      if (board[r][c].filled) return false
    }
  }
  return true
}

export function getBlockCells(block: Block, row: number, col: number): Position[] {
  const cells: Position[] = []
  for (let dr = 0; dr < block.shape.length; dr++) {
    for (let dc = 0; dc < block.shape[dr].length; dc++) {
      if (block.shape[dr][dc] === 1) {
        cells.push({ row: row + dr, col: col + dc })
      }
    }
  }
  return cells
}
