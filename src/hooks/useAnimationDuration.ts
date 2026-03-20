import { useCallback } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

const DURATION_MAP = {
  fast: 0.5,
  normal: 1.0,
  slow: 2.0,
}

/**
 * 애니메이션 속도 설정에 따라 duration 배율을 적용한 함수를 반환한다.
 * 사용: const getDuration = useAnimationDuration()
 *       <motion.div transition={{ duration: getDuration(0.3) }} />
 */
export function useAnimationDuration() {
  const speed = useSettingsStore((s) => s.animationSpeed)
  return useCallback(
    (baseDuration: number) => baseDuration * DURATION_MAP[speed],
    [speed]
  )
}
