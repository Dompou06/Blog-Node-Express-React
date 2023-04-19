import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UrlContext } from '../helpers/UrlContext'
import { AuthContext } from '../helpers/AuthContext'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faMessage } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

function Author() {
  const { urlPath } = useContext(UrlContext)
 const location = useLocation()
 const { authState } = useContext(AuthContext)
 const [author, setAuthor] = useState({})
 const [listOfPosts, setListOfPosts] = useState([])
 let navigate = useNavigate()

 useEffect(() => {
  /**
   * Information et posts de l'auteur
   * @param {String} some id du post ou comment
   * @return { Promise }
   */
  const id = location.state
  axios
   //.get(`http://dpstudio.alwaysdata.net/blog/auth/basicinfo/${id}`)
   .get(`${urlPath}/auth/basicinfo/${id}`)
   .then((response) => {
    setAuthor({
     username: response.data.username,
     presentation: response.data.presentation
    })
    setListOfPosts(response.data.Posts)
   })
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [])

 return (
  <div className="container-profile">
   <div className="d-flex flex-column shadow bg-body rounded form profile">
    <div className="bg-moyen text-white text-center">
     <h4 className="fw-bold">{author.username}</h4>
    </div>
    <div className="d-flex mb-2">
     <div className="col-4 btn btn-secondary text-white fw-bold text-end pe-2 btn-noradius nocursor">
      <span className="">Présentation</span>
     </div>
     <div className="flex-fill align-self-center ps-2 d-flex">
      <div className="flex-fill col-12">
       <div id="presentation" className="col-12 pt-2">
        {author.presentation}
       </div>
      </div>
     </div>
    </div>
    <div className="bg-moyen text-white fw-bold text-center">Posts</div>
    <div className={authState.status ? 'profile-auth-posts' : 'profile-posts'}>
     <div className="flex-grow-1 d-flex flex-column">
      {listOfPosts.map((post, key) => {
       return (
        <div className="d-flex bg-body rounded" key={key}>
         <div className="col-12 d-flex justify-content-between text-start">
          <div
           className="align-self-center align-self-stretch col-4 bg-moyen text-truncate text-white fw-bold ps-2 pe-2 border-end border-light cursor"
           onClick={() => {
            navigate(`/blog/post/${post.id}`)
           }}
          >
           {post.title}
          </div>
          <div
           className="col-6 border-start ps-2 pe-2 pt-02 border-bottom border-moyen cursor"
           onClick={() => {
            navigate(`/blog/post/${post.id}`)
           }}
          >
           <div className="d-flex">
            <div className="col-11 text-start text-truncate pe-2">
             {post.postText}
            </div>
            {post.Comments.length > 0 && (<div className="position-relative p-0 pe-1 text-moyen">
             <FontAwesomeIcon icon={faMessage} />
             <span className="position-absolute top-3 start-10 translate-middle badge rounded-pill bg-clair">
              {post.Comments.length}
             </span>
            </div>
            )}
           </div>
          </div>
          <div className="align-self-center align-self-stretch col-2 d-flex bg-moyen">
           <div className="flex-fill align-self-stretch pt-1 d-flex justify-content-around text-warning border-bottom border-light">
            {post.Likes.length >= 1 ? (
             <FontAwesomeIcon icon={faStar} />
            ) : (
             <FontAwesomeIcon icon={farStar} />
            )}
            {post.Likes.length >= 2 ? (
             <FontAwesomeIcon icon={faStar} />
            ) : (
             <FontAwesomeIcon icon={farStar} />
            )}
            {post.Likes.length >= 3 ? (
             <FontAwesomeIcon icon={faStar} />
            ) : (
             <FontAwesomeIcon icon={farStar} />
            )}
            {post.Likes.length >= 4 ? (
             <FontAwesomeIcon icon={faStar} />
            ) : (
             <FontAwesomeIcon icon={farStar} />
            )}
            {post.Likes.length >= 5 ? (
             <FontAwesomeIcon icon={faStar} />
            ) : (
             <FontAwesomeIcon icon={farStar} />
            )}
           </div>
          </div>
         </div>
        </div>
       )
      })}
     </div>
    </div>
   </div>
  </div>
 )
}

export default Author
