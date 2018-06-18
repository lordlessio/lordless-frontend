module.exports = axios => {
  return {
    // 根据条件获取 ldbIcons 列表信息
    getLdbIcons: (params) => {
      return axios.get('/api/ldbIcons', { params })
    },
    // 根据id获取 ldbIcon 详情
    getLdbIconById: (id) => {
      return axios.get(`/api/ldbIcon/${id}`)
    }
  }
}
