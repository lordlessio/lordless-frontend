<template>
  <el-dialog
    title="提示"
    :visible.sync="value"
    width="300px"
    :close-on-click-modal="false"
    :center="true"
    :show-close="false">
    <div class="ld-relogin-input">
      <p>账户信息失效了，需要重新认证呀！</p>
      <input aria-label="address" disabled type="text" :value="address | splitAddress({ before: 12, end: 12, symbol: '***' })"/>
    </div>
    <div slot="footer" class="dialog-footer">
      <ld-button @click="setUserExpired(false)">取 消</ld-button>
      <ld-button theme="deep-blue-2" @click="metaLogin">确 定</ld-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
import LdButton from '@/components/stories/button'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    address: String
  },
  data: () => {
    return {}
  },
  components: {
    LdButton
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN,
      actionTypes.USER_SET_USER_EXPIRED
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .ld-relogin-input {
    input {
      width: 100%;
      line-height: 30px;
      border: none;
      outline: none;
      background-color: #ddd;
      border-radius: 3px;
      text-indent: 8px;
      @include margin('top', 15px, 1);
      @include fontSize(14px, 1);
    }
  }
</style>
