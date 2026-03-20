import { useRef } from 'react'
import Board from './components/Board/Board'
import BlockTray from './components/Block/BlockTray'
import DraggableBlock from './components/Block/DraggableBlock'
import './index.css'

function App() {
  const boardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Block Blast</h1>
      <div
        className="flex flex-col w-full"
        style={{ maxWidth: 'min(90vw, 500px)' }}
      >
        <Board boardRef={boardRef} />
        <BlockTray boardRef={boardRef} />
      </div>
      {/* 드래그 중 커서를 따라 이동하는 고스트 레이어 */}
      <DraggableBlock />
    </div>
  )
}

export default App
