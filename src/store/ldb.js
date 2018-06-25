
/**
 * layout store options
 */
import { objectType, getObjStorage } from 'utils/tool'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    historySearchLdbs: []
  },
  mutations: {

    /**
     * 获取 ldb记录信息
     * 如果 state.historySearchLdbs 为空，则从localStorage中获得
     */
    [mutationTypes.LDB_GET_HISTORY_SEARCH_LDBS]: (state) => {
      let historySearchLdbs = state.historySearchLdbs
      if (!historySearchLdbs.length) {
        historySearchLdbs = getObjStorage('lordless_search_ldbs', 'array')
        state.historySearchLdbs = historySearchLdbs
      }
      return historySearchLdbs
    },

    /**
     * 存储 ldb搜索记录
     * 记录最多存储10条，多于10条，移除最后的那一条
     */
    [mutationTypes.LDB_SET_HISTORY_SEARCH_LDB]: (state, payload) => {
      if (objectType(payload)[0] !== 'object') return false

      // 拿到建筑数据
      const ldbs = state.historySearchLdbs || getObjStorage('lordless_search_ldbs', 'array')

      // 遍历判断是否重复信息
      ldbs.map((item, index) => {
        if (item._id === payload._id) ldbs.splice(index, 1)
      })

      // 存储的信息，添加记录标记
      payload = Object.assign({}, payload, {
        history: 1
      })
      ldbs.unshift(payload)
      if (ldbs.length > 10) ldbs.pop()
      state.historySearchLdbs = ldbs
      window.localStorage.setItem('lordless_search_ldbs', JSON.stringify(ldbs))
    }
  },
  actions: {

    /**
     * 存储 单条ldb信息 到本地
     */
    [actionTypes.LDB_SET_HISTORY_SEARCH_LDB]: ({ commit }, payload) => {
      commit(mutationTypes.LDB_SET_HISTORY_SEARCH_LDB, payload)
    },

    /**
     * 获取本地 ldb 查询记录
     */
    [actionTypes.LDB_GET_HISTORY_SEARCH_LDBS]: ({ commit }) => {
      return commit(mutationTypes.LDB_GET_HISTORY_SEARCH_LDBS)
    }
  }
}
