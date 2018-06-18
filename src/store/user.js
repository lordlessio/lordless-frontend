
/**
 * user store options
 */

import { mutationTypes, actionTypes } from './typeNames/user'
import { getUserById, getUserByToken } from 'api'
import { stringifyParse, getObjStorage } from 'utils/tool'
export default {
  namespaced: true,
  state: {
    userInfo: { default: true },
    uidInfo: {}
  },
  mutations: {

    // 存储 userInfo
    [mutationTypes.USER_SET_USER_INFO]: (state, payload) => {
      state.userInfo = stringifyParse(payload)
    },

    // 存储 uidInfo
    [mutationTypes.USER_SET_USERID_INFO]: (state, payload) => {
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
      if (res.code === 1000) commit(mutationTypes.USER_SET_USER_INFO, res.data)
      else {
        commit(mutationTypes.USER_SET_USER_INFO, {})
      }
    },

    // 根据token获取用户信息
    [actionTypes.USER_SET_USER_BY_TOKEN]: async ({ commit }) => {
      const res = await getUserByToken()
      if (res.code === 1000) commit(mutationTypes.USER_SET_USER_INFO, res.data)
      else {
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
