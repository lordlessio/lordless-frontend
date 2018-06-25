import store from '@/store'
import { getNetwork, getCoinbase } from './utils'
import { actionTypes } from '@/store/types'

export const monitorWeb3 = () => {
  // const APPROVED_NETWORKID = '5777'
  const { web3Opt } = store.state.web3
  let { coinbase, networkId, web3js, error } = web3Opt
  return setInterval(async () => {
    /**
     * check network
     */
    const nRes = await getNetwork(web3js)

    if (nRes.error) {
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: nRes.error })
      return
    }

    const newNetworkId = nRes.networkId

    // 如果切换了网络, 修改 web3Opt
    if ((newNetworkId && newNetworkId !== networkId) || (!newNetworkId && networkId)) {
      networkId = newNetworkId
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { networkId: newNetworkId })
      return
    }

    /**
     * check coinbase
     */
    const cRes = await getCoinbase(web3js)

    if (cRes.error) {
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: nRes.error })
      return
    }

    const newCoinbase = cRes.coinbase

    // 如果logout metamask 或者切换 metamask 账号，退出登陆
    if ((newCoinbase !== coinbase)) {
      console.log('coinbase', coinbase, newCoinbase)
      coinbase = newCoinbase
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { coinbase: newCoinbase.toString(), address: newCoinbase.toString() })
      store.dispatch(`user/${actionTypes.USER_LOGOUT}`)

      // 如果 newCoinbase 存在，则证明是切换账号，或重新登陆，重新获取用户信息
      if (newCoinbase) store.dispatch(`user/${actionTypes.USER_SET_USER_BY_TOKEN}`)
    }

    // 如果流程完成，但是 error 还存在，清除 error
    if (error) {
      store.dispatch(`web3/${actionTypes.WEB3_RESET_OR_UPDATE_WEB3}`, { error: null })
    }
  }, 600)
}
