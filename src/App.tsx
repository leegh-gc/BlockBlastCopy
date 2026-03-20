import { useRef } from 'react'
import Board from './components/Board/Board'
import BlockTray from './components/Block/BlockTray'
import DraggableBlock from './components/Block/DraggableBlock'
import GameOverModal from './components/UI/GameOverModal'
import ScoreDisplay from './components/UI/ScoreDisplay'
import './index.css'

function App() {
  const boardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="flex flex-col items-center justify-between min-h-dvh p-4 pb-safe"
      style={{ background: '#F2F2F7' }}
    >
      <header className="w-full flex flex-col items-center pt-2">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wider mb-1">Block Blast</h1>
        <div
          className="w-full rounded-2xl overflow-hidden"
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
      <GameOverModal />
    </div>
  )
}

export default App
