const rateLimit = require('express-rate-limit')

/**
* Limitation de tentatives simultanéees de connection 
* @param {Number} some windowMs (période)
* @param {Number} some max (nombre)
* @param {Boolean} some standardHeaders
* @param {String} some message
* @return { Promise }
*/
const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5,
    standardHeaders: true,
    message: 'Le nombre de tentatives est dépassé. Merci de revenir plus tard.',
    handler: (res, options) => {
        //console.log(options.statusCode)
        res.status(options.statusCode).send({error: options.message})}
})

module.exports = { limiter }