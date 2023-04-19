import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'
import { useNavigate } from 'react-router-dom'
//import Users from './management/Users'
//import Posts from './management/UsersPosts'
//import Comments from './management/UsersComments'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList } from '@fortawesome/free-solid-svg-icons'

function Admin() {
  const { urlPath } = useContext(UrlContext)
 const { authState } = useContext(AuthContext)
 // const [roleState, setRoleState] = useState('')
 const [categoryState, setCategoryState] = useState('usersusername')
 //const [inputSearch, setInputSearch] = useState('')
 //const [children] = useState({})
 //const [setUser] = useState({})
 // const [setUserInfo] = useState({})
 // const [setRoles] = useState([])
 //const [request, setRequest] = useState('')
 let navigate = useNavigate()
 // console.log(authState.role)
 useEffect(() => {
  if (authState.role) {
   axios
    .get(
      `${urlPath}/roles/managment`,
     {
      headers: {
       accessToken: localStorage.getItem('token')
      }
     },
     { withCredentials: true }
    )
    .then((response) => {
     // console.log(response.data)
     if (response.data.token) {
      localStorage.setItem('token', response.data.token)
     }
     ///console.log(response.data.responsability)
     // setRoleState(response.data.responsability)
    })
    .catch((err) => {
     console.log(err)
     navigate('/blog/')
    })
  } else {
   navigate('/blog/')
  }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

 const handleSelectUser = (value) => {
  //  console.log(value)
  setCategoryState(value)
 }
 /* const handleSelect = (value) => {
  //  console.log(value)
  setCategoryState(value)
 }*/
 /*const handleSubmit = (item) => {
  //console.log('username', username)
  // console.log(inputSearch)
  // console.log(item)
  setChildren(item)
 }*/
 /* const handleReload = () => {
  //console.log('username', username)
  // console.log(inputSearch)
  // console.log(item)
  setChildren({})
  setInputSearch('')
  setCategoryState('username')
  setReload(false)
}*/
 /* axios
   .get(
    `http://localhost:3001/managment/${categoryState}/${inputSearch}`,
    {
     headers: {
      accessToken: localStorage.getItem('token')
     }
    },
    { withCredentials: true }
   )
   .then((response) => {
    console.log(response.data)
    if (response.data.token) {
     localStorage.setItem('token', response.data.token)
    }
    const responsabilities = Object.entries(response.data.roles)
    setRoles(responsabilities)
    setUser(response.data)
    if (response.data.info) {
     setUserInfo(response.data.info)
    }
   })
   .catch((err) => {
    if (err.response.data.error === 'Connectez-vous') {
     localStorage.removeItem('token')
     setAuthState({
      status: false,
      username: '',
      role: false
     })
     navigate('/login')
    } else {
     localStorage.removeItem('token')
     setAuthState({
      status: false,
      username: '',
      role: false
     })
     navigate('/')
    }
   })*/

 /*const handleRequest = (value) => {
  console.log(request)
  console.log(value)
 }*/
 return (
  <div className="d-flex post">
   <div className="flex-fill shadow mb-3 bg-body rounded post-post">
    <div className="d-flex justify-content-between bg-moyen">
     <div className="w33">
      <div className="d-flex text-light">
       <div className="dropdown">
        <button
         className="btn btn-primary dropdown-toggle btn-noradius"
         type="button"
         id="selectUser"
         data-bs-toggle="dropdown"
         aria-expanded="false"
        >
         <FontAwesomeIcon icon={faList} />
        </button>
        <ul className="dropdown-menu pt-0 m--1" aria-labelledby="selectUser">
         <li onClick={() => handleSelectUser('usersusername')}>
          <span
           className={
            categoryState === 'username'
             ? 'dropdown-item active'
             : 'dropdown-item'
           }
          >
           Nom
          </span>
         </li>
         <li onClick={() => handleSelectUser('usersrole')}>
          <span
           className={
            categoryState === 'role' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Rôles
          </span>
         </li>
         <li onClick={() => handleSelectUser('usersstate')}>
          <span
           className={
            categoryState === 'state' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Pays
          </span>
         </li>
        </ul>
       </div>
       <div className="flex-fill align-self-center text-center fw-bold pe-4">
        Utilisateurs
       </div>
      </div>
     </div>

     <div className="w33">
      <div className="d-flex text-light">
       <div className="dropdown">
        <button
         className="btn btn-primary dropdown-toggle btn-noradius"
         type="button"
         id="selectUser"
         data-bs-toggle="dropdown"
         aria-expanded="false"
        >
         <FontAwesomeIcon icon={faList} />
        </button>
        <ul className="dropdown-menu" aria-labelledby="selectUser">
         <li onClick={() => handleSelectUser('poststitle')}>
          <span
           className={
            categoryState === 'title' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Titre
          </span>
         </li>
         <li onClick={() => handleSelectUser('postsauthor')}>
          <span
           className={
            categoryState === 'role' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Auteur
          </span>
         </li>
         <li onClick={() => handleSelectUser('postsdate')}>
          <span
           className={
            categoryState === 'date' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Date
          </span>
         </li>
        </ul>
       </div>
       <div className="flex-fill align-self-center text-center fw-bold">
        Posts
       </div>
      </div>
     </div>

     <div className="w33">
      <div className="d-flex text-light">
       <div className="dropdown">
        <button
         className="btn btn-primary dropdown-toggle btn-noradius"
         type="button"
         id="selectUser"
         data-bs-toggle="dropdown"
         aria-expanded="false"
        >
         <FontAwesomeIcon icon={faList} />
        </button>
        <ul className="dropdown-menu" aria-labelledby="selectUser">
         <li onClick={() => handleSelectUser('commentsauthor')}>
          <span
           className={
            categoryState === 'title' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Auteur
          </span>
         </li>
         <li onClick={() => handleSelectUser('commentspost')}>
          <span
           className={
            categoryState === 'role' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Post
          </span>
         </li>
         <li onClick={() => handleSelectUser('commentsdate')}>
          <span
           className={
            categoryState === 'date' ? 'dropdown-item active' : 'dropdown-item'
           }
          >
           Date
          </span>
         </li>
        </ul>
       </div>
       <div className="flex-fill align-self-center text-center fw-bold">
        Commentaires
       </div>
      </div>
     </div>
    </div>
    {/*categoryState.includes('users').toString() && (
     <Users data={categoryState} />
    )*/}
    {/*children.categoryState !== undefined && <Posts data={children} />*/}
    {/*children.categoryState !== undefined && <Comments data={children} />*/}
   </div>
  </div>
 )
}

export default Admin
