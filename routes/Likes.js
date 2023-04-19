const express = require('express')
const router = express.Router()
const { Likes } = require('../models')
const { validateToken } = require('../middlewares/Auth')

/**
* Liker ou pas un post 
* @param {String} some userId
* @param {String} some postId
* @return { Promise }
*/
router.post('/', validateToken, async (req, res)=> {

    const userId = req.user
    const postId = req.body.PostId
    const found = await Likes.findOne({
        where: {
            PostId: postId,
            UserId: userId
        }
    })
    let result = {}
    if(!found) {
    //On like
        await Likes.create({
            PostId: postId,
            UserId: userId
        })
        result.liked = true
        res.send(result)
    } else {    
    //On unlike
        await Likes.destroy({
            where: {
                PostId: postId,
                UserId: userId
            }
        })
        result.liked = false
        res.send(result)
    }
})

module.exports = router