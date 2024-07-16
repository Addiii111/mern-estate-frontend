import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  console.log(formData)

  const handelSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }

    axios
      .post('api/signup', formData, config)
      .then((res) => {
        setLoading(false)
        setError(null)
        navigate('/signin')
        console.log(res)
      })
      .catch((err) => {
        setLoading(false)
        setError(err.response.data.error)
        console.log(err.response.data.error)
      })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handelChange}
        />
        <input
          type='text'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handelChange}
        />
        <input
          type='text'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handelChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/signin'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
