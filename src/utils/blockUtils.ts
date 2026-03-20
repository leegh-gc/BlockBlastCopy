import { BLOCK_DEFINITIONS } from '../constants/blocks'
import type { Block } from '../types/game'

/**
 * BLOCK_DEFINITIONS에서 랜덤으로 n개의 블록 인스턴스를 생성하여 반환
 */
export function getRandomBlocks(count: number): Block[] {
  return Array.from({ length: count }, () => {
    const def = BLOCK_DEFINITIONS[Math.floor(Math.random() * BLOCK_DEFINITIONS.length)]
    return {
      id: crypto.randomUUID(),
      definitionId: def.id,
      shape: def.shape,
      color: def.color,
    }
  })
}
