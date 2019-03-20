
// 公用 contract 函数
export const initContract = (json, web3js) => {
  return new Promise(resolve => {
    if (!web3js || !web3js.eth) return resolve(null)
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
            console.log('err', err)
            if (err) return resolve(0)
            return resolve(res)
          })
        })
      }
    })
    Object.defineProperty(contract, 'methods', {
      value: (name, values = []) => {
        return new Promise((resolve, reject) => {
          contract[name](...values, (err, res) => {
            if (err) return reject(err)
            return resolve(res)
          })
        })
      }
    })
    return resolve(contract)
  })
}

export const TavernNFTs = (web3js) => {
  return initContract(process.env.contract.TavernNFTs, web3js)
}
export const NFTsCrowdsale = (web3js) => {
  return initContract(process.env.contract.NFTsCrowdsale, web3js)
}
export const Airdrop = (web3js) => {
  return initContract(process.env.contract.Airdrop, web3js)
}

export const Luckyblock = (web3js) => {
  return initContract(process.env.contract.Luckyblock, web3js)
}

export const HOPSPlan = (web3js) => {
  return initContract(process.env.contract.HOPSPlan, web3js)
}

export const GrowHopsPlus = (web3js) => {
  return initContract(process.env.contract.GrowHopsPlus, web3js)
}

export const Bounty = (web3js) => {
  return initContract(process.env.contract.Bounty, web3js)
}

export const BountyNFT = (web3js) => {
  return initContract(process.env.contract.BountyNFT, web3js)
}

export const Referer = (web3js) => {
  return initContract(process.env.contract.Referer, web3js)
}

export const Recruited = (web3js) => {
  return initContract(process.env.contract.Recruited, web3js)
}
// export const Power = (web3js) => initContract(process.env.contract.Power, web3js)
// export const Building = (web3js) => initContract(process.env.contract.Building, web3js)
