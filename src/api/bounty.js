module.exports = axios => {
  return {

    // 根据用户 获取 bounties 列表
    getBountiesByUser: (params) => {
      return axios.get('/api/bounties', { params })
    },

    // 根据 bountyId 获取 bounty 详情
    getBountyDetail: (params) => {
      return axios.get('/api/bounty/detail', { params })
    },

    // 获取当前用户的 withdraw info
    getBountyInfos: (params) => {
      return axios.get('/api/bounty/infos', { params })
    },

    // 用户打包 bounty
    packageBounty: (params) => {
      return axios.post('/api/bounty/package', params)
    },

    // 用户开启 bounty
    openBounty: (params) => {
      return axios.put('/api/bounty/open', params)
    }
  }
}
