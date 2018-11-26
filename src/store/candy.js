
/**
 * candy store options
 */
import { getCandyPrice } from '../api'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    candyPrice: {}
  },
  mutations: {

    /**
     * 存储 candy price
     */
    [mutationTypes.CANDY_SET_CANDY_PRICE]: (state, payload = {}) => {
      state.candyPrice = Object.assign({}, state.candyPrice, payload)
    }
  },
  actions: {

    /**
     * 设置 candy price
     */
    [actionTypes.CANDY_SET_CANDY_PRICE]: async ({ commit }) => {
      const res = await getCandyPrice()
      commit(mutationTypes.CANDY_SET_CANDY_PRICE, res.data)
    }
  }
}
