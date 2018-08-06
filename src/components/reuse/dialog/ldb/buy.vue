<template>
  <el-dialog
    :visible.sync="buyModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent ${metaOpen ? 'blur' : ''}`"
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
        <!-- <div class="ldb-buy-poster">
          <img-box type="span" :src="ldbInfo.ldbIcon.source.detail"></img-box>
        </div>
        <div class="ldb-buy-info">
          <p>You are going to buy</p>
          <h1 class="TTFontBolder ldb-info-name">{{ ldbInfo.name.zh }}</h1>
          <p class="ldb-coords color-yellow">{{ ldbInfo.chain.lng | sliceStr }}, {{ ldbInfo.chain.lat | sliceStr }}</p>
        </div> -->
        <div class="text-left ldb-buy-top">
          <div class="TTFontBold text-nowrap ldb-info-box">
            <p>You are going to <span class="font-bold">BUY</span></p>
            <h2>{{ ldbInfo.name.zh }}</h2>
            <div class="d-flex ldb-influence-box">
              <div class="v-flex ldb-influence">
                <p class="TTFontNormal">Influence</p>
                <p>{{ ldbInfo.chain.influence }}</p>
              </div>
              <div class="v-flex ldb-level">
                <p class="TTFontNormal">Level</p>
                <p>{{ ldbInfo.chain.level }}</p>
              </div>
            </div>
            <div class="ldb-price">
              <p class="TTFontNormal">Price</p>
              <h2>{{ ldbInfo.chain.auction.price }} <span class="text-upper">ETH</span></h2>
            </div>
          </div>
          <div class="ldb-poster-box">
            <img-box type="span" contain :src="ldbInfo.ldbIcon.source.market"></img-box>
          </div>
        </div>
        <!-- <p class="ldb-buy-markline"></p> -->
        <div class="TTFontBolder ldb-buy-bottom">
          <!-- <p>Price</p>
          <h1 class="color-yellow ldb-buy-price">{{ ldbInfo.chain.auction.price }} ETH</h1> -->
          <div class="ldb-buy-btn">
            <ld-btn
              class="TTFontBolder lordless-message-btn"
              theme="info"
              shadow
              :loading="buyPending"
              :disabled="metamaskChoose || buyPending || !enoughBalance"
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
            </ld-btn>
          </div>
          <div class="contract-pending-tip" v-if="buyPending">
            <p>contract is pending, waiting for few minutes</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import ImgBox from '@/components/stories/image'
import LdBtn from '@/components/stories/button'

import { metamaskMixins } from '@/mixins'

import { mapState } from 'vuex'
export default {
  mixins: [ metamaskMixins ],
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
      buyModel: vm.value,
      buyPending: false
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

    metaOpen () {
      return this.$root.$children[0].metaOpen
    }
  },
  components: {
    ImgBox,
    LdBtn
  },
  methods: {
    async buyLdb () {
      const tokenId = this.ldbInfo.chain.tokenId
      if (!tokenId) return

      console.log('this.ldbInfo', this.ldbInfo)
      const NFTsCrowdsale = this.NFTsCrowdsale

      // 根据 tokenId 获取建筑链上信息
      const ldb = await NFTsCrowdsale.getAuction(tokenId)
      console.log('ldb', ldb[1].toNumber(), tokenId)

      this.metamaskChoose = true

      // 根据链上信息购买建筑
      NFTsCrowdsale.payByEth(tokenId, {
        // from,
        value: ldb[1]
      })
        .then(data => {
          this.buyPending = true
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
  @import '@/assets/stylus/mixin/index.scss';

  .lordless-message-box {
    position: relative;
    margin: 0;
    padding: 0 0 60px;
  }
  .dialog-buy-cnt {
    // transform: translateY(-150px);
    // margin-top: 50px;
    padding-top: 80px;
    overflow: hidden;
  }

  /* ldb-buy-top */

  .ldb-buy-top {
    position: relative;
  }
  .ldb-info-box {
    display: inline-block;
    margin: 30px 0;
    padding: 40px 30px 40px 60px;
    width: 330px;
    position: relative;
    z-index: 1;
    >p {
      font-size: 18px;
    }
    h2 {
      font-size: 24px;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -15%;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to right, #00C0EB, #3588FD);
      transform: skew(-15deg) translateZ(0);
      border-radius: 5px;
      z-index: -1;
      box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, .5);
    }
  }
  .ldb-influence-box {
    margin-top: 20px;
    margin-right: 40px;
    >div {
      >p {
        &:nth-of-type(1) {
          font-size: 16px;
          color: #F8F8F8;
        }
        &:nth-of-type(2) {
          font-size: 18px;
        }
      }
    }
  }
  .ldb-price {
    margin-top: 45px;
    >p {
      font-size: 16px;
      color: #F8F8F8;
    }
  }

  // ldb-poster-box
  .ldb-poster-box {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - 65px);
    height: 100%;
    margin-left: 80px;
    padding-left: 200px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-color: #fff;
    /deep/ .image-box {
      width: 100%;
      height: 100%;
      >span {
        background-position-y: 60%;
      }
    }
  }

  /* ldb-buy-bottom */

  .ldb-buy-bottom {
    margin-top: 50px;
  }
  .buy-no-balance {

  }
  .buy-warning-svg {
    margin-right: 5px;
    width: 20px;
    height: 20px;
    fill: #E47172;
  }
  // .ldb-buy-poster {
  //   margin-bottom: 45px;
  //   margin-left: 5%;
  //   margin-right: 5%;
  //   height: 300px;
  //   border-radius: 10px;
  //   overflow: hidden;
  //   box-shadow: 2.5px 5px 10px 0 #4E47D3;
  // }
  // .ldb-info-name {
  //   margin-top: 8px;
  //   margin-bottom: 6px;
  //   font-size: 24px;
  // }
  // .ldb-buy-info {
  //   font-size: 18px;
  // }
  // .ldb-coords {
  //   font-size: 16px;
  // }
  // .ldb-buy-markline {
  //   margin: 38px auto;
  //   width: 55%;
  //   height: 0;
  //   border-bottom: 1px dashed #fff;
  // }
  // .ldb-buy-bottom {
    // >p {
    //   font-size: 18px;
    // }
  // }
  // .ldb-buy-price {
  //   margin-top: 8px;
  //   font-size: 24px;
  // }
</style>
