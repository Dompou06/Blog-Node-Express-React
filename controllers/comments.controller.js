require('dotenv').config()
const httpStatus = require('http-status')

const { Users, Comments } = require('../models')
const options = {
    sameSite: 'strict', 
    path: '/',
    httpOnly: true,
    //En production
    // secure: true,
    expired: new Date(Date.now()) + process.env.EXPIRETOKEN
}
/**
* Tous les comments d'un post
* @param {Number} some req.params.postId
* @return { Promise }
*/
exports.allComments = async (req, res) => {
    const postId = req.params.postId
    const comments = await Comments.findAll({
        where: {
            PostId: postId
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: {
            exclude: ['UserId']
        },
        include: [{
            model: Users,
            attributes: ['username']
        }]
    })
    res.status(httpStatus.OK).send(comments)
}
/**
* Ajouter un comment à un post
* @param {String} some req.body
* @param {Number} some req.user.id
* @return { Promise }
*/
exports.addComment = async (req, res) => {
    const comment = req.body
    comment.UserId = req.user
    await Comments.create(comment)
        .then(result => {
            //  console.log('result', result)
            Users.findByPk(req.user,
                {
                    attributes: ['username']
                }).then(user => {
                const item = {
                    id: result.id,
                    username: user.username
                }
                if(req.accessToken) {
                    res.status(httpStatus.OK)
                        .cookie('token', req.accessToken, options)
                        .send({
                            token: req.refreshToken,
                            item: item
                        })
                } else {
                    res.status(httpStatus.OK)
                        .send(item)
                }
            })
        }).catch(() => {
            res.status(httpStatus.UNAUTHORIZED).send({error: 'Le commenntaire n\'a pas été enregistré'})           
        })
}
/**
* Supprimer un comment
* @param {Number} some req.params.commentId
* @return { Promise }
*/
exports.deleteComment = async (req, res) => {
    //console.log('req.params', req.params)
    const commentId = req.params.commentId
    await  Comments.destroy({
        where: {
            id: commentId
        }
    })
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
            })
    } else {
        res.status(httpStatus.OK).send('Commentaire supprimé') 
    }
}