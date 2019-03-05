module.exports = axios => {
  return {
    getActivityTasks: (params) => {
      return axios.get('/api/activityTasks', { params })
    }
  }
}
