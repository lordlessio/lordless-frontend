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
    <div class="text-center lordless-message-box lordless-lucky-conditions-dialog">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h2>Conditions</h2>
      <div class="block-conditions-info">
        <h3>WALLET</h3>
        <div class="block-conditions-item">
          <p class="conditions-token-status">
            <span class="inline-block line-height-0 block-conditions-icon">
              <svg>
                <use xlink:href="#icon-radio-selected"/>
              </svg>
            </span>
            <span class="text-upper">{{ ethBet.count.toLocaleString() }} ETH</span>
          </p>
          <p class="conditions-warn-text">Still need <span class="color-yellow">{{ ethBet.count | formatDecimal }}</span> more <span class="text-upper">ETH</span></p>
        </div>
        <div class="block-conditions-item"
          v-for="(bet, index) of tokenBets" :key="index">
          <p class="conditions-token-status">
            <span class="inline-block line-height-0 block-conditions-icon">
              <svg>
                <use xlink:href="#icon-radio-selected"/>
              </svg>
            </span>
            <span class="text-upper">{{ bet.candy.count.toLocaleString() }} {{ bet.candy.symbol }}</span>
          </p>
          <p class="conditions-warn-text">Still need <span class="color-yellow">{{ bet.candy.count }}</span> more <span class="text-upper">{{ bet.candy.symbol }}</span></p>
        </div>
        <p class="conitions-item-desc">Your wallet balance of designated token is insufficient. Try to purchase some more in the exchanges please.</p>
      </div>
      <div class="block-conditions-info">
        <h3>CONTRACT</h3>
        <div class="block-conditions-item"
          v-for="(bet, index) of tokenBets" :key="index">
          <span class="inline-block line-height-0 block-conditions-icon">
            <svg>
              <use xlink:href="#icon-radio-selected"/>
            </svg>
          </span>
          <span>Betting width {{ bet.candy.symbol }}</span>
        </div>
        <p class="conitions-item-desc">There is sufficient balance for you to win the game.</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
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
    ethBet: {
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
    }
  },
  watch: {
    value (val) {
      this.dialogModel = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-lucky-conditions-dialog {
    >h2 {
      font-size: 24px;
    }
  }
  .block-conditions-info {
    margin-top: 36px;
    >h3 {
      font-size: 18px;
    }
  }
  .block-conditions-item {
    margin-top: 12px;
    color: #fff;
    fill: #fff;
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
  .block-conditions-icon {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    fill: #fff;
  }
</style>
