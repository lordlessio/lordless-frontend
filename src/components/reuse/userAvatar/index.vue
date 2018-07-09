<template>
  <div class="user-avatar-box" :style="`font-size: ${fontSize};`">
    <Blockies v-if="userInfo.address" :radius="radius" :seed="userInfo.address" :scale="scale"></Blockies>
    <span v-if="!userInfo.address" @click.stop="sign" class="user-sign">Sign in</span>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
import Blockies from '@/components/stories/blockies'
export default {
  name: 'user-avatar',
  props: {
    scale: {
      type: Number,
      default: 8
    },
    radius: {
      type: String,
      default: '6px'
    },
    fontSize: {
      type: String,
      default: '20px'
    }
  },
  components: {
    Blockies
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

    sign () {
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
  }
  .user-sign {
    cursor: pointer;
  }
</style>
