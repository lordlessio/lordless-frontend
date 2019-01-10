<template>
  <el-dialog
    :visible.sync="dialogModel"
    custom-class="inline-block lordless-dialog message-dialog no-header transparent center full-style"
    width="100%"
    append-to-body
    center
    top="0"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="text-center lordless-message-box full-style lordless-lucky-conditions-dialog">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h2>Conditions</h2>
      <div class="text-left block-conditions-info" v-if="ethBets.conditions">
        <h3>WALLET</h3>
        <div class="block-conditions-item" :class="{ 'is-error': !ethBets.conditions.enough }">
          <p class="d-flex f-align-center conditions-token-status">
            <span class="inline-block line-height-0 block-conditions-icon">
              <svg>
                <use :xlink:href="`#icon-${ethBets.conditions.enough ? 'radio-selected' : 'stop'}`"/>
              </svg>
            </span>
            <span class="text-upper">{{ weiByDecimals(ethBets.count).toLocaleString() }} ETH</span>
          </p>
          <p class="conditions-warn-text">Still need <span class="color-yellow">{{ formatDecimal(weiByDecimals(ethBets.conditions.need)).toLocaleString() }}</span> more <span class="text-upper">ETH</span></p>
        </div>
        <div v-if="tokenBets && tokenBets.length">
          <div
            class="block-conditions-item"
            :class="{ 'is-error': !bets.conditions.enough }"
            v-for="(bets, index) of tokenBets" :key="index">
            <p class="d-flex f-align-center conditions-token-status">
              <span class="inline-block line-height-0 block-conditions-icon">
                <svg>
                  <use :xlink:href="`#icon-${bets.conditions.enough ? 'radio-selected' : 'stop'}`"/>
                </svg>
              </span>
              <span class="text-upper">{{ formatDecimal(weiByDecimals(bets.count)).toLocaleString() }} {{ bets.candy.symbol }}</span>
            </p>
            <p class="conditions-warn-text">Still need <span class="color-yellow">{{ formatDecimal(weiByDecimals(bets.conditions.need, bets.candy.decimals)).toLocaleString() }}</span> more <span class="text-upper">{{ bets.candy.symbol }}</span></p>
          </div>
        </div>
        <p class="conitions-item-desc">Your wallet balance of designated token is insufficient. Try to purchase some more in the exchanges please.</p>
      </div>
      <div class="text-left block-conditions-info" v-if="contractInfo">
        <h3>CONTRACT</h3>
        <div v-if="contractInfo.ethBalance" class="d-flex f-align-center block-conditions-item">
          <span class="inline-block line-height-0 block-conditions-icon">
            <svg>
              <use xlink:href="#icon-radio-selected"/>
            </svg>
          </span>
          <span>{{ formatDecimal(weiByDecimals(contractInfo.ethBalance)).toLocaleString() }} ETH</span>
        </div>
        <div v-if="contractInfo.tokenWinnings && contractInfo.tokenWinnings.length">
          <div class="d-flex f-align-center block-conditions-item"
            v-for="(winnings, index) of contractInfo.tokenWinnings" :key="index">
            <span class="inline-block line-height-0 block-conditions-icon">
              <svg>
                <use xlink:href="#icon-radio-selected"/>
              </svg>
            </span>
            <span>{{ formatDecimal(weiByDecimals(winnings.tokenBalance, winnings.candy.decimals)).toLocaleString() }} {{ winnings.candy.symbol }}</span>
          </div>
        </div>
        <p class="conitions-item-desc">There is sufficient balance for you to win the game.</p>
      </div>
      <lordless-btn theme="dialog" class="block-conditions-btn" @click="$emit('input', false)">
        <p v-if="!lessBetsEnough" class="purchase-less-info">
          <a class="d-flex f-align-center" href="https://ddex.io/trade/LESS-WETH" target="_blank">
            <img class="ddex-logo" src="//lordless-sh.oss-cn-shanghai.aliyuncs.com/exchanges/icon/DDEX.svg"/>
            <span>Purchase LESS</span>
          </a>
        </p>
        <span v-else>Got it</span>
      </lordless-btn>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { weiByDecimals, formatDecimal } from 'utils/tool'
export default {
  name: 'lordless-lucky-conditions',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tokenBets: {
      type: Array,
      default: () => []
    },
    ethBets: {
      type: Object,
      default: () => {}
    },
    contractInfo: {
      type: Object,
      default: () => {}
    }
  },
  data: () => {
    return {
      dialogModel: false
    }
  },
  computed: {
    ...mapState('contract', [
      'Luckyblock'
    ]),

    contractLink () {
      return `${process.env.ETHERSCANURL}/address/${this.Luckyblock ? this.Luckyblock.address : ''}#code`
    },

    lessBetsEnough () {
      console.log('----- lessBetsEnough', this.tokenBets.filter(bets => {
        return !bets.conditions.enough && bets.candy.symbol.toLocaleUpperCase() === 'LESS'
      }))
      return !this.tokenBets.filter(bets => {
        return !bets.conditions.enough && bets.candy.symbol.toLocaleUpperCase() === 'LESS'
      }).length
    }
  },
  watch: {
    value (val) {
      this.dialogModel = val
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },
    formatDecimal () {
      return formatDecimal(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-lucky-conditions-dialog {
    @media screen and (max-width: 768px) {
      padding-top: 60px;
      padding-bottom: 10px;
    }
    >h2 {
      font-size: 24px;
    }
  }
  .block-conditions-info {
    margin-top: 36px;
    font-size: 16px;
    >h3 {
      font-size: 18px;
    }
  }
  .block-conditions-item {
    margin-top: 12px;
    color: #fff;
    fill: #fff;
    &.is-error {
      .conditions-token-status {
        color: #F5515F;
        fill: #F5515F;
      }
      .conditions-warn-text {
        display: block;
      }
    }
  }
  .conditions-warn-text {
    display: none;
    margin-top: 4px;
    font-size: 14px;
    color: #BDB9FD;
  }
  .conitions-item-desc {
    margin-top: 12px;
    @include TTFontBolder();
  }
  .conditions-token-status {
    fill: #fff;
  }
  .block-conditions-icon {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
  .block-conditions-btn {
    padding: 12px 14px;
    margin-top: 36px;
  }
  .purchase-less-info {
    margin: 0 6px;
    color: #0024FF;
  }
  .ddex-logo {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
</style>
