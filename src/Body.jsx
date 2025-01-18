import React from 'react'
import NavBar from './NavBar'
import Profile from './Profile'
import Login from './Login'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {
  return (
    <div>
      <NavBar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body



