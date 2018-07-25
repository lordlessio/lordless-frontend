// generator getNetwork func
export const getNetwork = (web3js) => {
  return new Promise((resolve, reject) => {
    try {
      web3js.version.getNetwork((error, networkId) => {
        if (error) resolve({ error: error.message || 'Network error', networkId: 0 })
        else resolve({ networkId: parseInt(networkId) })
      })
    } catch (err) {
      resolve({ error: err.message || 'Network error', networkId: 0 })
    }
  })
}

// generator getCoinbase func
export const getCoinbase = (web3js) => {
  return new Promise((resolve, reject) => {
    try {
      web3js.eth.getCoinbase((error, coinbase) => {
        if (error) resolve({ error: error.message || 'Coinbase error', coinbase: '' })
        else resolve({ coinbase: (coinbase || '').toString() })
      })
    } catch (err) {
      resolve({ error: err.message || 'Coinbase error', coinbase: '' })
    }
  })
}

// get eth balance
export const getBalance = (web3js, address) => {
  return new Promise((resolve, reject) => {
    try {
      web3js.eth.getBalance(address, (error, balance) => {
        if (error) resolve({ balance: 0 })
        else resolve({ balance: parseInt(web3js.fromWei(balance.toNumber())) || 0 })
      })
    } catch (err) {
      resolve({ balance: 0 })
    }
  })
}
