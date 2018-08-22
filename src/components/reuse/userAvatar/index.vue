<template>
  <div
    class="cursor-pointer user-avatar-box"
    :class="[{ 'shadow': shadow && userInfo.address }, theme]"
    :style="`font-size: ${fontSize};border-radius: ${radius};`"
    @click="$router.push(`/owner/info`)">
    <div class="d-flex f-align-center" v-if="userInfo.address">
      <div class="text-right user-avatar-info" v-if="showInfo">
        <p class="text-ellipsis user-nickname">
          <span v-if="userInfo.nickName">{{ userInfo.nickName }}</span>
          <span v-else>{{ userInfo.address | splitAddress({ before: 4, end: 2 }) }}</span>
        </p>
        <p class="d-flex f-align-center f-justify-end">
          <span class="inline-block line-height-1">
            <svg>
              <use xlink:href="#icon-color-star"/>
            </svg>
          </span>
          <span>AP {{ userInfo.ap }}</span>
        </p>
      </div>
      <Blockies
        class="user-avatar-poster"
        :radius="radius"
        :seed="userInfo.address"
        :scale="scale"
        :theme="theme">
      </Blockies>
    </div>
    <ld-btn
      v-if="!userInfo.address"
      class="user-getting-start"
      :theme="theme === 'dark' ? 'blue' : 'deep-blue'"
      :inverse="theme === 'dark'"
      @click.native="sign"
      shadow>{{ loginText }}</ld-btn>
    <authorize
      ref="authorize"
      @blurs="dialogSetBlurs($event, 0)">
    </authorize>
  </div>
</template>

<script>
import Authorize from '@/components/reuse/dialog/authorize'
import Blockies from '@/components/stories/blockies'
import LdBtn from '@/components/stories/button'

import { dialogMixins } from '@/mixins'

import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
export default {
  name: 'user-avatar',
  mixins: [dialogMixins],
  props: {
    shadow: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 8
    },
    radius: {
      type: String,
      default: '10px'
    },
    fontSize: {
      type: String,
      default: '20px'
    },
    loginText: {
      type: String,
      default: 'Getting started'
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  components: {
    Blockies,
    Authorize,
    LdBtn
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN
    ]),

    async sign () {
      const authorize = await this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
      console.log('authorize', authorize)
      if (!authorize) return
      // 检测 user 是否注册过
      this[actionTypes.USER_META_LOGIN]()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .user-avatar-box {
    width: inherit;
    height: inherit;
    // &.has-canvas {
    //   position: relative;
    //   top: 50%;
    //   transform: translateY(-50%);
    // }
    &.shadow {
      .user-avatar-poster {
        box-shadow: 2px 4px 8px 0 rgba(12, 0, 42, .5);
      }
    }
    &.dark {
      .user-avatar-info {
        >p {
          &:nth-of-type(1) {
            color: #999;
          }
          &:nth-of-type(2) {
            color: #555;
          }
        }
      }
    }
    &.light {
      .user-avatar-info {
        >p {
          color: #fff;
        }
      }
    }
  }
  .user-avatar-info {
    margin-right: 15px;
    >p {
      font-size: 18px;
      &:nth-of-type(2) {
        font-size: 16px;
      }
      svg {
        margin-right: 5px;
        width: 14px;
        height: 14px;
      }
    }
  }
  .user-nickname {
    max-width: 80px;
  }
  .user-getting-start {
    padding: 12px 18px;
  }
  .user-sign {
    cursor: pointer;
  }
</style>
