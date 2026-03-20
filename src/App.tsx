import { useRef } from 'react'
import Board from './components/Board/Board'
import './index.css'

function App() {
  const boardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6 text-white">Block Blast</h1>
      <div className="w-full" style={{ maxWidth: 'min(90vw, 500px)' }}>
        <Board boardRef={boardRef} />
      </div>
    </div>
  )
}

export default App
