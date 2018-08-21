
/**
 * contract store options
 */
import { NFTsCrowdsale, Building, LDBNFTs } from '@/contract'
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
      // window[key] = value
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
      else isCrowdsaleApproved = await LDBNFTs.methods('isApprovedForAll', [address, NFTsCrowdsale.address])

      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'isCrowdsaleApproved', value: isCrowdsaleApproved })
      return isCrowdsaleApproved
    },

    /**
     * init contrcat instance
     */
    [actionTypes.CONTRACT_INIT_INSTANCE]: ({ state, commit, dispatch }, { monitor = false } = {}) => {
      console.log('init contract')
      const { web3js, address } = web3Store.state.web3Opt

      // 如果是 monitor 的状态，不重置合约文件
      if (!monitor) {
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: NFTsCrowdsale(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Building', value: Building(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'LDBNFTs', value: LDBNFTs(web3js) })
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
