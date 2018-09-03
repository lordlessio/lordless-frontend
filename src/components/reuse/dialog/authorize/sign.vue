<template>
  <div v-if="value" class="text-center authorize-sign-box">
    <div class="authorize-login-container" v-if="!register">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <Blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="account"
          theme="light"/>
      </div>
      <div class="login-cnt-box">
        <div class="login-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="login-info-text">{{ account }}</p>
        </div>
        <p class="login-markline"></p>
        <div>
          <ld-btn
            class="TTFontBolder lordless-message-btn login-btn"
            theme="deep-blue"
            shadow
            :loading="userChecking"
            :disabled="userChecking"
            @click="relogin">Login</ld-btn>
        </div>
      </div>
    </div>
    <div class="authorize-sign-container" v-if="register">
      <h1 class="TTFontBolder">Create Account</h1>
      <div class="text-left authorize-sign-cnt">
        <p>We use your email to send you notifications around collectible activity such as ones you buy and sell. We'll never share your email with anyone else.</p>
        <div class="authorize-sign-input">
          <ld-input
            v-model="signInputs.email.model"
            :theme="signInputs.email.theme"
            :placeholder="signInputs.email.placeholder"
            required
            :regex="signInputs.email.regex"
            @change="emailChange"
            @blur="emailBlur">
          </ld-input>
        </div>
        <p>For display purposes only (we show it instead of your wallet address). It doesn't need to be unique.</p>
        <div class="authorize-sign-input">
          <ld-input
            v-model="signInputs.nickName.model"
            type="text"
            :placeholder="signInputs.nickName.placeholder"
            :maxlength="signInputs.nickNamemaxlength"
            @change="nicknameChange"
            @blur="nickNameBlur">
          </ld-input>
        </div>
        <div class="authorize-terms-box">
          <p>Please read our <span>Terms of Use</span> and <span>Privacy Policy</span>.</p>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.terms }">
              <check-box
                v-model="termModels.terms">
              </check-box>
            </div>
            <span>I have read and agree to the LORDLESS Terms of Use.</span>
          </div>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.privacy }">
              <check-box
                v-model="termModels.privacy">
              </check-box>
            </div>
            <span>I have read and agree to the LORDLESS Privacy Policy.</span>
          </div>
          <div class="d-flex f-align-center authorize-terms-item">
            <div class="authorize-sign-checkbox" :class="{ 'active': termModels.notice }">
              <check-box
                v-model="termModels.notice">
              </check-box>
            </div>
            <span>I wish to receive marketing updates (optional).</span>
          </div>
        </div>
      </div>
      <ld-btn
        class="TTFontBolder lordless-message-btn"
        theme="deep-blue"
        shadow
        :disabled="!signRequired"
        @click="signUp">Sign Up</ld-btn>
    </div>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
import LdInput from '@/components/stories/input'
import CheckBox from '@/components/stories/checkbox'
import Blockies from '@/components/stories/blockies'

import { getUserByAddress } from 'api'

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
    openStatus: {
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
    }
  },
  data: () => {
    return {
      userChecking: false,
      register: false,

      // 条款状态
      termModels: {
        terms: false,
        privacy: false,
        notice: false
      },

      // 注册 inputs
      signInputs: {
        nickName: {
          model: '',
          placeholder: 'Nickname',
          maxlength: 30,
          required: false
        },
        email: {
          model: '',
          theme: null,
          placeholder: 'Email Address',
          regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          required: false
        }
      }
    }
  },
  computed: {
    account () {
      return this.$root.$children[0].web3Opt.address
    },
    signRequired () {
      const { nickName, email } = this.signInputs
      const { terms, privacy } = this.termModels
      return terms && privacy && nickName.required && email.required
    }
  },
  components: {
    Blockies,
    LdBtn,
    LdInput,
    CheckBox
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN
    ]),

    relogin () {
      // metamask 是否被打开
      this.metamaskChoose = true
      this[actionTypes.USER_META_LOGIN]({ cb: (err) => {
        if (!err) this.$emit('success')
        this.metamaskChoose = false
      }})
    },

    async checkRegister (address = this.account) {
      console.log('check user sign')
      this.userChecking = true
      const res = await getUserByAddress(address)
      if (res.code === 1000 && !res.data) this.register = true
      else if (res.code !== 1000) {
        this.$notify.error({
          title: 'error!',
          message: res.errorMsg || 'unknown',
          position: 'bottom-right',
          duration: 2500
        })
      } else this.register = false
      this.userChecking = false
    },

    emailChange ({ required }) {
      this.$set(this.signInputs.email, 'required', required)
    },

    emailBlur ({ required, model }) {
      this.$set(this.signInputs.email, 'required', required)
    },

    nicknameChange ({ model }) {
      this.$set(this.signInputs.nickName, 'required', !!model)
    },

    nickNameBlur ({ model }) {
      this.$set(this.signInputs.nickName, 'required', !!model)
    },

    signUp () {
      if (!this.signRequired) return
      const { email, nickName } = this.signInputs

      // metamask 是否被打开
      this.metamaskChoose = true
      this[actionTypes.USER_META_LOGIN]({
        nickName: nickName.model,
        email: email.model,
        cb: () => {
          this.$emit('success')
          this.metamaskChoose = false
        }})
    }
  },
  watch: {
    openStatus (val) {
      if (val && this.value) this.checkRegister()
    }
  },
  mounted () {
    this.checkRegister()
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
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
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(15px, auto, 30px, auto, 1);
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
      @include margin('bottom', 40px, 1);
      @include fontSize(36px, 1.2);
    }
    >p {
      @include fontSize(14px, 1);
    }
    >button {
      @include margin(-1, 30px, 1);
    }
  }
  .authorize-terms-box {
    padding-top: 30px;
    >p {
      margin-bottom: 10px;
      >span {
        color: $--color-btn-yellow;
      }
    }
  }
  .authorize-sign-input {
    margin: 25px auto 30px;
    width: 250px;
    line-height: 30px;
    font-size: 18px;
    overflow: hidden;
    ::placeholder {
      color: #ddd;
    }
  }
  .authorize-terms-item {
    font-size: 18px;
    &:not(:first-of-type) {
      margin-top: 8px;
    }
  }
  .authorize-sign-checkbox {
    position: relative;
    margin-right: 5px;
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: transparent;
    border-radius: 100%;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border: 1px solid #fff;
      border-radius: inherit;
      box-sizing: border-box;
    }
    &.active {
      background-color: transparent;
      /deep/ .checkbox-inner {
        &::after {
          border-color: #fff;
        }
      }
    }
  }
</style>
