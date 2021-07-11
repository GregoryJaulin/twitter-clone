const express = require('express')

const User = require('../schemas/user')
const { StrictAuth } = require('../middlewares/auth')
const webtoken = require('../utils/webtoken')
const { BodyError } = require('../errors/customErrors')

const router = express.Router()

//Cookie validation
router.get('/cookie', StrictAuth, (req, res) => {
    const { tokenCreation, ...user } = req.user.toJSON()

    res.status(200).json(user)
})

//User login in
router.post('/login', (req, res, next) => {
    const { credential, password } = req.body

    if (!credential || !password) return next(new BodyError(['credential', 'password']))

    User.findByCredential(credential, password, webtoken.generate, req.query.askRegen)
        //Cookie's option 'secure' is set to false because this server isn't using https connexion.
        //For better security, we should enabled this option and use https protocol.
        .then((data) => res.status(200).cookie('authorization', data.token, { secure: true, httpOnly: true }).json(data.user))
        .catch(next)
})

//User register
router.post('/register', (req, res, next) => {
    //We do not ask password confirmation in the API
    const { tag, name, credential, password } = req.body

    const account = new User({
        tag,
        name,
        credentials: credential,
        password
    })

    const token = webtoken.generate(account._id, account.tokenCreation)

    account.save()
        .then(() => res.status(200)
                        .cookie('authorization', token, { secure: false, httpOnly: true })
                        .json({
                            _id: account._id,
                            tag,
                            name
                        }))
        .catch(next)
})

module.exports = router
