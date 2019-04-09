module.exports = axios => {
  return {

    // 获取 hunterTaskType 列表信息
    getHunterTaskTypes: (params) => {
      return axios.get('/api/hunterTaskTypes', { params })
    },

    // 根据条件获取 hunterTask 列表信息
    getHunterTasksByUser: (params) => {
      return axios.get('/api/hunterTasks', { params })
    },

    // 根据条件获取 hunterTask 列表信息
    checkHunterTask: (params) => {
      return axios.get('/api/hunterTask/check', { params })
    }
  }
}
