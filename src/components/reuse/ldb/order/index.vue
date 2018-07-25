<template>
  <el-dialog
    :visible.sync="orderModel"
    custom-class="inline-block lordless-dialog message-dialog no-header center white"
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
            <img-box sType="height" src="/static/img/test/congratulation.png"></img-box>
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
                    src="/static/img/test/fandian-png-3.png">
                  </img-box>
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex order-cnt-right">
              <div class="d-flex col-flex order-ldb-info">
                <p class="d-flex f-align-center">
                  <span class="inline-block line-height-1">
                    <svg class="order-crown-svg">
                      <use :xlink:href="`#icon-crown-l${ldbInfo.levelSystem.level}`"/>
                    </svg>
                  </span>
                  <span class="order-ldb-name">{{ ldbInfo.name.zh }}</span>
                </p>
                <p class="order-ldb-address">{{ ldbInfo.address }}</p>
                <!-- <p class="d-flex row-flex f-align-center color-main">
                  <span class="order-reward-symbol">x </span>
                  <span class="order-reward-unit">1 LDB</span>
                </p> -->
              </div>
              <!-- <div class="d-flex col-flex order-ldb-reward">
                <p class="d-flex f-align-center order-tx-title">
                  <span class="inline-block order-tx-img">
                    <img-box src="/static/img/test/tx-img.png"></img-box>
                  </span>
                  <span>Transaction fee return</span>
                </p>
                <p class="d-flex f-align-center color-main">
                  <span class="order-reward-symbol">x</span>
                  <span class="order-reward-unit">{{ ldbInfo.chainSystem.value * 0.02 * 41666 }} LESS</span>
                </p>
              </div> -->
            </div>
          </div>
          <div class="d-flex f-align-center order-footer">
            <ld-button theme="info" shadow class="d-flex f-align-center TTFontBolder lordless-message-btn order-share-btn">
              <span>Copy link</span>
              <span class="mar-l1 line-height-0">
                <svg>
                  <use xlink:href="/static/svg/icon.svg#icon-share"/>
                </svg>
              </span>
            </ld-button>
            <ld-button theme="info" shadow class="order-footer-btn line-height-0">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-facebook"/>
              </svg>
            </ld-button>
            <ld-button theme="info" shadow class="order-footer-btn line-height-0">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-twitter"/>
              </svg>
            </ld-button>
            <ld-button theme="info" shadow class="order-footer-btn line-height-0">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
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
  data: () => {
    return {
      orderModel: false
    }
  },
  computed: {
    account () {
      return this.$root.$children[0].web3Opt.address
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
    @include padding('bottom', 80px, 1);
  }
  .order-header {
    >h1 {
      @include fontSize(36px, 1.2);
    }
    >p {
      @include margin('top', 3px);
      @include fontSize(18px, 1.2);
    }
  }
  .order-header-icon {
    @include height(250px, 1);
    @include margin('bottom', 25px, 1);
  }
  .order-markline {
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(15px, auto, 30px, auto, 1);
  }
  .order-container {
    position: relative;
    @include padding-around(0, 50px, 0, 50px, 1);
  }
  .order-cnt-right {
    @include margin('left', 30px, 1);
    @include fontSize(18px, 1);
    p {
      &:not(:first-of-type) {
        @include margin('top', 10px, 1);
      }
    }
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
    @include width(30px, 1);
    @include height(20px, 1);
  }
  .order-ldb-name {
    @include margin('left', 10px, 1);
  }
  .order-ldb-address {
    // @include fontSize(18px, 1);
  }

  .order-ldb-reward {
    @include margin('top', 30px, 1);
  }
  .order-tx-title {
    @include fontSize(22px, 1);
  }
  .order-tx-img {
    width: 16px;
    height: 16px;
    @include margin('right', 10px, 1);
  }
  .order-reward-symbol {
    @include fontSize(14px, 1);
  }
  .order-reward-unit {
    font-weight: 400;
    @include margin('left', 6px, 1);
  }

  .order-footer {
    @include margin('top', 50px, 1);
  }
  .order-share-btn {
    margin: 0;
    border-radius: 5px;
    @include padding-around(12px, 15px, 12px, 15px, 1);
    @include fontSize(16px, 1);
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .order-footer-btn {
    border-radius: 100%;
    margin: 0;
    @include margin('left', 25px, 1);
    @include padding(-1, 12px, 1);
    svg {
      width: 20px;
      height: 20px;
    }
  }
</style>
