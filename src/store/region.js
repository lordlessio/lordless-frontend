
/**
 * status store options
 */
import { getRegions } from '../api'
import { actionTypes, mutationTypes } from './types'
export default {
  namespaced: true,
  state: {
    regions: []
  },
  mutations: {

    /**
     * 获取 ldb记录信息
     * 如果 state.historySearchLdbs 为空，则从localStorage中获得
     */
    [mutationTypes.REGION_SET_REGIONS]: (state, regions = []) => {
      state.regions = regions
    }
  },
  actions: {

    /**
     * 初始化 regions 地区信息
     */
    [actionTypes.REGION_SET_REGIONS]: async ({ commit }) => {
      const regions = await getRegions()
      if (regions.code === 1000 && regions.data) commit(mutationTypes.REGION_SET_REGIONS, regions.data.list)
    }
  }
}
