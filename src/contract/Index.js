const contract = require('truffle-contract')
// console.log('ldf', process.env.contract.ldbNFTCrowdsale.address, process.env.contract.erc20.address, process.env.contract.erc20)
console.log('process.env.contract', process.env.contract)
module.exports = (web3js, account) => {
  // 公用 contract 函数
  const initContract = (json) => {
    if (!web3js) return
    const _contract = contract(json)
    _contract.defaults({
      from: account
    })
    _contract.setProvider(web3js.currentProvider)
    return _contract.at(json.address)
  }

  return {
    LDBNFTs: () => {
      return initContract(process.env.contract.LDBNFTs)
    },

    NFTsCrowdsale: () => {
      return initContract(process.env.contract.NFTsCrowdsale)
    },

    Power: () => {
      return initContract(process.env.contract.Power)
    },

    Building: () => {
      return initContract(process.env.contract.Building)
    }
  }
}
