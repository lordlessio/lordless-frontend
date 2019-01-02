import { getAirdrops, getLuckyblocks } from 'api'
import { loopCandyClamied } from 'utils/loop'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {
      loading: true,
      promotions: [],
      luckyblocks: []
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
    async getAirdropsHandle () {
      const isPre = location.origin.includes('pre.')
      const luckyBlockParams = {}
      if (isPre) luckyBlockParams.pre = true

      this.loading = true
      try {
        const airdropRes = await getAirdrops()
        if (airdropRes.code === 1000 && airdropRes.data) {
          this.promotions = airdropRes.data
        }
        const luckyblockRes = await getLuckyblocks(luckyBlockParams)
        if (luckyblockRes.code === 1000 && luckyblockRes.data) {
          this.luckyblocks = luckyblockRes.data
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  mounted () {
    this.getAirdropsHandle()
    loopCandyClamied()
  }
}
