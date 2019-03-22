module.exports = axios => {
  return {
    getRecruitsByTavernId: (params) => {
      return axios.get(`/api/recruits/${params.tavernId}`, { params })
    },
    getRecruitUserHome: (params) => {
      return axios.get('/api/recruit/userHome', { params })
    }
  }
}
