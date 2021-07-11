const axios = require('axios')
const { series } = require('gulp')

axios.defaults.baseURL = 'http://localhost:3000/API'
axios.defaults.headers.post['Content-Type'] = 'application/json'
const sampleLength = 3

let users = []

async function createUsers() {
    for(let i = 0; i < sampleLength; i++) {
        const baseBody = {
            tag: `Nekyox${i}`,
            credential: `jaulin.gregory@gmail.fr${i}`,
            name: 'Grégory',
            password: 'Greg45410!'
        }

        await axios.post('/auth/register', baseBody)
        await axios.post('/auth/login', { credential: baseBody.credential, password: baseBody.password })
                    .then(res => { res.data.token = res.headers.authorization; users[i] = res.data })
    }
}
  
module.exports = series(createUsers)