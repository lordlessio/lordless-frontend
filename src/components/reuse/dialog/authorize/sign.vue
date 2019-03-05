<template>
  <div v-if="visible" class="text-center authorize-sign-box">
    <div v-if="web3Loading || !isRegister || userChecking" class="mobile-authorize-login">
      <h2>Sign up</h2>
      <p class="mobile-login-desc">You are signing up for the wallet address below.</p>
      <div class="mobile-login-account">
        <p class="text-break">{{ account }}</p>
      </div>
      <div class="mobile-login-btn">
        <lordless-btn
          class="TTFontBolder lordless-message-btn login-btn"
          theme="dialog"
          shadow
          :loading="web3Loading || userChecking"
          :disabled="web3Loading || userChecking"
          @click="relogin">YES</lordless-btn>
      </div>
    </div>
    <!-- <div v-if="web3Loading || !isRegister || userChecking" class="authorize-login-container">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <lordless-blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="account"
          theme="light"/>
      </div>
      <div class="login-cnt-box">
        <div class="login-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="text-break login-info-text">{{ account || 'Welcome to LORDLESS!' }}</p>
        </div>
        <p class="login-markline"></p>
        <div>
          <lordless-btn
            class="TTFontBolder lordless-message-btn login-btn"
            theme="deep-blue"
            shadow
            :loading="web3Loading || userChecking"
            :disabled="web3Loading || userChecking"
            @click="relogin">Login</lordless-btn>
        </div>
      </div>
    </div> -->
    <div v-else-if="termsDialogModel">
      <div class="authorize-sign-terms authorize-sign-term">
        <h1 class="TTFontBolder">Term of use</h1>
        <div class="overflow term-cnt-box">
          <terms class="dialog light"/>
        </div>
        <p class="term-btn-box">
          <lordless-btn
            class="d-inline-flex f-align-center term-btn"
            theme="dialog"
            @click="termAgree('terms')">Done</lordless-btn>
        </p>
      </div>
    </div>
    <div v-else-if="privacyDialogModel">
      <div class="authorize-sign-terms authorize-sign-privacy">
        <h1 class="TTFontBolder">Term of use</h1>
        <div class="overflow term-cnt-box">
          <privacy class="dialog light"/>
        </div>
        <p class="term-btn-box">
          <lordless-btn
            class="d-inline-flex f-align-center term-btn"
            theme="dialog"
            @click="termAgree('privacy')">Done</lordless-btn>
        </p>
      </div>
    </div>
    <!-- <div v-else class="authorize-sign-container">
      <h1 class="TTFontBolder">Create Account</h1>
      <div class="text-left authorize-sign-cnt">
        <p>We use your email to send you notifications around collectible activity such as ones you buy and sell. We'll never share your email with anyone else.</p>
        <div class="authorize-sign-input authorize-sign-email">
          <ld-input
            v-model="signInputs.email.model"
            :theme="signInputs.email.theme"
            :placeholder="signInputs.email.placeholder"
            required
            :regex="signInputs.email.regex"
            @change="emailChange"
            @blur="emailBlur"/>
        </div>
        <p class="sm-hidden">For display purposes only (we show it instead of your wallet address). It doesn't need to be unique.</p>
        <div class="authorize-sign-input authorize-sign-nickname">
          <ld-input
            v-model="signInputs.nickName.model"
            type="text"
            :placeholder="signInputs.nickName.placeholder"
            :maxlength="signInputs.nickNamemaxlength"
            @change="nicknameChange"
            @blur="nickNameBlur"/>
        </div>
        <div class="authorize-terms-box">
          <p>Please read our <span @click.stop="termsDialogModel = true">Terms of Use</span> and <span @click.stop="privacyDialogModel = true">Privacy Policy</span>.</p>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.terms }">
              <check-box v-model="termModels.terms"/>
            </div>
            <span @click.stop="chooseTerm('terms')">I have read and agree to the LORDLESS Terms of Use.</span>
          </div>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.privacy }">
              <check-box v-model="termModels.privacy"/>
            </div>
            <span @click.stop="chooseTerm('privacy')">I have read and agree to the LORDLESS Privacy Policy.</span>
          </div>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.notice }">
              <check-box v-model="termModels.notice"/>
            </div>
            <span @click.stop="chooseTerm('notice')">I wish to receive marketing updates (optional).</span>
          </div>
        </div>
      </div>
      <lordless-btn
        class="TTFontBolder lordless-message-btn"
        theme="deep-blue"
        shadow
        :disabled="!signRequired"
        @click="signUp">Sign Up</lordless-btn>
    </div> -->
  </div>
</template>

<script>
// import LdInput from '@/components/stories/input'
// import CheckBox from '@/components/stories/checkbox'
import TermsDialog from '@/components/reuse/dialog/sign/terms.vue'
import PrivacyDialog from '@/components/reuse/dialog/sign/privacy.vue'

import Privacy from '@/components/content/sign/privacy.vue'
import Terms from '@/components/content/sign/terms.vue'

// import { getUserByAddress } from 'api'

import { metamaskMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapActions } from 'vuex'
export default {
  mixins: [metamaskMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: Object,
      default: () => {
        return {
          scale: 18,
          radius: '20px'
        }
      }
    },
    account: {
      type: String,
      default: 'Welcome to LORDLESS!'
    },
    web3Loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      userChecking: false,
      isRegister: false,

      termsDialogModel: false,
      privacyDialogModel: false,

      // 条款状态
      termModels: {
        terms: false,
        privacy: false,
        notice: false
      }

      // 注册 inputs
      // signInputs: {
      //   nickName: {
      //     model: '',
      //     placeholder: 'Nickname',
      //     maxlength: 30,
      //     required: false
      //   },
      //   email: {
      //     model: '',
      //     theme: null,
      //     placeholder: 'Email Address',
      //     regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      //     required: false
      //   }
      // }
    }
  },
  computed: {

    // 判断注册信息格式是否有效
    // signRequired () {
    //   const { nickName, email } = this.signInputs
    //   const { terms, privacy } = this.termModels
    //   return terms && privacy && nickName.required && email.required
    // }
  },
  watch: {
    // value (val) {
    //   if (val) this.checkRegister()
    // },

    // // 监听 account改变并且 sign dialog 在打开情况下，重新 check register
    // account (val) {
    //   if (val && this.value) {
    //     this.checkRegister()
    //   }
    // }
  },
  components: {
    // LdInput,
    // CheckBox,

    TermsDialog,
    PrivacyDialog,

    Privacy,
    Terms
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN
    ]),

    chooseTerm (type) {
      this.$set(this.termModels, type, !this.termModels[type])
    },

    // 重新登陆
    relogin () {
      if (this.userChecking) return

      // metamask 是否被打开
      this.metamaskChoose = true
      const referrer = this.$route.query.r
      this[actionTypes.USER_META_LOGIN]({ referrer,
        cb: (err) => {
          this.metamaskChoose = false
          if (!err) this.$emit('success')
        }})
    },

    // 检查用户是否已经注册过
    // async checkRegister (address = this.account) {
    //   console.log('check user sign')
    //   this.userChecking = true
    //   const res = await getUserByAddress(address)
    //   if (res.code === 1000 && !res.data) this.isRegister = true
    //   else if (res.code !== 1000) {
    //     this.$notify.error({
    //       title: 'error!',
    //       message: res.errorMsg || 'unknown',
    //       position: 'bottom-right',
    //       duration: 2500
    //     })
    //   } else this.isRegister = false
    //   this.userChecking = false
    // },

    // // 注册账户
    // signUp () {
    //   if (!this.signRequired) return
    //   const { email, nickName } = this.signInputs

    //   // metamask 控制开关
    //   this.metamaskChoose = true
    //   this[actionTypes.USER_META_LOGIN]({
    //     nickName: nickName.model,
    //     email: email.model,
    //     cb: () => {
    //       this.metamaskChoose = false

    //       this.reset()

    //       this.$emit('success')
    //     }})
    // },

    // emailChange ({ required }) {
    //   this.$set(this.signInputs.email, 'required', required)
    // },

    // emailBlur ({ required, model }) {
    //   this.$set(this.signInputs.email, 'required', required)
    // },

    // nicknameChange ({ model }) {
    //   this.$set(this.signInputs.nickName, 'required', !!model)
    // },

    // nickNameBlur ({ model }) {
    //   this.$set(this.signInputs.nickName, 'required', !!model)
    // },

    termAgree (type) {
      this[`${type}DialogModel`] = false
      this.$set(this.termModels, type, true)
    },

    reset () {
      // this.$set(this.signInputs.nickName, 'model', '')
      // this.$set(this.signInputs.email, 'model', '')
      this.$set(this, 'termModels', {
        terms: false,
        privacy: false,
        notice: false
      })
      this.termsDialogModel = false
      this.privacyDialogModel = false
      this.isRegister = false
    }
  },
  mounted () {
    // this.checkRegister()
  }
}
</script>

<style lang="scss" scoped>
  .login-box {
    border-radius: 5px;
    @include padding('bottom', 40px, 1);
  }
  .login-container {
    position: relative;
  }
  .login-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
  }
  .login-cnt-box {
    margin-top: 30px;
    font-size: 18px;
  }
  .login-cnt-top {
    margin-bottom: 30px;
  }
  .login-info-text {
    font-size: 20px;
    >a {
      color: $--text-yellow-color;
    }
  }
  .login-markline {
    margin: 15px auto 30px;
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(60%, 0.75);
  }
  // .authorize-sign-box {
  //   max-width: 600px;
  //   color: #fff;
  //   background-image: linear-gradient(135deg, #5961F9, #EE9AE5);
  //   border-radius: 5px;
  //   box-sizing: border-box;
  //   @include padding-around(70px, 50px, 30px, 50px, 1);
  // }
  .authorize-sign-container {
    >h1 {
      margin-bottom: 40px;
      @include margin('bottom', 16px, 1, -1);
      @include fontSize(36px, 1.5);
    }
    >p {
      @include fontSize(14px, 1);
    }
    >button {
      @include margin(-1, 30px, 1);
    }
  }
  .authorize-terms-box {
    // padding-top: 30px;
    >p {
      margin-bottom: 10px;
      >span {
        color: $--color-btn-yellow;
        cursor: pointer;
      }
    }
  }
  .authorize-sign-input {
    margin: 0 auto;
    width: 250px;
    line-height: 30px;
    font-size: 18px;
    color: #fff;
    overflow: hidden;
    @include margin('top', 25px, -2);
    @include margin('bottom', 30px, -2);
  }

  .authorize-terms-item {
    // font-size: 18px;
    @include fontSize(18px, 1.15);
    &:not(:first-of-type) {
      margin-top: 8px;
    }
  }
  .authorize-sign-checkbox {
    position: relative;
    margin-right: 5px;
    display: inline-block;
    width: 18px;
    height: 18px;
    background-color: transparent;
    border-radius: 100%;
    // &::before {
    //   content: '';
    //   position: absolute;
    //   width: 100%;
    //   height: 100%;
    //   left: 0;
    //   top: 0;
    //   border: 1px solid #fff;
    //   border-radius: inherit;
    //   box-sizing: border-box;
    // }
    // &.active {
    //   background-color: transparent;
    //   /deep/ .checkbox-inner {
    //     &::after {
    //       border-color: #fff;
    //     }
    //   }
    // }
  }
  .authorize-sign-terms {
    >h1 {
      margin-bottom: 5px;
      font-size: 24px;
    }
  }
  .term-cnt-box {
    padding-right: 10px;
    margin-right: -10px;
    color: #fff;
    min-height: 300px;
    @include viewport-unit('height', 55vh);
    &::-webkit-scrollbar {
      width: 7px;
    }
    &::-webkit-scrollbar-thumb {
      // height: 10px;
      background: #fff;
      border-radius: 5px;
    }
  }
  .term-btn-box {
    margin-top: 30px;
  }
  .term-btn {
    padding: 12px 15px;
  }

  /**
   *  mobile-authorize-login --begin
   */
  .mobile-authorize-login {
    padding: 15px 10px;
    color: #fff;
    font-size: 16px;
    >h2 {
      font-size: 24px;
    }
  }
  .mobile-login-desc {
    margin-top: 10px;
    // font-size: 16px;
  }
  .mobile-login-account {
    padding: 5px;
    margin-top: 20px;
    // font-size: 16px;
    border: 2px dashed #fff;
    border-radius: 5px;
  }
  .mobile-login-btn {
    margin-top: 35px;
  }
  /**
   *  mobile-authorize-login --end
   */

  @media screen and (max-width: 768px) {
    .authorize-sign-input {
      width: 230px;
      line-height: 24px;
      font-size: 16px;
    }
    .authorize-sign-email {
      margin-top: 8px;
    }
    .authorize-sign-nickname {
      margin-top: 14px;
      margin-bottom: 16px;
    }
  }
</style>
