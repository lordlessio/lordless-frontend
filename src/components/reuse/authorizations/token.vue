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
          v-for="(item, index) of allTokenCrowdsales" :key="index">
          <p class="token-crowdsale-name">For {{ item.name }}</p>
          <ul>
            <li class="token-crowdsale-item"
              v-for="(bet, index) of tokenBets" :key="index">
              <p class="d-flex f-align-center token-crowdsale-symbol" @click.stop="approveAllowance(bet, allowanceModels[bet.candy.address])">
                <span class="inline-block token-bet-icon">
                  <lordless-check-box
                    v-model="allowanceModels[bet.candy.address]"
                    :loading="allowancePendings[bet.candy.address]"
                    @click="approveAllowance(bet, allowanceModels[bet.candy.address])"
                    :theme="theme"
                    sync/>
                </span>
                <span class="TTFontBolder">{{ tokenCrowdsaleInfo.behavior }} with <span class="text-upper">{{ bet.candy.symbol }}</span></span>
              </p>
              <p class="token-crowdsale-desc">Authorize the <a :href="tokenCrowdsaleInfo.contractLink" target="_blank">{{ tokenCrowdsaleInfo.contractText }} contract</a> to operate your <span class="text-upper">{{ bet.candy.symbol }}</span> on your behalf.</p>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p class="token-crowdsale-name">For {{ tokenCrowdsaleInfo.name }}</p>
        <ul>
          <li class="token-crowdsale-item"
            v-for="(bet, index) of tokenBets" :key="index">
            <p class="d-flex f-align-center token-crowdsale-symbol" @click.stop="approveAllowance(bet, allowanceModels[bet.candy.address])">
              <span class="inline-block token-bet-icon">
                <lordless-check-box
                  v-model="allowanceModels[bet.candy.address]"
                  :loading="allowancePendings[bet.candy.address]"
                  @click="approveAllowance(bet, allowanceModels[bet.candy.address])"
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
    ...mapState('contract', [
      'Luckyblock',
      'HOPSPlan',
      'tokensContract',
      'luckyblockTokenAllowances',
      'HOPSPlanTokenAllowances'
    ]),

    luckyAddress () {
      return this.Luckyblock ? this.Luckyblock.address : ''
    },

    HOPSPlanAddress () {
      return this.HOPSPlan ? this.HOPSPlan.address : ''
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

    allTokenCrowdsales () {
      return [
        {
          name: 'Lucky Blocks',
          behavior: 'Betting',
          contractText: 'Luckyblock',
          tokenAllowances: this.luckyblockTokenAllowances,
          checkAllowancesMethod: this[actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE],
          contractAddress: this.luckyAddress,
          contractLink: `${process.env.ETHERSCANURL}/address/${this.luckyAddress}#code`
        },
        {
          name: 'LESS deposit',
          behavior: 'Deposit LESS',
          contractText: 'Deposit LESS',
          tokenAllowances: this.HOPSPlanTokenAllowances,
          checkAllowancesMethod: this[actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE],
          contractAddress: this.HOPSPlanAddress,
          contractLink: `${process.env.ETHERSCANURL}/address/${this.HOPSPlanAddress}#code`
        }
      ]
    },

    tokenCrowdsaleInfo () {
      const infos = {
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
        }
      }
      return infos[this.planType] || {}
    }
  },
  // watch: {
  //   luckyblockTokenAllowances: {
  //     deep: true,
  //     handler: (val) => {
  //       console.log('------ luckyblockTokenAllowances total', val)
  //       this.initTokenAllowance()
  //     }
  //   }
  // },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE,
      actionTypes.CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE
    ]),

    checkAllowance (address = this.account, contractAddress = this.contractAddress, tokenAllowances = this.tokenAllowances, allowanceModels = this.allowanceModels) {
      for (const bet of this.tokenBets) {
        const { candy } = bet
        const tokenApproveKey = `lordless_token_approve_${address}_${candy.address}_${contractAddress}`
        console.log('tokenApproveKey', tokenApproveKey)
        const isPending = !!localStorage.getItem(tokenApproveKey)
        isPending && this.loopCheckTokenAllowance({ candy: candy.address, count: bet.count })

        this.$set(this.allowancePendings, candy.address, isPending || tokenAllowances[candy.address] === undefined)
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
    async initTokenAllowance (tokenBets = this.tokenBets, tokenAllowances = this.tokenAllowances) {
      for (const bet of tokenBets) {
        let { candy } = bet
        candy = typeof candy === 'object' ? candy.address.toLocaleLowerCase() : candy.toLocaleLowerCase()
        console.log(' init token allowance bet', bet)

        // 记录该 token pending 状态
        this.$set(this.allowancePendings, candy, tokenAllowances[candy] === undefined)

        // 记录该 token 是否授权状态, 这里的数量都是 wei 单位
        this.$set(this.allowanceModels, candy, tokenAllowances[candy] !== undefined && tokenAllowances[candy] >= bet.count)
      }

      this.$nextTick(() => this.checkAllowance())
    },

    /**
     * 在授权之前单独 check一下
     */
    checkSingleAllowance (candy, count, tokenAllowances = this.tokenAllowances) {
      console.log('----------- checkSingleAllowance', candy, count)
      return tokenAllowances[candy] !== undefined && tokenAllowances[candy] > count
    },

    /**
     * 授权erc20合约
     */
    async approveAllowance ({ address = this.account, contractAddress = this.contractAddress, tokensContract = this.tokensContract, web3Opt = this.web3Opt, candy, count } = {}, isChoose = false) {
      if (isChoose) return

      candy = typeof candy === 'object' ? candy.address : candy

      if (this.checkSingleAllowance(candy, count)) {
        if (!this.allowanceModels[candy]) this.initTokenAllowance()
        return
      }
      this.$set(this.allowancePendings, candy, true)

      const { gasPrice } = web3Opt

      // 传输的合约参数
      const setApprove = {
        name: 'approve',
        values: [ contractAddress, 1e30 ]
      }

      // 估算 gas
      const gas = (await tokensContract[candy].estimateGas(setApprove.name, setApprove.values)) || 120000
      console.log('gas', gas, contractAddress, candy, address)

      // metamask 是否被打开
      this.metamaskChoose = true

      // 授权给合约 erc20 可操作数量为 1e30
      tokensContract[candy].methods(setApprove.name, setApprove.values.concat([{ from: address, gas, gasPrice }]))
        .then(tx => {
          this.metamaskChoose = false
          this.loopCheckTokenAllowance({ contractAddress, candy, count })
        })
        .catch(err => {
          console.log('err', err)
          this.metamaskChoose = false
          this.$set(this.allowancePendings, candy, false)
          this.$emit('error', err)
        })
    },

    /**
     * loop 监听 tokenAllowance 事件
     */
    async loopCheckTokenAllowance ({ address = this.account, contractAddress = this.contractAddress, tokensContract = this.tokensContract, candy = '', count = 0 } = {}) {
      if (!address) return

      candy = candy.toLocaleLowerCase()

      console.log(' ====== come in loopCheckTokenAllowance')

      let timeout = null
      const loopFunc = () => {
        const tokenApproveKey = `lordless_token_approve_${address}_${candy}_${contractAddress}`
        localStorage.setItem(tokenApproveKey, true)

        // 创建新定时器实例
        timeout = setTimeout(async () => {
          const allowance = await this.checkAllowancesMethod({ address, candy, contractAddress, contract: tokensContract[candy] })

          console.log('tokenApproveKey', tokenApproveKey, allowance)
          clearTimeout(timeout)
          timeout = null

          console.log('----- loopCheckTokenAllowance', contractAddress, candy, count, this.tokenAllowances[candy])
          if (allowance >= count) {
            localStorage.getItem(tokenApproveKey) && this.$notify.success({
              title: 'Success!',
              message: 'Betting with LESS Success!',
              position: 'bottom-right',
              duration: 2500
            })

            localStorage.removeItem(tokenApproveKey)
            this.$set(this.allowanceModels, candy, true)
            this.$set(this.allowancePendings, candy, false)
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
  }
  .token-crowdsale-name {
    margin-top: 12px;
  }
  .token-crowdsale-item {
    margin-top: 12px;
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
</style>
