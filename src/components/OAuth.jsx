import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)
      // console.log(result);
      const data = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
      const res = await axios.post('/api/google', data, config)
        // const resData = await res.json()
      console.log(res)
      dispatch(signInSuccess(res))
      navigate('/')
    } catch (error) {
      console.log('Could not sign in with google', error)
    }
  }

  return (
    <button
      onClick={handelGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue to google
    </button>
  )
}
