<template>
  <el-dialog
    :visible.sync="sellModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent ${metaOpen ? 'blur' : ''}`"
    width="100%"
    append-to-body
    center
    top="0"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close light">
        <i class="el-icon-close"></i>
      </span>
      <div class="text-center dialog-sell-cnt">
        <h1>Sell LDB</h1>
        <p class="text-left"><span>#{{ ldbInfo.chain.tokenId }}</span> will be placed for auction. When time expires, you need to cancel the auction, and then <span>#{{ ldbInfo.chain.tokenId }}</span> will be set free for sale.</p>
        <div class="dialog-sell-middle">
          <ld-input
            v-model="sellInputs.price.model"
            type="text"
            number
            required
            :placeholder="sellInputs.price.placeholder"
            :symbol="sellInputs.price.symbol"
            :regex="sellInputs.price.regex"
            :regexError="sellInputs.price.regexError"
            @change="priceChange"
            @blur="priceBlur">
          </ld-input>
          <ld-input
            v-model="sellInputs.duration.model"
            type="text"
            number
            required
            :placeholder="sellInputs.duration.placeholder"
            :symbol="sellInputs.duration.symbol"
            :regex="sellInputs.duration.regex"
            :regexError="sellInputs.duration.regexError"
            @change="durationChange"
            @blur="durationBlur">
          </ld-input>
        </div>
        <div class="TTFontBolder ldb-sell-bottom">
          <div class="ldb-sell-btn">
            <ld-btn
              class="TTFontBolder lordless-message-btn"
              theme="info"
              shadow
              :loading="sellPending"
              :disabled="metamaskChoose || sellPending"
              @click="sellLdb">
              <span class="sell-confirm" v-if="!sellPending">Sell</span>
            </ld-btn>
          </div>
          <div class="contract-pending-tip" v-if="sellPending">
            <p>contract is pending, waiting for few minutes</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import LdBtn from '@/components/stories/button'
import LdInput from '@/components/stories/input'

import { metamaskMixins } from '@/mixins'

import { mapState } from 'vuex'
export default {
  mixins: [metamaskMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },

    ldbInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: (vm) => {
    return {
      sellModel: vm.value,
      sellPending: false,
      sellInputs: {
        price: {
          model: vm.ldbInfo.chain.auction.price || 0,
          placeholder: 'Price',
          symbol: 'ETH',
          regex: /^[0-9.]+$/,
          regexError: 'Only integer is valid',
          required: true
        },
        duration: {
          model: 30,
          placeholder: 'Duration',
          symbol: 'Days',
          regex: /^[0-9]+$/,
          regexError: 'Only integer is valid',
          required: true
        }
      }
    }
  },
  computed: {
    ...mapState('contract', [
      'NFTsCrowdsale'
    ]),

    enoughBalance () {
      return parseFloat(this.$root.$children[0].web3Opt.balance) >= parseFloat(this.ldbInfo.chain.auction.price)
    },

    account () {
      return this.$root.$children[0].web3Opt.address
    },

    sellRequired () {
      const { price, duration } = this.sellInputs
      return price.required && duration.required
    },

    metaOpen () {
      return this.$root.$children[0].metaOpen
    }
  },
  components: {
    LdBtn,
    LdInput
  },
  methods: {
    priceChange ({ required }) {
      this.$set(this.sellInputs.price, 'required', required)
    },
    priceBlur ({ required }) {
      this.$set(this.sellInputs.price, 'required', required)
    },
    durationChange ({ required }) {
      this.$set(this.sellInputs.duration, 'required', required)
    },
    durationBlur ({ required }) {
      this.$set(this.sellInputs.duration, 'required', required)
    },
    async sellLdb () {
      const tokenId = this.ldbInfo.chain.tokenId
      if (!tokenId || !this.sellRequired) return

      const NFTsCrowdsale = this.NFTsCrowdsale
      const { web3js } = this.$root.$children[0].web3Opt
      const price = parseFloat(this.sellInputs.price.model)
      const duration = parseFloat(this.sellInputs.duration.model)
      const endTime = Math.floor(new Date().getTime() / 1000) + duration * 3600 * 24
      console.log('--- sale price', price, tokenId, endTime)

      this.metamaskChoose = true
      NFTsCrowdsale.newAuction(web3js.toWei(price), tokenId, endTime)
        .then(data => {
          this.sellPending = true
          this.metamaskChoose = false
          this.$emit('pending', data)
        })
        .catch(() => {
          this.metamaskChoose = false
        })
    }
  },
  watch: {
    value (val) {
      this.sellModel = val
      this.$emit('blurs', val)
    },
    sellModel (val) {
      this.$emit('input', val)
    },
    account (val) {
      this.sellModel = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .lordless-message-box {
    padding-bottom: 60px;
  }
  .dialog-sell-cnt {
    // transform: translateY(-150px);
    // margin-top: -150px;
    >h1 {
      font-size: 36px;
    }
    >p {
      font-size: 16px;
      @include margin('top', 40px, 1);
      >span {
        font-size: 18px;
        font-family: $--font-TTNormsMedium;
      }
    }
  }
  .dialog-sell-middle {
    font-size: 18px;
    margin: 30px auto 0;
    width: 280px;
    line-height: 30px;
    font-size: 18px;
    overflow: hidden;
    >div {
      &:not(:first-of-type) {
        margin-top: 40px;
      }
    }
  }

  .ldb-sell-bottom {
    margin-top: 60px;
  }

  .ldb-sell-bottom {
    >p {
      font-size: 18px;
    }
  }

  .ldb-sell-btn {
  }
</style>
