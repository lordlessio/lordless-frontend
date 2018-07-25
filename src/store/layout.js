
/**
 * layout store options
 */
import { objectType, stringifyParse } from 'utils/tool'
import { mutationTypes, actionTypes } from './types'
import range from 'lodash/range'
export default {
  namespaced: true,
  state: {

    // blur 状态集合，多级状态使用追加形式
    blurs: [],
    app: {},
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

    /**
     * 修改 blur 配置参数
     */
    [mutationTypes.LAYOUT_SET_BLURS] (state, _blur = 0) {
      if (typeof _blur !== 'number') {
        state.blurs = []
        return false
      }
      // 使用 range 的形式，调整 blur 参数
      // 传入的 _blur 数字就是 blur 展示层级
      // eg: 2 range(1, 2 + 1) blur = [ 1, 2 ]
      state.blurs = range(1, _blur + 1)
    },

    /**
     * 修改 app 配置参数
     */
    [mutationTypes.LAYOUT_SET_APP_OPTIONS] (state, _app) {
      if (!checkOptions(_app)) {
        state.app = {}
        return false
      }
      state.app = _app
    },

    /**
     * 修改 header 配置参数
     */
    [mutationTypes.LAYOUT_SET_HEADER_OPTIONS] (state, _header) {
      if (!checkOptions(_header)) {
        state.header = stringifyParse(state.dHeader)
        return false
      }
      console.log('------------- _header', _header, Object.assign({}, state.dHeader, _header))
      state.header = Object.assign({}, state.dHeader, _header)
    },

    /**
     * 修改 footer 配置参数
     */
    [mutationTypes.LAYOUT_SET_FOOTER_OPTIONS] (state, _footer) {
      if (!checkOptions(_footer)) {
        state.footer = stringifyParse(state.dFooter)
        return false
      }
      console.log('--------- _footer', _footer, Object.assign({}, state.Footer, _footer))
      state.footer = Object.assign({}, state.dFooter, _footer)
    }
  },
  actions: {

    /**
     * 修改 app layout opts
     */
    [actionTypes.LAYOUT_SET_APP_OPTIONS] ({ commit }, _app) {
      commit(mutationTypes.LAYOUT_SET_APP_OPTIONS, _app)
    },

    /**
     * 修改 blur layout opts
     */
    [actionTypes.LAYOUT_SET_BLURS] ({ commit }, _blur) {
      commit(mutationTypes.LAYOUT_SET_BLURS, _blur)
    }
  }
}

const checkOptions = (payload) => {
  if (!payload || (objectType(payload)[0] !== 'object' && !Object.keys[payload].length)) return false
  return true
}
