const axios = require('axios')
const { series, parallel } = require('gulp')

axios.defaults.baseURL = 'http://localhost:3000/API'
axios.defaults.headers.post['Content-Type'] = 'application/json'

let token
let user
let postID

function connectUser() {
    const body = {
        credential: 'jaulin.gregory@gmail.fr',
        password: 'Greg45410!'
    }

    return axios.post('/auth/login', body)
        .then(res => { token = res.headers.authorization; user = res.data })
}

function createNewPost() {
    return axios.post('/post/new', { content: 'I\'m creating a Post' }, { headers: { authorization: token } })
        .then(res => { postID = res.data._id })
}

function deletePost() {
    return axios.delete(`/post/${postID}`, { headers: { authorization: token } })
}

async function like() {
    return axios.post(`/post/like/${postID}`, {}, { headers: { authorization: token } })
                .then(async () => {
                    const likes = await axios.get(`/post/${postID}/likes`).then(res => res.data)
                    if(!likes.find(like => like._id === user._id)) throw new Error('Like not applied')
                })
}

async function dislike() {
    return axios.delete(`/post/like/${postID}`, { headers: { authorization: token } })
                .then(async () => {
                    const likes = await axios.get(`/post/${postID}/likes`).then(res => res.data)
                    if(likes.find(like => like._id === user._id)) throw new Error('Dislike not applied')
                })
}

async function retweet() {
    return axios.post(`/post/retweet/${postID}`, {}, { headers: { authorization: token } })
                .then(async () => {
                    const retweets = await axios.get(`/post/${postID}/retweets`).then(res => res.data)
                    if(!retweets.find(retweet => retweet._id === user._id)) throw new Error('Retweet not applied')
                })
}

async function unretweet() {
    return axios.delete(`/post/retweet/${postID}`, { headers: { authorization: token } })
                .then(async () => {
                    const retweets = await axios.get(`/post/${postID}/retweets`).then(res => res.data)
                    if(retweets.find(retweet => retweet._id === user._id)) throw new Error('Unretweet not applied')
                })
}


module.exports = series(
                        connectUser,
                        createNewPost,
                        parallel(
                            series(like, dislike),
                            series(retweet, unretweet)
                            ),
                        deletePost
                        )
                        