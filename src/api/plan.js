module.exports = axios => {
  return {

    // 获取 planBase 信息
    getPlanBases: () => {
      return axios.get('/api/planBases')
    },

    // 根据 planBaseId 获取 planBase 详情
    getPlanBaseDetail: (params) => {
      return axios.get('/api/planBase/detail', { params })
    },

    // 根据 user token 获取 该用户的 plans
    getPlansByToken: (params) => {
      return axios.get('/api/plans/byToken', { params })
    },

    // 根据 planId 获取 plan 详情
    getPlanById: (params) => {
      return axios.get('/api/plan/detail', { params })
    },

    // 用户 growHops
    saveGrowHopsPlan: (params) => {
      return axios.post('/api/plan/growHops', params)
    }
  }
}
