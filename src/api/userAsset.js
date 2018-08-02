module.exports = axios => {
  return {

    // 根据用户地址获取该用户账户信息
    getAssetsByAddress: (address) => {
      return axios.get(`/api/userAssets/${address}`)
    },

    // 根据条件获取账户信息
    getAssets: (params) => {
      return axios.get('/api/userAssets', { params })
    }
  }
}
