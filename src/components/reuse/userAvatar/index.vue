<template>
  <div
    class="alone-layer cursor-pointer user-avatar-box"
    :class="[{ 'shadow': shadow && userInfo.address, 'mobile': mobile }, theme]"
    :style="`border-radius: ${radius};`"
    @click="$router.push(`/owner/info`)">
    <div class="d-flex f-align-end" v-if="userInfo.address">
      <div class="v-flex d-flex f-align-center">
        <div class="text-right user-avatar-info" :class="{ 'order-1 left-margin': leftInfo }" v-if="showInfo">
          <p class="text-ellipsis user-nickname">
            <span v-if="userInfo.nickName">{{ userInfo.nickName }}</span>
            <span v-else>{{ userInfo.address | splitAddress({ before: 6, end: 2 }) }}</span>
          </p>
          <p class="d-flex f-align-center" :class="leftInfo ? 'f-justify-start' : 'f-justify-end'">
            <span class="inline-block line-height-1">
              <svg>
                <use xlink:href="#icon-color-star"/>
              </svg>
            </span>
            <span>AP {{ userInfo.ap }}</span>
          </p>
        </div>
        <lordless-blockies
          class="user-avatar-poster"
          :radius="radius"
          :seed="userInfo.address"
          :scale="scale"
          :theme="theme">
        </lordless-blockies>
      </div>
      <!-- <p class="lg-hidden user-avatar-logout" @click.stop="logout">Logout</p> -->
    </div>
    <lordless-btn
      v-if="!userInfo.address && !tip"
      class="user-getting-start"
      :theme="theme === 'dark' ? 'blue' : 'deep-blue'"
      :inverse="theme === 'dark'"
      @click.native="sign"
      shadow>{{ loginText }}</lordless-btn>
    <p class="TTFontBolder top-login-text" v-if="!userInfo.address && tip" @click.stop="sign">{{ loginText }}</p>
    <authorize
      ref="authorize"
      @blurs="dialogSetBlurs($event, 0)">
    </authorize>
  </div>
</template>

<script>
import Authorize from '@/components/reuse/dialog/authorize'

import { dialogMixins, userMixins } from '@/mixins'
export default {
  name: 'user-avatar',
  mixins: [ dialogMixins, userMixins ],
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
    // fontSize: {
    //   type: String,
    //   default: '20px'
    // },
    loginText: {
      type: String,
      default: 'Get started'
    },
    showInfo: {
      type: Boolean,
      default: true
    },
    leftInfo: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'dark'
    },

    // 是否从 headerTip 引用
    tip: {
      type: Boolean,
      default: false
    },
    mobile: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Authorize
  }
}
</script>

<style lang="scss" scoped>
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
    &.mobile {
      .user-avatar-info {
        >p {
          font-size: 14px;
        }
      }
      .top-login-text {
        font-size: 16px;
      }
    }
  }
  .user-avatar-info {
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
    &:not(.left-margin) {
      margin-right: 15px;
    }
    &.left-margin {
      margin-left: 15px;
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
  .top-login-text {
    color: $--text-blue-purple-color;
    font-size: 18px;
  }
  // .user-avatar-logout {
  //   font-size: 16px;
  // }
</style>
