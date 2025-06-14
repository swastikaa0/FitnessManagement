import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './Login'
import Signup from './Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginPage />
      <Signup />
    </>
  )
}

export default App
