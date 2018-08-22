<template>
  <div v-show="value" class="telegram-box">
    <div class="text-center telegram-container">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <Blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="address"
          theme="light"/>
      </div>
      <div class="telegram-cnt-box">
        <div class="telegram-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="TTFontNormal telegram-info-text">{{ address }}</p>
        </div>
        <p class="telegram-markline"></p>
        <div class="telegram-cnt-bottom">
          <p class="TTFontBolder">Telegram Authorize</p>
          <p class="TTFontNormal telegram-info-text">Authorization the <a href="#" class="TTFontBolder">Telegram</a> to Receive Task</p>
        </div>
        <div class="d-flex f-auto-center telegram-authorize-btn">
          <p v-if="!telegramReady" class="d-flex f-align-baseline customize-loading">loading <span class="line-height-1"><i class="el-icon-loading"></i></span></p>
          <div class="d-flex f-auto-center" id="telegram"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockies from '@/components/stories/blockies'

import { putUserTgAuth } from 'api'

import { metamaskMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [metamaskMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // chooseBool: {
    //   type: Boolean,
    //   default: false
    // },
    avatar: {
      type: Object,
      default: () => {
        return {
          scale: 18,
          radius: '20px'
        }
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      telegramReady: false
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  watch: {
    value (val) {
      if (val) this.initTelegram()
      else this.removeTelegram()
    }
  },
  components: {
    Blockies
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    // 初始化 tg 授权状态
    initTelegram () {
      const isTelegram = this.userInfo.telegram && this.userInfo.telegram.id
      // const isTelegram = false
      if (isTelegram) return
      // const tgCode = '<script async src="https://telegram.org/js/telegram-widget.js?4" data-telegram-login="samplebot" data-size="large" data-userpic="false" data-onauth="onTelegramAuth(user)" data-request-access="write"><\/script>'
      // document.getElementById('telegram').innerHTML = tgCode
      const el = document.createElement('script')
      el.src = 'https://telegram.org/js/telegram-widget.js?4'
      el.async = true
      el.setAttribute('data-telegram-login', 'ldbbot')
      el.setAttribute('data-size', 'large')
      el.setAttribute('data-userpic', false)
      el.setAttribute('data-onauth', 'onTelegramAuth(user)')
      el.setAttribute('data-request-access', 'write')
      // document.body.appendChild(el)
      document.getElementById('telegram').appendChild(el)
      el.onload = () => {
        this.telegramReady = true
      }
      window.onTelegramAuth = async (user) => {
        const res = await putUserTgAuth(user)
        if (res.code === 1000) {
          this[actionTypes.USER_SET_USER_BY_TOKEN]({ update: true })
        }
        this.$emit('telegram', res)
      }
    },
    removeTelegram () {
      const telegram = document.getElementById('telegram')
      while (telegram.firstChild) {
        telegram.removeChild(telegram.firstChild)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .telegram-box {
    padding-bottom: 10px;
    border-radius: 5px;
  }
  .telegram-container {
    position: relative;
  }
  .telegram-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
  }
  .telegram-cnt-box {
    margin-top: 30px;
    font-size: 18px;
  }
  .telegram-cnt-top {
    margin-bottom: 30px;
  }
  .telegram-info-text {
    font-size: 20px;
    >a {
      color: $--text-yellow-color;
    }
  }
  .telegram-markline {
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(30px, auto, 45px, auto, 1);
  }
  // .telegram-choose {
  //   width: 26px;
  //   height: 26px;
  //   border-radius: 5px;
  //   overflow: hidden;
  //   background-color: $--secondary-color;
  // }
  .telegram-text {
    margin-left: 10px;
    font-size: 18px;
  }
  .telegram-btn {
    margin-top: 40px;
    padding-left: 25px;
    padding-right: 25px;
  }
  .customize-loading {
    position: absolute;
    left: 50%;
    top: 0;
    padding: 8px 15px;
    z-index: 0;
    transform: translateX(-50%);
  }
  .telegram-authorize-btn {
    margin-top: 40px;
    position: relative;
    min-height: 50px;
    #telegram {
      position: relative;
      z-index: 2;
    }
  }
</style>
