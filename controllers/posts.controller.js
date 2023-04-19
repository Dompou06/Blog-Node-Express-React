require('dotenv').config()
const httpStatus = require('http-status')

const { Users, Posts, Likes, Comments } = require('../models')
const options = {
    sameSite: 'strict', 
    path: '/',
    httpOnly: true,
    //En production
    // secure: true,
    expired: new Date(Date.now()) + process.env.EXPIRETOKEN
}

/**
* Ajouter un post
* @param {Number} some req.user
* @param {Object} some req.body
* @return { Promise }
*/
exports.addPost = async (req, res) => {
    let post = req.body
    console.log('post', post)
    post.UserId = req.user
    await Posts.create(post)
        .then(result => {
            const id = result.id
            if(req.accessToken) {
                res.status(httpStatus.OK)
                    .cookie('token', req.accessToken, options)
                    .send({
                        token: req.refreshToken,
                        id: id
                    })
            } else {
                res.status(httpStatus.OK).json(id)
            }
        })
}
/**
* Information d'un post, de ses likes et auteur
* @param {Number} some req.params.id
* @param {Number} some req.user
* @return { Promise }
*/
exports.onePost = async (req, res) => {
    const id = req.params.id
    let post = await Posts.findByPk(id, {
        attributes: {
            exclude: ['UserId']
        },
        include: [
            {
                model: Likes,
                attributes: ['PostId']
            },
            {
                model: Users,
                attributes: ['username']
            }] 
    })
    let liked = false
    if(req.user) {
        //L'utilisateur est authentifié
        const userId = req.user
        const likeUser = await Posts.findByPk(id, {
            include: [{
                model: Likes,
                attributes: ['UserId']
            }] 
        })
        likeUser.Likes.forEach(like => {
            if(like.UserId === userId) {
                //Si l'utilisateur a liké le post
                liked = true
            }
        })
    }
    res.status(httpStatus.OK).send({post, likeRight: liked})  
}
/**
* Tous les post, avec ses likes, comments et auteur
* @param {Number} some req.user
* @return { Promise }
*/
exports.allPosts = async (req, res) => {
    // console.log('ici', req)
    let listOfPosts = await Posts.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: {
            exclude: ['UserId']
        },
        include: [
            {
                model: Likes,
                attributes: ['PostId']
            }, 
            {
                model: Users,
                attributes: ['username']
            }, 
            {
                model: Comments,
                attributes: ['PostId']
            }
        ]
    }) 
    if(req.user){
        const likedPosts = await Likes.findAll({
            where: {
                UserId: req.user 
            },
            attributes: ['PostId']
        })
        res.status(httpStatus.OK).send({
            listOfPosts: listOfPosts,
            likedPosts: likedPosts
        })
    } else {
        res.status(httpStatus.OK).send(
            listOfPosts
        )
    }
}
/**
* Mise à jour d'un post
* @param {Number} some req.params.id
* @param {String} some req.body
* @return { Promise }
*/
exports.updatePost = async (req, res) => {
    const id = req.params.id
    const post = await Posts.findByPk(id)
    if(req.body.newTitle) {
        const newTitle = req.body.newTitle
        await post.update({ title: newTitle })
        await post.save()
    } else {
        await post.update({ postText: req.body.newBody })
        await post.save()
    }
    const result = await Posts.findByPk(id, 
        { attributes: ['title', 'postText'],
            include: [Likes, {
                model: Users,
                attributes: ['username']
            }]}
    )
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                post: result
            })
    } else {
        res.status(httpStatus.OK).send(result)
    }
}
/**
* Suppression d'un post
* @param {Number} some req.params.id
* @return { Promise }
*/
exports.deletePost = async (req, res) => {
    const id = req.params.id
    await Posts.destroy({
        where: {
            id: id
        } 
    })
    res.send('Post supprimé')
}
