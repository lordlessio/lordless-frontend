module.exports = axios => {
  return {
    // 根据条件获取 taskType 列表信息
    getTaskTypes: (params) => {
      return axios.get('/api/taskTypes', { params })
    },
    // 根据id获取 taskType 详情
    getTaskTypeById: (id) => {
      return axios.get(`/api/taskType/${id}`)
    }
  }
}
