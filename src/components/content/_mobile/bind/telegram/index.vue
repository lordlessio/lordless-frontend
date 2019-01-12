<template>
  <div class="relative telegram-bind-box mobile-clipboard-box" :class="{ 'clipboard': clipBool }">
    <div class="container telegram-bind-container">
      <div class="d-flex f-justify-center telegram-bind-header">
        <p class="d-flex f-align-center bind-header-icons">
          <span class="inline-block line-height-0 both-sides-icon">
            <svg>
              <use xlink:href="#icon-bind-less"/>
            </svg>
          </span>
          <span class="inline-block line-height-0 bind-link-icon">
            <svg>
              <use xlink:href="#icon-link"/>
            </svg>
          </span>
          <span class="inline-block line-height-0 both-sides-icon">
            <svg>
              <use xlink:href="#icon-bind-telegram"/>
            </svg>
          </span>
        </p>
      </div>
      <div class="telegram-bind-content">
        <ul class="telegram-bind-cnt-box">
          <li class="telegram-bind-item">
            <p class="bind-step-title">STEP 1</p>
            <p class="bind-step-desc">Tap the code below to copy it.</p>
            <p id="copy-link"
              :data-clipboard-text="`${account}-${userInfo.telegram ? userInfo.telegram.code : ' --'}`"
              class="ImpactFont text-break telegram-bind-code">{{ account }}-{{ userInfo.telegram ? userInfo.telegram.code : ' --' }}</p>
          </li>
          <li class="telegram-bind-item">
            <p class="bind-step-title">STEP 2</p>
            <p class="bind-step-desc">Click the button “Talk with Telegram bot”.</p>
          </li>
          <li class="telegram-bind-item">
            <p class="bind-step-title">STEP 3</p>
            <p class="bind-step-desc">Enter /bind in the input box.</p>
            <p class="bind-step-desc">Send the code you copied to the LORDLESS bot.</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="TTFontBolder text-center telegram-bind-bottom">
      <lordless-btn
        class="telegram-talk-btn"
        theme="blue-linear"
        :disabled="!userInfo.telegram || !userInfo.telegram.code">
        <a :href="botLink" target="_blank">
          Talk with Telegram bot
        </a>
      </lordless-btn>
    </div>
  </div>
</template>

<script>
import { clipboardMixins, publicMixins } from '@/mixins'

import { initUserTgCode } from 'api'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'lordless-telegram-bind-component',
  mixins: [ clipboardMixins, publicMixins ],
  data: () => {
    return {
      shortCode: ''
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    botLink () {
      return `https://t.me/${process.env.tgBot}?start=bind`
    }
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    /**
     * 初始化用户 telegram bind code
     */
    async initBindCode () {
      if (this.userInfo.telegram && this.userInfo.telegram.code) return
      try {
        const res = await initUserTgCode()
        if (res.code === 1000 && res.data) {
          return this[actionTypes.USER_SET_USER_BY_TOKEN]()
        }
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error!',
          position: 'bottom-right',
          duration: 2500
        })
      }
    },

    /**
     * 循环检查 telegram 是否绑定成功
     */
    loopCheckBind () {
      let intance = null
      const func = () => {
        clearTimeout(intance)
        intance = null

        if (this.userInfo.telegram && this.userInfo.telegram.id) return

        this[actionTypes.USER_SET_USER_BY_TOKEN]()
        intance = setTimeout(() => {
          func()
        }, 5000)
      }
      func()

      this.$once('hook:beforeDestroy', () => {
        clearTimeout(intance)
        intance = null
      })
      this.$once('hook:deactivated', () => {
        clearTimeout(intance)
        intance = null
      })
    }
  },
  deactivated () {
    this.isCopyCode = false
  },
  mounted () {
    this.$nextTick(() => {
      this.initBindCode()
      this.loopCheckBind()
    })
  }
}
</script>

<style lang="scss" scoped>
  .telegram-bind-box {
    @include viewport-unit(min-height, 100vh);
    // @include overflow();
  }
  .telegram-bind-container {
    padding-bottom: 80px;
  }

  /**
   *  telegram-bind-header -- begin
   */

  .telegram-bind-header {
    padding-top: 44px;
    margin: 0 -20px;
    background-color: #0079FF;
  }
  .bind-header-icons {
    padding: 18px 0;
    box-sizing: border-box;
  }
  .both-sides-icon {
    padding: 16px;
    width: 64px;
    height: 64px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 100%;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);
  }
  .bind-link-icon {
    margin: 0 12px;
    width: 32px;
    height: 32px;
    fill: #fff;
  }

  /**
   *  telegram-bind-header -- end
   */


  /**
   *  telegram-bind-content -- begin
   */
  .telegram-bind-content {
    padding-top: 48px;
    box-sizing: border-box;
  }
  .telegram-bind-cnt-box {
    margin-top: -24px;
  }
  .telegram-bind-item {
    margin-top: 24px;
  }
  .bind-step-title {
    font-size: 18px;
    color: #0B2A48;
    @include TTFontBolder();
  }
  .bind-step-desc {
    margin-top: 8px;
    font-size: 16px;
    color: #555;
  }
  .telegram-bind-code {
    font-size: 24px;
    line-height: 1.2;
    color: #0079FF;
  }
  /**
   *  telegram-bind-content -- end
   */

  .telegram-bind-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    // background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
  }
  .telegram-talk-btn {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
</style>
