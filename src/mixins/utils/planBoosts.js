import { getPlanBoosts } from 'api'
export default {
  data: () => {
    return {
      boostRender: false,
      planBoosts: {}
    }
  },
  computed: {
    userTotalBoost () {
      return (this.planBoosts.total || 0) / 100
    },
    planBoostsList () {
      const texts = {
        referee: {
          text: 'Referee boost',
          icon: '#icon-certificate'
        },
        tavernkeep: {
          text: 'Tavernkeep boost',
          icon: '#icon-certificate'
        }
      }
      return this.planBoosts.list.map(item => {
        const data = Object.assign({}, item, texts[item.type])
        if (item.number === 0 && item.type === 'referee') {
          data.none = true
          data.text = 'Get referee boost'
          data.routePath = `/owner/referee?refer=${this.$route.fullPath}`
        }
        return data
      })
    },
    isRefereeBoost () {
      return !!this.planBoosts.list.filter(item => item.type === 'referee').length
    }
  },
  methods: {
    async initPlanBoost () {
      try {
        const res = await getPlanBoosts()
        if (res.code === 1000 && res.data) {
          this.planBoosts = res.data
        }
      } catch (err) {
        console.log('---- plan boost err', err.message)
      }
    }
  },
  activated () {
    if (!this.boostRender) {
      this.boostRender = true
      return
    }
    this.initPlanBoost()
  },
  mounted () {
    this.$nextTick(() => this.initPlanBoost())
  }
}
