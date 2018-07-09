
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
    ldbNFTCrowdsaleContract: null,
    erc20Contract: null,

    // 测试使用
    buildingContract: null,
    ldbNFTContract: null
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
     * init contrcat instance
     */
    [actionTypes.CONTRACT_INIT_INSTANCE]: async ({ state, commit }, payload) => {
      console.log('init contract')
      const { web3js, address } = web3Store.state.web3Opt
      const { ldbNFTCrowdsale, erc20Token, building, ldbNFT } = lordContract(web3js, address)
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: address })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTCrowdsaleContract', value: await ldbNFTCrowdsale() })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'erc20Contract', value: await erc20Token() })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'buildingContract', value: await building() })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTContract', value: await ldbNFT() })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'contractReady', value: true })
    },

    /**
     * reset contrcat instance
     */
    [actionTypes.CONTRACT_RESET_INSTANCE]: ({ commit }) => {
      console.log('reset contract')
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTCrowdsaleContract', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'erc20Contract', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'buildingContract', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTContract', value: null })
    }
  }
}
