import { useCallback } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

/**
 * Vibration API 기반 햅틱 피드백 훅.
 * iOS Safari는 Vibration API 미지원 → graceful degradation.
 */
export function useHaptic() {
  const isHapticEnabled = useSettingsStore((s) => s.isHapticEnabled)
  const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!isHapticEnabled || !canVibrate) return
      navigator.vibrate(pattern)
    },
    [isHapticEnabled, canVibrate]
  )

  const vibratePlace = useCallback(() => vibrate(50), [vibrate])
  const vibrateClear = useCallback(() => vibrate(100), [vibrate])
  const vibrateGameOver = useCallback(() => vibrate([100, 50, 100, 50, 200]), [vibrate])

  return { vibratePlace, vibrateClear, vibrateGameOver, canVibrate }
}
