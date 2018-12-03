module.exports = axios => {
  return {
    // 根据条件获取 candy 列表信息
    getCandies: (params) => {
      return axios.get('/api/candies', { params })
    },
    // 根据条件获取 candy 详情
    getCandyDetail: (id) => {
      return axios.get(`/api/candy/${id}`)
    },
    // 获取糖果价格
    getCandyPrice: () => {
      return axios.get('/api/candy/price')
    },
    // 获取糖果 claimed
    getCandyClaimed: () => {
      return axios.get('/api/candy/claimed')
    }
  }
}
