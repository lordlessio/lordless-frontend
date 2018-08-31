module.exports = axios => {
  return {

    // 根据条件获取 regions 列表信息
    getRegions: (params) => {
      return axios.get('/api/regions', { params })
    },

    // 根据id获取 region 详情
    getRegionById: (id) => {
      return axios.get(`/api/region/${id}`)
    }
  }
}
