const jwt = require('jsonwebtoken')

function generate(id, creationTime) {
    return jwt.sign({
        id,
        creationTime,
        exp: Date.now() + (parseInt(process.env.TOKEN_EXPIRATION) * 1000)
    }, process.env.TOKEN_SECRET)
}

function verify(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET)
}

module.exports = {
    generate, verify
}