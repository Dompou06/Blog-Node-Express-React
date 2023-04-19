const crypto = require('crypto')
require('dotenv').config()
const algorithm = 'aes-192-cbc'
const keyCrypt = process.env.CRYPT
const key = crypto.scryptSync(keyCrypt, 'salt', 24)
const iv = Buffer.alloc(16, 8)

exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    return encrypted
}
exports.decrypt = (text) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

const keyCrypted = process.env.CRYPTED
const keyTwoo = crypto.scryptSync(keyCrypted, 'salt', 24)
// eslint-disable-next-line no-undef
exports.encrypted = (text) => {
    if(text  != null) {
        const cipherTwoo = crypto.createCipheriv(algorithm, keyTwoo, iv)
        let encryptedTwoo = cipherTwoo.update(text, 'utf8', 'hex')
        encryptedTwoo += cipherTwoo.final('hex')
        return encryptedTwoo
    } else {
        let decryptedTwoo = null
        return decryptedTwoo     
    }
}
exports.decrypted = (text) => {
    if(text  != null) {
        const decipherTwoo = crypto.createDecipheriv(algorithm, keyTwoo, iv)
        let decryptedTwoo = decipherTwoo.update(text, 'hex', 'utf8')
        decryptedTwoo += decipherTwoo.final('utf8')
        return decryptedTwoo
    } else {
        let decryptedTwoo =''
        return decryptedTwoo     
    }
}

