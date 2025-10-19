import { useEffect, useState, useContext, useCallback } from 'react'
import { UserContext } from '../contexts/UserContext'
import Header from './Header' // Ensure Header component exists

export default function Diet() {
  // Define the base URL using the environment variable
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'

  const loggedInData = useContext(UserContext)
  const [items, setItems] = useState([])
  const [date, setDate] = useState(new Date())

  const [total, setTotal] = useState({
    totalCaloreis: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFiber: 0,
  })

  // Helper function to format the date correctly for the API
  const formatDate = (dateObj) => {
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${month}/${day}/${dateObj.getFullYear()}`
  }

  // ⭐️ FIX 1: Wrap calculateTotal in useCallback
  const calculateTotal = useCallback(() => {
    let totalCopy = {
      totalCaloreis: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
    }

    items.forEach((item) => {
      if (item.details) {
        totalCopy.totalCaloreis += item.details.calories
        totalCopy.totalProtein += item.details.protein
        totalCopy.totalCarbs += item.details.carbohydrates
        totalCopy.totalFats += item.details.fat
        totalCopy.totalFiber += item.details.fiber
      }
    })

    setTotal(totalCopy)
  }, [items, setTotal]) // Dependency includes items state and the setter function

  useEffect(() => {
    const userId = loggedInData.loggedUser.userid
    const token = loggedInData.loggedUser.token

    if (!userId || !token) return

    const dateString = formatDate(date)

    // Using the dynamic API_BASE_URL variable
    fetch(`${API_BASE_URL}/track/${userId}/${encodeURIComponent(dateString)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        console.log('Fetched tracked items:', data)
        setItems(data)
      })
      .catch((err) => {
        console.error('Fetch error:', err)
        setItems([])
      })
  }, [
    date,
    loggedInData.loggedUser.userid,
    loggedInData.loggedUser.token,
    API_BASE_URL, // Dependency added to fix earlier warning
  ])

  // ⭐️ FIX 2: Update the dependency array to depend on the stable calculateTotal function
  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  return (
    <section className='container diet-container'>
      <Header />

      <input
        type='date'
        onChange={(event) => {
          setDate(new Date(event.target.value))
        }}
      />

      {/* Displaying fetched items */}
      {items.length === 0 ? (
        <p>No food tracked on {formatDate(date)}.</p>
      ) : (
        items.map((item) => {
          const foodName =
            item.foodId && item.foodId.name ? item.foodId.name : 'Unknown Food'

          return (
            <div className='item' key={item._id}>
              <h3>
                {foodName} ( {Math.round(item.details.calories)} Kcal for{' '}
                {item.quantity}g )
              </h3>
              <p>
                Protein {item.details.protein.toFixed(1)}g, Carbs{' '}
                {item.details.carbohydrates.toFixed(1)}g, Fats{' '}
                {item.details.fat.toFixed(1)}g, Fiber{' '}
                {item.details.fiber.toFixed(1)}g
              </p>
            </div>
          )
        })
      )}

      {/* Displaying Total Macros */}
      <div className='item total-summary'>
        <h3>Total: {Math.round(total.totalCaloreis)} Kcal </h3>
        <p>
          Protein {total.totalProtein.toFixed(1)}g, Carbs{' '}
          {total.totalCarbs.toFixed(1)}g, Fats {total.totalFats.toFixed(1)}g,
          Fiber {total.totalFiber.toFixed(1)}g
        </p>
      </div>
    </section>
  )
}
