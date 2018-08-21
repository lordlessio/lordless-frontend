<template>
  <div
    class="d-flex f-align-center cursor-pointer user-avatar-box"
    :class="{ 'shadow': shadow && userInfo.address }"
    :style="`font-size: ${fontSize};border-radius: ${radius};`"
    @click="$router.push(`/owner/info`)">
    <div class="text-right user-avatar-info">
      <p>
        <span v-if="userInfo.nickName">{{ userInfo.nickName }}</span>
        <span v-else>{{ userInfo.address | splitAddress({ before: 4, end: 2 }) }}</span>
      </p>
      <p>
        <span></span>
        <span>AP {{ userInfo.ap }}</span>
      </p>
    </div>
    <Blockies
      v-if="userInfo.address"
      :radius="radius"
      :seed="userInfo.address"
      :scale="scale"
      theme="light">
    </Blockies>
    <span v-if="!userInfo.address && showText" @click.stop="sign" class="user-sign">Sign in</span>
    <authorize
      ref="authorize"
      @blurs="dialogSetBlurs($event, 0)">
    </authorize>
  </div>
</template>

<script>
import Authorize from '@/components/reuse/dialog/authorize'
import Blockies from '@/components/stories/blockies'

import { dialogMixins } from '@/mixins'

import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
export default {
  name: 'user-avatar',
  mixins: [dialogMixins],
  props: {
    header: {
      type: Boolean,
      default: false
    },
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
    showText: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Blockies,
    Authorize
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
  .user-avatar-box {
    width: inherit;
    height: inherit;
    // &.has-canvas {
    //   position: relative;
    //   top: 50%;
    //   transform: translateY(-50%);
    // }
    &.shadow {
      box-shadow: 2px 4px 8px 0 rgba(12, 0, 42, .5);
    }
  }
  .user-avatar-info {
    margin-right: 15px;
    >p {
      font-size: 18px;
      &:nth-of-type(2) {
        font-size: 16px;
      }
    }
  }
  .user-sign {
    cursor: pointer;
  }
</style>
