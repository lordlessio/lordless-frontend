module.exports = axios => {
  return {

    // 获取 planBase 信息
    getPlanBases: (params) => {
      return axios.get('/api/planBases', { params })
    },

    // 根据 planBaseId 获取 planBase 详情
    getPlanBaseDetail: (params) => {
      return axios.get('/api/planBase/detail', { params })
    },

    // 根据 user token 获取 该用户的 plans
    getPlansByToken: (params) => {
      return axios.get('/api/plans', { params })
    },

    // 根据 user token 获取 该用户的 plan records
    getPlanRecordssByToken: (params) => {
      return axios.get('/api/plan/records', { params })
    },

    // 根据 planId 获取 plan 详情
    getPlanById: (params) => {
      return axios.get('/api/plan/detail', { params })
    },

    // 用户 growHops
    saveGrowHopsPlan: (params) => {
      return axios.post('/api/plan/growHops', params)
    },

    // 用户提取 less
    withdrawLessPlan: (params) => {
      return axios.put('/api/plan/withdraw', params)
    },

    // 获取用户 boosts
    getPlanBoosts: (params) => {
      return axios.get('/api/plan/boosts', params)
    }
  }
}
