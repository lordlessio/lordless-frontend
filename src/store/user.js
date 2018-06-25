
/**
 * user store options
 */

import { mutationTypes, actionTypes } from './types'
import { getUserById, getUserByToken } from 'api'
import { stringifyParse, getObjStorage } from 'utils/tool'
export default {
  namespaced: true,
  state: {

    // 当前所有登陆过的用户
    users: {},

    // 当前用户
    userInfo: { default: true },

    // uid 用户信息
    uidInfo: {}
  },
  mutations: {

    // 存储 users
    [mutationTypes.USER_SET_USERS]: (state, payload = {}) => {
      const address = payload.address
      if (!address) return

      state.users[address] = stringifyParse(payload)
    },

    // 存储 userInfo
    [mutationTypes.USER_SET_USER_INFO]: (state, payload = {}) => {
      state.userInfo = stringifyParse(payload)
    },

    // 存储 uidInfo
    [mutationTypes.USER_SET_USERID_INFO]: (state, payload = {}) => {
      state.uidInfo = stringifyParse(payload)
    },

    // 存储用户sigStr信息
    [mutationTypes.USER_SET_USER_TOKEN]: (state, { address, token = '' } = {}) => {
      if (!address) return
      const tokenObj = getObjStorage()
      tokenObj[address] = token
      window.localStorage.setItem('lordless_tokens', JSON.stringify(tokenObj))
    }
  },
  actions: {
    // 根据用户id获取用户信息
    [actionTypes.USER_SET_USER_BY_ID]: async ({ commit }, { uid, address }) => {
      const res = await getUserById({ uid, address })
      if (res.code === 1000) commit(mutationTypes.USER_SET_USERID_INFO, res.data)
      else {
        commit(mutationTypes.USER_SET_USER_INFO, {})
      }
    },

    /**
     * 根据token获取用户信息
     * @param {Object} obejct 包含两个参数：address, update
     * @param address: 代表当前请求用户的address
     * @param update: 代表当前请求是否属于更新用户信息
     */
    [actionTypes.USER_SET_USER_BY_TOKEN]: async ({ state, commit }, { address, update } = {}) => {
      // 如果 state[address], 代表此用户数据已存在，不需要继续请求接口
      if (!update && state[address]) {
        commit(mutationTypes.USER_SET_USER_INFO, state[address])
        return
      }

      // 根据token请求用户信息
      const res = await getUserByToken()
      if (res.code === 1000) {
        commit(mutationTypes.USER_SET_USERS, res.data)
        commit(mutationTypes.USER_SET_USER_INFO, res.data)
      } else {
        commit(mutationTypes.USER_SET_USER_INFO, { default: true })
      }
      return true
    },

    // user logout
    [actionTypes.USER_LOGOUT]: async ({ commit }) => {
      commit(mutationTypes.USER_SET_USER_INFO, { default: true })
    },

    // 获取本地用户 sigs
    [actionTypes.USER_GET_TOKEN_BY_ADDRESS]: ({ state }, address) => {
      return getObjStorage()[address]
    },

    // 存储 localUserSig
    [actionTypes.USER_SET_USER_TOKEN]: ({ commit }, payload) => {
      commit(mutationTypes.USER_SET_USER_TOKEN, payload)
    }
  }
}
