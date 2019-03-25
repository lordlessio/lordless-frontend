import { getUserOverview } from 'api'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      rendered: false,
      loading: true,
      overviews: {
        holdings: {},
        totalEarnings: {},
        depositsCandies: {},
        userInfo: {}
      }
    }
  },
  computed: {
    ...mapState('candy', [
      'candyPrice'
    ]),

    userBoosts () {
      const planBoosts = this.planBoosts
      if (!planBoosts.boosts) return []

      const infos = {
        referee: {
          icon: '#icon-color-certificate',
          grayIcon: '#icon-gray-certificate',
          path: '/owner/referee'
        },
        recruit: {
          icon: '#icon-color-shield',
          grayIcon: '#icon-gray-shield',
          path: '/taverns'
        },
        tavernkeep: {
          icon: '#icon-color-tavernkeep',
          grayIcon: '#icon-gray-tavernkeep',
          path: '/taverns'
        }
      }
      return planBoosts.boosts.map((item) => {
        return Object.assign({}, item, infos[item.type])
      })
    },

    userCommissions () {
      const planBoosts = this.planBoosts
      if (!planBoosts.commissions) return []

      const infos = {
        referrer: {
          icon: '#icon-color-diploma',
          grayIcon: '#icon-gray-diploma',
          path: '/taverns'
        },
        recruit: {
          icon: '#icon-color-flag',
          grayIcon: '#icon-gray-flag',
          path: '/taverns'
        }
      }
      return planBoosts.commissions.map((item) => {
        return Object.assign({}, item, infos[item.type])
      })
    }
  },
  watch: {
    account (val) {
      console.log('---------- user account', val)
      if (val) this.initInfo()
    }
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_HOME,
      actionTypes.USER_SET_USER_BY_TOKEN
    ]),

    countDownHandle () {
      this.initInfo()
      this[actionTypes.USER_SET_USER_BY_TOKEN]()
    },

    initInfo () {
      this.getUserMessage()
      this[actionTypes.USER_SET_USER_HOME]()
    },

    // 获取用户 overview 信息
    async getUserMessage (user = this.$route.params.address) {
      this.loading = true
      try {
        const res = await getUserOverview({ user, single: true })
        if (res.code === 1000) {
          this.overviews = Object.assign({}, this.overviews, res.data)
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initInfo()
  },
  deactivated () {
    this.loading = true
  },
  async mounted () {
    this.$nextTick(() => {
      // this.initClipboard()
      this.initInfo()
    })
  }
}
