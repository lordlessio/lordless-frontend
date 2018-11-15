<template>
  <div>
    <market-page
      ref="market"
      v-if="!isMobile"
      @path="pathChange"
      @openDetail="openDetail"/>
    <mobile-market-page
      ref="market"
      v-if="isMobile"
      @path="pathChange"
      @openDetail="openDetail"/>
    <detail-dialog
      v-model="detailModel"
      :ldbId="detailInfo._id"
      @close="dialogClose">
    </detail-dialog>
  </div>
</template>

<script>
import MarketPage from '@/components/content/market'
import MobileMarketPage from '@/components/content/_mobile/market'

import DetailDialog from '@/components/reuse/dialog/ldb/detail'

import { historyState } from 'utils/tool'

export default {
  data: () => {
    return {
      marketPath: null,

      // ldb dialog 显示控制
      detailModel: false,

      // ldb current detail Info
      detailInfo: {},

      popstate: false
    }
  },
  components: {
    MarketPage,
    MobileMarketPage,

    DetailDialog
  },
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  watch: {
    detailModel (val) {
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!val && this.popstate) {
        historyState(this.marketPath || this.$route.path)
      }
    }
  },
  methods: {
    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.detailModel = true
      this.$nextTick(() => {
        this.detailInfo = info
        historyState(`/tavern/${info.id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose (info) {
      console.log('dialogClose')
      this.$refs.market.changeLdbs(info)
    },

    pathChange (path) {
      this.marketPath = path
      historyState(path)
    }
  },
  mounted () {
    // document.documentElement.scrollTop = 0
    // this.$nextTick(() => {
    //   const pn = parseInt(this.$route.query.page || 1)
    //   this.getLdbs({ pn })
    // })
    // window.addEventListener('popstate', () => {
    //   this.popstate = true
    //   console.log('=====', this.$route)
    //   // this.$nextTick(() => {
    //   //   if (location.pathname === '/market') {
    //   //     this.detailModel = false
    //   //   }
    //   // })
    // })
  }
}
</script>

<style lang="scss" scoped>

</style>
