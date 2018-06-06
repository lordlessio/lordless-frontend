import axios from './service'

// 根据 aMapid 查询aMap建筑详细信息
export const findAMapDetail = (id) => {
  return axios.get(`/api/aMap/building/${id}`)
}
// 根据条件获取 aMap 建筑列表信息
export const getAMapBuildings = (params) => {
  return axios.get('/api/aMap/buildings', { params })
}
// 根据条件获取链上的建筑信息
export const getChainLdbs = (params) => {
  return axios.get('/api/ldbs/on', { params })
}
// 根据 aMapid 或 id 查询建筑详细信息
export const findLdbById = (params) => {
  return axios.get('/api/ldb/detail', { params })
}
// 根据 id 修改建筑信息
export const updateLdb = params => {
  return axios.put('/api/ldb/update', params)
}
// 根据条件获取 candy 列表信息
export const getCandies = (params) => {
  return axios.get('/api/candies', { params })
}
// 根据条件获取 candy 详情
export const getCandyDetail = (id) => {
  return axios.get(`/api/candy/${id}`)
}
// 根据条件获取 taskType 列表信息
export const getTaskTypes = (params) => {
  return axios.get('/api/taskTypes', { params })
}
// 根据id获取 taskType 详情
export const getTaskTypeById = (id) => {
  return axios.get(`/api/taskType/${id}`)
}
// 根据条件获取 ldbIcons 列表信息
export const getLdbIcons = (params) => {
  return axios.get('/api/ldbIcons', { params })
}
// 根据id获取 ldbIcon 详情
export const getLdbIconById = (id) => {
  return axios.get(`/api/ldbIcon/${id}`)
}
// 根据 id 或 地址获取用户信息
export const getUserById = (params) => {
  return axios.get('/api/user', { params })
}
// 根据cookie中的token获取用户信息
export const getUserByToken = () => {
  return axios.post('/api/user')
}
// 用户登陆
export const login = (params) => {
  return axios.post('/api/user/login', params)
}
// 注销登陆
export const logout = () => {
  return axios.put('/api/user/logout')
}
