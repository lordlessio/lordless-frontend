<template>
  <div class="user-info-section">
    <h2 class="info-cnt-title">Info Card</h2>
    <div v-if="loading || !user" class="d-flex f-align-center info-header-skeletion">
      <div class="v-flex d-flex f-align-center skeletion-breath">
        <p></p>
        <div class="v-flex">
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="d-flex col-flex f-align-end text-right">
        <p></p>
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-in-fade">
      <div
        v-if="!loading && user"
        class="d-flex f-align-start sm-f-align-center sm-col-flex relative user-info-header">
        <span class="inline-block header-ldentity-svg">
          <span class="inline-block header-ldentity-container" :class="{ 'lord': lord }">
            <svg>
              <use :xlink:href="`#icon-${lord ? 'logo-image' : 'sword'}`"/>
            </svg>
          </span>
        </span>
        <div class="user-avatar">
          <lordless-blockies
            theme="light"
            :scale="18"
            radius="20px"
            :seed="user.address"></lordless-blockies>
        </div>
        <div class="v-flex d-flex lg-f-align-center sm-text-center sm-col-reverse-flex info-header-cnt">
          <div class="v-flex header-cnt-text">
            <h2 class="d-flex f-align-center sm-f-justify-center">
              <span class="header-crown-svg">
                <svg>
                  <use xlink:href="#icon-crown-l5"/>
                </svg>
              </span>
              <span v-if="user.nickName">{{ user.nickName }}</span>
              <span v-else>{{ user._id | splitAddress({ before: 5, end: 2 }) }}</span>
              <span v-if="!owner" class="TTFontBolder user-level">Level {{ user.level }}</span>
              <span class="sm-hidden" v-if="owner">
                <lordless-btn
                  class="user-Authorize-btn"
                  :theme="isCrowdsaleApproved ? 'green' : 'red'"
                  inverse
                  @click="userAuthorize">
                  {{ isCrowdsaleApproved ? 'Authorized' : 'Unauthorized' }}
                </lordless-btn>
              </span>
            </h2>
            <p class="d-flex f-align-center">
              <span id="user-address" class="text-ellipsis">
                {{ user.address }}
              </span>
              <el-tooltip class="item" effect="dark" :content="clipBool ? 'Copied!' : 'Copy to clipboard'" placement="bottom-start">
                <span
                  id="copy-address"
                  class="inline-block line-height-1 paste-icon"
                  data-clipboard-target="#user-address"
                  @mouseleave="clipLeave">
                  <svg>
                    <use xlink:href="#icon-paste"/>
                  </svg>
                </span>
              </el-tooltip>
            </p>
            <p v-if="owner" class="user-eamil">{{ user.email }}</p>
            <p v-if="user.tags && user.tags.length" class="d-flex f-wrap f-align-center user-types">
              <span class="inline-block" v-for="(tag, index) of user.tags.slice(0, 20)" :key="index">{{ tag }}</span>
            </p>
          </div>
          <div v-if="owner" class="lg-text-right header-cnt-balance sm-hidden">
            <p>ETH Balance in wallet</p>
            <p class="eth-balance">{{ ethBalance | weiToEth }} ETH</p>
          </div>
        </div>
      </div>
    </transition>
    <Authorize
      v-if="owner && user"
      ref="authorize"
      :address="user.address"
      @blurs="dialogSetBlurs">
    </Authorize>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import Authorize from '@/components/reuse/dialog/authorize'
import { contractMixins, dialogMixins, publicMixins } from '@/mixins'
export default {
  mixins: [ contractMixins, dialogMixins, publicMixins ],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {
        return {}
      }
    },
    owner: {
      type: Boolean,
      default: false
    },
    lord: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      clipBool: false
    }
  },
  computed: {
    ethBalance () {
      return this.web3Opt.balance
    },

    isCrowdsaleApproved () {
      return this.$root.$children[0].isCrowdsaleApproved
    }
  },
  components: {
    Authorize
  },
  methods: {
    // 初始化 黏贴板
    initClipboard () {
      const clip = new Clipboard('#copy-address')
      clip.on('success', (e) => {
        this.clipBool = true
        e.clearSelection()
      })
    },
    clipLeave () {
      this.clipBool = false
    },

    userAuthorize () {
      if (this.isCrowdsaleApproved) return
      this.$refs.authorize.checkoutAuthorize({ guide: true, crowdsale: true })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initClipboard()
    })
  }
}
</script>

<style lang="scss" scoped>
  // info-header-skeletion
  .info-header-skeletion {
    padding: 25px;
    background-color: $--skeletion-light;
    p {
      background-color: $--skeletion-dark;
    }
    >div {
      &:nth-of-type(1) {
        >p {
          width: 108px;
          height: 108px;
          border-radius: 10px;
        }
        >div {
          margin-left: 25px;
          >p {
            &:nth-of-type(1) {
              width: 100px;
              height: 30px;
            }
            &:nth-of-type(2) {
              margin-top: 10px;
              width: 80%;
              height: 25px;
            }
          }
        }
      }
      &:nth-of-type(2) {
        >p {
          &:nth-of-type(1) {
            width: 180px;
            height: 25px;
          }
          &:nth-of-type(2) {
            margin-top: 15px;
            width: 100px;
            height: 35px;
          }
        }
      }
    }
  }

  .user-info-header {
    padding: 25px;
    color: #fff;
    background-image: linear-gradient(45deg, $--gradient-blue-color, $--gradient-pink-color);
    overflow: hidden;
    // @include padding(-1, 25px, 1);
  }

  .header-ldentity-svg {
    position: absolute;
    right: 0;
    top: 0;
    width: 30%;
    min-width: 300px;
    height: 100%;
    fill: rgba(60, 44, 201, .1);
  }
  .header-ldentity-container {
    position: relative;
    margin-top: -25%;
    width: 100%;
    padding-top: 100%;
    transform: rotate(15deg);
    &.lord {
      transform: rotate(-15deg);
      >svg {
        left: -20%;
        width: 120%;
        height: 120%;
      }
    }
    >svg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      // height: 150px;
      // width: 120%;
      // height: 120%;
    }
  }

  .info-header-cnt {
    width: 100%;
    min-height: 108px;
    @include margin('left', 25px, -1);
    @include margin('top', 20px, 1, -2);
  }
  .user-Authorize-btn {
    margin-left: 6px;
    padding: 4px 6px;
    font-size: 14px;
    // @include margin('left', 6px, 1);
  }
  .header-cnt-text {
    // @include padding('top', 5px, -2);
    @include padding('right', 50px, -2);
    >h2 {
      font-size: 18px;
    }
    >p {
      font-size: 16px;
      line-height: 1.6;
    }
  }
  .header-crown-svg {
    margin-right: 6px;
    width: 30px;
    height: 30px;
  }
  .paste-icon {
    margin-left: 8px;
    width: 20px;
    height: 20px;
    stroke: #fff;
    fill: none;
    cursor: pointer;
    @include width(25px, 1, -2);
    @include height(25px, 1, -2);
  }
  .user-eamil {
    color: #BDB9FD;
  }
  .user-types {
    margin-top: 4px;
    max-height: 62px;
    overflow: hidden;
    >span {
      margin-top: 6px;
      margin-right: 10px;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 20px;
      // border: 1px solid #BDB9FD;
      color: #fff;
      background-color: rgba(189, 185, 253, .5);
      box-sizing: border-box;
    }
  }

  .header-cnt-balance {
    font-size: 20px;
    // min-height: 108px;
  }
  .eth-balance {
    color: $--text-yellow-color;
    font-size: 24px;
  }

  .user-level {
    // margin-top: 10px;
    margin-left: 15px;
    font-size: 18px;
    color: #bbb;
    // >span {
    //   font-size: 20px;
    // }
  }
</style>

