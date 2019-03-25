import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('user', {
      userPlanBoosts: 'userPlanBoosts'
    }),
    planBoosts () {
      return this.unOwnerPlanBoosts || this.userPlanBoosts
    },
    userTotalBoost () {
      return (this.planBoosts.boostTotal || 0) / 100
    },
    planBoostsList () {
      const texts = {
        referee: {
          text: 'Referee boost',
          icon: '#icon-color-certificate',
          grayIcon: '#icon-gray-certificate'
        },
        tavernkeep: {
          text: 'Tavernkeep boost',
          icon: '#icon-color-tavernkeep',
          grayIcon: '#icon-gray-tavernkeep'
        },
        recruit: {
          text: 'Recruit boost',
          icon: '#icon-color-shield',
          grayIcon: '#icon-gray-shield'
        }
      }
      return this.planBoosts.boosts.map(item => {
        const data = Object.assign({}, item, texts[item.type])
        if (item.number === 0 && item.type === 'referee') {
          data.none = true
          data.text = 'Get referee boost'
          data.routePath = `/owner/referee?refer=${this.$route.fullPath}`
        } else if (item.number === 0 && item.type !== 'referee') {
          data.hide = true
        }
        return data
      }).filter(item => !item.hide).sort((a, b) => b.number - a.number)
    },
    isRefereeBoost () {
      return !!this.planBoosts.boosts.filter(item => item.type === 'referee').length
    }
  }
}
