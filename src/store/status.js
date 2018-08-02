
/**
 * status store options
 */
import { getBrowser } from 'utils/tool'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    browser: { default: true }
  },
  mutations: {

    /**
     * 获取 ldb记录信息
     * 如果 state.historySearchLdbs 为空，则从localStorage中获得
     */
    [mutationTypes.STATUS_SET_BROWSER]: (state, payload = {}) => {
      state.browser = payload
    }
  },
  actions: {

    /**
     * 初始化浏览器状态
     */
    [actionTypes.STATUS_INIT_BROSWER]: ({ commit }) => {
      const browser = getBrowser()
      commit(mutationTypes.STATUS_SET_BROWSER, browser)
    }
  }
}
