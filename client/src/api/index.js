import axios from 'axios'
import errorHandler from './errorHandler'

import PostAPI from './post'
import AuthAPI from './auth'
import UserAPI from './user'
import SearchAPI from './search'

function errorFactory(errorMSG) {
    return { isError: true, error: errorMSG }
}

class API {
    constructor() {
        axios.defaults.baseURL = '/API'
        axios.interceptors.response.use(undefined, errorHandler)

        this.auth = new AuthAPI(errorFactory)
        this.posts = new PostAPI(errorFactory)
        this.users = new UserAPI(errorFactory)
        this.search = new SearchAPI(errorFactory)
    }
}

//Instantiation here in case we need to import this file in differents locations
export default new API()