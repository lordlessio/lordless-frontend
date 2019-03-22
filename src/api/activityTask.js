module.exports = axios => {
  return {
    getActivityTasks: (params) => {
      return axios.get('/api/activityTasks', { params })
    },
    getTavernCommissions: (params) => {
      return axios.get('/api/activityTask/commissions', { params })
    }
  }
}
