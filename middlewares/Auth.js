const { verify, sign } = require('jsonwebtoken')
require('dotenv').config()
const httpStatus = require('http-status')

/**
* Validation des token reçus du cookie et du headers 
* @param {String} some req.cookies.token
* @param {String} some req.header('accessToken')
* @return { Promise }
*/
const validateToken = (req, res, next) => {
    const accessToken = req.cookies.token
    if(!accessToken) {
        //Token cookie not exist
        return res.status(httpStatus.FORBIDDEN).send({error: 'Connectez-vous'})
    } else {
        try {
            const validToken = verify(accessToken, process.env.TOKEN)
            req.user = validToken.id
            //Token cookie valid
            console.log('Token cookie valid')
            return next() 
        } catch (err) {
            if(err.name === 'TokenExpiredError') {
                //Token cookie expired
                console.log('Token cookie expired')                
                const refreshToken = req.header('accessToken')
                console.log('refreshToken', refreshToken)                
                if(!refreshToken) {
                    //Token header not exist
                    return res.status(httpStatus.FORBIDDEN)
                        .clearCookie('token')
                        .send({error: 'Connectez-vous'})
                } else {
                    try {
                        const validRefreshToken = verify(refreshToken, process.env.REFRESHTOKEN)
                        console.log('Refreshtoken valid')                
                        //Refreshtoken valid                       
                        //if(validRefreshToken.id) {
                        req.user = validRefreshToken.id
                        //New token cookie and Refreshtoken
                        req.accessToken = sign({ id: validRefreshToken.id }, process.env.TOKEN, { expiresIn: process.env.EXPIRETOKEN })
                        req.refreshToken = sign({ id: validRefreshToken.id }, process.env.REFRESHTOKEN, { expiresIn: process.env.EXPIREREFRESHTOKEN })
                        return next()
                        /*} else {
                            //console.log('refresh token obsolète')
                            return res.status(httpStatus.FORBIDDEN)
                                .clearCookie('token')
                                .send({error: 'Connectez-vous'})
                        } */
                    }
                    catch (err) {                                 
                        console.log('Refreshtoken expired or false')                
                        //Refreshtoken expired or false
                        try {
                            //Refreshtoken is a remeber me ?                                
                            const validRememberToken = verify(refreshToken, process.env.REMEMBERTOKEN)
                            // if(validRememberToken) {
                            //Rememberme is valid
                            console.log('Rememberme is valid')                
                            // console.log('validRememberToken.id', validRememberToken.id)
                            req.user = validRememberToken.id
                            //New token cookie and Refreshtoken
                            req.accessToken = sign({ id: validRememberToken.id }, process.env.TOKEN, { expiresIn: process.env.EXPIRETOKEN })
                            req.refreshToken = sign({ id: validRememberToken.id }, process.env.REMEMBERTOKEN, { expiresIn: process.env.EXPIREREMEMBERTOKEN })
                            return next()
                            //  } 
                        } catch(err) {
                            //Rememberme is invalid                            
                            return res.status(httpStatus.FORBIDDEN)
                                .clearCookie('token')
                                .send({error: 'Connectez-vous'})
                        }
                    }
                }
            } else {
                //Token cookie invalid
                return res.status(httpStatus.FORBIDDEN).send({error: 'Connectez-vous'})
            }
        }
    }
}

module.exports = { validateToken }