
import { Routes, Route } from 'react-router-dom'
import Dashboard from './View/Dashboard'
import Stats from './View/Stats'
import Horas from './View/Horas'
import Week from './View/Week'
import Month from './View/Month'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='now' element={<Stats />} />
      <Route path='horas' element={<Horas />} />
      <Route path='week' element={<Week />} />
      <Route path='month' element={<Month />} />
    </Routes>
  )
}

export default App
