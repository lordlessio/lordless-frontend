module.exports = axios => {
  return {

    // 根据 地址获取用户信息
    getUserByAddress: (address) => {
      return axios.get(`/api/user/${address}`)
    },

    // 根据cookie中的token获取用户信息
    getUserByToken: () => {
      return axios.post('/api/user')
    },

    // 获取用户 overview 信息
    getUserOverview: (params) => {
      return axios.get('/api/user/overview', { params })
    },

    // 用户 tg 认证
    putUserTgAuth: (params) => {
      return axios.put('/api/user/tgAuth', params)
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
