
// 公用 contract 函数
const initContract = (json, web3js) => {
  if (!web3js || !web3js.eth) return
  // const _contract = contract(json)
  // _contract.defaults({
  //   from: account
  // })
  // _contract.setProvider(web3js.currentProvider)
  const _contract = web3js.eth.contract(json.abi)
  const contract = _contract.at(json.address)

  Object.defineProperty(contract, 'estimateGas', {
    value: (name, values) => {
      return new Promise((resolve, reject) => {
        contract[name].estimateGas(...values, (err, res) => {
          if (err) return resolve(0)
          return resolve(res)
        })
      })
    }
  })
  Object.defineProperty(contract, 'methods', {
    value: (name, values) => {
      return new Promise((resolve, reject) => {
        contract[name](...values, (err, res) => {
          if (err) return reject(err)
          return resolve(res)
        })
      })
    }
  })
  return contract
}

export const TavernNFTs = (web3js) => initContract(process.env.contract.TavernNFTs, web3js)
export const NFTsCrowdsale = (web3js) => initContract(process.env.contract.NFTsCrowdsale, web3js)
// export const Power = (web3js) => initContract(process.env.contract.Power, web3js)
// export const Building = (web3js) => initContract(process.env.contract.Building, web3js)

