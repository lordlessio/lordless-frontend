import axios from 'axios'
import { getObjStorage } from 'utils/tool'
const instance = axios.create({
  baseURL: process.env.BACKEND_SERVER,
  timeout: 30000,
  withCredentials: true
})
// request
instance.interceptors.request.use(async (res) => {
  // set lordless-token to headers
  const address = window.localStorage.getItem('currentAddress').toLocaleLowerCase()
  const token = getObjStorage()[address]
  res.headers['lordless-token'] = token
  return res
}, error => {
  return Promise.reject(error)
})

// response
instance.interceptors.response.use(async (response) => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export default instance
