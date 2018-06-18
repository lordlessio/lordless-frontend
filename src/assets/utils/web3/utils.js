// generator getNetwork func
export const getNetwork = (web3js) => {
  return new Promise((resolve, reject) => {
    web3js.version.getNetwork((error, networkId) => {
      if (error) resolve({ error: error.message || 'Network error', networkId: 0 })
      else resolve({ networkId: parseInt(networkId) })
    })
  })
}

// generator getCoinbase func
export const getCoinbase = (web3js) => {
  return new Promise((resolve, reject) => {
    web3js.eth.getCoinbase((error, coinbase) => {
      if (error) resolve({ error: error.message || 'Coinbase error', coinbase: '' })
      else resolve({ coinbase: (coinbase || '').toString() })
    })
  })
}
