<template>
  <div v-show="visible" class="telegram-box">
    <div class="text-center telegram-container">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <lordless-blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="address"
          theme="light"/>
      </div>
      <div class="telegram-cnt-box">
        <div class="telegram-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="TTFontNormal text-ellipsis telegram-info-text">{{ address }}</p>
        </div>
        <p class="telegram-markline"></p>
        <div class="telegram-cnt-bottom">
          <p class="TTFontBolder">Telegram Authorize</p>
          <p class="sm-mar-t2 TTFontNormal telegram-info-text">Authorization the <a href="#" class="TTFontBolder">Telegram</a> to Receive Task</p>
        </div>
        <lordless-btn
          v-if="isOk"
          class="TTFontBolder ld-authorize-btn"
          theme="blue"
          shadow
          :disabled="true">
          <span class="inline-block authorize-check-box">
            <svg>
              <use xlink:href="#icon-ok"/>
            </svg>
          </span>
        </lordless-btn>
        <div v-show="!userInfo.telegram || !userInfo.telegram.id" class="d-flex f-auto-center telegram-authorize-btn">
          <p v-if="!telegramReady" class="d-flex f-align-baseline customize-loading">loading <span class="line-height-1"><i class="el-icon-loading"></i></span></p>
          <div class="d-flex f-auto-center" :id="telegramContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { putUserTgAuth } from 'api'

import { metamaskMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [metamaskMixins],
  props: {
    visible: {
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
      telegramReady: false,
      telegramContainer: `telegram${new Date().getTime()}`
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),

    isOk () {
      return this.userInfo.telegram && this.userInfo.telegram.id
    }
  },
  watch: {
    visible (val) {
      console.log('telegram watch visible', val)
      if (val) this.initTelegram()
      else this.removeTelegram()
    },

    isOk (val) {
      if (val) this.$emit('close')
    }
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    // 初始化 tg 授权状态
    initTelegram () {
      console.log('---- initTelegram')
      const isTelegram = this.userInfo.telegram && this.userInfo.telegram.id

      console.log('---- initTelegram', isTelegram)
      if (this.isOk) return
      console.log('---- come in telegram')
      // const tgCode = '<script async src="https://telegram.org/js/telegram-widget.js?4" data-telegram-login="samplebot" data-size="large" data-userpic="false" data-onauth="onTelegramAuth(user)" data-request-access="write"><\/script>'
      // document.getElementById('telegram').innerHTML = tgCode
      const el = document.createElement('script')
      el.src = 'https://telegram.org/js/telegram-widget.js?4'
      el.async = true
      el.setAttribute('data-telegram-login', process.env.tgBot)
      el.setAttribute('data-size', 'large')
      el.setAttribute('data-userpic', false)
      el.setAttribute('data-onauth', 'onTelegramAuth(user)')
      el.setAttribute('data-request-access', 'write')
      // el.setAttribute('data-auth-url', location.href)

      document.getElementById(this.telegramContainer).appendChild(el)
      el.onload = () => {
        this.telegramReady = true
      }
      el.onerror = (err) => {
        this.$notify.error({
          title: 'Telegram error!',
          message: err.message,
          position: 'bottom-right',
          duration: 3500
        })
      }
      window.onTelegramAuth = async (user) => {
        const res = await putUserTgAuth(user)
        if (res.code === 1000) {
          this[actionTypes.USER_SET_USER_BY_TOKEN]({ update: true })
        } else {
          this.$notify.error({
            title: 'Telegram authorization failed!',
            message: res.errorMsg,
            position: 'bottom-right',
            duration: 3500
          })
        }
        this.$emit('telegram', res)
      }
    },
    removeTelegram () {
      const telegram = document.getElementById(this.telegramContainer)
      while (telegram.firstChild) {
        telegram.removeChild(telegram.firstChild)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

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
  .telegram-info-text {
    font-size: 20px;
    @include grid('font-size', 16px, -1);
    >a {
      color: $--text-yellow-color;
    }
  }
  .telegram-markline {
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include grid('margin', 30px auto 45px, 1);
    @include grid('margin', 20px auto 25px, -1);
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
  .ld-authorize-btn {
    padding: 0;
    margin-top: 40px;
    border-radius: 100%;
  }
  .authorize-check-box {
    padding: 10px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    >svg {
      width: 100%;
      height: 100%;
    }
  }
  .telegram-authorize-btn {
    // margin-top: 40px;
    position: relative;
    min-height: 50px;
    @include margin('top', 40px, 1.4);
    #telegram {
      position: relative;
      z-index: 2;
    }
  }
</style>
