import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  // console.log(formData)

  const handelSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStart())

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }

    await axios
      .post('api/signin', formData, config)
      .then((res) => {
        dispatch(signInSuccess(res))
        navigate('/')
        // console.log(res)
      })
      .catch((err) => {
        dispatch(signInFailure(err.response.data.error))
        // console.log(err.response.data.error)
      })
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
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
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
