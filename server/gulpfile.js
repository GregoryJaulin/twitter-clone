const { series, parallel } = require('gulp')

exports.auth = require('./gulp/auth')
exports.user = require('./gulp/user')
exports.postDetails = require('./gulp/postDetails')
exports.bulkPost = require('./gulp/bulkPost')
exports.default = series(
                        this.auth,
                        parallel(
                            this.user,
                            this.postDetails,
                            this.bulkPost
                            )
                        )