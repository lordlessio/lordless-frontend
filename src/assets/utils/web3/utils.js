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
      // 设置 timeout
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ coinbase: '' })
      }, 30000)

      web3js.version.getNetwork((error, networkId) => {
        clearTimeout(timer)
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
      // 设置 timeout
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ coinbase: '' })
      }, 5000)

      web3js.eth.getCoinbase((error, coinbase) => {
        clearTimeout(timer)

        if (error) return resolve({ error: error.message || 'Coinbase error', coinbase: '' })
        resolve({ coinbase: (coinbase || '').toString() })
      })
    } catch (err) {
      resolve({ error: err.message || 'Coinbase error', coinbase: '' })
    }
  })
}

// generator getAccount func
export const getAccount = (web3js) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (web3js.eth.defaultAccount || web3js.eth.accounts.length) {
        resolve({ account: web3js.eth.defaultAccount || web3js.eth.accounts[0] })
        return
      }

      if (window.ethereum) {
        const accounts = await window.ethereum.enable()
        resolve({ account: accounts[0] })
        return
      }

      // 设置 timeout
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ account: '' })
      }, 5000)

      web3js.eth.getAccounts((error, accounts) => {
        clearTimeout(timer)

        let account = accounts[0]
        if (!account) account = web3js.eth.defaultAccount || ''

        if (error) return resolve({ error: error.message || 'Account error', account: '' })
        resolve({ account })
      })
    } catch (err) {
      resolve({ error: err.message || 'Coinbase error', account: '' })
    }
  })
}

// generator getGasPrice func
export const getGasPrice = (web3js) => {
  return new Promise((resolve, reject) => {
    try {
      // 设置 timeout,有些账号获取 gasPrice 会一直不返回，所以需要设置 timeout
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ account: '' })
      }, 5000)

      web3js.eth.getGasPrice((error, gasPrice) => {
        clearTimeout(timer)

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
  if (!address) address = web3js.eth.defaultAccount
  return new Promise((resolve, reject) => {
    try {
      if (!address) return resolve({ balance: 0 })

      // 设置 timeout 有些账号获取 getBalance 会一直不返回，所以需要设置 timeout
      const timer = setTimeout(() => {
        clearTimeout(timer)
        resolve({ account: '' })
      }, 5000)

      web3js.eth.getBalance(address, (error, balance) => {
        clearTimeout(timer)

        if (error) return resolve({ error: error.message || 'balance error', balance: 0 })
        resolve({ balance: balance ? balance.toNumber() : 0 })
      })
    } catch (err) {
      resolve({ error: err.message || 'balance error', balance: 0 })
    }
  })
}
