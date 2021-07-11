const express = require('express')
const { Types } = require('mongoose')

const User = require('../schemas/user')
const Post = require('../schemas/post')
const { StrictAuth, BasicAuth } = require('../middlewares/auth')
const { QueryError } = require('../errors/customErrors')

const router = express.Router()

/* ----- User getters ----- */
router.get('/:ID', BasicAuth, (req, res, next) => {
    User.findOne(Types.ObjectId.isValid(req.params.ID) ? { _id: req.params.ID } : { tag: req.params.ID }, '-__v -password -credentials -token')
        .lean({ virtuals: ['followersCount', 'followsCount'] })
        .populate('followersCount')
        .orFail(new SyntaxError('Invalid user ID'))
        .then(async (user) => {
            if(req.user) {
                user.isFollowed = await User.findOne({ _id: req.user._id, follows: {$in: user._id} }).then(found => !!found)
            } else user.isFollowed = false

            delete user.follows

            return user
        })
        .then((user) => res.status(200).send(user))
        .catch(next)
})

router.get('/:ID/posts', BasicAuth, (req, res, next) => {
    Post.find(
        { author: req.params.ID, type: { $in: ['initial', 'quote'] }, createdAt: { $lt: req.query.after ? parseInt(req.query.after) : Infinity } },
        '-__v',
        {
            limit: parseInt(process.env.BATCH_USER_RETRIEVE),
            sort: { createdAt: -1 }
        }
    )
        .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
        .populate({ path: 'author repliesCount', select: 'tag name' })
        .then((data) => {
            data.map(post => {
                if (req.user) {
                    post.isLiked = !!post.likes.find(id => id.toString() === req.user.id)
                    post.isRetweeted = !!post.retweets.find(id => id.toString() === req.user.id)
                }

                delete post.likes
                delete post.retweets
            })
            return data
        })
        .then((data) => res.status(200).send(data))
        .catch(next)
})

router.get('/:ID/replies', BasicAuth, (req, res, next) => {
    Post.find(
        { author: req.params.ID, type: 'reply', createdAt: { $lt: req.query.after ? parseInt(req.query.after) : Infinity } },
        '-__v',
        {
            limit: parseInt(process.env.BATCH_USER_RETRIEVE),
            sort: { createdAt: -1 }
        }
    )
        .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
        .populate({ path: 'author repliesCount', select: 'tag name' })
        .then((data) => {
            data.map(post => {
                if (req.user) {
                    post.isLiked = !!post.likes.find(id => id.toString() === req.user.id)
                    post.isRetweeted = !!post.retweets.find(id => id.toString() === req.user.id)
                }

                delete post.likes
                delete post.retweets
            })
            return data
        })
        .then((data) => res.status(200).send(data))
        .catch(next)
})

router.get('/:ID/likes', BasicAuth, (req, res, next) => {
    Post.find(
        { likes: { $in: req.params.ID } },
        '-__v',
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        }
    )
        .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
        .populate({ path: 'author repliesCount', select: 'tag name' })
        .then((data) => {
            data.map(post => {
                if (req.user) {
                    post.isLiked = !!post.likes.find(id => id.toString() === req.user.id)
                    post.isRetweeted = !!post.retweets.find(id => id.toString() === req.user.id)
                }

                delete post.likes
                delete post.retweets
            })
            return data
        })
        .then((data) => res.status(200).send(data))
        .catch(next)
})

router.get('/:ID/retweets', BasicAuth, (req, res, next) => {
    Post.find(
        { retweets: { $in: req.params.ID } },
        '-__v',
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        }
    )
        .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
        .populate({ path: 'author repliesCount', select: 'tag name' })
        .then((data) => {
            data.map(post => {
                if (req.user) {
                    post.isLiked = !!post.likes.find(id => id.toString() === req.user.id)
                    post.isRetweeted = !!post.retweets.find(id => id.toString() === req.user.id)
                }

                delete post.likes
                delete post.retweets
            })
            return data
        })
        .then((data) => res.status(200).send(data))
        .catch(next)
})

router.get('/:ID/follows', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    User.findById(
        req.params.ID,
        'follows',
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        }
    )
        .lean()
        .populate({ path: 'follows', select: 'tag name' })
        .orFail(new SyntaxError('Invalid user ID'))
        .then((user) => res.status(200).send(user.follows))
        .catch(next)
})

router.get('/:ID/followers', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    User.find(
        { follows: { $in: req.params.ID } },
        'tag name',
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        }
    )
        .lean()
        .then((followers) => res.status(200).send(followers))
        .catch(next)
})

/* ----- User follows actions ----- */
router.post('/:ID/follow', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    User.findById(req.params.ID)
        .lean()
        .orFail(new SyntaxError('Invalid user ID'))
        .then(async () => await req.user.updateOne({ $addToSet: { follows: req.params.ID } }))
        .then(res.sendStatus(204))
        .catch(next)
})

router.delete('/:ID/follow', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    User.findById(req.params.ID)
        .lean()
        .orFail(new SyntaxError('Invalid user ID'))
        .then(async () => {
            await req.user.updateOne({ $pull: { follows: req.params.ID } })

            res.sendStatus(204)
        })
        .catch(next)
})

module.exports = router