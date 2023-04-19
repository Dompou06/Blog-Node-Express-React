/* eslint-disable no-inner-declarations */
require('dotenv').config()
const httpStatus = require('http-status')
const bcrypt = require('bcrypt')
const crypted = require('../utils/crypt')
const nodemailer = require('nodemailer')
const { sign } = require('jsonwebtoken')

const { Users, Posts, Likes, Auths, Comments, Passwords, Roles } = require('../models')
//Pour token cookie
const options = {
    sameSite: 'strict', 
    path: '/',
    httpOnly: true,
    //En production
    // secure: true,
    expired: new Date(Date.now()) + process.env.EXPIRETOKEN
}

/**
* Inscription d'un utilisateur 
* @param {String} some req.body.username
* @param {String} some req.body.email
* @param {String} some req.body.password
* @return { Promise }
*/
exports.signup = async (req, res) => {
    const { username, email, password } = req.body
    //On véifie que le nom d'utilisateur n'existe pas
    const user = await Users.findOne({
        where: {
            username: username
        }
    })
    if(!user) {
        //On vérifie l'email de l'utilisateur n'esxiste pas
        const crytedEmail = crypted.encrypt(email)
        const auth = await Auths.findOne({
            where: {
                email: crytedEmail
            }
        })
        if(!auth) {
            //On crée un compte 
            bcrypt.hash(password, 10).then(hash => {
                Users.create(
                    {
                        username: username,
                        presentation: '',
                    }
                ).then(result => {    
                    Auths.create(
                        {
                            password: hash,
                            email: crytedEmail,
                            UserId: result.id
                        })
                    Roles.create(
                        {
                            UserId: result.id
                        })
                    res.status(httpStatus.OK).send('Success')
                })
            })
        } else {
            //L'email de l'utilisateu est déjà enregisté
            res.status(httpStatus.UNAUTHORIZED).send({error: 'Vous êtes déjà enregistré'})
        }
    } else {
        //Le nom d'utilisateur existe déjà
        res.status(httpStatus.UNAUTHORIZED).send({error: 'Cet identifiant est déjà octroyé'})
    }
}
/**
* Connexion d'un utilisateur 
* @param {String} some req.body.email
* @param {String} some req.body.password
* @param {Boolean} some req.body.remember
* @return { Promise }
*/
exports.login = async (req, res) => {  
    //  console.log(req.body)
    const { email, password, remember } = req.body
    // console.log('email', email)    
    const crytedEmail = crypted.encrypt(email)
    //On cherche si l'email de l'utilisateur existe
    const auth = await Auths.findOne({
        where: {
            email: crytedEmail
        }
    })
    if(!auth) {
        res.status(httpStatus.UNAUTHORIZED).send({error: 'L\'utilisateur est inconnu'})
    } else { 
        //On compare le password reçu et celui dans la BD
        bcrypt.compare(password, auth.password).then(match => {
            if(!match) {
                res.status(httpStatus.UNAUTHORIZED).send({error: 'Mot de passe invalide'})
            } else {
                // On recheche le nom d'utilisateur
                Users.findByPk(auth.UserId, {
                    attributes: ['username'],
                    include: [ {
                        model: Roles,
                        attributes: {exclude: ['UserId', 'id', 'createdAt', 'updatedAt']}
                    }
                    ]
                }).then(user => {
                    let role = false
                    if(user.Role.Administrator != 'false' || user.Role.Moderator != 'false') {
                        role = true
                    } 
                    //On crée un token
                    const accessToken = sign({ id: auth.UserId }, process.env.TOKEN, { expiresIn: process.env.EXPIRETOKEN })
                    //On crée un refeshToken selon si l'utilisateur a choisi ou pas Remember me
                    let refreshToken = ''
                    if(remember === true) {
                        refreshToken = sign({ id: auth.UserId }, process.env.REMEMBERTOKEN, { expiresIn: process.env.EXPIREREMEMBERTOKEN })
                    } else {
                        refreshToken = sign({ id: auth.UserId }, process.env.REFRESHTOKEN, { expiresIn: process.env.EXPIREREFRESHTOKEN })
                    }
                    res.status(httpStatus.OK)
                        .cookie('token', accessToken, options)
                        .send({
                            token: refreshToken,
                            username: user.username,
                            role: role
                        })
                })
            }
        })
    }
}
/**
* Déonnexion d'un utilisateur 
* @return { Promise }
*/
exports.logout = async (req, res) => {
    res.status(httpStatus.OK)
        .clearCookie('token')
        .send('Déconnecté')
}
/**
* Envoi d'un mail pour mot de passe oublié 
* @param {String} some req.body.email
* @return { Promise }
*/
exports.passwordForget = async (req, res) => {
    console.log(req.body.email)
    const crytedEmail = crypted.encrypt(req.body.email)
    const auth = await Auths.findOne({
        where: {
            email: crytedEmail
        }    })
    if(!auth) {
        res.status(httpStatus.UNAUTHORIZED).send({error: 'L\'utilisateur est inconnu'})
    } else { 
        //On crée une ligne dans la table Passwods
        const password = await Passwords.create()
        //On encrypte le id de la ligne
        const key = sign({ id: password.id }, process.env.PASSWORDSECRET, { expiresIn: process.env.EXPIREPASSWORD })
        let transporter = nodemailer.createTransport({
            host: process.env.MAILHOST,
            port: process.env.MAILPORT,
            auth: {
                user: process.env.MAILUSER,
                pass: process.env.SECRET
            }
        })
        const text = `Bonjour Dominique,\n
            Avez-vous oublié votre mot de passe \n
            Réinitialisation du mot de passe en vous rendant sur la page : http://localhost:3000/resetpassword/${key}\n
            Ce lien expirera dans 24 heures et ne peut être utilisé qu’une seule fois.\n
            Si vous ne souhaitez pas modifier votre mot de passe ou n’êtes pas à l’origine de cette demande, ignorez ce message et supprimez-le.\n
            Merci !\n
            L'équipe du Blog`
        const html = `Bonjour Dominique,
            <p>Avez-vous oublié votre mot de passe ?
            </p>
            <p>
            <a href='http://localhost:3000/resetpassword/${key}'>Réinitialisation du mot de passe</a></p>
            <p>
            Ce lien expirera dans 24 heures et ne peut être utilisé qu’une seule fois.
            </p>
            <p>Si vous ne souhaitez pas modifier votre mot de passe ou n’êtes pas à l’origine de cette demande, ignorez ce message et supprimez-le.
            </p>
            <p>
            Merci !</p>
            L'équipe du Blog
            `
        const mailOptions = {
            from: process.env.MAILUSER,
            to: req.body.email,
            subject: 'Réinitialisation du mot de passe de votre compte Blog',
            text: text,
            html: html
        }
        transporter.sendMail(mailOptions, function(error){
            if (error) {
                res.status(httpStatus.NORESPONSE).send({error: 'Erreur email'})
            } else {
                res.status(httpStatus.OK).send('Un email vous a été envoyé')
            }
        })
    }
}
/**
* Changement de mot de passe 
* @param {String} some req.body.email
* @return { Promise }
*/
exports.passwordReset = async (req, res) => {
    //On cherche l'utilisateur pa son email
    const crytedEmail = crypted.encrypt(req.body.email)
    const auth = await Auths.findOne({
        where: {
            email: crytedEmail
        }
    })
    if(auth) {
        //On met à jour le mot de passe
        await bcrypt.hash(req.body.newpassword, 10).then(hash => {
            auth.update({ password: hash })
            auth.save()
        })
        res.status(httpStatus.OK).send('Mot de passe réinitialisé')
    } else {
        res.status(httpStatus.UNAUTHORIZED).send({error: 'Demande non reconnue'})
    }
}
/**
* Authentification et renvoie de nouveaux token
* @param {Numer} some req.user.id
* @return { Promise }
*/
exports.authentification = async (req, res) => {
    // console.log('req.user', req.user)
    await Users.findByPk(req.user, {
        attributes: ['username'],
        include: [ {
            model: Roles,
            attributes: {exclude: ['UserId', 'id', 'createdAt', 'updatedAt']}
        }
        ]
    }).then(response => {
        let role = false
        if(response.Role.Administrator != 'false' || response.Role.Moderator != 'false') {
            role = true
        } 
        if(req.accessToken) {
            res.status(httpStatus.OK)
                .cookie('token', req.accessToken, options)
                .send({
                    token: req.refreshToken,
                    username: response.username,
                    role: role
                })
        } else {
            res.status(httpStatus.OK).send(
                {
                    username: response.username,
                    role: role
                })
        }
    }).catch(err =>  {
        confirm.log(err)
        res.status(httpStatus.UNAUTHORIZED).send({error: 'Connectez-vous'})
    }
    )
}
/**
* Profil d'un auteur
* @param {Sting} some req.params.id
* @return { Promise }
*/
exports.profilePost = async (req, res) => {
    let userId = {}
    let id =''
    if(req.params.id.includes('comment')) {
        //Si c'est l'auteur d'un commentaire
        const split = req.params.id.split('comment')
        id = split[1]
        userId = await Comments.findByPk(id, {
            attributes: ['UserId']
        })
    } else {
        //Si c'est l'auteur d'un post
        id = req.params.id 
        userId = await Posts.findByPk(id, {
            attributes: ['UserId']
        })
    }
    const basicInfo = await Users.findByPk(userId.UserId, {
        attributes: ['username', 'presentation'],
        include: [ {
            model: Posts,
            attributes: {exclude: ['UserId']},
            include: [{
                model: Likes,
                attributes: ['id'],
            }, {
                model: Comments,
                attributes: ['id'],
            }
            ]
        }]
    })
    res.send(basicInfo)
}
/**
* Profil de l'utilisateur
* @param {Number} some req.params.id
* @return { Promise }
*/
exports.profileMe = async (req, res) => {
    const userId = req.user 
    const userInfo = {}
    const basicInfo = await Users.findByPk(userId, {
        attributes: ['username', 'presentation'],
        include: [ {
            model: Posts,
            attributes: {exclude: ['UserId']},
            include: [Likes, Comments]
        },
        {
            model: Auths,
            attributes: {exclude: ['UserId']}
        },
        ]
    })
    userInfo.username = basicInfo.username
    userInfo.presentation = basicInfo.presentation
    userInfo.email = crypted.decrypt(basicInfo.Auth.email)
    if(basicInfo.Auth.mobile) {
        userInfo.mobile = crypted.decrypt(basicInfo.Auth.mobile)
    } else {  
        userInfo.mobile = ''
    }
    if(basicInfo.Auth.tel) {
        userInfo.tel = crypted.decrypt(basicInfo.Auth.tel)
    } else {  
        userInfo.tel = ''
    }
    if(basicInfo.Auth.address) {
        userInfo.address = crypted.decrypt(basicInfo.Auth.address)
    } else {  
        userInfo.address = ''
    }
    if(basicInfo.Auth.cp) {
        userInfo.cp = crypted.decrypt(basicInfo.Auth.cp)
    } else {  
        userInfo.cp = ''
    }
    if(basicInfo.Auth.city) {
        userInfo.city = crypted.decrypt(basicInfo.Auth.city)
    } else {  
        userInfo.city = ''
    }
    userInfo.state = basicInfo.Auth.state
    userInfo.Posts = basicInfo.Posts
    if(req.accessToken) {
        //Si les token ont été réinitialisés
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken,
                basicInfo: userInfo
            })
    } else {
        res.status(httpStatus.OK).send({basicInfo: userInfo})
    }
}
/**
* Mise à jour du profile de l'utilisateur
* @param {Number} some req.user.id
* @param {String} some req.body.field
* @param {String} some req.body.value
* @return { Promise }
*/
exports.updateProfile = async (req, res) => {
    const id = req.user
    const field = req.body.field
    const user = await Users.findByPk(id)
    if(field === 'presentation') {
        await user.update({ [field]: req.body.value })
        await user.save()
    } else {
        let value = ''
        if(field != 'state') {
            value = crypted.encrypt(req.body.value)
        } else {
            value = req.body.value
        }
        const auth = await Auths.findOne({
            where: {
                UserId: user.id
            } 
        })
        await auth.update({ [field]: value })
        await auth.save()
    }
    if(req.accessToken) {
        res.status(httpStatus.OK)
            .cookie('token', req.accessToken, options)
            .send({
                token: req.refreshToken
            })
    } else {
        res.send('Présentation mise à jour')
    }
}
/**
* MSuppression du compte de l'utilisateur et de l'ensemble des données le concernant
* @param {Number} some req.user.id
* @return { Promise }
*/
exports.delete = async (req, res) => {
    const id = req.user
    await Users.destroy({
        where: {
            id: id
        }, 
        include: [ Auths, Roles, Posts, Likes, Comments
        ]
    })
    res.status(httpStatus.OK)
        .clearCookie('token')
        .send('Compte supprimé')
}