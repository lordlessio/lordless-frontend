
import { getUserById, getUserByToken, logout } from 'api'
import { stringifyParse } from '@/assets/utils/tool'
export default {
  namespaced: true,
  state: {
    userInfo: { default: true },
    uidInfo: {}
  },
  mutations: {
    SET_USER_INFO: (state, payload) => {
      state.userInfo = stringifyParse(payload)
    },
    SET_USERID_INFO: (state, payload) => {
      state.uidInfo = stringifyParse(payload)
    }
  },
  actions: {
    // 根据token获取用户信息
    GET_USER_BY_TOKEN: async ({ commit, state }) => {
      const res = await getUserByToken()
      if (res.code === 1000) commit('SET_USER_INFO', res.data)
      else {
        commit('SET_USER_INFO', { default: true })
        await logout()
      }
    },
    GET_USER_BY_ID: async ({ commit, state }, { uid, address }) => {
      const res = await getUserById({ uid, address })
      if (res.code === 1000) commit('SET_USERID_INFO', res.data)
      else {
        commit('SET_USERID_INFO', {})
        await logout()
      }
    }
  }
}
