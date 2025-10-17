import { UserContext } from '../contexts/UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const loggedInData = useContext(UserContext)

  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('nutrify-user')
    loggedInData.setLoggedUser(null)
    navigate('/login')
  }

  return (
    <div>
      <ul>
        <li>Home</li>
        <li onClick={logout}>Logout</li>
      </ul>
    </div>
  )
}
