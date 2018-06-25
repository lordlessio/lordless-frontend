module.exports = axios => {
  return {

    // 根据 query 查询 mapbox 建筑信息
    getPoiInfos: (params) => {
      return axios.get('/api/mapbox/poi', { params })
    }
  }
}
