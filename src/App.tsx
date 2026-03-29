import { lazy, Suspense, useRef, useState } from 'react'
import Board from './components/Board/Board'
import BlockTray from './components/Block/BlockTray'
import DraggableBlock from './components/Block/DraggableBlock'
import ScoreDisplay from './components/UI/ScoreDisplay'
import GameEffects from './components/UI/GameEffects'
import InstallPrompt from './components/UI/InstallPrompt'
import SettingsPanel from './components/UI/SettingsPanel'
import { useTheme } from './hooks/useTheme'
import './index.css'

const GameOverModal = lazy(() => import('./components/UI/GameOverModal'))

// 설정 아이콘
const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.33 7.33 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7.33 7.33 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
)

function App() {
  useTheme()
  const boardRef = useRef<HTMLDivElement>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div
      className="flex flex-col items-center justify-between min-h-dvh p-4 pb-safe dark:bg-[#1C1C1E]"
      style={{ background: '#F2F2F7' }}
    >
      <header className="w-full flex flex-col items-center pt-2">
        <div
          className="w-full flex items-center gap-2"
          style={{ maxWidth: 'min(90vw, 500px)' }}
        >
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wider flex-1">
            Block Blast
          </h1>
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="설정 열기"
            className="flex items-center justify-center rounded-full w-11 h-11 transition-colors text-gray-600 dark:text-gray-300"
            style={{ background: '#E5E5EA' }}
          >
            <GearIcon />
          </button>
        </div>
        <div
          className="w-full rounded-2xl overflow-hidden mt-1 dark:bg-[#2C2C2E]"
          style={{ maxWidth: 'min(90vw, 500px)', background: '#FFFFFF' }}
        >
          <ScoreDisplay />
        </div>
      </header>

      <main
        className="flex flex-col w-full flex-1 justify-center py-4"
        style={{ maxWidth: 'min(90vw, 500px)' }}
      >
        <Board boardRef={boardRef} />
        <BlockTray boardRef={boardRef} />
      </main>

      <DraggableBlock />
      <Suspense fallback={null}>
        <GameOverModal />
      </Suspense>
      <GameEffects />
      <InstallPrompt />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
