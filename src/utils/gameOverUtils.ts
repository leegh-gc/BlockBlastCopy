import type { Cell, Block } from '../types/game'
import { canPlaceBlock } from './boardUtils'

const BOARD_SIZE = 8

export function canAnyBlockBePlaced(board: Cell[][], blocks: Block[]): boolean {
  if (blocks.length === 0) return false

  for (const block of blocks) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlaceBlock(board, block, r, c)) return true
      }
    }
  }

  return false
}
