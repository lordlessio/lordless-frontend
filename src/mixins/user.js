import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    _actionTypes () {
      return actionTypes
    }
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_META_LOGIN,
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_LOGOUT
    ]),
    async sign () {
      if (!this.$refs.authorize) return

      const authorize = this.$refs.authorize.checkoutAuthorize()
      if (!authorize) return

      // 检测 user 是否注册过
      this[actionTypes.USER_META_LOGIN]()
    },
    async logout () {
      await this[actionTypes.USER_LOGOUT]({ reset: true })
    }
  }
}
