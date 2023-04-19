/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'

function Navbar() {
  const { urlPath } = useContext(UrlContext)
const { authState, setAuthState } = useContext(AuthContext)
 //const [actived, setActived] = useState(false)
 let navigate = useNavigate()
 useEffect(() => {
  if (authState.status !== false) {
   // if (authState.username) {
   axios
    .get(`${urlPath}/auth/auth`,
     {
      headers: {
       accessToken: localStorage.getItem('token')
      }
     },
     { withCredentials: true }
    )
    .then((response) => {
     // console.log(response)
     if (response.data.error) {
      setAuthState({
       status: false,
       username: '',
       role: false
      })
     } else {
      if (response.data.token) {
       localStorage.setItem('token', response.data.token)
       setAuthState({
        status: true,
        username: response.data.user,
        role: response.data.role
       })
      } else {
       setAuthState({
        status: true,
        username: response.data.user,
        role: response.data.role
       })
      }
     }
    })
    .catch(() => {
     setAuthState({
      status: false,
      username: '',
      role: false
     })
    })
  } else {
   setAuthState({
    status: false,
    username: '',
    role: false
   })
  }
 }, [])
 /*const linked = () => {
  setActived(true)
  navigate('/profile')
 }*/
 const logout = () => {
  axios.get(`${urlPath}/auth/logout`,
   {
    headers: {
     accessToken: localStorage.getItem('token')
    }
   },
   { withCredentials: true }
  )
  localStorage.removeItem('token')
  setAuthState({
   status: false,
   username: '',
   role: false
  })
  navigate('/blog/')
 }
 return (
  <nav className="navbar navbar-expand-lg navbar-dark bg-fonce ps-4 pe-4 mb-3">
   <div className="container-fluid">
    <NavLink to="/blog/" className="navbar-brand">
     <span data-bs-toggle="collapse">Accueil</span>
    </NavLink>
    <button
     className="navbar-toggler"
     type="button"
     data-bs-toggle="collapse"
     data-bs-target="#navbarNav"
     aria-controls="navbarNav"
     aria-expanded="false"
     aria-label="Toggle navigation"
    >
     <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
     <ul className="navbar-nav pe-4">
      {!authState.status ? (
       <>
        <li className="nav-item"></li>
        <li className="nav-item">
         <div className="d-flex">
          <NavLink
           to="/blog/login"
           className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
           }
          >
           <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
            Connection
           </span>
          </NavLink>
          <NavLink
           to="/blog/registration"
           className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
           }
          >
           <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
            Inscription
           </span>
          </NavLink>
         </div>
        </li>
       </>
      ) : (
       <>
        <li className="nav-item">
         <NavLink
          to="/blog/add"
          className={({ isActive }) =>
           isActive ? 'nav-link active' : 'nav-link'
          }
         >
          <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
           Ajouter un post
          </span>
         </NavLink>
        </li>
        <li className="nav-item dropdown">
         <span
          className="nav-link dropdown-toggle text-light"
          href="#"
          id="accountDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
         >
          {authState.username}
         </span>
         <ul
          className="dropdown-menu dropdown-menu-dark ps-2"
          aria-labelledby="accountDropdown"
         >
          <li>
           <NavLink
            to="/blog/profile"
            className={({ isActive }) =>
             isActive ? 'nav-link active' : 'nav-link'
            }
           >
            <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
             Mon compte
            </span>
           </NavLink>
          </li>
          {authState.role && (
           <li>
            <NavLink
             to="/blog/managment"
             className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
             }
            >
             <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
              Management
             </span>
            </NavLink>
           </li>
          )}
          <li className="ps-2" onClick={logout}>
           <span data-bs-toggle="collapse" data-bs-target="#navbarNav">
            Déconnection
           </span>
          </li>
         </ul>
        </li>
       </>
      )}
     </ul>
    </div>
   </div>
  </nav>
 )
}

export default Navbar
