let mongoErrors = {
    11000: 'DuplicateKey'
}

function MongoErrorHandler(err, res) {
    let errorType = mongoErrors[err.code]
    let fields = Object.keys(err.keyValue)

    res.status(409)
        .json({
            type: errorType,
            fields
        })
}

function ValidationErrorHandler(err, res) {
    let fields = Object.entries(err.errors)
                    .map(([key, value], _) => {
                        return {
                            field: key.replace(/\.\d$/, ''), //remove last occurence of index if array (e.g '.0' in 'field.subfield.0')
                            message: value.message
                        }
                    })

    res.status(400).json({
        type: 'ValidationError',
        fields
    })
}

function SyntaxErrorHandler(err, res) {
    res.status(400)
        .json({
            type: 'SyntaxError',
            message: err.message
        })
}

function CustomError(err, res) {
    res.status(400)
        .json({
            type: err.name,
            message: err.message,
            fields: err.fields
        })
}

module.exports = async (err, req, res, _) => {
    console.log(err)
    switch(err.name) {
        case 'MongoError': 
            MongoErrorHandler(err, res)
            break
        case 'ValidationError':
            ValidationErrorHandler(err, res)
            break
        case 'SyntaxError':
            SyntaxErrorHandler(err, res)
            break
        case 'AuthError':
        case 'HeaderError':
        case 'BodyError':
        case 'QueryError': 
            CustomError(err, res)
            break

        default: res.status(500).send(err)//'Something went wrong.')
    }
}