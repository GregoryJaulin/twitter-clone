const express = require('express')

const Post = require('../schemas/post')
const User = require('../schemas/user')
const { QueryError } = require('../errors/customErrors')

const router = express.Router()

const accentMap = {
    a: "[aáàãâä]",
    e: "[eéèêë]",
    i: "[iíìîï]",
    o: "[oóòôõö]",
    u: "[uúùûü]",
    c: "[cç]",
    n: "[nñ]"
}

function rasterizeQuery(query) {
    Object.keys(accentMap).forEach(key => query = query.replace(key, accentMap[key]))
    return query
}

// We should be using $text or even ElasticSearch to perform
// search on a collection, but it's somewhat overkill for this
// kind of project
router.get('/', (req, res, next) => {
    if (!req.query.filter) return next(new QueryError('Filter'))

    const query = rasterizeQuery(req.query.filter.toLowerCase().replace('+', ' '))
    Promise.all([
        User.find({ $or: [{ tag: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }] },
            'tag name',
            { limit: 3 }),
        Post.find({ content: { $regex: query, $options: 'i' } }, undefined, {
            limit: parseInt(process.env.BATCH_POST_RETRIEVE),
            sort: { createdAt: -1 }
        })
            .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount'] })
            .populate({ path: 'author repliesCount', select: 'tag name' })
    ])
        .then(([users, posts]) => res.status(200).json({users, posts}))
        .catch(next)
})

router.get('/user', (req, res, next) => {
    if (!req.query.filter) return next(new QueryError('Filter'))

    const query = rasterizeQuery(req.query.filter.toLowerCase().replace('+', ' '))
    User.find({
        $or: [
            { tag: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
        ]
    },
        'tag name',
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        })
        .then((data) => res.status(200).json(data))
        .catch(next)
})

router.get('/post', (req, res, next) => {
    if (!req.query.filter) return next(new QueryError('Filter'))

    const query = rasterizeQuery(req.query.filter.toLowerCase().replace('+', ' '))
    Post.find({ content: { $regex: query, $options: 'i' } },
        undefined,
        {
            skip: req.query.skip && req.query.skip.match(/^\d+$/) ? parseInt(req.query.skip) : 0,
            limit: parseInt(process.env.BATCH_USER_RETRIEVE)
        })
        .then((data) => res.status(200).json(data))
        .catch(next)
})

module.exports = router