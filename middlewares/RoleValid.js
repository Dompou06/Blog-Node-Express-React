const { Roles } = require('../models')
const httpStatus = require('http-status')

/**
* Validation des token reçus du cookie et du headers 
* @param {String} some req.cookies.token
* @param {String} some req.header('accessToken')
* @return { Promise }
*/
const roleValid = async (req, res, next) => {
    const userId = req.user
    await Roles.findOne({
        where: {
            UserId: userId,
        },
        attributes: ['Administrator', 'Moderator']
    })
        .then(foundRoles => {
            // console.log(foundRoles.dataValues)
            if(foundRoles.dataValues.Administrator === 'true') {
                req.role = 'Administrator'
                return next()
            } else if(foundRoles.dataValues.Moderator === 'true') {
                req.role = 'Moderator'
                return next()
            } else {
                return res.status(httpStatus.FORBIDDEN).send({error: 'Non autorisé'})   
            }
        })
        .catch(() => {
            return res.status(httpStatus.FORBIDDEN).send({error: 'Non autorisé'})   
        })
            
                
            
}
    


module.exports = { roleValid }