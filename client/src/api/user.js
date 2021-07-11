import axios from 'axios'

export default class User {

    constructor(errorFactory) {
        this.error = errorFactory || function () {
            return { isError: true, error: 'Une erreur est survenue, veuillez réessayer ultérieurement' }
        }
    }

    get(userID) {
        return axios.get(`/user/${userID}`)
    }

    follow(userID) {
        return axios.post(`user/${userID}/follow`)
    }

    getFollowers(userID, skip = 0) {
        return axios.get(`user/${userID}/followers`, { params: { skip }})
    }

    getFollows(userID, skip = 0) {
        return axios.get(`user/${userID}/follows`, { params: { skip }})
    }

    unfollow(userID) {
        return axios.delete(`user/${userID}/follow`)
    }

    getPosts(userID, after) {
        return axios.get(`user/${userID}/posts`, { params: { after }})
    }

    getReplies(userID, after) {
        return axios.get(`user/${userID}/replies`, { params: { after }})
    }

    getRetweets(userID, skip = 0) {
        return axios.get(`user/${userID}/retweets`, { params: { skip }})
    }

    getLikes(userID, skip = 0) {
        return axios.get(`user/${userID}/likes`, { params: { skip }})
    }
}