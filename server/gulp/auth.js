const axios = require('axios')
const { series } = require('gulp')

axios.defaults.baseURL = 'http://localhost:3000/API'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function createUser() {
  const body = {
    tag: 'Nekyox',
    credential: 'jaulin.gregory@gmail.fr',
    name: 'Grégory',
    password: 'Greg45410!'
  }

  return axios.post('/auth/register', body)
}

function connectUser() {
  const body = {
    credential: 'jaulin.gregory@gmail.fr',
    password: 'Greg45410!'
  }

  return axios.post('/auth/login', body)
}
  
module.exports = series(createUser, connectUser)