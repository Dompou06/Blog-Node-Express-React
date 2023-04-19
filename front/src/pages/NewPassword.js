import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UrlContext } from '../helpers/UrlContext'

function NewPassword() {
    const { urlPath } = useContext(UrlContext)
    let navigate = useNavigate()

    let { idPage } = useParams()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ msg, setMsg ] = useState('')

    const resetPassword = () => {
        const data = {
            id: idPage,
            email: email,
            newpassword: password
        }
        axios.post(
            `${urlPath}/posts/auth/resetpassword`, data)
        .then(() => {
            navigate('/blog/')
        }
        ).catch(error => {

            setMsg(error.response.data.error)
        })
    }
  return (
    <div className='pt-5'>
        <div className='d-flex flex-column shadow bg-body rounded form'>
        <div className='bg-moyen text-white text-center'>
            <h4 className='fw-bold'>Réinitailiser votre mot de passe</h4>
          </div>
          <div className='d-flex'>
           <label className='col-3 bg-moyen text-white fw-bold text-end pe-2'>Email</label>
            <input type="email" className='form-control'
            value={email}
             onChange={e => {
                setEmail(e.target.value)
            }} />
            </div>
          <div className='d-flex'>
            <label className='col-3 bg-moyen text-white fw-bold text-end pe-2'>Mot de passe</label>
            <input type="password" className='form-control'
            value={password}
             onChange={e => {
                setPassword(e.target.value)
            }} />
            </div>
            <div id="message" className='text-danger fw-bold text-center'>{msg}</div>
            <button onClick={resetPassword} className='btn btn-success fw-bold btn-noradius'>Valider</button>
        </div>
    </div>
  )
}

export default NewPassword
