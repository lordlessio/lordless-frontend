
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
    ldbNFTContract: null,
    ldbNFTCrowdsaleContract: null,
    erc20Contract: null,

    // 测试使用
    buildingContract: null
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
      const { ldbNFTContract, ldbNFTCrowdsaleContract } = state
      let isCrowdsaleApproved
      if (!address) isCrowdsaleApproved = false
      else isCrowdsaleApproved = await ldbNFTContract.isApprovedForAll(address, ldbNFTCrowdsaleContract.address)

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
        const { ldbNFTCrowdsale, erc20Token, building, ldbNFT } = lordContract(web3js, address)
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTCrowdsaleContract', value: await ldbNFTCrowdsale() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'erc20Contract', value: await erc20Token() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'buildingContract', value: await building() })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTContract', value: await ldbNFT() })
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
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTCrowdsaleContract', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'erc20Contract', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'buildingContract', value: null })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'ldbNFTContract', value: null })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'isCrowdsaleApproved', value: false })
    }
  }
}
