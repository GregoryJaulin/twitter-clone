import axios from 'axios'

export default class Post {

    constructor(errorFactory) {
        this.error = errorFactory || function() {
            return { isError: true, error: 'Une erreur est survenue, veuillez réessayer ultérieurement' }
        }
    }

    create(content) {
        if(!content || content.trim() === '') return this.error('Impossible de créer un tweet vide')

        return axios.post('/post/new', { content })
    }

    reply(target, content, quote) {
        if(!content || content.trim() === '') return this.error('Impossible de créer un tweet vide')

        return axios.post(`/post/reply/${target}`, { content }, quote ? { params: { quote }} : undefined)
    }

    quote(target, content) {
        if(!content || content.trim() === '') return this.error('Impossible de créer un tweet vide')

        return axios.post(`/post/quote/${target}`, { content })
    }

    getParents(target) {
        return axios.get(`/post/${target}/parents`)
    }

    get(target) {
        return axios.get(`/post/${target}`)
    }

    getFeed(after) {
        return axios.get('/post/feed', { params: { after }})
    }

    getReplies(target, after) {
        return axios.get(`/post/${target}/replies`, { params: { after }})
    }

    getQuotes(target, after) {
        return axios.get(`/post/${target}/quotes`, { params: { after }})
    }

    deletePost(target) {
        return axios.delete(`/post/${target}`)
    }

    like(target) {
        return axios.post(`/post/like/${target}`)
    }

    getLikes(target, skip = 0) {
        return axios.get(`/post/${target}/likes`, { params: { skip }})
    }

    deleteLike(target) {
        return axios.delete(`/post/like/${target}`)
    }

    retweet(target) {
        return axios.post(`/post/retweet/${target}`)
    }
    
    getRetweets(target, skip = 0) {
        return axios.get(`/post/${target}/retweets`, { params: { skip }})
    }

    deleteRetweet(target) {
        return axios.delete(`/post/retweet/${target}`)
    }
}