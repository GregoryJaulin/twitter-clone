import axios from 'axios'

export default class Search {

    constructor(errorFactory) {
        this.error = errorFactory || function () {
            return { isError: true, error: 'Une erreur est survenue, veuillez réessayer ultérieurement' }
        }
    }

    global(query) {
        return axios.get(`/search`, { params: { filter: query }})
    }

    users(query, skip = 0) {
        return axios.get(`/search/user`, { params: { filter: query, skip }})
    }

    posts(query, skip = 0) {
        return axios.get(`/search/post`, { params: { filter: query, skip }})
    }
}