import { Route, Routes } from 'react-router-dom'
import './App.css'
import GlobalStyles from './styles/GlobalStyles'

import Home from './pages/Home'
import Loading from './pages/Loading'
import Game1 from './pages/Game1'

function App() {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/loading' element={<Loading />} />
        <Route path='/game' element={<Game1 />} />
      </Routes>
    </>
  )
}

export default App
