<template>
  <div class="d-flex user-authorization-box">
    <div class="d-flex v-flex col-flex user-authorization-container">
      <h1 class="text-cap user-authorization-title">authorization</h1>
      <div class="user-authorization-cnt">
        <el-row :gutter="20" class="authorization-cnt-container">
          <el-col
            :xs="24" :sm="12" :lg="8"
            class="authorization-item"
            v-for="(authorization, index) of authorizations"
            :key="index">
            <authorization-card
              :active="authorization.active"
              :info="authorization"
              @click="authorizeFunc($event, index)">
            </authorization-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <Authorize
      ref="authorize"
      @telegram="telegramFunc"
      @pending="authorizePending"
      @blurs="dialogSetBlurs($event, 0)">
    </Authorize>
  </div>
</template>

<script>
import AuthorizationCard from '@/components/reuse/card/authorization'
import Authorize from '@/components/reuse/dialog/authorize'

// import { putUserTgAuth } from 'api'

import { contractMixins, dialogMixins } from '@/mixins'
import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'owner-authorization',
  mixins: [contractMixins, dialogMixins],
  data: (vm) => {
    return {
      authorizations: [
        {
          symbol: 'marketplace',
          title: 'Marketplace contract',
          desc: 'Authorized the marketplace contract to operate LDB',
          icon: 'icon-marketplace',
          active: false,
          loading: false
        }, {
          symbol: 'telegram',
          title: 'Telegram',
          desc: 'Authorize the Telegram to apply tasks',
          icon: 'icon-telegram',
          // customize: true,
          active: false,
          loading: false
        }
      ],
      authModels: {}
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    marketModel () {
      return this.$root.$children[0].isCrowdsaleApproved
    }
  },
  components: {
    AuthorizationCard,
    Authorize
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_CHECK_CROWDSALE
    ]),
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    initModels (userInfo = this.userInfo) {
      if (this.marketModel) {
        this.rewriteAuthorizations('marketplace')
      }
      if (userInfo.telegram && userInfo.telegram.id) {
        this.rewriteAuthorizations('telegram')
      }
    },

    telegramFunc (res) {
      if (res.code === 1000) this.initModels()
    },

    // marketplace authorization
    /**
     * 授权市场权限的合约 pending 状态
     */
    async authorizePending ({ tx }) {
      const address = this.userInfo.address
      this.rewriteAuthorizations('marketplace', { loading: true, active: false })
      this.checkCrowdsaleEvent({ address }, () => {
        this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
        this[actionTypes.CONTRACT_CHECK_CROWDSALE](address)
        this.rewriteAuthorizations('marketplace', { loading: false })
      })
    },

    // 点击认证执行事件
    authorizeFunc (symbol) {
      switch (symbol) {
        case 'marketplace': this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
          break
        case 'telegram': this.$refs.authorize.checkoutAuthorize({ telegram: true })
          break
        default: break
      }
    },

    // 重写 authorizations
    rewriteAuthorizations (symbol = 'telegram', { loading = false, active = true } = {}) {
      const authorizations = this.authorizations
      authorizations.map(item => {
        if (item.symbol === symbol) {
          item.active = active
          item.loading = loading
        }
      })
      this.$set(this, 'authorizations', authorizations)
    }

    // 初始化 tg 授权状态
    // initTelegram () {
    //   const isTelegram = this.userInfo.telegram && this.userInfo.telegram.id
    //   // const isTelegram = false
    //   if (isTelegram) return
    //   // const tgCode = '<script async src="https://telegram.org/js/telegram-widget.js?4" data-telegram-login="samplebot" data-size="large" data-userpic="false" data-onauth="onTelegramAuth(user)" data-request-access="write"><\/script>'
    //   // document.getElementById('telegram').innerHTML = tgCode
    //   const el = document.createElement('script')
    //   el.src = 'https://telegram.org/js/telegram-widget.js?4'
    //   el.async = true
    //   el.setAttribute('data-telegram-login', 'ldbbot')
    //   el.setAttribute('data-size', 'large')
    //   el.setAttribute('data-userpic', false)
    //   el.setAttribute('data-onauth', 'onTelegramAuth(user)')
    //   el.setAttribute('data-request-access', 'write')
    //   // document.body.appendChild(el)
    //   document.getElementById('telegram').appendChild(el)
    //   window.onTelegramAuth = async (user) => {
    //     const res = await putUserTgAuth(user)
    //     if (res.code === 1000) {
    //       this[actionTypes.USER_SET_USER_BY_TOKEN]({ update: true })
    //       this.rewriteAuthorizations('telegram')
    //     }
    //   }
    // }
  },
  watch: {
    marketModel (val) {
      if (val) this.rewriteAuthorizations('marketplace')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initModels()
      // this.initTelegram()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .user-authorization-box {
    font-size: 16px;
    @include padding(-1, 30px, 1);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      position: static;
      overflow: initial;
    }
    /deep/ .el-tabs__item {
      font-size: 18px;
      color: #999;
      &.is-active {
        color: inherit;
      }
    }
  }
  .user-authorization-title {
    font-size: 36px;
    color: #999;
  }
  .user-authorization-cnt {
    margin-top: 35px;
  }
  .authorization-cnt-container {

  }
  .authorization-item {
    @include margin('top', 25px, 1, -2);
  }
</style>
