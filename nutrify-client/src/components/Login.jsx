import React from 'react'
import { Link, Links } from 'react-router-dom'

export default function Login() {
  return (
    <section className='container'>
      <form className='form'>
        <h1>login to fitness</h1>

        <input
          className='inp'
          type='email'
          placeholder='Enter Email'
          name='email'
        />
        <input
          className='inp'
          type='password'
          placeholder='Enter Password'
          name='pasasword'
        />

        <button className='btn'>Login</button>
        <p>
          Don't have account? <Link to='/register'>Register now</Link>
        </p>
      </form>
    </section>
  )
}
