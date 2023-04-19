import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UrlContext } from '../helpers/UrlContext'

function Forget() {
  const { urlPath } = useContext(UrlContext)
  let navigate = useNavigate()

 const [email, setEmail] = useState('')
 const [msg, setMsg] = useState('Le mail peut arriver dans votre dossier Spams')
 const forget = () => {
  const data = {
   email: email
  }
  axios
   .post(
    `${urlPath}/auth/forget`, data)
   .then(() => {
    navigate('/blog/')
   })
   .catch((error) => {
    setMsg(error.response.data.error)
   })
 }
 return (
  <div className="pt-5">
   <div className="d-flex flex-column shadow bg-body rounded form">
    <div className="bg-moyen text-white text-center">
     <h4 className="fw-bold">Mot de passe oublié ?</h4>
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
    <div id="message" className="text-danger fw-bold text-center">
     {msg}
    </div>
    <button onClick={forget} className="btn btn-success fw-bold btn-noradius">
     Valider
    </button>
   </div>
  </div>
 )
}

export default Forget
