const express = require('express')
const router = express.Router()
//const { Posts, Likes } = require('../models')
const { validateToken } = require('../middlewares/Auth') 

const postsController = require('../controllers/posts.controller')

router.get('/', postsController.allPosts)
router.get('/byId/:id', postsController.onePost)
router.get('/validbyId/:id', validateToken, postsController.onePost)
router.put('/byId/:id', validateToken, postsController.updatePost)
router.delete('/byId/:id', validateToken, postsController.deletePost)
router.post('/', validateToken, postsController.addPost)

module.exports = router