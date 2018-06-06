import axios from 'axios'
const instance = axios.create({
  baseURL: process.env.BACKEND_SERVER,
  timeout: 30000,
  withCredentials: true
})
instance.interceptors.response.use(async function (response) {
  return response.data
}, function (error) {
  return Promise.reject(error)
})

export default instance
