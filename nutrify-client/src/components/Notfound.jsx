import React from 'react'
import { Link } from 'react-router-dom'

export default function Notfound() {
  return (
    <section className='container notfound'>
      <div className='not-found'>
        <h1>404 | Not Found</h1>
        <p>
          {' '}
          <Link to='/register'>Register</Link> Now to Use
        </p>
      </div>
    </section>
  )
}
