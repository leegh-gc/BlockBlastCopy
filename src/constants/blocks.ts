import type { BlockDefinition } from '../types/game'

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // 1. 1x1 블록
  { id: 'block_1x1', shape: [[1]], color: 'bg-yellow-400' },

  // 2. 2x2 블록
  { id: 'block_2x2', shape: [[1,1],[1,1]], color: 'bg-red-500' },

  // 3. 3x3 블록
  { id: 'block_3x3', shape: [[1,1,1],[1,1,1],[1,1,1]], color: 'bg-purple-600' },

  // 4. 수평 라인 블록 (2, 3, 4, 5칸)
  { id: 'line_h2', shape: [[1,1]], color: 'bg-blue-400' },
  { id: 'line_h3', shape: [[1,1,1]], color: 'bg-blue-500' },
  { id: 'line_h4', shape: [[1,1,1,1]], color: 'bg-blue-600' },
  { id: 'line_h5', shape: [[1,1,1,1,1]], color: 'bg-blue-700' },

  // 5. 수직 라인 블록 (2, 3, 4, 5칸)
  { id: 'line_v2', shape: [[1],[1]], color: 'bg-cyan-400' },
  { id: 'line_v3', shape: [[1],[1],[1]], color: 'bg-cyan-500' },
  { id: 'line_v4', shape: [[1],[1],[1],[1]], color: 'bg-cyan-600' },
  { id: 'line_v5', shape: [[1],[1],[1],[1],[1]], color: 'bg-cyan-700' },

  // 6. L자형 블록 (4가지 회전)
  { id: 'l_bottom_left', shape: [[1,0],[1,0],[1,1]], color: 'bg-orange-500' },
  { id: 'l_bottom_right', shape: [[0,1],[0,1],[1,1]], color: 'bg-orange-400' },
  { id: 'l_top_left', shape: [[1,1],[1,0],[1,0]], color: 'bg-amber-500' },
  { id: 'l_top_right', shape: [[1,1],[0,1],[0,1]], color: 'bg-amber-400' },

  // 7. T자형 블록 (작은 T 3칸, 큰 T 5칸)
  { id: 't_small', shape: [[1,1,1],[0,1,0]], color: 'bg-green-500' },
  { id: 't_large', shape: [[1,1,1],[0,1,0],[0,1,0]], color: 'bg-green-600' },

  // 8. 특수 블록
  { id: 'zigzag', shape: [[1,1,0],[0,1,1]], color: 'bg-pink-500' },
  { id: 'staircase', shape: [[1,0,0],[1,1,0],[0,1,1]], color: 'bg-teal-500' },
]
