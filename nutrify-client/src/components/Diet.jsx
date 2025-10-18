import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import Header from './Header' // Ensure Header component exists

export default function Diet() {
  const loggedInData = useContext(UserContext)
  const [items, setItems] = useState([])
  // Initialize date to today's date to ensure first fetch is correct
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
    // This format (e.g., "10/17/2025") is reliably parsed by new Date()
    // and keeps the logic consistent.
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${month}/${day}/${dateObj.getFullYear()}`
  }

  useEffect(() => {
    const userId = loggedInData.loggedUser.userid
    const token = loggedInData.loggedUser.token

    if (!userId || !token) return

    // Use the simplified date string that the backend can now parse
    const dateString = formatDate(date)

    fetch(
      `http://localhost:8000/track/${userId}/${encodeURIComponent(dateString)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          // If response is not OK (e.g., 404, 500), throw error
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
        setItems([]) // Clear items on error
      })
  }, [date, loggedInData.loggedUser.userid, loggedInData.loggedUser.token])

  useEffect(() => {
    calculateTotal()
  }, [items])

  function calculateTotal() {
    let totalCopy = {
      totalCaloreis: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
    }

    items.forEach((item) => {
      // Ensure data exists before summing (Mongoose population check)
      if (item.details) {
        totalCopy.totalCaloreis += item.details.calories
        totalCopy.totalProtein += item.details.protein
        totalCopy.totalCarbs += item.details.carbohydrates
        totalCopy.totalFats += item.details.fat
        totalCopy.totalFiber += item.details.fiber
      }
    })

    setTotal(totalCopy)
  }

  return (
    <section className='container diet-container'>
      <Header />

      {/* Input is now a controlled component with the date state */}
      <input
        type='date'
        onChange={(event) => {
          // Setting date state triggers the useEffect fetch
          setDate(new Date(event.target.value))
        }}
      />

      {/* Displaying fetched items */}
      {items.length === 0 ? (
        <p>No food tracked on {formatDate(date)}.</p>
      ) : (
        items.map((item) => {
          // 🛑 DANGER AREA: This relies on Mongoose Population (item.foodId must be an object)
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
