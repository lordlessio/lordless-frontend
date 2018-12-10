import { getAirdrops } from 'api'
import { loopCandyClamied } from 'utils/loop'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      loading: true,
      promotions: []
    }
  },
  computed: {
    ...mapState('candy', [
      'candyClaimed'
    ]),
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  methods: {
    async getAirdrops () {
      this.loading = true
      try {
        const res = await getAirdrops()
        if (res.code === 1000 && res.data) {
          this.promotions = res.data
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  mounted () {
    this.getAirdrops()
    loopCandyClamied()
  }
}
