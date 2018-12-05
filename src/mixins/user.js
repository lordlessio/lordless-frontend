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
      this.$confirm('<p class="logout-tip-text">Should you logout this account.</p>', 'Logout?', {
        confirmButtonText: 'logout',
        cancelButtonText: 'cancel',
        dangerouslyUseHTMLString: true,
        showClose: false,
        type: 'warning',
        center: true,
        customClass: 'lordless-logout-confirm',
        confirmButtonClass: 'logout-confirm-btn',
        cancelButtonClass: 'logout-cancel-btn'
      }).then(() => {
        this[actionTypes.USER_LOGOUT]({ reset: true })
      })
    }
  }
}
