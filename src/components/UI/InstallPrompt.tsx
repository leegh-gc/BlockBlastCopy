import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'

const InstallPrompt: React.FC = () => {
  const { canPrompt, promptInstall, dismiss, showIOSHint } = useInstallPrompt()

  const visible = canPrompt || showIOSHint

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl p-4 flex items-center gap-3 shadow-lg"
          style={{ background: '#FFFFFF', maxWidth: 500, margin: '0 auto' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="text-2xl">🎮</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">홈 화면에 추가</p>
            {showIOSHint ? (
              <p className="text-xs text-gray-500 mt-0.5">
                Safari 공유 버튼 → <strong>홈 화면에 추가</strong>
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-0.5">오프라인에서도 플레이 가능!</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {canPrompt && (
              <button
                onClick={promptInstall}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#007AFF' }}
              >
                설치
              </button>
            )}
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-xl text-sm font-semibold"
              style={{ background: '#F2F2F7', color: '#8E8E93' }}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InstallPrompt
