import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:7002/',
  timeout: 2000
})

export default instance
