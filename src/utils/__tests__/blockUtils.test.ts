import { describe, it, expect } from 'vitest'
import { BLOCK_DEFINITIONS } from '../../constants/blocks'
import { getRandomBlocks } from '../blockUtils'

describe('BLOCK_DEFINITIONS', () => {
  it('19종의 블록이 정의되어 있다', () => {
    expect(BLOCK_DEFINITIONS).toHaveLength(19)
  })

  it('모든 블록은 id, shape, color를 가진다', () => {
    BLOCK_DEFINITIONS.forEach((block) => {
      expect(block.id).toBeTruthy()
      expect(block.shape.length).toBeGreaterThan(0)
      expect(block.color).toBeTruthy()
    })
  })

  it('모든 블록 shape는 최소 1개의 채워진 셀을 가진다', () => {
    BLOCK_DEFINITIONS.forEach((block) => {
      const filledCells = block.shape.flat().filter((v) => v === 1)
      expect(filledCells.length).toBeGreaterThan(0)
    })
  })
})

describe('getRandomBlocks', () => {
  it('요청한 수만큼 블록 인스턴스를 반환한다', () => {
    const blocks = getRandomBlocks(3)
    expect(blocks).toHaveLength(3)
  })

  it('각 블록 인스턴스는 고유한 id를 가진다', () => {
    const blocks = getRandomBlocks(3)
    const ids = blocks.map((b) => b.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(3)
  })
})
