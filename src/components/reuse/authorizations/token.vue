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
      <p>For Lucky Blocks</p>
      <ul>
        <li class="token-crowdsale-item"
          v-for="(bet, index) of tokenBets" :key="index">
          <p class="d-flex f-align-center token-crowdsale-symbol" @click="approveAllowance(bet)">
            <span class="inline-block token-bet-icon">
              <lordless-check-box
                v-model="allowanceModels[bet.candy.address]"
                :loading="allowancePendings[bet.candy.address]"
                @click="approveAllowance(bet)"
                :theme="theme"
                sync/>
            </span>
            <span class="TTFontBolder">Betting with <span class="text-upper">{{ bet.candy.symbol }}</span></span>
          </p>
          <p class="token-crowdsale-desc">Authorize the <a :href="contractLink" target="_blank">Luckyblock contract</a> to operate your <span class="text-upper">{{ bet.candy.symbol }}</span> on your behalf.</p>
        </li>
      </ul>
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
      'airdropTokens',
      'tokenAllowances'
    ]),

    contractLink () {
      return `${process.env.ETHERSCANURL}/address/${this.luckyAddress}#code`
    },

    luckyAddress () {
      return this.Luckyblock ? this.Luckyblock.address : ''
    },

    web3Opt () {
      return this.$root.$children[0].web3Opt
    },

    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_SET_TOKEN_ALLOWANCE
    ]),

    checkAllowance (address = this.account, luckyAddress = this.luckyAddress, tokenAllowances = this.tokenAllowances, allowanceModels = this.allowanceModels) {
      for (const bet of this.tokenBets) {
        const { candy } = bet
        const tokenApproveKey = `lordless_token_approve_${address}_${candy.address}_${luckyAddress}`
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
     * 授权erc20合约
     */
    async approveAllowance ({ address = this.account, luckyAddress = this.luckyAddress, airdropTokens = this.airdropTokens, web3Opt = this.web3Opt, candy, count } = {}) {
      candy = typeof candy === 'object' ? candy.address : candy
      this.$set(this.allowancePendings, candy, true)

      const { gasPrice } = web3Opt

      // 传输的合约参数
      const setApprove = {
        name: 'approve',
        values: [ luckyAddress, 1e30 ]
      }

      // 估算 gas
      const gas = (await airdropTokens[candy].estimateGas(setApprove.name, setApprove.values)) || 120000
      console.log('gas', gas, luckyAddress, candy, address)

      // metamask 是否被打开
      this.metamaskChoose = true

      // 授权给合约 erc20 可操作数量为 1e30
      airdropTokens[candy].methods(setApprove.name, setApprove.values.concat([{ from: address, gas, gasPrice }]))
        .then(tx => {
          this.metamaskChoose = false
          this.loopCheckTokenAllowance({ luckyAddress, candy, count })
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
    async loopCheckTokenAllowance ({ address = this.account, luckyAddress = this.luckyAddress, airdropTokens = this.airdropTokens, candy = '', count = 0 } = {}) {
      if (!address) return

      candy = candy.toLocaleLowerCase()

      console.log(' ====== come in loopCheckTokenAllowance')

      let timeout = null
      const loopFunc = () => {
        const tokenApproveKey = `lordless_token_approve_${address}_${candy}_${luckyAddress}`
        localStorage.setItem(tokenApproveKey, true)

        // 创建新定时器实例
        timeout = setTimeout(async () => {
          const allowance = await this[actionTypes.CONTRACT_SET_TOKEN_ALLOWANCE]({ address, candy, luckyAddress, contract: airdropTokens[candy] })

          console.log('tokenApproveKey', tokenApproveKey, allowance)
          clearTimeout(timeout)
          timeout = null

          console.log('----- loopCheckTokenAllowance', luckyAddress, candy, count, this.tokenAllowances[candy])
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
      .token-crowdsale-box {
        >p {
          color: #999;
        }
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
      .token-crowdsale-box {
        >p {
          color: #BDB9FD;
        }
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
    >p {
      margin-top: 12px;
    }
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
