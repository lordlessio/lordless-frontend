module.exports = axios => {
  return {

    // 新建 activity 实例
    postActivity: (params) => {
      return axios.post('/api/activity', params)
    },

    // 根据 tx 查询所属合约
    getActivityByTx: ({ tx, opt }) => {
      return axios.get(`/api/activity/${tx}`, { params: opt })
    },

    // 根据 userId 查询所属合约
    getActivitysByUser: ({ user, opt }) => {
      return axios.get(`/api/activity/listByUser/${user}`, { params: opt })
    },

    // 根据 tokenId 查询所属合约
    getActivitysByTokenId: ({ tokenId, opt }) => {
      return axios.get(`/api/activity/listByTokenId/${tokenId}`, { params: opt })
    },

    // 根据 tokenId 查询用户 pending 状态
    getUserPendingsByTokenId: (params) => {
      return axios.get('/api/activity/userPendings', { params })
    },

    getRecords: (params) => {
      return axios.get('/api/activity/records', { params })
    }
  }
}
