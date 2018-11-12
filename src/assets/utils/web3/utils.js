import store from '@/store'
import { actionTypes } from '@/store/types'

export const initStorageUser = (account) => {
  // 获取本地缓存中的 currentAddress
  const currentAddress = window.localStorage.getItem('currentAddress')

  // 如果 currentAddress 不等于当前地址，更改 currentAddress
  if (account && currentAddress !== account) {
    window.localStorage.setItem('currentAddress', account)
    // 获取本地用户
    store.dispatch(`user/${actionTypes.USER_SET_USER_BY_TOKEN}`)
  }
}

// generator getNetwork func
export const getNetwork = (web3js) => {
  return new Promise((resolve, reject) => {
    try {
      web3js.version.getNetwork((error, networkId) => {
        if (error) return resolve({ error: error.message || 'Network error', networkId: 0 })
        resolve({ networkId: parseInt(networkId) })
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
        if (error) return resolve({ error: error.message || 'Coinbase error', coinbase: '' })
        resolve({ coinbase: (coinbase || '').toString() })
      })
    } catch (err) {
      resolve({ error: err.message || 'Coinbase error', coinbase: '' })
    }
  })
}

// generator getGasPrice func
export const getGasPrice = (web3js) => {
  return new Promise((resolve, reject) => {
    try {
      web3js.eth.getGasPrice((error, gasPrice) => {
        if (error) return resolve({ error: error.message || 'gasPrice error', gasPrice: 0 })
        resolve({ gasPrice: gasPrice ? gasPrice.toNumber() : 0 })
      })
    } catch (err) {
      resolve({ error: err.message || 'getGasPrice error', gasPrice: 0 })
    }
  })
}

// get eth balance
export const getBalance = (web3js, address) => {
  return new Promise((resolve, reject) => {
    try {
      if (!address) return resolve({ balance: 0 })
      web3js.eth.getBalance(address, (error, balance) => {
        if (error) return resolve({ error: error.message || 'balance error', balance: 0 })
        resolve({ balance: balance ? balance.toNumber() : 0 })
      })
    } catch (err) {
      resolve({ error: err.message || 'balance error', balance: 0 })
    }
  })
}
