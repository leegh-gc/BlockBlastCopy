import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore, type Theme, type AnimationSpeed } from '../../stores/settingsStore'
import { useHaptic } from '../../hooks/useHaptic'
import StatsDisplay from './StatsDisplay'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-[#C6C6C8] dark:border-[#38383A]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="flex-1 py-2 text-sm font-medium transition-colors"
          style={{
            background: value === opt.value ? '#007AFF' : 'transparent',
            color: value === opt.value ? '#FFFFFF' : '#8E8E93',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="relative w-12 h-7 rounded-full transition-colors"
      style={{ background: enabled ? '#007AFF' : '#E5E5EA' }}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform"
        style={{ transform: enabled ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

const THEME_OPTIONS: { label: string; value: Theme }[] = [
  { label: '라이트', value: 'light' },
  { label: '시스템', value: 'system' },
  { label: '다크', value: 'dark' },
]

const SPEED_OPTIONS: { label: string; value: AnimationSpeed }[] = [
  { label: '빠름', value: 'fast' },
  { label: '보통', value: 'normal' },
  { label: '느림', value: 'slow' },
]

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { isSoundEnabled, isHapticEnabled, theme, animationSpeed,
    toggleSound, toggleHaptic, setTheme, setAnimationSpeed } = useSettingsStore()
  const { canVibrate } = useHaptic()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 백드롭 */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 패널 */}
          <motion.div
            className="fixed right-0 top-0 h-full z-50 flex flex-col overflow-y-auto"
            style={{
              width: 'min(320px, 85vw)',
              background: 'var(--panel-bg, #FFFFFF)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 border-b border-[#C6C6C8] dark:border-[#38383A]">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">설정</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400"
                style={{ background: '#F2F2F7' }}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 px-5 py-4 space-y-5">
              {/* 테마 */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-2">
                  테마
                </label>
                <SegmentControl options={THEME_OPTIONS} value={theme} onChange={setTheme} />
              </div>

              {/* 애니메이션 속도 */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 block mb-2">
                  애니메이션 속도
                </label>
                <SegmentControl options={SPEED_OPTIONS} value={animationSpeed} onChange={setAnimationSpeed} />
              </div>

              {/* 사운드 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">사운드</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">블록 배치, 라인 클리어, 게임 오버</div>
                </div>
                <ToggleSwitch enabled={isSoundEnabled} onToggle={toggleSound} />
              </div>

              {/* 햅틱 */}
              {canVibrate && (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">햅틱</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">터치 진동 피드백</div>
                  </div>
                  <ToggleSwitch enabled={isHapticEnabled} onToggle={toggleHaptic} />
                </div>
              )}

              {/* 통계 */}
              <StatsDisplay />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SettingsPanel
