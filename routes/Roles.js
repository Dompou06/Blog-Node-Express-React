const express = require('express')
const router = express.Router()
const httpStatus = require('http-status')
const { Roles, Users } = require('../models')
const { validateToken } = require('../middlewares/Auth')

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
router.get('/managment', validateToken, async (req, res) => {
    //console.log('req.user', req.user)
    const userId = req.user
    await Roles.findOne({
        where: {
            UserId: userId,
        },
        attributes: ['Administrator', 'Moderator']
    })
        .then(foundRoles => {
            const key = Object.keys(foundRoles.dataValues).find(key => foundRoles.dataValues[key] === 'true')
            let role = ''
            if(key === 'Administrator') {
                role = 'Administrateur'
            } else {
                role = 'Modérateur'
            }
            //  console.log('key', key)   
            if(req.accessToken) {
                res.status(httpStatus.OK)
                    .cookie('token', req.accessToken, options)
                    .send({
                        token: req.refreshToken,
                        responsability: role
                    })
            } else {
                res.status(httpStatus.OK).send({responsability: role})
            }
        })
    // .catch(res.status(httpStatus.UNAUTHORIZED).send({error: 'Connectez-vous'}))
    /*if(foundRoles) {
        const key = Object.keys(foundRoles.dataValues).find(key => foundRoles.dataValues[key] === 'true')
        //  console.log('key', key)   
    
        if(req.accessToken) {
            res.status(httpStatus.OK)
                .cookie('token', req.accessToken, options)
                .send({
                    token: req.refreshToken,
                    responsability: key
                })
        } else {
            res.status(httpStatus.OK).send({responsability: key})
        }
    } else {
        res.send({error: 'erreur'})
    }*/
})
router.put('/', validateToken, async (req, res) => {
    // console.log('req.params', req.params.data)
    // console.log('req.query', req.body)
    const user = await Users.findOne({
        where: {
            username: req.body.username,
        },
        attributes: ['id']
    })
    let role = ''
    if (req.body.role === 'Modérateur') {
        role = 'Moderator'
    } else if (req.body.role === 'Administrateur') {
        role = 'Administrateur'
    } 
    let status = 'false'
    if(req.body.status === 'false') {
        status = 'true'
    }
    //  console.log('role', role)
    const update = await Roles.findOne({
        where: {
            UserId: user.id
        } 
    })
    await update.update({ [role]: status })
    await update.save()
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken
            })
    } else {
        res.status(httpStatus.OK).send('Rôle modifié')
    }
})

module.exports = router