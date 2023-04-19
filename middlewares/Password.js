const { verify } = require('jsonwebtoken')
const Sequelize = require('sequelize')
const httpStatus = require('http-status')
const { Passwords } = require('../models')

/**
* Suppression de tous les enregistrements de demande de réinitialisation 
* de mot de passe antérieure à 24 h 
* Vérification du id envoyé par mail pour mot de passe oublié 
* @param {String} some id
* @return { Promise }
*/
const validateId = async (req, res, next) => {
//Delete all records befoe 24 h
    await Passwords.destroy({
        where: {
            createdAt: {
                [Sequelize.Op.gte]: new Date(new Date() - (24 * 60 * 60 * 1000)) // one day ago
            }
        }
    })
    const accessId = req.body.id
    if(!accessId) {
        return res.status(httpStatus.FORBIDDEN).send({error: 'Action non autorisée'})
    } else {
        try {
            const validId = verify(accessId, process.env.PASSWORDSECRET)
            if(validId) {
                //Delete this record
                await Passwords.destroy({
                    where: {
                        id: validId
                    }
                }).then(() => {return next()}
                )
                    .catch(err => {
                        return res.status(httpStatus.UNAUTHORIZED).send({error: err})
                    })
            }
        } catch(err) {
            return res.status(httpStatus.UNAUTHORIZED).send({error: err})
        }
    }
}

module.exports = { validateId }