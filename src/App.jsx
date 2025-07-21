import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VoipClient from './VoipClient'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <VoipClient />
    </>
  )
}

export default App
