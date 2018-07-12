
/**
 * user store options
 */

import { mutationTypes, actionTypes } from './types'
import { getUserById } from 'api'
import { stringifyParse, getObjStorage } from 'utils/tool'
import web3Store from './web3'
export default {
  namespaced: true,
  state: {

    // 当前所有登陆过的用户
    users: {
      '0x4cd98f82decade2d152e256efd1f8d5a334a3e28': {
        address: '0x4cd98f82decade2d152e256efd1f8d5a334a3e28',
        created_at: '2018-06-12T08:54:13.426Z',
        nickName: 'LORD',
        update_at: '2018-06-12T08:54:13.426Z',
        _id: '5b1f8a352b97c33ed98d64e6'
      },
      '0xe4e891aa1ab36661fcfff8062267787ccaacd8af': {
        address: '0xe4e891aa1ab36661fcfff8062267787ccaacd8af',
        created_at: '2018-06-12T08:54:13.426Z',
        nickName: 'LESS',
        update_at: '2018-06-12T08:54:13.426Z',
        _id: '5b1f8a352b97c33ed98d64e6'
      }
    },

    // 当前用户
    userInfo: { default: true },

    // uid 用户信息
    uidInfo: {},

    // 用户是否过期
    userExpired: false
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

      // 测试
      window.userInfo = stringifyParse(payload)
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
    },

    // 改变 userExpired 状态
    [mutationTypes.USER_SET_USER_EXPIRED]: (state, payload = true) => {
      state.userExpired = Boolean(payload)
    }
  },
  actions: {
    /**
     * 根据用户id获取用户信息
     */
    [actionTypes.USER_SET_USER_BY_ID]: async ({ commit }, { uid, address }) => {
      const res = await getUserById({ uid, address })
      if (res.code === 1000) commit(mutationTypes.USER_SET_USERID_INFO, res.data)
      else {
        commit(mutationTypes.USER_SET_USER_INFO, {})
      }
    },

    /**
     * metaMask login
     */
    [actionTypes.USER_META_LOGIN]: ({ state, commit, dispatch }) => {
      const { web3js, address } = web3Store.state.web3Opt
      if (!address) return

      // 登陆
      // const loginFunc = async (sigStr, addr) => {
      //   const res = await login({ sigStr, address: addr })
      //   if (res.code === 1000) {
      //     dispatch(actionTypes.USER_SET_USER_TOKEN, ({ address: addr, token: res.token }))
      //     dispatch(actionTypes.USER_SET_USER_BY_TOKEN)
      //   }
      // }
      // 取消 expired 状态
      commit(mutationTypes.USER_SET_USER_EXPIRED, false)
      const str = web3js.toHex('lordless')

      // 调起 metamask personal_sign 方法
      web3js.personal.sign(str, web3js.eth.defaultAccount, async (err, result) => {
        if (!err) {
          if (result) {
            dispatch(actionTypes.USER_SET_USER_BY_TOKEN, ({ address }))
          }
        }
      })
    },

    /**
     * 根据token获取用户信息
     * @param {Object} obejct 包含两个参数：address, update
     * @param address: 代表当前请求用户的address
     * @param update: 代表当前请求是否属于更新用户信息
     */
    [actionTypes.USER_SET_USER_BY_TOKEN]: async ({ state, commit }, { address, update } = {}) => {
      // 如果 state[address], 代表此用户数据已存在，不需要继续请求接口
      if (!update && state.users[address]) {
        commit(mutationTypes.USER_SET_USER_INFO, state.users[address])
        return
      }

      // 根据token请求用户信息
      // const res = await getUserByToken()
      // if (res.code === 1000) {
      //   commit(mutationTypes.USER_SET_USERS, res.data)
      //   commit(mutationTypes.USER_SET_USER_INFO, res.data)
      //   if (state.userExpired) commit(mutationTypes.USER_SET_USER_EXPIRED, false)
      // } else {
      //   if (res.code === 9001 && res.errorMsg === 'jwt expired') commit(mutationTypes.USER_SET_USER_EXPIRED, true)
      //   commit(mutationTypes.USER_SET_USER_INFO, { default: true })
      // }
      return true
    },

    // user logout
    [actionTypes.USER_LOGOUT]: async ({ commit }) => {
      commit(mutationTypes.USER_SET_USER_INFO, { default: true })
    },

    // 获取本地用户tokens
    [actionTypes.USER_GET_TOKEN_BY_ADDRESS]: ({ state }, address) => {
      return getObjStorage()[address]
    },

    // 存储 用户 token 到本地
    [actionTypes.USER_SET_USER_TOKEN]: ({ commit }, payload) => {
      commit(mutationTypes.USER_SET_USER_TOKEN, payload)
    }
  }
}
