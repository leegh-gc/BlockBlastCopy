import { describe, it, expect } from 'vitest'
import { calcPlacementScore, calcLineClearScore, calcComboScore } from '../scoreUtils'
import type { Block } from '../../types/game'

const block5: Block = {
  id: 'test',
  definitionId: 'line_h5',
  shape: [[1, 1, 1, 1, 1]],
  color: 'bg-blue-500',
}

const block3x3: Block = {
  id: 'test2',
  definitionId: 'block_3x3',
  shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
  color: 'bg-purple-600',
}

describe('calcPlacementScore', () => {
  it('5칸 블록은 5점이다', () => {
    expect(calcPlacementScore(block5)).toBe(5)
  })

  it('3x3 블록은 9점이다', () => {
    expect(calcPlacementScore(block3x3)).toBe(9)
  })
})

describe('calcLineClearScore', () => {
  it('1줄 제거: 10점', () => {
    expect(calcLineClearScore(1)).toBe(10)
  })

  it('2줄 제거: 30점', () => {
    expect(calcLineClearScore(2)).toBe(30)
  })

  it('3줄 제거: 60점', () => {
    expect(calcLineClearScore(3)).toBe(60)
  })

  it('4줄 제거: 100점', () => {
    expect(calcLineClearScore(4)).toBe(100)
  })

  it('5줄 제거: 5 * 5 * 5 = 125점', () => {
    expect(calcLineClearScore(5)).toBe(125)
  })

  it('0줄 제거: 0점', () => {
    expect(calcLineClearScore(0)).toBe(0)
  })
})

describe('calcComboScore', () => {
  it('콤보 0: 0점', () => {
    expect(calcComboScore(0)).toBe(0)
  })

  it('콤보 1: 10점', () => {
    expect(calcComboScore(1)).toBe(10)
  })

  it('콤보 3: 30점', () => {
    expect(calcComboScore(3)).toBe(30)
  })
})
