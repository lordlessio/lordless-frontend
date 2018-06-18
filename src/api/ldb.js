module.exports = axios => {
  return {
    // 根据条件获取链上的建筑信息
    getChainLdbs: (params) => {
      return axios.get('/api/ldbs/on', { params })
    },
    // 根据 aMapid 或 id 查询建筑详细信息
    getLdbById: (params) => {
      return axios.get('/api/ldb/detail', { params })
    },
    // 根据 id 修改建筑信息
    updateLdb: params => {
      return axios.put('/api/ldb/update', params)
    }
  }
}
