const express = require('express')
const { Types } = require('mongoose')

const { StrictAuth, BasicAuth } = require('../middlewares/auth')
const User = require('../schemas/user')
const Post = require('../schemas/post')
const { QueryError } = require('../errors/customErrors')

const router = express.Router()

/* ----- Post management (creation/deletion) ----- */
router.post('/new', StrictAuth, (req, res, next) => {
    const post = new Post({
        author: req.user._id,
        content: req.body.content
    })

    const { likes, retweets, __v, ...postInfo } = post.toJSON()

    post.save()
        .then(() => res.status(201).json({
            ...postInfo,
            createdAt: post.createdAt,
            repliesCount: 0,
            likesCount: 0,
            retweetsCount: 0
        }))
        .catch(next)
})

router.post('/reply/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))
    if (req.query.quote !== undefined && !Types.ObjectId.isValid(req.query.quote)) return next(new QueryError('Quote ID'))

    Post.findById(req.params.ID)
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(async () => {
            const reply = new Post({
                author: req.user._id,
                type: 'reply',
                content: req.body.content,
                quote: req.query.quote,
                target: req.params.ID
            })

            await reply.save()

            const { likes, retweets, __v, ...replyInfo } = reply.toJSON()

            res.status(201).json({
                ...replyInfo,
                createdAt: reply.createdAt,
                repliesCount: 0,
                likesCount: 0,
                retweetsCount: 0
            })
        })
        .catch(next)
})

router.post('/quote/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findById(req.params.ID)
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(async () => {
            const quote = new Post({
                author: req.user._id,
                type: 'quote',
                content: req.body.content,
                quote: req.params.ID
            })

            await quote.save()

            const { likes, retweets, __v, ...quoteInfo } = quote.toJSON()

            res.status(201).json({
                ...quoteInfo,
                createdAt: quote.createdAt,
                repliesCount: 0,
                likesCount: 0,
                retweetsCount: 0
            })
        })
        .catch(next)
})

router.delete('/:ID', StrictAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.ID, author: req.user._id })
        .lean()
        .orFail(new SyntaxError('Invalid post ID or you don\'t have permission to delete it'))
        .then(() => res.sendStatus(204))
        .catch(next)
})

/* ----- Post interactions (like/retweet) ----- */
router.post('/like/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findByIdAndUpdate(
        req.params.ID,
        { $addToSet: { likes: req.user._id } })
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(() => res.sendStatus(204))
        .catch(next)
})

router.delete('/like/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findByIdAndUpdate(
        req.params.ID,
        { $pull: { likes: req.user._id } })
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(() => res.sendStatus(204))
        .catch(next)
})

router.post('/retweet/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findByIdAndUpdate(
        req.params.ID,
        { $addToSet: { retweets: req.user._id } })
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(() => res.sendStatus(204))
        .catch(next)
})

router.delete('/retweet/:ID', StrictAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findByIdAndUpdate(
        req.params.ID,
        { $pull: { retweets: req.user._id } })
        .lean()
        .orFail(new SyntaxError('Invalid post ID'))
        .then(() => res.sendStatus(204))
        .catch(next)
})

/* ----- Post getters ----- */
router.get('/feed', StrictAuth, (req, res, next) => {
    //- User posts
    //- User retweets
    //- User likes
    //- Follows posts
    //- Follows retweets
    //- Follows likes

    //Missing precision of 'isLike' or 'isRetweet'
    User.findById(req.user._id, 'follows')
        .then(async client => {
            const filter = client.follows
            filter.push(client._id)

            const feed = await Post.find({
                $or: [
                    { author: { $in: filter } },
                    { likes: { $in: filter } },
                    { retweets: { $in: filter } }
                ],
                createdAt: { $lt: req.query.after ? parseInt(req.query.after) : Infinity }
            }, '-__v', {
                limit: parseInt(process.env.BATCH_POST_RETRIEVE),
                sort: { createdAt: -1 }
            })
                .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
                .populate({ path: 'author repliesCount', select: 'tag name' })

            feed.map(post => {
                post.isLiked = !!post.likes.find(id => id.toString() === req.user.id)
                post.isRetweeted = !!post.retweets.find(id => id.toString() === req.user.id)

                delete post.likes
                delete post.retweets
            })

            res.status(201).json(feed)
        })
        .catch(next)
})

router.get('/:ID/parents', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.getParents(req.params.ID, { select: '-__v' })
        .then((data) => res.status(200).json(data))
        .catch(next)
})

router.get('/:ID', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.findById(req.params.ID)
        .populate({ path: 'author', select: 'tag name' })
        .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
        .populate('repliesCount')
        .orFail(new SyntaxError('Invalid post ID'))
        .then(data => {
            if (req.user) {
                data.isLiked = !!data.likes.find(id => id.toString() === req.user.id)
                data.isRetweeted = !!data.retweets.find(id => id.toString() === req.user.id)
            }

            delete data.likes; delete data.retweets; return data
        })
        .then((post) => res.status(200).json(post))
        .catch(next)
})

router.get('/:ID/replies', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.find(
        { target: req.params.ID, createdAt: { $lt: req.query.after ? parseInt(req.query.after) : Infinity } },
        '-__v',
        {
            limit: parseInt(process.env.BATCH_POST_RETRIEVE),
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
        .then((replies) => res.status(200).send(replies))
        .catch(next)
})

router.get('/:ID/quotes', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new QueryError('Post ID'))

    Post.find(
        { quote: req.params.ID, createdAt: { $lt: req.query.after ? parseInt(req.query.after) : Infinity } },
        '-__v',
        {
            limit: parseInt(process.env.BATCH_POST_RETRIEVE),
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
        .then((replies) => res.status(200).send(replies))
        .catch(next)
})

router.get('/:ID/likes', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new SyntaxError('Invalid post ID'))

    Post.findById(
        req.params.ID,
        'likes',
    )
        .lean()
        .populate({ path: 'likes', select: 'tag name' })
        .orFail(new SyntaxError('Invalid post ID'))
        .then((document) => res.status(200).send(document.likes.slice(parseInt(req.query.skip))))
        .catch(next)
})

router.get('/:ID/retweets', BasicAuth, (req, res, next) => {
    if (!Types.ObjectId.isValid(req.params.ID)) return next(new SyntaxError('Invalid post ID'))

    Post.findById(
        req.params.ID,
        'retweets',
    )
        .lean()
        .populate({ path: 'retweets', select: 'tag name' })
        .orFail(new SyntaxError('Invalid post ID'))
        .then((document) => res.status(200).send(document.retweets.slice(parseInt(req.query.skip))))
        .catch(next)
})

module.exports = router