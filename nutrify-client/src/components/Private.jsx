import { UserContext } from '../contexts/UserContext'
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

// ⭐️ FIX: Destructure the Component prop directly from the 'props' object

// eslint-disable-next-line no-unused-vars
export default function Private({ Component }) {
  const loggedInData = useContext(UserContext)

  // Now use 'Component' directly as a JSX tag
  return loggedInData.loggedUser !== null ? (
    <Component />
  ) : (
    <Navigate to='/login' />
  )
}
