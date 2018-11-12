/**
 * user store options
 */

import { mutationTypes, actionTypes } from './types'
import { getUserByAddress, getUserByToken, getUserHome, login } from '../api'
import { stringifyParse, getObjStorage } from 'utils/tool'
import web3Store from './web3'
export default {
  namespaced: true,
  state: {

    userHome: {},

    // 当前用户
    userInfo: { default: true },

    // user single 用户信息
    uSingleInfo: {},

    // 用户是否过期
    userExpired: false
  },
  mutations: {

    // 存储 userInfo
    [mutationTypes.USER_SET_USER_INFO]: (state, payload = {}) => {
      state.userInfo = stringifyParse(payload)
    },

    // 修改 userInfo 信息
    [mutationTypes.USER_UPT_USER_INFO]: (state, payload = {}) => {
      state.userInfo = stringifyParse(Object.assign({}, state.userInfo, payload))
    },

    // 存储 single user Info
    [mutationTypes.USER_SET_SINGLE_USER_INFO]: (state, payload = {}) => {
      state.uSingleInfo = stringifyParse(Object.assign({}, state.uSingleInfo, payload))
    },

    // 存储用户sigStr信息
    [mutationTypes.USER_SET_USER_TOKEN]: (state, { address = state.userInfo.address, token = '' } = {}) => {
      if (!address) return

      address = address.toLocaleLowerCase()

      const tokenObj = getObjStorage()
      tokenObj[address] = token
      window.localStorage.setItem('lordless_tokens', JSON.stringify(tokenObj))
    },

    // 改变 userExpired 状态
    [mutationTypes.USER_SET_USER_EXPIRED]: (state, payload = true) => {
      state.userExpired = Boolean(payload)
    },

    // 存储 userHome 信息
    [mutationTypes.USER_SET_USER_HOME]: (state, { home, update = false } = {}) => {
      console.log('home', home)
      if (!update) state.userHome = stringifyParse(home)
      else state.userHome = home ? stringifyParse(Object.assign({}, state.userHome, home)) : {}
    }
  },
  actions: {

    /**
     * 根据用户id获取用户信息
     */
    [actionTypes.USER_SET_USER_BY_ADDRESS]: async ({ commit }, { address = '' }) => {
      address = address.toLocaleLowerCase()
      const res = await getUserByAddress(address)
      if (res.code === 1000) commit(mutationTypes.USER_SET_USERID_INFO, res.data)
      else {
        commit(mutationTypes.USER_SET_USER_INFO, {})
      }
    },

    /**
     * metaMask login
     */
    [actionTypes.USER_META_LOGIN]: ({ state, commit, dispatch }, { email, nickName, cb } = {}) => {
      const _address = window.localStorage.getItem('currentAddress')
      const { web3js, address = _address } = web3Store.state.web3Opt
      if (!address) return

      // 登陆
      const loginFunc = async (sigStr, addr) => {
        const res = await login({ sigStr, address: addr.toLocaleLowerCase(), email, nickName })
        if (res.code === 1000) {
          dispatch(actionTypes.USER_SET_USER_TOKEN, ({ address: addr, token: res.token }))
          await dispatch(actionTypes.USER_SET_USER_BY_TOKEN)
          cb && cb()
        }
      }
      // 取消 expired 状态
      commit(mutationTypes.USER_SET_USER_EXPIRED, false)
      const str = web3js.toHex('lordless')

      // 调起 metamask personal_sign 方法
      web3js.personal.sign(str, address, (err, result) => {
        if (!err) {
          if (result) loginFunc(result, address)
        } else {
          cb && cb(err)
        }
      })
    },

    /**
     * 根据token获取用户信息
     */
    [actionTypes.USER_SET_USER_BY_TOKEN]: async ({ state, commit }) => {
      // 根据token请求用户信息
      const res = await getUserByToken()
      if (res.code === 1000 && res.data) {
        commit(mutationTypes.USER_SET_USER_INFO, res.data)
        if (state.userExpired) commit(mutationTypes.USER_SET_USER_EXPIRED, false)
        return true
      }
      if (res.code === 9001 && res.errorMsg === 'jwt expired') {
        commit(mutationTypes.USER_SET_USER_EXPIRED, true)
        commit(mutationTypes.USER_SET_USER_INFO, {})
      } else {
        commit(mutationTypes.USER_SET_USER_INFO, { default: true })
      }
      commit(mutationTypes.USER_SET_USER_INFO)
      return false
    },

    // 用户 logout
    [actionTypes.USER_LOGOUT]: async ({ commit }, { reset = false } = {}) => {
      // commit(mutationTypes.USER_SET_USER_INFO, { default: true })
      if (reset) {
        commit(mutationTypes.USER_SET_USER_TOKEN)
        // await logout()
      }
      commit(mutationTypes.USER_SET_USER_INFO)
    },

    // 获取本地用户tokens
    [actionTypes.USER_GET_TOKEN_BY_ADDRESS]: ({ state }, address) => {
      if (!address) return null

      address = address.toLocaleLowerCase()
      return getObjStorage()[address]
    },

    // 存储 用户 token 到本地
    [actionTypes.USER_SET_USER_TOKEN]: ({ commit }, payload) => {
      commit(mutationTypes.USER_SET_USER_TOKEN, payload)
    },

    // 改变 user expired
    [actionTypes.USER_SET_USER_EXPIRED]: ({ commit }, payload) => {
      payload = Boolean(payload)
      commit(mutationTypes.USER_SET_USER_EXPIRED, payload)
    },

    // 改变用户ap
    [actionTypes.USER_UPT_USER_AP]: ({ commit, state }, ap) => {
      if (!ap) return
      commit(mutationTypes.USER_UPT_USER_INFO, { ap: state.userInfo.ap - ap })
    },

    /**
     * 根据token获取用户home
     */
    [actionTypes.USER_SET_USER_HOME]: async ({ commit }, { home, update = false } = {}) => {
      if (update) {
        commit(mutationTypes.USER_SET_USER_HOME, { home, update })
        return
      }
      const res = await getUserHome()
      if (res.code === 1000 && res.data) {
        commit(mutationTypes.USER_SET_USER_HOME, { home: res.data })
      } else commit(mutationTypes.USER_SET_USER_HOME)
    }
  }
}
