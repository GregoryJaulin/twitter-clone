const mongoose = require('mongoose')

const schema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    type: {
        type: String,
        enum: ['initial', 'reply', 'quote'],
        default: 'initial'
    },
    content: {
        type: String,
        trim: true,
        maxLength: [400, 'Tweet length cannot exceed 400 characters'],
        required: true,
        immutable: true,
        text: true
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        validate: {
            validator: value => (this.type === 'initial' && !value) || value,
            message: 'You can only set a target on \'quote\' or \'reply\' typed post'
        }
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts',
        required: [() => this.type === 'quote', 'You can only set a quote on \'quote\' typed post']
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    retweets: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    //Version field. Auto added by Mongoose but specify it here allow us
    //unselect it for all requests with 'select: false'
    __v: {
        type: Number,
        select: false
    }
}, {
    collation: { locale: 'fr', strength: 1}
})

schema.static('getParents', async function (id, { limit = process.env.BATCH_TARGET_NESTING, select = '-__v' } = {}) {
    const data = []

    //Request initial post, assuming id is valid ObjectId
    let document = await this.findById(id, 'type target').lean()

    while(limit > 0 && (document && document.target)) {
        //Populate first on quote then lean virtuals to avoid get virtuals also for quote.
        document = await this.findById(document.target, select)
                            .populate({ path: 'quote', select: 'author content createdAt', populate: { path: 'author', select: 'tag name' }})
                            .lean({ virtuals: ['likesCount', 'retweetsCount', 'repliesCount']})
                            .populate({ path: 'author repliesCount', select: 'tag name' })
        if(!document) break;

        data.push(document)

        limit--
    }

    data.map(obj => { delete obj.likes; delete obj.retweets })

    return data
})

schema.plugin(require('mongoose-lean-virtuals'))
schema.virtual('likesCount').get(function () { return (this.likes || []).length })
schema.virtual('retweetsCount').get(function () { return (this.retweets || []).length })
schema.virtual('repliesCount', {
    ref: 'Posts',
    localField: '_id',
    foreignField: 'target',
    count: true
})

module.exports = mongoose.model('Posts', schema)