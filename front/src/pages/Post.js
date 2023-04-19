import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
 faStar,
 faThumbsUp,
 faThumbsDown,
 faPen,
 faCheck
} from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

import Comments from './Comments'

function Post() {
  const { urlPath } = useContext(UrlContext)
  let { id } = useParams()
 let navigate = useNavigate()
 const [Post, setPost] = useState({})
 const [postLenght, setPostLenght] = useState(0)
 const [postLiked, setPostLiked] = useState(true)
 const [inputTitle, setInputTitle ] = useState(false)
 const [inputText, setInputText ] = useState(false)
 const { authState, setAuthState } = useContext(AuthContext)

 useEffect(() => {
  const getPost = async () => {
   let response = ''
   if (authState.status) {
    //Si l'utilisateur est authentifié
    response = await axios.get(
      `${urlPath}/posts/validbyId/${id}`,
     {
      headers: {
       accessToken: localStorage.getItem('token')
      }
     },
     { withCredentials: true }
    )
   } else {
    //Si l'utilisateur n'est pas authentifié
    response = await axios.get(`${urlPath}/posts/byId/${id}`)
   }
   let post = response.data.post
   const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
   const createdAt = new Date(post.createdAt).toLocaleDateString(
    'fr-FR',
    options
   )
   post.createdAt = createdAt
   const updatedAt = new Date(post.updatedAt).toLocaleDateString(
    'fr-FR',
    options
   )
   post.updatedAt = updatedAt
   post.username = response.data.post.User.username
   setPost(post)
   setPostLenght(post.Likes.length)
   setPostLiked(response.data.likeRight)
  }
  getPost()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])
 //Editer le champ Titre ou Texte
 const editPost = (option) => {
 // console.log('option', option)
  if(option === 'title') {
  setInputTitle(true)
} else {
  setInputText(true) 
}
 /* console.log('option', option)
  document.getElementById(option).classList.add('hidden')
  document.getElementById(`edit${option}`).classList.add('hidden')
  document.getElementById(`update${option}`).classList.remove('hidden')
  let postText = document.getElementById(option).innerHTML
  document.getElementById(`input${option}`).value = postText
  document.getElementById(`input${option}`).classList.remove('hidden')
  if (option === 'title') {
   document.getElementById(`input${option}`).classList.add('inputcenter')
  }*/
 }
 //Modifier le titre ou le texte
 const updatePost = (option) => {
  let newText = document.getElementById(`input${option}`).value
  let data = {}
  if (option === 'title') {
   data.newTitle = newText
  } else {
   data.newBody = newText
  }
  axios
   .put(
    `${urlPath}/posts/byId/${id}`,
    data,
    {
     headers: {
      accessToken: localStorage.getItem('token')
     }
    },
    { withCredentials: true }
   )
   .then((response) => {
    if (response.data.token) {
     localStorage.setItem('token', response.data.token)
     setPost({
      ...Post,
      title: response.data.post.title,
      postText: response.data.post.postText
     })
    } else {
     setPost({
      ...Post,
      title: response.data.title,
      postText: response.data.postText
     })
    }
    setInputTitle(false)
    setInputText(false)
   /* document.getElementById(option).classList.remove('hidden')
    document.getElementById(`edit${option}`).classList.remove('hidden')
    document.getElementById(`input${option}`).value = ''
    document.getElementById(`update${option}`).classList.add('hidden')
    document.getElementById(`input${option}`).classList.add('hidden')
    if (option === 'title') {
     document.getElementById(`input${option}`).classList.remove('inputcenter')
    }*/
   })
   .catch(() => {
    setAuthState({
     status: false,
     username: '',
     role: false
    })
    localStorage.removeItem('token')
    navigate('/login')
   })
 }
 //Supprimer le post
 const deletePost = () => {
  axios
   .delete(
    `${urlPath}/posts/byId/${id}`,
    {
     headers: {
      accessToken: localStorage.getItem('token')
     }
    },
    { withCredentials: true }
   )
   .then((response) => {
    if (response.data.token) {
     localStorage.setItem('token', response.data.token)
    }
    navigate('/blog/')
   })
 }
 //Like ou unliker le post
 const likeAPost = () => {
  axios
   .post(
    `${urlPath}/like`,
    { PostId: id },
    {
     headers: {
      accessToken: localStorage.getItem('token')
     }
    },
    { withCredentials: true }
   )
   .then((response) => {
    if (response.data.token) {
     localStorage.setItem('token', response.data.token)
    }
    if (postLiked) {
     setPostLiked(false)
     setPostLenght(postLenght - 1)
    } else {
     setPostLiked(true)
     setPostLenght(postLenght + 1)
    }
   })
   .catch(() => {
    setAuthState({
     status: false,
     username: '',
     role: false
    })
    localStorage.removeItem('token')
   })
 }
 return (
  <div className="d-flex post">
   <div className="flex-fill d-flex flex-column shadow mb-3 bg-body rounded post-post">
    <div className="d-flex bg-moyen text-light">
     <div className="flex-fill d-flex justify-content-center align-items-center fw-bold ps-2 pe-2">
      {!inputTitle ? (
      <div id="title" className="text-center">
       {Post.title}
      </div> ) : (
      <input id="inputtitle" type="text" className="border-0 text-center fw-bold text-light bg-clair" 
      autoFocus 
      defaultValue={Post.title} />
      )
      }      
     </div>
     {authState.username === Post.username || authState.role === true ? (
      <div>
       <div id="edittitle">
       {!inputTitle ? (<button
         className="btn btn-info btn-noradius text-light fw-bold"
         onClick={() => {
          editPost('title')
         }}
        >
         <FontAwesomeIcon icon={faPen} />
        </button>
        ) : (
        <button
         className="btn btn-success btn-noradius text-light fw-bold"
         onClick={() => {
          updatePost('title')
         }}
        >
         <FontAwesomeIcon icon={faCheck} />
        </button>
        )}
       </div>
      </div>
     ) : (
      <button className="btn btn-1 novisible">i</button>
     )}
    </div>
    <div className="flex-grow-1 border-start border-end border-moyen d-flex">
     <div className="flex-fill col-12 ps-2 pe-2">
     {!inputText ? (
      <div id="postText" className="text-start post-text">
       {Post.postText}
      </div>
     ) : (
      <textarea
       id="inputpostText"
       rows="12"
       className="col-12"
       defaultValue={Post.postText}
       autoFocus
      ></textarea>
      )}
     </div>
     {authState.username === Post.username || authState.role === true ? (
      <div className="align-self-end d-flex flex-column">
       <div id="editpostText">
       {!inputText ? (
        <button
         className="col-12 btn btn-info btn-noradius text-light fw-bold"
         onClick={() => {
          editPost('postText')
         }}
        >
         <FontAwesomeIcon icon={faPen} />
        </button>
       ) : (
        <button
         className="col-12 btn btn-success btn-noradius text-light fw-bold"
         onClick={() => {
          updatePost('postText')
         }}
        >
         <FontAwesomeIcon icon={faCheck} />
        </button>
       )}
       </div>
       <button
        className="btn btn-danger btn-noradius fw-bold ps-3 pe-3"
        onClick={deletePost}
       >
        X
       </button>
      </div>
     ) : (
      <button className="btn btn-1 novisible">i</button>
     )}
    </div>
    <div className="d-flex bg-moyen rounded-bottom">
     <div className="flex-fill align-self-center d-flex pe-3">
      <div
       className="flex-fill align-self-center text-white text-start ps-2 cursor d-flex justify-content-between"
       onClick={() => {
        navigate('/blog/author', { state: Post.id })
       }}
      >
       <div className="fw-bold">{Post.username}</div>
       <div>créé le {Post.createdAt}</div>
      </div>
     </div>
     <div className="d-flex">
      <div className="align-self-center text-warning pe-2">
       {postLenght >= 1 ? (
        <FontAwesomeIcon icon={faStar} />
       ) : (
        <FontAwesomeIcon icon={farStar} />
       )}
       {postLenght >= 2 ? (
        <FontAwesomeIcon icon={faStar} />
       ) : (
        <FontAwesomeIcon icon={farStar} />
       )}
       {postLenght >= 3 ? (
        <FontAwesomeIcon icon={faStar} />
       ) : (
        <FontAwesomeIcon icon={farStar} />
       )}
       {postLenght >= 4 ? (
        <FontAwesomeIcon icon={faStar} />
       ) : (
        <FontAwesomeIcon icon={farStar} />
       )}
       {postLenght >= 5 ? (
        <FontAwesomeIcon icon={faStar} />
       ) : (
        <FontAwesomeIcon icon={farStar} />
       )}
      </div>
     </div>
     {authState.status && (
      <button
       className="btn bg-warning btn-noradius text-secondary"
       onClick={() => {
        likeAPost()
       }}
      >
       {postLiked ? (
        <FontAwesomeIcon icon={faThumbsDown} />
       ) : (
        <FontAwesomeIcon icon={faThumbsUp} />
       )}
      </button>
     )}
    </div>
   </div>

   <div className="flex-fill ">
    <Comments data={id} />
   </div>
  </div>
 )
}

export default Post
