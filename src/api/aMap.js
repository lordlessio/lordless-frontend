module.exports = axios => {
  return {
    // 根据 aMapid 查询aMap建筑详细信息
    getAMapDetail: (id) => {
      return axios.get(`/api/aMap/building/${id}`)
    },
    // 根据条件获取 aMap 建筑列表信息
    getAMapBuildings: (params) => {
      return axios.get('/api/aMap/buildings', { params })
    }
  }
}
