const express = require('express')
const router = express.Router()

const userController = require('../controllers/user.controller')

const { validateToken } = require('../middlewares/Auth')
const { validateId } = require('../middlewares/Password')
const { limiter } = require('../middlewares/Limiter')

router.post('/', userController.signup)
router.post('/login', limiter, userController.login)
router.post('/forget', userController.passwordForget)
router.get('/logout', validateToken, userController.logout)
router.get('/auth', validateToken, userController.authentification)
router.get('/passwordforget', userController.passwordForget)
router.post('/resetpassword', validateId, userController.passwordReset)
router.get('/basicinfo/:id', userController.profilePost)
router.get('/me', validateToken, userController.profileMe)
router.put('/profile', validateToken, userController.updateProfile)
router.delete('/', validateToken, userController.delete)

module.exports = router