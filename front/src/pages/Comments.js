import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'

function Comments(data) {
  const { urlPath } = useContext(UrlContext)
const { authState, setAuthState } = useContext(AuthContext)
 const [comments, setComments] = useState([])
 let navigate = useNavigate()

 useEffect(() => {
  //Afficher les comments du post (id en props)
  const getComments = async () => {
   const response = await axios.get(
    //  `http://dpstudio.alwaysdata.net/blog/comments/${data.data}`
    `${urlPath}/comments/${data.data}`
   )
   // console.log(response.data)
   setComments(response.data)
  }
  getComments()
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])
 const initialValues = {
  commentBody: '',
  PostId: data.data
 }
 const validationSchema = Yup.object().shape({
  commentBody: Yup.string()
   .required('Le champ Commentaire doit être rempli')
   .max(250, 'Le champ Commentaire est limité à 250 signes')
 })
 //Ajouter un commentaire
 const onSubmit = (data, { setSubmitting, resetForm }) => {
  document.getElementById('message').innerHTML = ''
  axios
   .post(
    `${urlPath}/comments`,
    data,
    {
     headers: {
      accessToken: localStorage.getItem('token')
     }
    },
    { withCredentials: true }
   )
   .then((response) => {
    if (response.data.error) {
     document.getElementById('message').innerHTML =
      'Connectez-vous pour créer un commentaire'
    } else {
     data.User = {}
     if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      data.User.username = response.data.item.username
     } else {
      data.User.username = response.data.username
     }
     setComments([data, ...comments])
     resetForm(initialValues)
    }
   })
   .catch((err) => {
    // console.log(err.response.data)
    /* setAuthState({
     status: false,
     username: ''
    })
    localStorage.removeItem('token')*/
    document.getElementById('message').innerHTML = err.response.data.error
   })
  setSubmitting(false)
 }
 //Supprimer un commentaire
 const deleteComment = (id) => {
  axios
   .delete(
    `${urlPath}/comments/${id}`,
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
    setComments(
     comments.filter((comment) => {
      return comment.id !== id
     })
    )
   })
   .catch(() => {
    setAuthState({
     status: false,
     username: ''
    })
    localStorage.removeItem('token')
   })
 }

 return (
  <div className="align-items-en ps-5 pb-3 d-flex flex-column h100">
   <div className="bg-clair text-light text-center fw-bold mb-2">
    Commentaires<button className="btn btn-1 novisible">i</button>
   </div>
   <div className="flex-grow-1 comments">
    {comments.map((acomment, key) => {
     return (
      <div className="d-flex flex-column mb-2 shadow bg-body rounded" key={key}>
       <div
        className="bg-clair text-light text-start fs-6 ps-2 fw-bold flex-fill"
        onClick={() => {
         navigate('/blog/author', { state: `comment${acomment.id}` })
        }}
       >
        {acomment.User.username}
       </div>
       <div className="d-flex">
        <div className="flex-fill text-start fs-6 ps-2 pe-2 comment">
         {acomment.commentBody}
        </div>
        {authState.username === acomment.User.username && (
         <button
          className="btn btn-danger btn-noradius fs-6 p-1 pt-0 pb-0 fw-bold"
          onClick={() => {
           deleteComment(acomment.id)
          }}
         >
          x
         </button>
        )}
       </div>
      </div>
     )
    })}
   </div>
   {authState.status && (
    <Formik
     initialValues={initialValues}
     onSubmit={onSubmit}
     validationSchema={validationSchema}
    >
     <Form className="d-flex flex-column">
      <Field
       className="form-control btn-noradius"
       autoComplete="off"
       id="inputAddComment"
       name="commentBody"
       placeholder="Nouveau commentaire"
      />
      <div className="text-danger fw-bold">
       <ErrorMessage name="commentBody" component="span" />
       <div id="message"></div>
      </div>
      <button
       type="submit"
       className="btn btn-noradius rounded-bottom btn-success fw-bold"
      >
       Valider
      </button>
     </Form>
    </Formik>
   )}
  </div>
 )
}

export default Comments
