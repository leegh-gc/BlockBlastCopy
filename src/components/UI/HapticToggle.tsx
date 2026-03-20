import React from 'react'
import { useSettingsStore } from '../../stores/settingsStore'
import { useHaptic } from '../../hooks/useHaptic'

const HapticOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
    <path d="M2 7h1.5v10H2zm18.5 0H22v10h-1.5z" />
  </svg>
)

const HapticOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
  </svg>
)

const HapticToggle: React.FC = () => {
  const isHapticEnabled = useSettingsStore((s) => s.isHapticEnabled)
  const toggleHaptic = useSettingsStore((s) => s.toggleHaptic)
  const { canVibrate } = useHaptic()

  if (!canVibrate) return null

  return (
    <button
      onClick={toggleHaptic}
      aria-label={isHapticEnabled ? '햅틱 끄기' : '햅틱 켜기'}
      className="flex items-center justify-center rounded-full w-11 h-11 transition-colors"
      style={{
        background: isHapticEnabled ? '#007AFF' : '#E5E5EA',
        color: isHapticEnabled ? '#FFFFFF' : '#8E8E93',
      }}
    >
      {isHapticEnabled ? <HapticOnIcon /> : <HapticOffIcon />}
    </button>
  )
}

export default HapticToggle
