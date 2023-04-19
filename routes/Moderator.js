const express = require('express')
const router = express.Router()
const httpStatus = require('http-status')
const { Users, Auths, Roles, Posts, Likes, Comments, Suspends } = require('../models')
const { validateToken } = require('../middlewares/Auth')
const { roleValid } = require('../middlewares/roleValid')
const crypted = require('../utils/crypt')

const options = {
    sameSite: 'strict', 
    path: '/',
    httpOnly: true,
    //En production
    // secure: true,
    expired: new Date(Date.now()) + process.env.EXPIRETOKEN
}
/**
* Liker ou pas un post 
* @param {String} some userId
* @return { Promise }
*/
router.get('/username/:data', validateToken, roleValid, async (req, res) => {
    //console.log('req.user', req.user)
    // console.log('req.params', req.params.data)
    // console.log('req.role', req.role)
    const value = req.params.data
    const presentation = await Users.findOne({
        where: {
            username: value,
        },
        attributes: ['presentation'],
        include: [
            {
                model: Suspends,
                attributes: {exclude: ['UserId']},
            }
        ],
        order: [
            [Suspends, 'createdAt', 'DESC']
        ]
    })
    // const suspended = await Suspends.findAll()
    //console.log('presentation', presentation.Suspends)
    if (req.role === 'Moderator') {
        if(presentation != null) {
            //console.log('user', user)
            const user = presentation
            if(req.accessToken) {
                res.status(httpStatus.OK)
                    .cookie('token', req.accessToken, options)
                    .send({
                        token: req.refreshToken,
                        user: user 
                    })
            } else {
                res.status(httpStatus.OK).send(user)
            }
        } else {
            if(req.accessToken) {
                res.status(httpStatus.OK)
                    .cookie('token', req.accessToken, options)
                    .send({
                        token: req.refreshToken,
                        message: 'Utilisateur inconnu'
                    })
            } else {
                res.status(httpStatus.OK).send({message: 'Utilisateur inconnu'})
            }
        }
      
    } else if (presentation != null && req.role === 'Administrator') {
        const info = await Users.findOne({
            where: {
                username: value,
            },
            attributes: {exclude: ['id']},
            include: [
                {
                    model: Auths,
                    attributes: {exclude: ['UserId', 'password', 'id', 'createdAt']}
                },
                {
                    model: Roles,
                    attributes: {exclude: ['UserId', 'id']}
                }

            ]
        })
        info.dataValues.Auth.dataValues.email = crypted.decrypt(info.dataValues.Auth.dataValues.email)
        const user = {
            presentation: info.dataValues.presentation,
            Suspends: presentation.dataValues.Suspends,
            createdAt: info.dataValues.createdAt,
            updatedAt: info.dataValues.updatedAt,
            info: info.dataValues.Auth,
            roles: {
                Administrateur: info.dataValues.Role.Administrator,
                Modérateur: info.dataValues.Role.Moderator,
                Auteur: info.dataValues.Role.Author
            }
        }
        
        if(req.accessToken) {
            res.status(httpStatus.OK)
                .cookie('token', req.accessToken, options)
                .send({
                    token: req.refreshToken,
                    user: user
                })
        } else {
            res.status(httpStatus.OK).send(user)
        }
    } else {
        if(req.accessToken) {
            res.status(httpStatus.OK)
                .cookie('token', req.accessToken, options)
                .send({
                    token: req.refreshToken,
                    message: 'Utilisateur inconnu'
                })
        } else {
            res.status(httpStatus.OK).send({message: 'Utilisateur inconnu'})
        }
    }
})
router.get('/posts/:data', validateToken, async (req, res) => {
    // console.log('req.params', req.params.data)
    const value = req.params.data
    const presentation = await Users.findOne({
        where: {
            username: value,
        },
        attributes: ['id']
    })
    let listOfPosts = await Posts.findAll({
        where: {
            UserId: presentation.id,
        },
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
                model: Comments,
                attributes: ['PostId']
            }
        ]
    }) 
    // console.log(listOfPosts)
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                listOfPosts: listOfPosts
            })
    } else {
        res.status(httpStatus.OK).send({listOfPosts: listOfPosts})
    }
})
router.get('/comments/:data', validateToken, async (req, res) => {
    //console.log('req.params', req.params.data)
    const value = req.params.data
    const presentation = await Users.findOne({
        where: {
            username: value,
        },
        attributes: ['id']
    })
    let listOfComments = await Posts.findAll({
        attributes: ['id', 'title'],
        include: [
            {
                model: Comments,
                where: {
                    UserId: presentation.id
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                attributes: {
                    exclude: ['UserId']
                }
            }
        ]
    })
    /*let listOfComments = await Comments.findAll({
        where: {
            UserId: presentation.id,
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: {
            exclude: ['UserId']
        },
        include: [
            {
                model: Posts,
                attributes: ['title']
            }
        ]
    }) */
    // console.log(listOfComments)
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                listOfComments: listOfComments
            })
    } else {
        res.status(httpStatus.OK).send({listOfComments: listOfComments})
    }
})
router.post('/suspend', validateToken, roleValid, async (req, res) => {
    const value = req.body
    const presentation = await Users.findOne({
        where: {
            username: value.username,
        },
        attributes: ['id']
    })
    const userId = presentation.id
    await Suspends.create({
        Status: 'true',
        About: value.about,
        UserId: userId,
    })
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                message: 'Auteur suspendu'
            })
    } else {
        res.status(httpStatus.OK).send({message: 'Auteur suspendu'})
    }
})
router.put('/suspend/:data', validateToken, roleValid, async (req, res) => {
    const id = req.params.data
    const suspend = await Suspends.findByPk(id)
    await suspend.update({ Status: 'false' })
    await suspend.save()
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                message: 'Suspension annulée'
            })
    } else {
        res.status(httpStatus.OK).send({message: 'Suspension annulée'})
    }
})
module.exports = router