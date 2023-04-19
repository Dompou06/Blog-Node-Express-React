import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.scss'
import './index.scss'
import { AuthContext } from './helpers/AuthContext'
import { UrlContext } from './helpers/UrlContext'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import { createPopper } from '@popperjs/core'

import Header from './pages/Navbar'
import Footer from './pages/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Login from './pages/Login'
import Add from './pages/AddPost'
import Post from './pages/Post'
import Author from './pages/Author'
import Profile from './pages/Profile'
import Error from './pages/Error'
import Forget from './pages/Forget'
import NewPassword from './pages/NewPassword'
import Managment from './pages/Managment'

function App () {
  // eslint-disable-next-line no-unused-expressions
  createPopper
      let auth = {
        status: false,
        username: '',
        role: false
       }   
       const [authState, setAuthState] = useState(auth)
       const [urlPath] = useState('http://localhost:3001')
useEffect(() => {
  if(localStorage.getItem('token')) {
    axios
 .get(
  `${urlPath}/auth/auth`,
  {
   headers: {
    accessToken: localStorage.getItem('token')
   }
  },
  { withCredentials: true }
 ).then(response => {
   if(response.data.token) {
    localStorage.setItem('token', response.data.token)
   }
       setAuthState({
      status: true,
       username: response.data.username,
       role: response.data.role 
       })
 }).catch(() => {
  setAuthState({
    status: false,
    username: '',
    role: false
  })
 })
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
     
  //En development
  // const [urlPath] = useState('http://localhost:5000')
   //https://www.youtube.com/watch?v=klEs4oi3Igc 36:00

  return (
    <div className='App'>
       <UrlContext.Provider value={{urlPath}}>
       <AuthContext.Provider value={{ authState, setAuthState }}>
     <Router>
     <Header />
    <div className="container-app">
      <Routes>
       <Route path="/blog/" exact element={<Home />} />
       <Route path="/blog/registration" exact element={<Registration />} />
       <Route path="/blog/login" exact element={<Login />} />
       <Route path="/blog/forget" exact element={<Forget />} />
       <Route path="/blog/resetpassword/:id" exact element={<NewPassword />} />
       <Route path="/blog/add" exact element={<Add />} />
       <Route path="/blog/post/:id" exact element={<Post />} />
       <Route path="/blog/author" exact element={<Author />} />
       <Route path="/blog/profile" exact element={<Profile />} />
       <Route path="/blog/managment" exact element={<Managment />} />
       <Route path="/blog/*" exact element={<Error />} />
      </Routes>
     </div>    
     <Footer /> 
    </Router>
     </AuthContext.Provider>
     </UrlContext.Provider>
    </div>
  )
}

export default App
