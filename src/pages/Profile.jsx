import { useSelector } from 'react-redux'
import { useState, useEffect, useRef } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { app } from '../firebase'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [formData, setFormData] = useState({})
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])
  const dispatch = useDispatch()
  console.log(formData)
  useEffect(() => {
    if (file) {
      handelFileUpload(file)
    }
  }, [file])

  const handelFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
        console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        })
      }
    )
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handelSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }

      await axios
        .post(
          `api/updateUser/${currentUser.data._id}`,
          JSON.stringify(formData),
          config
        )
        .then((res) => {
          dispatch(updateUserSuccess(res))
          setUpdateSuccess(true)
          // console.log(res)
        })
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message))
      // console.log(error.response.data.message);
    }
  }

  const handelDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      await axios
        .delete(`api/deleteUser/${currentUser.data._id}`)
        .then((res) => {
          dispatch(deleteUserSuccess(res))
          // console.log(res)
        })
    } catch (error) {
      dispatch(deleteUserFailure(error.response.data.message))
    }
  }

  const handelSignOut = async () => {
    try {
      dispatch(signOutUserStart)
      await axios.get('api/signOut').then((res) => {
        dispatch(signOutUserSuccess(res))
      })
    } catch (error) {
      dispatch(signOutUserFailure(error.response.data.message))
    }
  }

  const handelShowListings = async () => {
    try {
      setShowListingsError(false)
      await axios.get(`/api/listings/${currentUser.data._id}`).then((res) => {
        setUserListings(res.data)
      })
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handelListingDelete = async (listingId) => {

      try {
        await axios.delete(`/api/deleteListing/${listingId}`).then((res) => {

          setUserListings((prev) => prev.filter((listing) => listing._id != listingId))

        })
      } catch (error) {
        console.log(error.response.data.message);
      }
  } 

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile </h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.data.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>Error Image upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image Successfully Uploaded </span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.data.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          defaultValue={currentUser.data.email}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opa95\'
          to={'/create-listing'}
        >
          {' '}
          create listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handelDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handelSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handelShowListings} className='text-green-700 w-full'>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ''}
      </p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing}
              className='border rounded-lg p-3 flex justify-between
  gap-4 items-center'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1 '
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button onClick={() => handelListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                
                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
                
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
