module.exports = axios => {
  return {
    // 根据条件获取 candy 列表信息
    getCandies: (params) => {
      return axios.get('/api/candies', { params })
    },
    // 根据条件获取 candy 详情
    getCandyDetail: (id) => {
      return axios.get(`/api/candy/${id}`)
    }
  }
}
