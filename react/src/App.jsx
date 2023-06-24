
import { Routes, Route } from 'react-router-dom'
import Dashboard from './View/Dashboard'
import Stats from './View/Stats'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='stats' element={<Stats />} />
    </Routes>
  )
}

export default App
