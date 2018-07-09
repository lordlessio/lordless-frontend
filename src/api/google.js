module.exports = axios => {
  return {

    // 根据 input 获取 google 信息列表
    getGoogleInfos: (params) => {
      return axios.get('/api/google/list', { params })
    }
  }
}
