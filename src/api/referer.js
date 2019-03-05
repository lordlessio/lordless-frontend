module.exports = axios => {
  return {
    getReferees: (params) => {
      return axios.get('/api/referer/referees', { params })
    },

    // 根据条件获取 regions 列表信息
    getRefereeInfo: (params) => {
      return axios.get('/api/referer/refereeInfo', { params })
    }
  }
}
