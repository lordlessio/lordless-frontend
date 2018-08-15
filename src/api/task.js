module.exports = axios => {
  return {
    // 根据id获取任务详情
    getTaskById: ({ taskId, opt }) => {
      return axios.get(`/api/tasks/${taskId}`, { opt })
    },

    // 根据id获取 taskType 详情
    getLdb2Round: (params) => {
      return axios.get('/api/listLdb2Round', params)
    }
  }
}
