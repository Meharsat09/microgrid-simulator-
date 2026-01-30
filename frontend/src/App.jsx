import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [showSimulator, setShowSimulator] = useState(false)

  if (showSimulator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Dashboard />
      </div>
    )
  }

  return <LandingPage onLaunchSimulator={() => setShowSimulator(true)} />
}

export default App
