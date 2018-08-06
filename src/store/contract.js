
/**
 * contract store options
 */
import lordContract from '@/contract'
import { mutationTypes, actionTypes } from './types'
import web3Store from './web3'
export default {
  namespaced: true,

  state: {
    contractReady: false,
    address: null,

    // 是否授权了市场合约
    isCrowdsaleApproved: false,

    // 合约
    LDBNFTs: null,
    NFTsCrowdsale: null,

    // 测试使用
    Building: null
  },

  mutations: {
    [mutationTypes.CONTRACT_SET_INSTANCE]: (state, { key, value }) => {
      if (!key) return false
      state[key] = value
      window[key] = value
    }
  },

  actions: {
    [actionTypes.CONTRACT_SET_INSTANCE]: ({ state }, payload) => {

    },

    /**
     * check crowdsale by address
     */
    [actionTypes.CONTRACT_CHECK_CROWDSALE]: async ({ state, commit }, address) => {
      const { LDBNFTs, NFTsCrowdsale } = state
      let isCrowdsaleApproved
      if (!address) isCrowdsaleApproved = false
      else isCrowdsaleApproved = await LDBNFTs.isApprovedForAll(address, NFTsCrowdsale.address)

      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'isCrowdsaleApproved', value: isCrowdsaleApproved })
      return isCrowdsaleApproved
    },

    /**
     * init contrcat instance
     */
    [actionTypes.CONTRACT_INIT_INSTANCE]: async ({ state, commit, dispatch }, { monitor = false } = {}) => {
      console.log('init contract')
      const { web3js, address } = web3Store.state.web3Opt

      // 如果是 monitor 的状态，不重置合约文件
      if (!monitor) {
        const { NFTsCrowdsale, Building, LDBNFTs } = lordContract(web3js, address)
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: await NFTsCrowdsale() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Building', value: await Building() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'LDBNFTs', value: await LDBNFTs() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'contractReady', value: true })
      }

      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: address })
      dispatch(actionTypes.CONTRACT_CHECK_CROWDSALE, address)
    },

    /**
     * reset contrcat instance
     */
    [actionTypes.CONTRACT_RESET_INSTANCE]: ({ commit }) => {
      console.log('reset contract')
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'buildingContract', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'LDBNFTs', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'isCrowdsaleApproved', value: false })
    }
  }
}
