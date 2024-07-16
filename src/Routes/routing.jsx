import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import SignIn from '../pages/SignIn'
import Profile from '../pages/Profile'
import Header from '../components/Header'
import SignUp from '../pages/SignUp'
import PrivateRoute from '../components/PrivateRoute'
import CreateListing from '../pages/CreateListing'
import UpdateListing from '../pages/UpdateListing'
import Listing from '../pages/Listing'
import Search from '../pages/Search'

export default function routing() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/About' element={<About />}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/search' element={<Search/>}></Route>
        <Route path='/listing/:listingId' element={<Listing />}></Route>

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </>
  )
}
