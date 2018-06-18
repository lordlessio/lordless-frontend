import contract from 'truffle-contract'
console.log('ldf', process.env.contract.ldbNFTCrowdsale.address, process.env.contract.erc20.address, process.env.contract.erc20)
export const ldbNFTCrowdsale = () => {
  if (typeof web3 === 'undefined') return
  const _contract = contract({
    abi: process.env.contract.ldbNFTCrowdsale.abi,
    address: process.env.contract.ldbNFTCrowdsale.address
  })
  _contract.setProvider(web3.currentProvider)
  return _contract.at(process.env.contract.ldbNFTCrowdsale.address)
}
export const erc20Token = () => {
  if (typeof web3 === 'undefined') return
  const _contract = contract({
    abi: process.env.contract.erc20.abi,
    address: process.env.contract.erc20.address
  })
  _contract.setProvider(web3.currentProvider)
  return _contract.at(process.env.contract.erc20.address)
}
