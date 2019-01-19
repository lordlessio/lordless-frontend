
/**
 * contract store options
 */
import { initContract, NFTsCrowdsale, TavernNFTs, Airdrop, Luckyblock, HOPSPlan } from '@/contract'
import { mutationTypes, actionTypes } from './types'
import web3Store from './web3'
import candyStore from './candy'
export default {
  namespaced: true,

  state: {
    contractReady: false,
    address: null,

    // 是否授权了市场合约
    isCrowdsaleApproved: false,

    // 合约
    TavernNFTs: null,
    NFTsCrowdsale: null,
    Airdrop: null,
    Luckyblock: null,

    // 所有包括的 erc20 token 合约
    tokensContract: {},
    tokensContractInit: false,

    HOPSPlanTokenAllowances: {},
    HOPSPlanTokenAllowancesInit: false,

    luckyblockTokenAllowances: {},
    luckyblockTokenAllowancesInit: false
  },

  mutations: {
    [mutationTypes.CONTRACT_SET_INSTANCE]: (state, { key, value }) => {
      if (!key) return false
      state[key] = value
      // window[key] = value
    },

    /**
     * set airdrop tokens contract
     */
    [mutationTypes.CONTRACT_SET_AIRDROP_TOKENS]: (state, { candiesTotal, candy, contract }) => {
      const _tokensContract = state.tokensContract
      _tokensContract[candy] = contract
      state.tokensContract = _tokensContract
      // window.tokensContract = _tokensContract

      if (Object.keys(_tokensContract).length >= candiesTotal) state.tokensContractInit = true
    },

    /**
     * set token allowance
     */
    [mutationTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE]: (state, { candiesTotal = 0, candy = '', allowance = 0 }) => {
      // 向 tokenContract 查询 address 给 luckyAddress 授权操作多少个 token
      // tokenContract.methods('allowance', [ address, luckyAddress ]).then(allowance => {
      //   state.tokenAllowances[candy.toLocaleLowerCase()] = allowance ? allowance.toNumber() : 0
      //   window.tokenAllowances = state.tokenAllowances
      // })
      state.luckyblockTokenAllowances[candy.toLocaleLowerCase()] = allowance.toNumber()
      if (Object.keys(state.luckyblockTokenAllowances).length >= candiesTotal) state.luckyblockTokenAllowancesInit = true
      window.luckyblockTokenAllowances = state.luckyblockTokenAllowances
    },

    /**
     * set token allowance
     */
    [mutationTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE]: (state, { candiesTotal = 0, candy = '', allowance = 0 }) => {
      state.HOPSPlanTokenAllowances[candy.toLocaleLowerCase()] = allowance.toNumber()
      if (Object.keys(state.HOPSPlanTokenAllowances).length >= candiesTotal) state.HOPSPlanTokenAllowancesInit = true
      window.HOPSPlanTokenAllowances = state.HOPSPlanTokenAllowances
    }
  },

  actions: {
    /**
     * check crowdsale by address
     */
    [actionTypes.CONTRACT_CHECK_CROWDSALE]: async ({ state, commit }, address) => {
      const { TavernNFTs, NFTsCrowdsale } = state
      let isCrowdsaleApproved
      if (!address) isCrowdsaleApproved = false
      else isCrowdsaleApproved = await TavernNFTs.methods('isApprovedForAll', [address, NFTsCrowdsale.address])

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
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: await NFTsCrowdsale(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Airdrop', value: await Airdrop(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Luckyblock', value: await Luckyblock(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'HOPSPlan', value: await HOPSPlan(web3js) })
        // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Building', value: Building(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'TavernNFTs', value: await TavernNFTs(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'contractReady', value: true })
      }

      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: address })

      // 初始化合约完成之后，检查当前用户市场权限以及用户tokenAllwance
      dispatch(actionTypes.CONTRACT_CHECK_CROWDSALE, address)

      // 根据所有的 candy，批量初始化合约
      const { candySymbols } = candyStore.state
      const _symbols = candySymbols.list
      for (const item of _symbols) {
        dispatch(actionTypes.CONTRACT_SET_AIRDROP_TOKENS, { candiesTotal: _symbols.length, candy: item.address, luckyAddress: state.Luckyblock.address })
      }
    },

    /**
     * reset contrcat instance
     */
    [actionTypes.CONTRACT_RESET_INSTANCE]: async ({ commit }) => {
      console.log('reset contract')
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: await NFTsCrowdsale(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Airdrop', value: await Airdrop(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Luckyblock', value: await Luckyblock(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'HOPSPlan', value: await HOPSPlan(web3js) })
      // commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Building', value: Building(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'TavernNFTs', value: await TavernNFTs(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: null })
    },

    /**
     * set airdrop tokens contract
     */
    [actionTypes.CONTRACT_SET_AIRDROP_TOKENS]: async ({ state, commit, dispatch }, { candiesTotal, candy, luckyAddress = state.Luckyblock.address, HOPSPlanAddress = state.HOPSPlan.address } = {}) => {
      // if (state.tokensContract[candy]) return

      let { web3js, address } = web3Store.state.web3Opt

      // 如果没有从 web3 中获取到 address, 使用 localStorage 中的地址
      address = address || window.localStorage.getItem('currentAddress')

      const contractJson = {
        address: candy,
        abi: process.env.erc20ABI
      }

      const contract = await initContract(contractJson, web3js)
      if (contract) {
        console.log('candy, luckyAddress', candy, luckyAddress, address)
        // 存储 token contract
        commit(mutationTypes.CONTRACT_SET_AIRDROP_TOKENS, { candiesTotal, candy, contract })

        // luckyblock 存储用户授权到 token allowance
        dispatch(actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE, { candiesTotal, candy, address, contract, luckyAddress })

        // HOPSPlan 存储用户授权到  token allowance
        dispatch(actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE, { candiesTotal, candy, address, contract, HOPSPlanAddress })
      }
    },

    /**
     * set tokenAllowance
     */
    [actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE]: async ({ state, commit }, { candiesTotal, candy, address, erc20Contract = state.tokensContract[candy], contractAddress = state.Luckyblock.address } = {}) => {
      // 向 tokenContract 查询 address 给 luckyAddress 授权操作多少个 token
      const allowance = await erc20Contract.methods('allowance', [ address, contractAddress ])
      commit(mutationTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE, { candiesTotal, candy, allowance })
      return allowance
    },

    /**
     * set hopsPlan tokenAllowance
     */
    [actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE]: async ({ state, commit }, { candiesTotal, candy, address, erc20Contract = state.tokensContract[candy], contractAddress = state.HOPSPlan.address } = {}) => {
      // 向 erc20Contract 查询 address 给 HOPSPlan 授权操作多少个 token
      const allowance = await erc20Contract.methods('allowance', [ address, contractAddress ])
      commit(mutationTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE, { candiesTotal, candy, allowance })
      return allowance
    }
  }
}
