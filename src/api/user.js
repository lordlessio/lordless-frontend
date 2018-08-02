module.exports = axios => {
  return {

    // 根据 id 或 地址获取用户信息
    getUserById: (params) => {
      return axios.get('/api/user', { params })
    },

    // 根据cookie中的token获取用户信息
    getUserByToken: () => {
      return axios.post('/api/user')
    },

    // 用户登陆
    login: (params) => {
      return axios.post('/api/user/login', params)
    },

    // 注销登陆
    logout: () => {
      return axios.put('/api/user/logout')
    }
  }
}
