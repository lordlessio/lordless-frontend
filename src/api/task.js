module.exports = axios => {
  return {
    receiveTask: (params) => {
      return axios.post('/api/task', params)
    },
    // 根据id获取任务详情
    getTaskById: ({ taskId, opt }) => {
      return axios.get(`/api/task/${taskId}`, { opt })
    },

    // 根据 ldbId 或者 userId 获取任务
    getLdb2Round: (params) => {
      return axios.get('/api/listLdb2Round', { params })
    },

    // 根据条件获取最近完成的任务
    getApprovedTask: (params) => {
      return axios.get('/api/task/approved', { params })
    }
  }
}
