const axios = require('axios')
const { series } = require('gulp')

axios.defaults.baseURL = 'http://localhost:3000/API'
axios.defaults.headers.post['Content-Type'] = 'application/json'
const sampleLength = 20

let token
const postsIDs = []

function entry() {
    const body = {
        credential: 'jaulin.gregory@gmail.fr',
        password: 'Greg45410!'
    }

    return axios.post('/auth/login', body)
        .then(res => { token = res.headers.authorization })
}

function createNewPost() {
    return axios.post('/post/new', { content: 'I\'m creating a Post' }, { headers: { authorization: token } })
        .then(res => { postsIDs.push({ deep: 0, id: res.data._id }) })
}

function reply({ deep, id }) {
    return axios.post(`/post/reply/${id}`, { content: `Response lvl ${deep + 1}`}, { headers: { authorization: token } })
        .then(res => { postsIDs.push({ deep: deep+1, id: res.data._id }) })
}

async function bulkReplies() {
    let parent = postsIDs[Math.floor(Math.random() * postsIDs.length)]
    for(let i = 0; i < sampleLength; i++) {
        await reply(parent)

        parent = postsIDs[Math.floor(Math.random() * postsIDs.length)]
    }
}

function dropPosts(cb) {
    postsIDs.forEach(async post => await axios.delete(`/post/${post.id}`, { headers: { authorization: token } }))

    cb()
}

module.exports = series(entry, createNewPost, bulkReplies, dropPosts)