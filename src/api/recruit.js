module.exports = axios => {
  return {
    getRecruitUserHome: (params) => {
      return axios.get('/api/recruit/userHome', { params })
    }
  }
}
