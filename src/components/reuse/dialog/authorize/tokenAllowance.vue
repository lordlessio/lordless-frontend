<template>
  <div v-if="value" class="crowdsale-box">
    <div v-if="isMobile" class="text-center mobile-crowdsale-container">
      <h2>Token Approve</h2>
      <p>Authorize the Token contract to luckydrop contract</p>
      <div
        class="d-flex f-align-center token-crowdsale-item"
        v-for="(bet, index) of tokenBets" :key="index">
        <p class="v-flex text-left">{{ bet.candy.symbol }}</p>
        <lordless-btn
          class="TTFontBolder crowdsale-btn"
          theme="dialog"
          shadow
          :loading="allowancePendings[bet.candy.address]"
          :disabled="allowancePendings[bet.candy.address] || allowanceModels[bet.candy.address]"
          @click="approveAllowance(bet)">{{ allowanceModels[bet.candy.address] ? 'Allowed' : 'Go' }}</lordless-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { metamaskMixins, publicMixins } from '@/mixins'

import { mutationTypes } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [metamaskMixins, publicMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },

    tokenBets: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      allowanceModels: {},
      allowancePendings: {}
    }
  },
  computed: {
    ...mapState('contract', [
      'Luckydrop',
      'airdropTokens',
      'tokenAllowances'
    ]),

    luckyAddress () {
      return this.Luckydrop.address
    },

    web3Opt () {
      return this.$root.$children[0].web3Opt
    },

    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    },

    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  watch: {
    value (val) {
      val && this.initTokenAllowance()
    },
    tokenAllowances (obj) {
      for (const bet of this.tokenBets) {
        const { candy } = bet
        this.$set(this.allowancePendings, candy.address, obj[candy.address] === undefined)
      }
    },
    allowanceModels (obj) {
      const keys = Object.keys(obj)
      const bool = !!keys.filter(key => !!obj[key]).length
      if (keys.length === this.tokenBets.length && bool) {
        console.log('--- allowance success')
        this.$emit('success')
      }
    }
  },
  methods: {
    ...mapMutations('contract', [
      mutationTypes.CONTRACT_SET_TOKEN_ALLOWANCE
    ]),

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
    },

    /**
     * 授权erc20合约
     */
    async approveAllowance ({ address = this.account, luckyAddress = this.luckyAddress, airdropTokens = this.airdropTokens, web3Opt = this.web3Opt, candy, count } = {}) {
      candy = typeof candy === 'object' ? candy.address : candy
      this.$set(this.allowancePendings, candy, true)

      // metamask 是否被打开
      this.metamaskChoose = true

      const { gasPrice } = web3Opt

      // 传输的合约参数
      const setApprove = {
        name: 'approve',
        values: [ luckyAddress, 1e30 ]
      }

      // 估算 gas
      const gas = (await airdropTokens[candy].estimateGas(setApprove.name, setApprove.values)) || 300000
      console.log('gas', gas, luckyAddress, candy, address)

      // 授权给合约 erc20 可操作数量为 1e30
      airdropTokens[candy].methods(setApprove.name, setApprove.values.concat([{ from: this.address, gas, gasPrice }]))
        .then(tx => {
          this.metamaskChoose = false
          this.loopCheckTokenAllowance({ luckyAddress, candy, count }, () => {
            this.$set(this.allowanceModels, candy, true)
          })
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
    async loopCheckTokenAllowance ({ address = this.account, luckyAddress = this.luckyAddress, airdropTokens = this.airdropTokens, candy = '', count = 0 } = {}, cb) {
      if (!address) return

      candy = candy.toLocaleLowerCase()

      let timeout = null
      const loopFunc = () => {
        // 创建新定时器实例
        timeout = setTimeout(async () => {
          // const allowance = await airdropTokens[candy].methods('allowance', [ address, candy ])
          this[mutationTypes.CONTRACT_SET_TOKEN_ALLOWANCE]({ address, candy, luckyAddress, tokenContract: airdropTokens[candy] })
          clearTimeout(timeout)
          timeout = null

          if (!this.value) {
            return
          }
          console.log('----- loopCheckTokenAllowance', luckyAddress, candy, count, this.tokenAllowances[candy])
          if (this.tokenAllowances[candy] >= count) {
            return cb && cb()
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
  }
}
</script>

<style lang="scss" scoped>
  .crowdsale-box {
    padding-bottom: 10px;
    border-radius: 5px;
  }
  .mobile-crowdsale-container {
    >h2 {
      font-size: 24px;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
    }
  }
  .crowdsale-container {
    position: relative;
  }
  .crowdsale-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
  }
  .crowdsale-cnt-box {
    margin-top: 30px;
    font-size: 18px;
  }
  .crowdsale-cnt-top {
    margin-bottom: 30px;
  }
  .crowdsale-info-text {
    font-size: 20px;
    >a {
      color: $--text-yellow-color;
    }
  }
  .crowdsale-markline {
    margin: 15px auto 25px;
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(30px, auto, 45px, auto, 1);
  }
  // .crowdsale-choose {
  //   width: 26px;
  //   height: 26px;
  //   border-radius: 5px;
  //   overflow: hidden;
  //   background-color: $--secondary-color;
  // }
  .crowdsale-text {
    margin-left: 10px;
    font-size: 18px;
  }
  .token-crowdsale-item {
    margin-top: 40px;
  }
  .crowdsale-btn {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
  }
</style>
