<template>
  <el-dialog
    title="提示"
    :visible.sync="reloginDialog"
    width="300px"
    :close-on-click-modal="false"
    :center="true"
    :show-close="false">
    <div class="ld-relogin-input">
      <p>账户信息失效了，需要重新认证呀！</p>
      <input disabled type="text" :value="reloginAddress"/>
    </div>
    <div slot="footer" class="dialog-footer">
      <ld-button @click="reloginDialog = false">取 消</ld-button>
      <ld-button theme="info-2" @click="metaLogin">确 定</ld-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
import { splitAddress } from 'utils/tool'
import LdButton from '@/components/stories/button'
export default {
  props: {
    address: String,
    expired: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      reloginDialog: false
    }
  },
  computed: {
    reloginAddress () {
      return splitAddress(this.address, { before: 12, end: 12, symbol: '***' })
    }
  },
  components: {
    LdButton
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN
    ])
  },
  watch: {
    expired (val) {
      this.reloginDialog = val
    },

    splitAddress (address = this.address, { before = 10, end = 6, symbol = '***' }) {
      return splitAddress(address, { before, end, symbol })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.address) return
      this.reloginDialog = this.expired
    })
  }
}
</script>

<style lang="scss" scoped>
  .ld-relogin-input {
    input {
      margin-top: 15px;
      width: 100%;
      line-height: 30px;
      font-size: 14px;
      border: none;
      outline: none;
      background-color: #ddd;
      border-radius: 3px;
      text-indent: 8px;
    }
  }
</style>
