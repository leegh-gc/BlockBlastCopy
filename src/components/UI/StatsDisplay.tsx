import React, { useState } from 'react'
import { useStatsStore } from '../../stores/statsStore'

const StatsDisplay: React.FC = () => {
  const { totalGames, totalScore, bestScore, bestCombo, totalLinesCleared, resetStats } = useStatsStore()
  const [confirming, setConfirming] = useState(false)

  const handleReset = () => {
    if (confirming) {
      resetStats()
      setConfirming(false)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#C6C6C8] dark:border-[#38383A]">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
        통계
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: '총 플레이', value: totalGames.toLocaleString() },
          { label: '누적 점수', value: totalScore.toLocaleString() },
          { label: '최고 점수', value: bestScore.toLocaleString() },
          { label: '최고 콤보', value: `×${bestCombo}` },
          { label: '제거 라인', value: totalLinesCleared.toLocaleString() },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'var(--stats-cell-bg)' }}
          >
            <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            <div className="text-lg font-bold text-gray-800 dark:text-white">{value}</div>
          </div>
        ))}
      </div>
      <button
        onClick={handleReset}
        className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-colors"
        style={{
          background: confirming ? '#FF3B30' : '#F2F2F7',
          color: confirming ? '#FFFFFF' : '#8E8E93',
        }}
      >
        {confirming ? '정말 초기화하시겠어요? (다시 누르면 실행)' : '통계 초기화'}
      </button>
    </div>
  )
}

export default StatsDisplay
