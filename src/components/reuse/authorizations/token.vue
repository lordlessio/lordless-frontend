<template>
  <div class="full-width mobile-crowdsale-container" :class="[ theme ]">
    <lordless-blockies class="token-crowdsale-blockies" seed="account" :scale="18"/>
    <div class="token-crowdsale-header">
      <h3>WALLET</h3>
      <div class="crowdsale-header-item">
        <p>Wallet address</p>
        <p class="text-ellipsis crowdsale-account">{{ account }}</p>
      </div>
    </div>
    <div class="token-crowdsale-box">
      <h3>AUTHORIZATIONS</h3>
      <div v-if="isAll">
        <div
          class="loop-token-crowdsale"
          v-for="(betKey, index) of Object.keys(allTokenCrowdsaleInfos)" :key="index">
          <p class="token-crowdsale-name">For {{ allTokenCrowdsaleInfos[betKey].name }}</p>
          <ul>
            <li class="token-crowdsale-item"
              v-for="(bet, index) of allTokenBets[betKey]" :key="index">
              <p class="d-flex f-align-center token-crowdsale-symbol" @click.stop="approveAllowance(Object.assign({}, bet, allTokenCrowdsaleInfos[betKey]), allowanceModels[`${bet.candy.address}_${allTokenCrowdsaleInfos[betKey].contractAddress}`])">
                <span class="inline-block token-bet-icon">
                  <lordless-check-box
                    v-model="allowanceModels[`${bet.candy.address}_${allTokenCrowdsaleInfos[betKey].contractAddress}`]"
                    :loading="allowancePendings[`${bet.candy.address}_${allTokenCrowdsaleInfos[betKey].contractAddress}`]"
                    @click="approveAllowance(Object.assign({}, bet, allTokenCrowdsaleInfos[betKey]), allowanceModels[`${bet.candy.address}_${allTokenCrowdsaleInfos[betKey].contractAddress}`])"
                    :theme="theme"
                    sync/>
                </span>
                <span class="TTFontBolder">{{ allTokenCrowdsaleInfos[betKey].behavior }} <span v-if="allTokenCrowdsaleInfos[betKey].behavior === 'Betting'">with <span class="text-upper">{{ bet.candy.symbol }}</span></span></span>
              </p>
              <p class="token-crowdsale-desc">Authorize the <a :href="allTokenCrowdsaleInfos[betKey].contractLink" target="_blank">{{ allTokenCrowdsaleInfos[betKey].contractText }} contract</a> to operate your <span class="text-upper">{{ bet.candy.symbol }}</span> on your behalf.</p>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p class="token-crowdsale-name">For {{ tokenCrowdsaleInfo.name }}</p>
        <ul>
          <li class="token-crowdsale-item"
            v-for="(bet, index) of tokenBets" :key="index">
            <p class="d-flex f-align-center token-crowdsale-symbol" @click.stop="approveAllowance(bet, allowanceModels[`${bet.candy.address}_${tokenCrowdsaleInfo.contractAddress}`])">
              <span class="inline-block token-bet-icon">
                <lordless-check-box
                  v-model="allowanceModels[`${bet.candy.address}_${tokenCrowdsaleInfo.contractAddress}`]"
                  :loading="allowancePendings[`${bet.candy.address}_${tokenCrowdsaleInfo.contractAddress}`]"
                  @click="approveAllowance(bet, allowanceModels[`${bet.candy.address}_${tokenCrowdsaleInfo.contractAddress}`])"
                  :theme="theme"
                  sync/>
              </span>
              <span class="TTFontBolder">{{ tokenCrowdsaleInfo.behavior }} <span v-if="tokenCrowdsaleInfo.behavior === 'Betting'">with <span class="text-upper">{{ bet.candy.symbol }}</span></span></span>
            </p>
            <p class="token-crowdsale-desc">Authorize the <a :href="tokenCrowdsaleInfo.contractLink" target="_blank">{{ tokenCrowdsaleInfo.contractText }} contract</a> to operate your <span class="text-upper">{{ bet.candy.symbol }}</span> on your behalf.</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { metamaskMixins, publicMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [metamaskMixins, publicMixins],
  props: {
    tokenBets: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'light'
    },
    planType: {
      type: String,
      default: 'luckyblock'
    },
    isAll: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      refered: false,
      allowanceModels: {},
      allowancePendings: {}
    }
  },
  computed: {
    ...mapState('candy', [
      'candySymbols'
    ]),
    ...mapState('contract', [
      'Luckyblock',
      'HOPSPlan',
      'Bounty',
      'tokensContract',
      'luckyblockTokenAllowances',
      'HOPSPlanTokenAllowances',
      'BountyTokenAllowances',
      'BountyTokenAllowancesInit',
      'HOPSPlanTokenAllowancesInit',
      'luckyblockTokenAllowancesInit'
    ]),

    allTokenAllowanceInit () {
      return this.BountyTokenAllowancesInit && this.HOPSPlanTokenAllowancesInit && this.luckyblockTokenAllowancesInit
    },

    luckyAddress () {
      return this.Luckyblock ? this.Luckyblock.address : ''
    },

    HOPSPlanAddress () {
      return this.HOPSPlan ? this.HOPSPlan.address : ''
    },

    BountyAddress () {
      return this.Bounty ? this.Bounty.address : ''
    },

    contractAddress () {
      return this.tokenCrowdsaleInfo.contractAddress
    },

    tokenAllowances () {
      return this.tokenCrowdsaleInfo.tokenAllowances
    },

    checkAllowancesMethod () {
      return this.tokenCrowdsaleInfo.checkAllowancesMethod
    },

    web3Opt () {
      return this.$root.$children[0].web3Opt
    },

    isMobile () {
      return this.$root.$children[0].isMobile
    },

    allTokenBets () {
      const _candies = this.candySymbols.list || []
      const luckyblockFilter = [ 'less' ]
      const luckyblockTokenBets = []

      const plantFilter = [ 'less' ]
      const plantTokenBets = []

      const bountyFilter = [ 'hops' ]
      const bountyTokenBets = []
      for (const candy of _candies) {
        if (luckyblockFilter.includes(candy.symbol.toLocaleLowerCase())) {
          luckyblockTokenBets.push({
            candy,
            count: 1e25
          })
        }
        if (plantFilter.includes(candy.symbol.toLocaleLowerCase())) {
          plantTokenBets.push({
            candy,
            count: 1e25
          })
        }
        if (bountyFilter.includes(candy.symbol.toLocaleLowerCase())) {
          bountyTokenBets.push({
            candy,
            count: 1e25
          })
        }
      }
      return {
        luckyblock: luckyblockTokenBets,
        plant: plantTokenBets,
        bounty: bountyTokenBets
      }
    },

    allTokenCrowdsaleInfos () {
      return {
        luckyblock: {
          name: 'Lucky Blocks',
          behavior: 'Betting',
          contractText: 'Luckyblock',
          tokenAllowances: this.luckyblockTokenAllowances,
          checkAllowancesMethod: this[actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE],
          contractAddress: this.luckyAddress,
          contractLink: `${process.env.ETHERSCANURL}/address/${this.luckyAddress}#code`
        },
        plant: {
          name: 'LESS deposit',
          behavior: 'Deposit LESS',
          contractText: 'Deposit LESS',
          tokenAllowances: this.HOPSPlanTokenAllowances,
          checkAllowancesMethod: this[actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE],
          contractAddress: this.HOPSPlanAddress,
          contractLink: `${process.env.ETHERSCANURL}/address/${this.HOPSPlanAddress}#code`
        },
        bounty: {
          name: 'Bounty HOPS',
          behavior: 'Bounty HOPS',
          contractText: 'Bounty HOPS',
          tokenAllowances: this.BountyTokenAllowances,
          checkAllowancesMethod: this[actionTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE],
          contractAddress: this.BountyAddress,
          contractLink: `${process.env.ETHERSCANURL}/address/${this.BountyAddress}#code`
        }
      }
    },

    tokenCrowdsaleInfo () {
      return this.allTokenCrowdsaleInfos[this.planType] || {}
    }
  },
  watch: {
    allTokenAllowanceInit (val) {
      val && this.initTokenAllowance()
    }
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE,
      actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE,
      actionTypes.CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE
    ]),

    /**
     * 检查 token allowance 授权状态
     */
    checkAllowance (account = this.account, allowanceModels = this.allowanceModels) {
      // 如果是全部
      if (this.isAll) {
        const _allTokenCrowdsaleInfos = this.allTokenCrowdsaleInfos
        const _allBets = this.allTokenBets
        const keys = Object.keys(_allTokenCrowdsaleInfos)
        for (const key of keys) {
          const _crowdsaleInfo = _allTokenCrowdsaleInfos[key]
          const _tokenBets = _allBets[key]
          const _contractAddress = _crowdsaleInfo.contractAddress
          const _tokenAllowances = _crowdsaleInfo.tokenAllowances
          const _checkAllowancesMethod = _crowdsaleInfo.checkAllowancesMethod
          for (const bet of _tokenBets) {
            let { candy } = bet
            candy = typeof candy === 'object' ? candy.address.toLocaleLowerCase() : candy.toLocaleLowerCase()

            const tokenApproveKey = `lordless_token_approve_${account}_${candy}_${_contractAddress}`
            console.log('tokenApproveKey', tokenApproveKey)
            const isPending = !!localStorage.getItem(tokenApproveKey)
            isPending && this.loopCheckTokenAllowance({ candy, count: bet.count, contractAddress: _contractAddress, tokenAllowances: _tokenAllowances, checkAllowancesMethod: _checkAllowancesMethod })

            this.$set(this.allowancePendings, `${candy}_${_contractAddress}`, isPending || _tokenAllowances[candy] === undefined)
          }
        }
        return
      }

      // 如果是单项
      const { contractAddress, tokenAllowances, checkAllowancesMethod } = this.tokenCrowdsaleInfo
      for (const bet of this.tokenBets) {
        let { candy } = bet
        candy = typeof candy === 'object' ? candy.address.toLocaleLowerCase() : candy.toLocaleLowerCase()

        const tokenApproveKey = `lordless_token_approve_${account}_${candy}_${contractAddress}`
        console.log('tokenApproveKey', tokenApproveKey)
        const isPending = !!localStorage.getItem(tokenApproveKey)
        isPending && this.loopCheckTokenAllowance({ candy, count: bet.count, contractAddress, tokenAllowances, checkAllowancesMethod })

        this.$set(this.allowancePendings, `${candy}_${contractAddress}`, isPending || tokenAllowances[candy] === undefined)
      }

      const keys = Object.keys(allowanceModels)
      const bool = !!keys.filter(key => !!allowanceModels[key]).length
      if (keys.length === this.tokenBets.length && bool) {
        this.$emit('success')
      }
    },

    /**
     * 初始化 tokenAllowance
     */
    async initTokenAllowance () {
      // 如果是全部
      if (this.isAll) {
        const _allTokenCrowdsaleInfos = this.allTokenCrowdsaleInfos
        const _allBets = this.allTokenBets
        const keys = Object.keys(_allTokenCrowdsaleInfos)
        for (const key of keys) {
          const _crowdsaleInfo = _allTokenCrowdsaleInfos[key]
          const _tokenBets = _allBets[key]
          const _contractAddress = _crowdsaleInfo.contractAddress
          const _tokenAllowances = _crowdsaleInfo.tokenAllowances
          for (const bet of _tokenBets) {
            let { candy } = bet
            candy = typeof candy === 'object' ? candy.address.toLocaleLowerCase() : candy.toLocaleLowerCase()
            console.log(' init all token allowance bet', bet)

            // 记录该 token pending 状态
            this.$set(this.allowancePendings, `${candy}_${_contractAddress}`, _tokenAllowances[candy] === undefined)

            // 记录该 token 是否授权状态, 这里的数量都是 wei 单位
            this.$set(this.allowanceModels, `${candy}_${_contractAddress}`, _tokenAllowances[candy] !== undefined && _tokenAllowances[candy] >= bet.count)
          }
        }
      } else {
        // 如果是单项
        const tokenBets = this.tokenBets
        const { contractAddress, tokenAllowances } = this.tokenCrowdsaleInfo
        for (const bet of tokenBets) {
          let { candy } = bet
          candy = typeof candy === 'object' ? candy.address.toLocaleLowerCase() : candy.toLocaleLowerCase()
          console.log(' init token allowance bet', bet)

          // 记录该 token pending 状态
          this.$set(this.allowancePendings, `${candy}_${contractAddress}`, tokenAllowances[candy] === undefined)

          // 记录该 token 是否授权状态, 这里的数量都是 wei 单位
          this.$set(this.allowanceModels, `${candy}_${contractAddress}`, tokenAllowances[candy] !== undefined && tokenAllowances[candy] >= bet.count)
        }
      }

      this.$nextTick(() => this.checkAllowance())
    },

    /**
     * 在授权之前单独 check一下
     */
    checkSingleAllowance ({ candy, count, contractAddress = this.contractAddress, tokenAllowances = this.tokenAllowances } = {}) {
      console.log('----------- checkSingleAllowance', candy, count)
      return tokenAllowances[candy] !== undefined && tokenAllowances[candy] > count
    },

    /**
     * 授权erc20合约
     */
    async approveAllowance ({ account = this.account, candy, count, contractAddress = this.contractAddress, tokenAllowances = this.tokenAllowances, checkAllowancesMethod = this.checkAllowancesMethod, tokensContract = this.tokensContract } = {}, isChoose = false, web3Opt = this.web3Opt) {
      if (isChoose) return

      candy = typeof candy === 'object' ? candy.address : candy

      if (this.checkSingleAllowance({ candy, count, contractAddress, tokenAllowances })) {
        if (!this.allowanceModels[`${candy}_${contractAddress}`]) this.initTokenAllowance()
        return
      }
      this.$set(this.allowancePendings, `${candy}_${contractAddress}`, true)

      const { gasPrice } = web3Opt

      // 传输的合约参数
      const setApprove = {
        name: 'approve',
        values: [ contractAddress, 1e30 ]
      }

      // 估算 gas
      const gas = (await tokensContract[candy].estimateGas(setApprove.name, setApprove.values)) || 129999
      console.log('gas', gas, contractAddress, candy, account)

      // metamask 是否被打开
      this.metamaskChoose = true

      // 授权给合约 erc20 可操作数量为 1e30
      tokensContract[candy].methods(setApprove.name, setApprove.values.concat([{ from: account, gas, gasPrice }]))
        .then(tx => {
          this.metamaskChoose = false
          this.loopCheckTokenAllowance({ candy, count, contractAddress, tokenAllowances, checkAllowancesMethod })
        })
        .catch(err => {
          console.log('err', err)
          this.metamaskChoose = false
          this.$set(this.allowancePendings, `${candy}_${contractAddress}`, false)
          this.$emit('error', err)
        })
    },

    /**
     * loop 监听 tokenAllowance 事件
     */
    async loopCheckTokenAllowance ({ account = this.account, candy = '', count = 0, contractAddress = this.contractAddress, tokenAllowances = this.tokenAllowances, checkAllowancesMethod = this.checkAllowancesMethod, tokensContract = this.tokensContract } = {}) {
      if (!account) return

      candy = candy.toLocaleLowerCase()

      console.log(' ====== come in loop_CheckTokenAllowance')

      let timeout = null
      const loopFunc = () => {
        const tokenApproveKey = `lordless_token_approve_${account}_${candy}_${contractAddress}`
        localStorage.setItem(tokenApproveKey, true)

        // 创建新定时器实例
        timeout = setTimeout(async () => {
          const allowance = await checkAllowancesMethod({ address: account, candy, contractAddress, contract: tokensContract[candy] })

          console.log('tokenApproveKey', tokenApproveKey, allowance)
          clearTimeout(timeout)
          timeout = null

          console.log('----- loop_CheckTokenAllowance', contractAddress, candy, count, tokenAllowances[candy])
          if (allowance >= count) {
            localStorage.getItem(tokenApproveKey) && this.$notify.success({
              title: 'Success!',
              message: 'Betting with LESS Success!',
              position: 'bottom-right',
              duration: 2500
            })

            localStorage.removeItem(tokenApproveKey)
            this.$set(this.allowanceModels, `${candy}_${contractAddress}`, true)
            this.$set(this.allowancePendings, `${candy}_${contractAddress}`, false)
            this.$nextTick(() => this.checkAllowance())
          } else {
            return loopFunc()
          }
        }, 5000)
      }
      this.$once('hook:beforeDestroy', () => {
        timeout && clearTimeout(timeout)
      })
      this.$once('hook:deactivated', () => {
        timeout && clearTimeout(timeout)
      })
      return loopFunc()
    }
  },
  activated () {
    if (!this.refered) return
    this.initTokenAllowance()
  },
  mounted () {
    this.refered = true
    this.initTokenAllowance()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-crowdsale-container {
    // >h2 {
    //   font-size: 24px;
    // }
    // >p {
    //   margin-top: 12px;
    //   font-size: 16px;
    // }
    &.dark {
      .crowdsale-header-item {
        >p {
          &:nth-of-type(1) {
            color: #999;
          }
          &:nth-of-type(2) {
            color: #555;
          }
        }
      }
      .token-crowdsale-name {
        color: #999;
      }
      .token-crowdsale-symbol {
        color: #555;
      }
      .token-crowdsale-desc {
        color: #999;
        >a {
          color: $--color-btn-blue;
        }
      }
    }
    &.light {
      .crowdsale-header-item {
        >p {
          &:nth-of-type(1) {
            color: #BDB9FD;
          }
          &:nth-of-type(2) {
            color: #fff;
          }
        }
      }
      .token-crowdsale-name {
        color: #BDB9FD;
      }
      .token-crowdsale-symbol {
        color: #fff;
      }
      .token-crowdsale-desc {
        color: #BDB9FD;
        >a {
          color: $--color-btn-yellow;
        }
      }
    }
  }
  .token-crowdsale-blockies {
    margin-bottom: 36px;
  }
  .token-crowdsale-header {
    >h3 {
      font-size: 18px;
    }
  }
  .crowdsale-header-item {
    margin-top: 12px;
    font-size: 16px;
    >p {
      &:nth-of-type(1) {
        color: #BDB9FD;
      }
      &:nth-of-type(2) {
        margin-top: 4px;
        color: #fff;
      }
    }
  }
  .crowdsale-account {
    width: 90%;
  }

  .token-crowdsale-box {
    margin-top: 36px;
    >h3 {
      margin-bottom: 12px;
    }
  }
  .token-crowdsale-name {
    // margin-top: 12px;
  }
  .token-crowdsale-item {
    margin-top: 10px;
  }
  .token-crowdsale-symbol {
    font-size: 16px;
  }
  .token-crowdsale-desc {
    margin-top: 4px;
    font-size: 14px;
  }
  .token-bet-icon {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }

  // loop-token-crowdsale
  .loop-token-crowdsale {
    &:not(:first-of-type) {
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
    }
  }
</style>
