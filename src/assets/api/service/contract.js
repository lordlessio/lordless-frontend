const contract = require('truffle-contract')

export function ldbNFTCrowdsale () {
  const _contract = contract({
    abi: process.env.contract.ldbNFTCrowdsale.abi,
    address: process.env.contract.ldbNFTCrowdsale.address
  })
  _contract.setProvider(web3.currentProvider)
  return _contract.at(process.env.contract.ldbNFTCrowdsale.address)
}
export function erc20Token () {
  const _contract = contract({
    abi: process.env.contract.erc20.abi,
    address: process.env.contract.erc20.address
  })
  _contract.setProvider(web3.currentProvider)
  return _contract.at(process.env.contract.erc20.address)
}
