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
      <div v-if="!loading && user" class="d-flex f-align-center sm-col-flex user-info-header">
        <div class="user-avatar">
          <lordless-blockies
            theme="light"
            :scale="18"
            radius="20px"
            :seed="user.address"></lordless-blockies>
        </div>
        <div class="v-flex d-flex lg-f-align-end sm-col-reverse-flex info-header-cnt">
          <div class="v-flex header-cnt-text">
            <h2 class="d-flex f-align-center">
              <span class="header-crown-svg">
                <svg>
                  <use xlink:href="#icon-crown-l5"/>
                </svg>
              </span>
              <span v-if="user.nickName">{{ user.nickName }}</span>
              <span v-else>{{ user._id | splitAddress({ before: 5, end: 2 }) }}</span>
              <span v-if="!owner" class="TTFontBolder user-level">Level {{ user.level }}</span>
              <span v-if="owner">
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
            <p class="eth-balance">{{ balance | weiToEth }} ETH</p>
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
import { contractMixins, dialogMixins } from '@/mixins'
export default {
  mixins: [ contractMixins, dialogMixins ],
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
    }
  },
  data: () => {
    return {
      clipBool: false
    }
  },
  computed: {
    balance () {
      return this.$root.$children[0].web3Opt.balance
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
      this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
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
  @import '@/assets/stylus/mixin/index.scss';

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
    color: #fff;
    background-image: linear-gradient(45deg, $--gradient-blue-color, $--gradient-pink-color);
    @include padding(-1, 25px, 1);
  }
  .info-header-cnt {
    width: 100%;
    @include margin('left', 25px, -1);
    @include margin('top', 20px, 1, -2);
  }
  .user-Authorize-btn {
    padding: 4px 6px;
    font-size: 14px;
    @include margin('left', 6px, 1);
  }
  .header-cnt-text {
    padding-right: 50px;
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
    width: 20px;
    height: 20px;
    stroke: #fff;
    fill: none;
    cursor: pointer;
    @include margin('left', 8px, 1);
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

