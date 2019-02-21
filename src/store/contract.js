
/**
 * contract store options
 */
import { weiByDecimals } from 'utils/tool'
import { initContract, NFTsCrowdsale, TavernNFTs, Airdrop, Luckyblock, HOPSPlan, Bounty, BountyNFT } from '@/contract'
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
    Bounty: null,
    BountyNFT: null,

    // 所有的 erc721 授权
    bountyNFTApproved: false,
    checkBountyNFTApprovedInit: false,

    // 所有的 erc20 balance
    tokensBalance: {},
    tokensBalanceInit: false,

    // 所有包括的 erc20 token 合约
    tokensContract: {},
    tokensContractInit: false,

    BountyTokenAllowances: {},
    BountyTokenAllowancesInit: false,

    HOPSPlanTokenAllowances: {},
    HOPSPlanTokenAllowancesInit: false,

    luckyblockTokenAllowances: {},
    luckyblockTokenAllowancesInit: false
  },

  mutations: {
    [mutationTypes.CONTRACT_SET_INSTANCE]: (state, { key, value } = {}) => {
      if (!key) return false
      state[key] = value
      // window[key] = value
    },

    /**
     * set airdrop tokens contract
     */
    [mutationTypes.CONTRACT_SET_AIRDROP_TOKENS]: (state, { candiesTotal, candy, contract } = {}) => {
      const _tokensContract = state.tokensContract
      _tokensContract[candy] = contract
      state.tokensContract = _tokensContract
      // window.tokensContract = _tokensContract

      if (Object.keys(_tokensContract).length >= candiesTotal) state.tokensContractInit = true
    },

    /**
     * set luckyblock token allowance
     */
    [mutationTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE]: (state, { candiesTotal = 0, candy = '', allowance = 0 } = {}) => {
      state.luckyblockTokenAllowances[candy.toLocaleLowerCase()] = allowance.toNumber()
      if (Object.keys(state.luckyblockTokenAllowances).length >= candiesTotal) state.luckyblockTokenAllowancesInit = true
      // window.luckyblockTokenAllowances = state.luckyblockTokenAllowances
    },

    /**
     * set HOPSPlan token allowance
     */
    [mutationTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE]: (state, { candiesTotal = 0, candy = '', allowance = 0 } = {}) => {
      state.HOPSPlanTokenAllowances[candy.toLocaleLowerCase()] = allowance.toNumber()
      if (Object.keys(state.HOPSPlanTokenAllowances).length >= candiesTotal) state.HOPSPlanTokenAllowancesInit = true
      // window.HOPSPlanTokenAllowances = state.HOPSPlanTokenAllowances
    },

    /**
     * set bounty token allowance
     */
    [mutationTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE]: (state, { candiesTotal = 0, candy = '', allowance = 0 } = {}) => {
      state.BountyTokenAllowances[candy.toLocaleLowerCase()] = allowance.toNumber()
      if (Object.keys(state.BountyTokenAllowances).length >= candiesTotal) state.BountyTokenAllowancesInit = true
      // window.BountyTokenAllowances = state.BountyTokenAllowances
    },

    /**
     * check bountyNFT isApproved
     */
    [mutationTypes.CONTRACT_SET_BOUNTYNFT_APPROVE]: (state, payload = false) => {
      state.bountyNFTApproved = payload
    },

    /**
     * set token Balance
     */
    [mutationTypes.CONTRACT_SET_TOKEN_BALANCE]: (state, { symbol, data = {} }) => {
      state.tokensBalance[symbol] = Object.assign({}, state.tokensBalance[symbol], data)
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
      const { web3js, address = window.localStorage.getItem('currentAddress') } = web3Store.state.web3Opt

      // 如果是 monitor 的状态，不重置合约文件
      if (!monitor) {
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'NFTsCrowdsale', value: await NFTsCrowdsale(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Airdrop', value: await Airdrop(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Luckyblock', value: await Luckyblock(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'HOPSPlan', value: await HOPSPlan(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Bounty', value: await Bounty(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'BountyNFT', value: await BountyNFT(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'TavernNFTs', value: await TavernNFTs(web3js) })
        commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'contractReady', value: true })
      }

      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: address })

      // 初始化合约完成之后，检查当前用户市场权限以及用户tokenAllwance
      dispatch(actionTypes.CONTRACT_CHECK_CROWDSALE, address)

      // 根据所有的 candy，批量初始化合约
      const { candySymbols } = candyStore.state
      const _symbols = candySymbols.list
      await Promise.all(_symbols.map(item => dispatch(actionTypes.CONTRACT_SET_AIRDROP_TOKENS, { candiesTotal: _symbols.length, candy: item.address, luckyAddress: state.Luckyblock.address })))

      dispatch(actionTypes.CONTRACT_SET_TOKENS_BALANCE)

      dispatch(actionTypes.CONTRACT_CHECK_BOUNTYNFT_APPROVE, { address })
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
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'Bounty', value: await Bounty(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'BountyNFT', value: await BountyNFT(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'TavernNFTs', value: await TavernNFTs(web3js) })
      commit(mutationTypes.CONTRACT_SET_INSTANCE, { key: 'address', value: null })
    },

    /**
     * set airdrop tokens contract
     */
    [actionTypes.CONTRACT_SET_AIRDROP_TOKENS]: async ({ state, commit, dispatch }, { candiesTotal, candy, luckyAddress = state.Luckyblock.address, HOPSPlanAddress = state.HOPSPlan.address, BountyAddress = state.Bounty.address } = {}) => {
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
        // console.log('candy, luckyAddress', candy, luckyAddress, address)
        // 存储 token contract
        commit(mutationTypes.CONTRACT_SET_AIRDROP_TOKENS, { candiesTotal, candy, contract })

        // luckyblock 存储用户授权到 token allowance
        dispatch(actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE, { candiesTotal, candy, address, contract, luckyAddress })

        // HOPSPlan 存储用户授权到  token allowance
        dispatch(actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE, { candiesTotal, candy, address, contract, HOPSPlanAddress })

        // Bounty 存储用户授权到  token allowance
        dispatch(actionTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE, { candiesTotal, candy, address, contract, BountyAddress })
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
    },

    /**
     * set bounty tokenAllowance
     */
    [actionTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE]: async ({ state, commit }, { candiesTotal, candy, address, erc20Contract = state.tokensContract[candy], contractAddress = state.Bounty.address } = {}) => {
      // 向 erc20Contract 查询 address 给 HOPSPlan 授权操作多少个 token
      const allowance = await erc20Contract.methods('allowance', [ address, contractAddress ])
      commit(mutationTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE, { candiesTotal, candy, allowance })
      return allowance
    },

    /**
     * check bountyNFT approved
     */
    [actionTypes.CONTRACT_CHECK_BOUNTYNFT_APPROVE]: async ({ state, commit }, { address, approvedContractAddress = state.Bounty.address, BountyNFT = state.BountyNFT } = {}) => {
      // check user isApprovedForAll for bountyNFT
      const isApproved = await BountyNFT.methods('isApprovedForAll', [ address, approvedContractAddress ])
      console.log('--------- isApproved', isApproved, address, approvedContractAddress)
      commit(mutationTypes.CONTRACT_SET_BOUNTYNFT_APPROVE, isApproved)
      state.checkBountyNFTApprovedInit = true
      return isApproved
    },

    /**
     * set tokens balance
     */
    [actionTypes.CONTRACT_SET_TOKENS_BALANCE]: async ({ state }, { tokensContract = state.tokensContract } = {}) => {
      const { candySymbols } = candyStore.state
      let { address } = web3Store.state.web3Opt

      // 如果没有从 web3 中获取到 address, 使用 localStorage 中的地址
      address = address || window.localStorage.getItem('currentAddress')

      const tokens = candySymbols.list
      if (!tokens || !tokens.length) return
      const _tokensBalance = {}
      await Promise.all(tokens.map(async token => {
        const _address = token.address
        const _symbol = token.symbol.toLocaleLowerCase()
        const decimals = token.decimals || 18
        if (!tokensContract[_address]) return
        const tokenBalance = (await tokensContract[_address].methods('balanceOf', [ address ])).toNumber()
        _tokensBalance[_symbol] = {
          address: _address,
          balance: tokenBalance,
          balanceNumber: weiByDecimals(tokenBalance, decimals)
        }
      }))
      state.tokensBalance = _tokensBalance
      state.tokensBalanceInit = true
      console.log(' ------ contract ', _tokensBalance)
      return _tokensBalance
    }
  }
}
