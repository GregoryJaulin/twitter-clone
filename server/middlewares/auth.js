const webtoken = require('../utils/webtoken')
const userSchema = require('../schemas/user')
const { AuthError } = require('../errors/customErrors')

async function AuthBase (strict, req, res, next) {
  const token = req.cookies['authorization']
  if (!token) return next(strict ? new AuthError() : undefined)

  let webtokenObj
  try {
    webtokenObj = await webtoken.verify(token)
  } catch (err) { return next(new AuthError()) }

  const { id, creationTime, exp } = webtokenObj

  userSchema.findOne({ _id: id, tokenCreation: { $eq: creationTime } }, 'tokenCreation')
    .orFail(new AuthError())
    .then(user => {
      res.cookie('authorization',
        Date.now() >= exp ? webtoken.generate(user._id, user.tokenCreation) : token,
        { secure: false, httpOnly: true }
      )
      req.user = user
      next()
    })
    .catch(next)
}

module.exports = {
  StrictAuth: (req, res, next) => AuthBase(true, req, res, next),
  BasicAuth: (req, res, next) => AuthBase(false, req, res, next)
}