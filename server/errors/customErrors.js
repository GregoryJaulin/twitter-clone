class BaseError extends Error {
    constructor(name, msg, fields) {
        super(msg)

        this.name = name
        this.fields = Array.isArray(fields) ? fields : [fields]
    }
}

class AuthError extends BaseError {
    constructor() {
        super('AuthError', 'Auth cookie is missing or outdated', 'token')
    }
}

class HeaderError extends BaseError {
    constructor(field) {
        super('HeaderError', 'Header is missing a field or it\'s value is incorrect', field)
    }
}

class BodyError extends BaseError {
    constructor(fields) {
        super('BodyError', 'Body is missing field(s)', fields)
    }
}

class QueryError extends BaseError {
    constructor(fields) {
        super('QueryError', 'Query is malformated', fields)
    }
}

module.exports = {
    HeaderError, BodyError, QueryError, AuthError
}