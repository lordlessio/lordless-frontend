<template>
  <el-dialog
    :visible.sync="buyModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent`"
    width="100%"
    append-to-body
    center
    top="50px"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close light">
        <i class="el-icon-close"></i>
      </span>
      <div class="text-center dialog-buy-cnt">
        <div class="ldb-buy-poster">
          <img-box type="span" :src="ldbInfo.ldbIcon.sourceUrl"></img-box>
        </div>
        <div class="ldb-buy-info">
          <p>You are going to buy</p>
          <h1 class="TTFontBolder ldb-info-name">{{ ldbInfo.name.zh }}</h1>
          <p class="ldb-coords color-yellow">{{ ldbInfo.chainSystem.lng | sliceStr }}, {{ ldbInfo.chainSystem.lat | sliceStr }}</p>
        </div>
        <p class="ldb-buy-markline"></p>
        <div class="TTFontBolder ldb-buy-bottom">
          <p>Price</p>
          <h1 class="color-yellow ldb-buy-price">{{ ldbInfo.chainSystem.value }} ETH</h1>
          <div class="ldb-buy-btn">
            <ld-btn
              class="TTFontBolder lordless-message-btn"
              theme="info"
              shadow
              :disabled="buyChoose || buyPending || !enoughBalance"
              @click="buyLdb">
              <span class="buy-confirm" v-if="enoughBalance && !buyPending">Confirm</span>
              <span class="d-inline-flex f-align-center buy-no-balance" v-if="!enoughBalance && !buyPending">
                <span class="inline-block buy-warning-svg">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-warning"/>
                  </svg>
                </span>
                <span>Insufficient balance</span>
              </span>
              <span v-if="buyPending">Pending</span>
            </ld-btn>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ImgBox from '@/components/stories/image'
import LdBtn from '@/components/stories/button'

import { mapState } from 'vuex'
export default {
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
  data: () => {
    return {
      buyModel: false,
      buyPending: false,
      buyChoose: false
    }
  },
  computed: {
    ...mapState('contract', [
      'ldbNFTCrowdsaleContract'
    ]),

    enoughBalance () {
      return parseFloat(this.$root.$children[0].web3Opt.balance) >= parseFloat(this.ldbInfo.chainSystem.value)
    },

    account () {
      return this.$root.$children[0].web3Opt.address
    }
  },
  components: {
    ImgBox,
    LdBtn
  },
  methods: {
    async buyLdb () {
      const tokenId = this.ldbInfo.tokenId
      if (!tokenId) return

      console.log('this.ldbInfo', this.ldbInfo)
      const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract

      // 根据 tokenId 获取建筑链上信息
      const ldb = await ldbNFTCrowdsaleContract.getAuction(tokenId)
      const from = this.account
      console.log('ldb', from, ldb[1].toNumber(), tokenId)

      this.buyChoose = true

      // 根据链上信息购买建筑
      ldbNFTCrowdsaleContract.payByEth(tokenId, {
        from,
        value: ldb[1]
      })
        .then(data => {
          this.buyPending = true
          this.$set(this.ldbInfo.chainSystem, 'sellStatus', 0)
          this.$emit('pending', data)
        })
        .catch(() => {
          this.buyChoose = false
        })
    }
  },
  watch: {
    value (val) {
      this.buyModel = val
      this.$emit('blurs', val)
    },
    buyModel (val) {
      this.$emit('input', val)
    },
    account (val) {
      this.buyModel = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    padding-bottom: 60px;
  }
  .dialog-buy-cnt {
    // transform: translateY(-150px);
    margin-top: -150px;
  }
  .ldb-buy-poster {
    margin-bottom: 45px;
    margin-left: 5%;
    margin-right: 5%;
    height: 300px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 2.5px 5px 10px 0 #4E47D3;
  }
  .ldb-info-name {
    margin-top: 8px;
    margin-bottom: 6px;
    font-size: 24px;
  }
  .ldb-buy-info {
    font-size: 18px;
  }
  .ldb-coords {
    font-size: 16px;
  }
  .ldb-buy-markline {
    margin: 38px auto;
    width: 55%;
    height: 0;
    border-bottom: 1px dashed #fff;
  }
  .ldb-buy-bottom {
    >p {
      font-size: 18px;
    }
  }
  .ldb-buy-price {
    margin-top: 8px;
    font-size: 24px;
  }
  .ldb-buy-btn {
    margin-top: 30px;
  }
  .buy-no-balance {

  }
  .buy-warning-svg {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    fill: #E47172;
  }
</style>
