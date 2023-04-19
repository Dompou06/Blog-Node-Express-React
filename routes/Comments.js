const express = require('express')
const router = express.Router()
const { validateToken } = require('../middlewares/Auth')
const commentsController = require('../controllers/comments.controller')

router.get('/:postId', commentsController.allComments)
router.post('/', validateToken, commentsController.addComment)
router.delete('/:commentId', validateToken, commentsController.deleteComment)

module.exports = router
