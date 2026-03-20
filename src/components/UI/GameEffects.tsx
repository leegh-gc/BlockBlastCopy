import { useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useSound } from '../../hooks/useSound'
import { useHaptic } from '../../hooks/useHaptic'

/**
 * 게임 이벤트(배치/클리어/콤보/게임오버)에 반응해 사운드와 햅틱을 트리거하는 컴포넌트.
 * Zustand store에서 React 훅을 직접 호출할 수 없으므로 컴포넌트 레벨에서 처리.
 */
export default function GameEffects() {
  const lastAudioEvent = useGameStore((s) => s.lastAudioEvent)
  const clearAudioEvent = useGameStore((s) => s.clearAudioEvent)
  const { playPlace, playClear, playCombo, playGameOver } = useSound()
  const { vibratePlace, vibrateClear, vibrateGameOver } = useHaptic()

  useEffect(() => {
    if (!lastAudioEvent) return
    switch (lastAudioEvent) {
      case 'place':
        playPlace()
        vibratePlace()
        break
      case 'clear':
        playClear()
        vibrateClear()
        break
      case 'combo':
        playCombo()
        vibrateClear()
        break
      case 'gameover':
        playGameOver()
        vibrateGameOver()
        break
    }
    clearAudioEvent()
  }, [lastAudioEvent]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
