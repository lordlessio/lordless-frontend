
/**
 * layout store options
 */
import { objectType } from 'utils/tool'
import { mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    headerOptions: {
      show: true
    },
    footerOptions: {
      show: true
    }
  },
  mutations: {
    [mutationTypes.LAYOUT_SET_HEADER_OPTIONS] (state, payload) {
      if (!checkOptions(payload)) return false
      state.headerOptions = payload
    },
    [mutationTypes.LAYOUT_SET_FOOTER_OPTIONS] (state, payload) {
      if (!checkOptions(payload)) return false
      state.footerOptions = payload
    }
  },
  actions: {}
}

const checkOptions = (payload) => {
  if (!payload || (objectType(payload)[0] !== 'object' && !Object.keys[payload].length)) return false
  return true
}
