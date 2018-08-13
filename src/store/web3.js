/**
 * web3 store options
 */

import { mutationTypes, actionTypes } from './types'
import { objectType, stringifyParse } from 'utils/tool'
export default {
  namespaced: true,
  state: {
    web3Opt: {
      balance: 0,
      gasPrice: 0,
      address: null,
      coinbase: null,
      error: null,
      web3js: { default: true },
      isInjected: false,
      networkId: null
    },
    defaultWeb3Opt: {

      // eth 余额
      balance: 0,

      // 地址
      address: null,

      // coinbase 地址
      coinbase: null,

      // 错误信息
      error: null,

      // web3 实例
      web3js: { default: true },

      // 是否注入了web3
      isInjected: false,

      // 网络网段
      networkId: null
    }
  },
  mutations: {

    // set web3 info mutation
    [mutationTypes.WEB3_SET_WEB3_INFO] (state, payload = {}) {
      if (objectType(payload)[0] !== 'object') return
      state.web3Opt = Object.assign({}, state.web3Opt, payload)
      window.web3Opt = Object.assign({}, state.web3Opt, payload)
    }
  },
  actions: {

    // set web3 info action
    [actionTypes.WEB3_SET_WEB3_INFO] ({ commit }, payload) {
      commit(mutationTypes.WEB3_SET_WEB3_INFO, payload)
    },

    // 重置或修改 web3Opt
    [actionTypes.WEB3_RESET_OR_UPDATE_WEB3] ({ commit, state }, payload = stringifyParse(state.defaultWeb3Opt)) {
      if (objectType(payload)[0] !== 'object') return
      commit(mutationTypes.WEB3_SET_WEB3_INFO, payload)
    }
  }
}
