module.exports = axios => {
  return {

    // 根据 ldbId set home
    setHome: (params) => {
      return axios.post('/api/home/save', params)
    },

    // 获取 home count
    getHomeCount: (params) => {
      return axios.get('/api/home/count', { params })
    },

    // 根据 user 获取 home
    home: (params) => {
      return axios.get('/api/home', { params })
    }
  }
}
