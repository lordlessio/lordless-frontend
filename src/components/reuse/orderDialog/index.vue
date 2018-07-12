<template>
  <el-dialog
    :visible.sync="value"
    custom-class="lordless-dialog no-header white"
    width="600px"
    :close-on-click-modal="false"
    :center="true"
    append-to-body
    :show-close="false">
    <div class="order-box">
      <span @click.stop="$emit('input', false)" class="inline-block line-height-1 order-close">
        <i class="el-icon-close"></i>
      </span>
      <div class="text-center order-header">
        <div class="order-header-icon">
          <img-box sType="height" src="/static/img/test/congratulation.png"></img-box>
        </div>
        <h1 class="color-main TTNormsBold">Congratulations</h1>
      </div>
      <div class="order-markline text-center">
        <span class="inline-block TTNormsBold">You've got</span>
      </div>
      <div class="d-flex row-flex order-container">
        <div class="order-cnt-left">
          <div class="order-cnt-poster">
            <img-box class="order-poster" sType="height" :src="ldbInfo.ldbIcon.mapImg"></img-box>
          </div>
        </div>
        <div class="v-flex d-flex col-flex order-cnt-right">
          <div class="d-flex col-flex order-ldb-info">
            <p class="d-flex f-align-baseline">
              <span class="inline-block line-height-1">
                <svg class="order-crown-svg">
                  <use :xlink:href="`#icon-crown-l${ldbInfo.levelSystem.level}`"/>
                </svg>
              </span>
              <span class="order-ldb-name">{{ ldbInfo.name.zh }}</span>
            </p>
            <p class="order-ldb-address">{{ ldbInfo.address }}</p>
            <p class="d-flex row-flex f-align-center color-main">
              <span class="order-reward-symbol">x </span>
              <span class="order-reward-unit">1 LDB</span>
            </p>
          </div>
          <div class="d-flex col-flex order-ldb-reward">
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
          </div>
        </div>
      </div>
      <div class="d-flex f-align-center f-justify-center order-footer">
        <ld-button theme="pink-gray" class="d-flex f-align-center order-share-btn TTNormsBold">
          <span>SHARE</span>
          <span class="mar-l1 line-height-0">
            <svg>
              <use xlink:href="/static/svg/icon.svg#icon-share"/>
            </svg>
          </span>
        </ld-button>
        <ld-button theme="purple" class="order-footer-btn line-height-0">
          <svg>
            <use xlink:href="/static/svg/icon.svg#icon-facebook"/>
          </svg>
        </ld-button>
        <ld-button theme="purple" class="order-footer-btn line-height-0">
          <svg>
            <use xlink:href="/static/svg/icon.svg#icon-twitter"/>
          </svg>
        </ld-button>
        <ld-button theme="purple" class="order-footer-btn line-height-0">
          <svg>
            <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
          </svg>
        </ld-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import LdButton from '@/components/stories/button'
import ImgBox from '@/components/stories/image'
// import CheckBox from '@/components/stories/checkbox'
export default {
  name: 'lordless-order',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'submit'
    },
    submitText: {
      type: String,
      default: '确 定'
    },
    cancelText: {
      type: String,
      default: '取 消'
    },
    isSyncSubmit: {
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
  components: {
    LdButton,
    ImgBox
  },
  methods: {
    submit () {
      if (this.isSyncSubmit) {
        this.$emit('submit', () => {
          this.$emit('input', false)
        })
      } else {
        this.$emit('submit')
        this.$emit('input', false)
      }
    }
  },
  watch: {
    value (val) {
      if (!val) this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/class_mixin.scss';
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .order-box {
    width: inherit;
    height: inherit;
    color: $--text-main-color;
    @include margin-around(-25px, -25px, -30px, -25px, 1);
    @include padding-around(40px, 30px, 30px, 30px, 1);
  }
  .order-close {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: $--text-secondary-color;
    z-index: 9;
    @include fontSize(40px, 1.5);
  }
  .order-header {
    >h1 {
      @include fontSize(34px, 1.5);
    }
  }
  .order-header-icon {
    height: 120px;
    @include margin('bottom', 25px, 1);
  }
  .order-markline {
    height: 2px;
    background-color: #ddd;
    border-radius: 100px;
    @include margin('top', 50px, 1);
    @include margin('bottom', 60px, 1);
    >span {
      font-weight: 500;
      color: #909090;
      background-color: #fff;
      transform: translateY(-50%);
      @include padding-around(0, 15px, 0, 15px, 1);
    }
  }
  .order-container {
    position: relative;
    @include padding-around(0, 35px, 0, 35px, 1);
  }
  .order-cnt-right {
    @include margin('left', 30px, 1);
    @include fontSize(16px, 1);
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
    @include padding('top', 100px, 1.5);
    @include width(100px, 1.5);
  }
  .order-poster {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    @include padding(-1, 10px, 1.5);
  }
  .order-crown-svg {
    @include width(25px, 1);
    @include height(18px, 1);
  }
  .order-ldb-name {
    @include margin('left', 10px, 1);
    @include fontSize(22px, 1);
  }
  .order-ldb-address {
    color: $--text-secondary-color;
    @include fontSize(18px, 1);
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
    @include margin('top', 35px, 1);
  }
  .order-share-btn {
    border-radius: 100px;
    @include padding-around(10px, 23px, 10px, 23px, 1);
    svg {
      width: 20px;
      height: 20px;
    }
  }
  .order-footer-btn {
    border-radius: 100px;
    @include padding(-1, 10px, 1);
    svg {
      width: 15px;
      height: 15px;
    }
  }
</style>
