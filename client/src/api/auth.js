import axios from 'axios'

export default class Auth {

    constructor(errorFactory) {
        this.error = errorFactory || function() {
            return { isError: true, error: 'Une erreur est survenue, veuillez réessayer ultérieurement' }
        }
    }

    register(userInfos) {
        return axios.post('/auth/register', userInfos)
    }

    login(userInfos) {
        return axios.post('/auth/login', userInfos)
    }

    cookie() {
        return axios.get('/auth/cookie')
    }
}