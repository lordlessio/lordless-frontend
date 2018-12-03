<template>
  <div>
    <market-page
      ref="market"
      v-if="!isMobile"
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

import DetailDialog from '@/components/reuse/dialog/ldb/detail'

import { historyState } from 'utils/tool'

import { mapState } from 'vuex'

export default {
  data: () => {
    return {
      marketPath: null,

      // ldb dialog 显示控制
      detailModel: false,

      // ldb current detail Info
      detailInfo: {}
    }
  },
  components: {
    MarketPage,

    DetailDialog
  },
  computed: {
    ...mapState('status', {
      popstateModel: 'popstate'
    }),
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  watch: {
    popstateModel (val) {
      console.log('popstate', val, location.pathname)
      if (val && location.pathname.includes('/market')) {
        this.detailModel = false
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
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!this.popstateModel) historyState(this.marketPath || this.$route.path)
      // else this.$root.$children[0].popstate = false
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
  }
}
</script>

<style lang="scss" scoped>

</style>
