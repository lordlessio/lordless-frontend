
/**
 * candy store options
 */
import { getCandyPrice, getCandyClaimed } from '../api'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    candyPrice: {},
    candyClaimed: {}
  },
  mutations: {

    /**
     * 存储 candy price
     */
    [mutationTypes.CANDY_SET_CANDY_PRICE]: (state, payload = {}) => {
      state.candyPrice = Object.assign({}, state.candyPrice, payload)
    },

    /**
     * 存储 candy claimed
     */
    [mutationTypes.CANDY_SET_CANDY_CLAIMED]: (state, payload = {}) => {
      state.candyClaimed = Object.assign({}, state.candyClaimed, payload)
    }
  },
  actions: {

    /**
     * 设置 candy price
     */
    [actionTypes.CANDY_SET_CANDY_PRICE]: async ({ commit }) => {
      const res = await getCandyPrice()
      if (res.code === 1000 && res) commit(mutationTypes.CANDY_SET_CANDY_PRICE, res.data)
    },

    /**
     * 获取 candy claimed
     */
    [actionTypes.CANDY_SET_CANDY_CLAIMED]: async ({ commit }) => {
      const res = await getCandyClaimed()
      if (res.code === 1000 && res) commit(mutationTypes.CANDY_SET_CANDY_CLAIMED, res.data)
    }
  }
}
