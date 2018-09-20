import store from '@/store'
import { getNetwork, getCoinbase, getBalance, getGasPrice } from './utils'
import { actionTypes } from '@/store/types'

export const monitorWeb3 = () => {
  // const APPROVED_NETWORKID = '5777'
  const { web3Opt } = store.state.web3
  let { balance, gasPrice, coinbase, networkId, web3js, error } = web3Opt

  const checkWeb3 = async () => {
    /**
     * check balance
     */
    const balanceRes = (await getBalance(web3js, coinbase)) || {}
    if (balanceRes.balance !== balance) {
      balance = balanceRes.balance
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { balance: balanceRes.balance || 0 })
    }

    const gasPriceRes = (await getGasPrice(web3js)) || {}
    if (gasPriceRes.gasPrice !== gasPrice) {
      gasPrice = gasPriceRes.gasPrice
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { gasPrice: gasPriceRes.gasPrice || 0 })
    }

    /**
     * check network
     */
    const nRes = await getNetwork(web3js)

    if (nRes.error) {
      error = nRes.error
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: nRes.error })
      return
    }

    const newNetworkId = nRes.networkId

    // 如果切换了网络, 修改 web3Opt
    if ((newNetworkId && newNetworkId !== networkId) || (!newNetworkId && networkId)) {
      networkId = newNetworkId
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { networkId })
      return
    }

    /**
     * check coinbase
     */
    const cRes = await getCoinbase(web3js)

    if (cRes.error) {
      error = cRes.error
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: nRes.error })
      return
    }

    const newCoinbase = cRes.coinbase

    // 如果logout metamask 或者切换 metamask 账号，退出登陆
    if ((newCoinbase !== coinbase)) {
      console.log('coinbase', coinbase, newCoinbase)
      coinbase = newCoinbase

      // 修改 web3Opt
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { coinbase: newCoinbase.toString(), address: newCoinbase.toString() })

      // 用户登出
      store.dispatch(`user/${actionTypes.USER_LOGOUT}`)

      // 如果 newCoinbase 存在，则证明是切换账号，或重新登陆
      if (newCoinbase) {
        window.localStorage.setItem('currentAddress', newCoinbase)
        // 重新获取用户信息
        store.dispatch(`user/${actionTypes.USER_SET_USER_BY_TOKEN}`)

        // 重新初始化合约
        store.dispatch(`contract/${actionTypes.CONTRACT_INIT_INSTANCE}`, { monitor: true })
      } else {
        // 如果退出登陆，重置合约
        store.dispatch(`contract/${actionTypes.CONTRACT_RESET_INSTANCE}`)
      }
    }

    // 如果流程完成，但是 error 还存在，清除 error
    if (error) {
      error = null
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: null })
    }
  }

  let nowt
  const loopStep = async (timestamp) => {
    if (!nowt) nowt = timestamp
    if (timestamp - nowt > 1000) {
      console.time('loopStep')
      await checkWeb3()
      console.timeEnd('loopStep')
      nowt = timestamp
    }
    return window.requestAnimationFrame(loopStep)
  }
  return window.requestAnimationFrame(loopStep)
}
