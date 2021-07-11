const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = mongoose.Schema({
    tag: {
        type: String,
        trim: true,
        unique: true,
        select: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        select: true
    },
    follows: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Users'
    },
    credentials: [{
        type: String,
        trim: true,
        unique: true,
        match: [
            /((?=^[A-z0-9])(?!.*([.-]@|@[.-]))(?!.*[.-]{2,})[A-z0-9-.]{0,64}@[A-z0-9-.]{1,253}[A-z0-9-.]*(\.[A-z0-9]+)+)|^((\+33)|0)\d([.\- ]{0,1}\d{2}){4}$/,
            'Please provide valid credential'
        ],
        default: function () { return this.tag },
        select: false
    }],
    password: {
        type: String,
        required: true,
        minLength: [8, 'This password is too short'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Your password is too weak'],
        select: false
    },
    //We don't store JWT to prevent data leaks from any breach
    //Instead, we store token creation date to compare with the one stored in JWT
    tokenCreation: {
        type: Date,
        default: Date.now,
        select: false
    },
    //Version field. Auto added by Mongoose but specify it here allow us
    //unselect it for all requests with 'select: false'
    __v: {
        type: Number,
        select: false
    }
}, {
    timestamps: { createdAt: true, updatedAt: false },
    collation: { locale: 'fr', strength: 1 }
})

schema.static('findByCredential', function (credential, password, token_generator, askFullRegen) {
    return this.findOne({
        $or: [
            { credentials: { $in: credential } },
            { tag: credential }
        ]
    }, 'profilPic tag name password tokenCreation')
        .lean()
        .orFail(new SyntaxError('Invalid credential'))
        .then(async (user) => {
            let isValid = await bcrypt.compare(password, user.password)
            if (!isValid) throw new SyntaxError('Invalid password')

            let token = token_generator(
                user._id,
                askFullRegen !== undefined ? (
                    creationTime = Date.now(),
                    await this.updateOne({ _id: user._id }, { tokenCreation: creationTime }),
                    creationTime
                ) : user.tokenCreation
            )

            delete user.password
            delete user.tokenCreation

            return { user: user, token: token }
        })
})

//hash password before save document
//password hashing during "pre save" allow us use regex validator in schema
schema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew)
        this.password = await bcrypt.hash(this.password, 10)

    next()
})

schema.plugin(require('mongoose-lean-virtuals'))
schema.virtual('followersCount', {
    ref: 'Users',
    localField: '_id',
    foreignField: 'follows',
    count: true
})
schema.virtual('followsCount').get(function () { return (this.follows || []).length })

module.exports = mongoose.model('Users', schema)