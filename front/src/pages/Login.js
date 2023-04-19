/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'

axios.defaults.withCredentials = true

function Login() {
 let navigate = useNavigate()
 const { urlPath } = useContext(UrlContext)
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [rememberMe, setRememberMe] = useState(false)
 const { setAuthState } = useContext(AuthContext)

 const login = () => {
  const data = {
   email: email,
   password: password,
   remember: rememberMe
  }
 // console.log('data', data)
  axios
   .post(`${urlPath}/auth/login`, data, { withCredentials: true })
   .then((response) => {
    //console.log(response.data)
    localStorage.setItem('token', response.data.token)
    setAuthState({
     status: true,
     username: response.data.username,
     role: response.data.role
    })
    navigate('/blog/')
   })
   .catch((err) => {
    document.getElementById('message').innerHTML = err.response.data.error
    setAuthState({
     status: false,
     username: '',
     role: false
    })
   })
 }
 const forget = () => {
  axios
   .post(`${urlPath}/auth/forget`, { email: email })
   .then((response) => {
 //   console.log(response)
   })
   .catch(() => {})
 }
 return (
  <div className="pt-5">
   <div className="d-flex flex-column shadow bg-body rounded form">
    <div className="bg-moyen text-white text-center">
     <h4 className="fw-bold">Connection</h4>
    </div>
    <div className="d-flex">
     <label className="col-3 bg-moyen text-white fw-bold text-end pe-2">
      Email
     </label>
     <input
      type="email"
      className="form-control"
      value={email}
      onChange={(e) => {
       setEmail(e.target.value)
      }}
     />
    </div>
    <div className="d-flex">
     <label className="col-3 bg-moyen text-white fw-bold text-end pe-2">
      Mot de passe
     </label>
     <input
      type="password"
      className="form-control"
      value={password}
      onChange={(e) => {
       setPassword(e.target.value)
      }}
     />
    </div>
    <div className="d-flex bg-moyen">
     <div className="btn btn-secondary text-light btn-noradius novisible">
      Mot de passe oublié
     </div>
     <div className="flex-fill align-self-center d-flex justify-content-center">
      <input
       type="checkbox"
       className="no-border"
       value={rememberMe}
       onChange={(e) => {
        setRememberMe(e.target.checked)
       }}
      />
      <label className="text-light ms-2">Se souvenir de moi</label>
     </div>
     <div>
      <Link
       to="/forget"
       className="btn btn-secondary text-light btn-noradius"
       onClick={forget}
      >
       Mot de passe oublié
      </Link>
     </div>
    </div>
    <div id="message" className="text-danger fw-bold text-center"></div>
    <button onClick={login} className="btn btn-success fw-bold btn-noradius">
     Valider
    </button>
   </div>
  </div>
 )
}

export default Login
