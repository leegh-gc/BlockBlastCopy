import { lazy, Suspense, useRef } from 'react'
import Board from './components/Board/Board'
import BlockTray from './components/Block/BlockTray'
import DraggableBlock from './components/Block/DraggableBlock'
import ScoreDisplay from './components/UI/ScoreDisplay'
import SoundToggle from './components/UI/SoundToggle'
import HapticToggle from './components/UI/HapticToggle'
import GameEffects from './components/UI/GameEffects'
import InstallPrompt from './components/UI/InstallPrompt'
import './index.css'

const GameOverModal = lazy(() => import('./components/UI/GameOverModal'))

function App() {
  const boardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="flex flex-col items-center justify-between min-h-dvh p-4 pb-safe"
      style={{ background: '#F2F2F7' }}
    >
      <header className="w-full flex flex-col items-center pt-2">
        <div
          className="w-full flex items-center gap-2"
          style={{ maxWidth: 'min(90vw, 500px)' }}
        >
          <h1 className="text-2xl font-bold text-gray-800 tracking-wider flex-1">Block Blast</h1>
          <HapticToggle />
          <SoundToggle />
        </div>
        <div
          className="w-full rounded-2xl overflow-hidden mt-1"
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
    </div>
  )
}

export default App
