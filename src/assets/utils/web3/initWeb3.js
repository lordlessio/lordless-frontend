'use strict'

import store from '@/store'
import { initStorageUser, getNetwork, getCoinbase, getBalance, getGasPrice } from './utils'
import { monitorWeb3 } from './monitorWeb3'
import { actionTypes } from '@/store/types'

// 初始化 web3js
export const initWeb3 = async (callback) => {
  const res = await checkWeb3()
  console.log('init web3 web3Opt:', res)

  // 注册 web3 状态
  await store.dispatch(`web3/${actionTypes.WEB3_SET_WEB3_INFO}`, res)

  // 注册合约
  store.dispatch(`contract/${actionTypes.CONTRACT_INIT_INSTANCE}`)

  if (res.error) return callback ? callback(res) : res

  // 监听 web3 动态
  monitorWeb3(res)

  return callback ? callback(res) : res
}

const checkWeb3 = async () => {
  const res = {
    loading: true,
    error: null,
    web3js: { default: true },
    isConnected: false,
    balance: 0,
    gasPrice: 0,
    networkId: '',
    coinbase: '',
    address: ''
  }

  // check web3 instance
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    const web3js = new Web3(web3.currentProvider)

    res.web3js = web3js
    res.isConnected = web3js.isConnected()
    res.address = web3js.eth.defaultAccount || web3.eth.accounts[0]

    // 初始化 localStorage currentAddress
    initStorageUser(web3js.eth.defaultAccount)

    // // 获取本地缓存中的 currentAddress
    // const currentAddress = window.localStorage.getItem('currentAddress')

    // // 如果 currentAddress 不等于当前地址，更改 currentAddress
    // if (web3js.eth.defaultAccount && currentAddress !== web3js.eth.defaultAccount) {
    //   window.localStorage.setItem('currentAddress', web3js.eth.defaultAccount)
    //   // 获取本地用户
    //   store.dispatch(`user/${actionTypes.USER_SET_USER_BY_TOKEN}`)
    // }

    // 测试使用
    // window.web3js = web3js
  } else {
    res.web3js = { default: false, unlocked: true }
    res.error = 'Unable to connect Web3'
    res.loading = false
    return res
    // console.log('No web3? You should consider trying MetaMask!')
    // // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  }

  console.time('web3 init')
  // check network
  try {
    await Promise.all(
      [
        getNetwork(res.web3js)
          .then(({ error, networkId }) => {
            if (error) {
              res.error = error
            }
            res.networkId = networkId
          }),
        getCoinbase(res.web3js)
          .then(({ error, coinbase }) => {
            if (error) {
              res.error = error
            }
            res.coinbase = coinbase
            res.address = coinbase || res.web3js.eth.defaultAccount
          }),

        getGasPrice(res.web3js)
          .then(({ error, gasPrice }) => {
            if (error) {
              res.error = error
            }
            res.gasPrice = gasPrice
          }),

        getBalance(res.web3js, res.address)
          .then(({ error, balance }) => {
            if (error) {
              res.error = error
            }
            res.balance = balance
          })
      ]
    )
  } catch (err) {
    console.log(' init web3 error', err)
  }

  res.loading = false
  // const networkRes = await getNetwork(res.web3js)
  console.timeEnd('web3 init')
  return res
}
