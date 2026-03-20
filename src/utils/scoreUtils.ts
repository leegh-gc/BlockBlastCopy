import type { Block } from '../types/game'

export function calcPlacementScore(block: Block): number {
  return block.shape.flat().filter((v) => v === 1).length
}

export function calcLineClearScore(lineCount: number): number {
  if (lineCount <= 0) return 0
  if (lineCount === 1) return 10
  if (lineCount === 2) return 30
  if (lineCount === 3) return 60
  if (lineCount === 4) return 100
  return lineCount * lineCount * 5
}

export function calcComboScore(comboCount: number): number {
  return comboCount * 10
}
