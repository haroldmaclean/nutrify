import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Track from './components/Track'
import Notfound from './components/Notfound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
import { useState } from 'react'

import Private from './components/Private'

function App() {
  const [loggedUser, setLoggedUser] = useState(
    localStorage.getItem('nutrify-user')
  )

  return (
    <>
      <UserContext.Provider value={{ loggedUser, setLoggedUser }}>
        <BrowserRouter>
          {' '}
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/track' element={<Private Component={Track} />} />

            <Route path='*' element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App
