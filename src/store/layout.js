
/**
 * layout store options
 */
import { objectType, stringifyParse } from 'utils/tool'
import { mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    header: {
      show: true,

      // header is fixed position
      fixed: true,

      // header is transparent default
      transparent: false,

      // header is listener scroll
      scroll: false
    },

    // default options for header
    dHeader: {
      show: true,
      fixed: true,
      transparent: false,
      scroll: false
    },

    footer: {
      show: true
    },

    // default options for footer
    dFooter: {
      show: true
    }
  },
  mutations: {
    [mutationTypes.LAYOUT_SET_HEADER_OPTIONS] (state, _header) {
      if (!checkOptions(_header)) {
        console.log('--------', state.dHeader)
        state.header = stringifyParse(state.dHeader)
        return false
      }
      console.log('------------- _header', _header, Object.assign({}, state.dHeader, _header))
      state.header = Object.assign({}, state.dHeader, _header)
    },
    [mutationTypes.LAYOUT_SET_FOOTER_OPTIONS] (state, _footer) {
      if (!checkOptions(_footer)) {
        state.footer = stringifyParse(state.dFooter)
        return false
      }
      console.log('--------- _footer', _footer, Object.assign({}, state.Footer, _footer))
      state.footer = Object.assign({}, state.dFooter, _footer)
    }
  },
  actions: {}
}

const checkOptions = (payload) => {
  if (!payload || (objectType(payload)[0] !== 'object' && !Object.keys[payload].length)) return false
  return true
}
