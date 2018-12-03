module.exports = axios => {
  return {
    // 根据条件获取 airdrops 列表
    getAirdrops: (params) => {
      return axios.get('/api/airdrops', { params })
    },
    // 根据 id 或者 airdropId 获取 airdrop 详情
    getAirdropDetail: (params) => {
      return axios.get('/api/airdrop/detail', { params })
    },
    // save airdropUser info
    saveAirdropUser: (params) => {
      return axios.post('/api/airdropUser', params)
    },
    // findOne airdropUser by params
    getAirdropUserInfo: (params) => {
      return axios.get('/api/airdropUser/detail', { params })
    }
  }
}
