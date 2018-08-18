<template>
  <el-dialog
    :visible.sync="orderModel"
    :custom-class="`inline-block lordless-dialog message-dialog no-header transparent center ${metaOpen ? 'blur' : ''}`"
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
      <div class="ldb-order-box">
        <div class="text-center order-header">
          <div class="order-header-icon">
            <img-box sType="height" src="/static/svg/single/congra.svg"></img-box>
          </div>
          <h1 class="TTNormsBold">Congratulations</h1>
          <p>You've got</p>
        </div>
        <p class="order-markline"></p>
        <div class="order-container">
          <div class="d-flex row-flex">
            <div class="order-cnt-left">
              <div class="order-cnt-poster">
                <div class="order-poster">
                  <img-box
                    sType="height"
                    type="span"
                    :src="ldbInfo.ldbIcon.source.preview | reldbIcon">
                  </img-box>
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex order-cnt-right">
              <div class="d-flex col-flex order-ldb-info">
                <p class="d-flex f-align-center order-ldb-name">
                  <!-- <span class="inline-block line-height-1">
                    <svg class="order-crown-svg">
                      <use :xlink:href="`#icon-crown-l${ldbInfo.chain.level}`"/>
                    </svg>
                  </span> -->
                  <!-- <span class="order-ldb-name">{{ ldbInfo.name.zh }}</span> -->
                  {{ ldbInfo.name.zh }}
                </p>
                <p class="order-ldb-tokenId">#{{ ldbInfo.chain.tokenId }}</p>
                <p class="order-ldb-address">{{ ldbInfo.address }}</p>
                <!-- <p class="d-flex row-flex f-align-center color-main">
                  <span class="order-reward-symbol">x </span>
                  <span class="order-reward-unit">1 LDB</span>
                </p> -->
              </div>
              <!-- <div class="d-flex col-flex order-ldb-reward">
                <p class="d-flex f-align-center order-tx-title">
                  <span class="inline-block order-tx-img">
                    <img-box src="~static/img/test/tx-img.png"></img-box>
                  </span>
                  <span>Transaction fee return</span>
                </p>
                <p class="d-flex f-align-center color-main">
                  <span class="order-reward-symbol">x</span>
                  <span class="order-reward-unit">{{ ldbInfo.chain.auction.price * 0.02 * 41666 }} LESS</span>
                </p>
              </div> -->
            </div>
          </div>
          <div class="d-flex f-align-center order-footer">
            <ld-button theme="blue" shadow class="d-flex f-align-center TTFontBolder lordless-message-btn order-share-btn">
              <span>Copy link</span>
              <span class="mar-l1 line-height-0">
                <svg>
                  <use xlink:href="#icon-share"/>
                </svg>
              </span>
            </ld-button>
            <ld-button theme="blue" shadow class="order-footer-btn line-height-0">
              <svg>
                <use xlink:href="#icon-facebook"/>
              </svg>
            </ld-button>
            <ld-button theme="blue" shadow class="order-footer-btn line-height-0">
              <svg>
                <use xlink:href="#icon-twitter"/>
              </svg>
            </ld-button>
            <ld-button theme="blue" shadow class="order-footer-btn fill line-height-0">
              <svg>
                <use xlink:href="#icon-google+"/>
              </svg>
            </ld-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import LdButton from '@/components/stories/button'
import ImgBox from '@/components/stories/image'

// import { mutationTypes } from '@/store/types'
// import { mapMutations } from 'vuex'
export default {
  name: 'lordless-order',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ldbInfo: {
      type: Object,
      default: () => {
        return {
          ldbIcon: {}
        }
      }
    }
  },
  data: (vm) => {
    return {
      orderModel: vm.value
    }
  },
  computed: {
    account () {
      return this.$root.$children[0].web3Opt.address
    },

    metaOpen () {
      return this.$root.$children[0].metaOpen
    }
  },
  components: {
    LdButton,
    ImgBox
  },
  // methods: {
  //   ...mapMutations('layout', [
  //     mutationTypes.LAYOUT_SET_BLURS
  //   ])
  // },
  watch: {
    value (val) {
      this.orderModel = val
      this.$emit('blurs', val)
      // this[mutationTypes.LAYOUT_SET_BLURS](val ? 2 : 1)
    },
    orderModel (val) {
      this.$emit('input', val)
    },
    account () {
      this.orderModel = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .lordless-message-box {
    // @include padding('bottom', 60px, 1);
  }
  .order-header {
    >h1 {
      @include fontSize(36px, 1.2);
    }
    >p {
      margin-top: 3px;
      @include fontSize(18px, 1.2);
    }
  }
  .order-header-icon {
    margin-bottom: 25px;
    height: 260px;
  }
  .order-markline {
    margin: 15px auto 30px;
    width: 50%;
    height: 0;
    border-bottom: 1px dashed #fff;
  }
  .order-container {
    position: relative;
    padding: 0 50px;
  }
  .order-cnt-right {
    margin-left: 30px;
    font-family: $--font-TTNormsRegular;
    font-size: 18px;
  }
  .order-cnt-poster {
    position: relative;
    border-radius: 100%;
    // overflow: hidden;
    box-shadow: 5px 6px 20px 0px rgba(33, 33, 33, .2);
    background-color: #f5f5f5;
    overflow: hidden;
    @include padding('top', 90px, 1.5);
    @include width(90px, 1.5);
  }
  .order-poster {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    @include padding(-1, 12px, 1.5);
  }
  .order-crown-svg {
    width: 30px;
    height: 20px;
  }
  .order-ldb-name {
    font-size: 18px;
    // @include margin('left', 10px, 1);
  }
  .order-ldb-tokenId {
    font-size: 14px;
  }
  .order-ldb-address {
    margin-top: 8px;
    font-size: 16px;
    // @include fontSize(18px, 1);
  }

  .order-ldb-reward {
    margin-top: 30px;
  }
  .order-tx-title {
    font-size: 22px;
  }
  .order-tx-img {
    margin-right: 10px;
    width: 16px;
    height: 16px;
  }
  .order-reward-symbol {
    font-size: 14px;
  }
  .order-reward-unit {
    margin-left: 6px;
  }

  .order-footer {
    margin-top: 50px;
  }
  .order-share-btn {
    padding: 12px 15px;
    margin: 0;
    font-size: 16px;
    border-radius: 5px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .order-footer-btn {
    margin-left: 25px;
    padding: 12px;
    border: none;
    border-radius: 100%;
    svg {
      width: 20px;
      height: 20px;
    }
    // &:not(.fill) {
    //   fill: none;
    //   stroke: $--text-deep-blue-color;
    //   stroke-width: 1.5;
    // }
    // &.fill {
    //   fill: $--text-deep-blue-color;
    //   stroke: none;
    // }
  }
</style>
