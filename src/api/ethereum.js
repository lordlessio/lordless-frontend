module.exports = axios => {
  return {

    // 根据条件获取 tx 列表信息
    getTxs: (params) => {
      return axios.get('/api/txs', { params })
    },

    // 根据 tokenId 获取交易记录
    getTxsByTokenId: (params) => {
      return axios.get(`/api/tx/${params.tokenId}/records`, { params })
    },

    // 根据参数获取 用户 tx 状态
    getTxStatus: (params) => {
      return axios.get('/api/tx/status', { params })
    },

    // 根据 tx 或 id 获取详情
    getTxDetail: (params) => {
      return axios.get('/api/tx', { params })
    }
  }
}
