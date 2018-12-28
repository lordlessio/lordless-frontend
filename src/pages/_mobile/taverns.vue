<template>
  <div class="mobile-taverns-page">
    <mobile-nav-bar text="Taverns" fixed scroll scrollDefaultTheme="scroll-hidden" :scrollMark="220"/>
    <mobile-taverns-page
      ref="market"
      @path="pathChange"
      @openDetail="openDetail"/>
    <!-- <tavern-dialog
      v-model="detailModel"
      :ldbId="detailInfo._id"
      @close="dialogClose"/> -->
  </div>
</template>

<script>
import MobileTavernsPage from '@/components/content/_mobile/taverns'

// import TavernDialog from '@/components/reuse/dialog/ldb/detail'

import { historyState } from 'utils/tool'

import { mapState } from 'vuex'

export default {
  name: 'mobile-marketplace',
  data: () => {
    return {
      marketPath: null,

      // ldb dialog 显示控制
      // detailModel: false,

      // ldb current detail Info
      detailInfo: {}
    }
  },
  components: {
    MobileTavernsPage

    // TavernDialog
  },
  computed: {
    ...mapState('status', {
      popstateModel: 'popstate'
    }),
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  // watch: {
  //   popstateModel (val) {
  //     console.log('popstate', val, location.pathname)
  //     if (val && location.pathname.includes('/taverns')) {
  //       this.detailModel = false
  //     }
  //   }
  // },
  methods: {
    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$router.push(`/tavern/${info.id}`)
      // this.detailModel = true
      // this.$nextTick(() => {
      //   this.detailInfo = info
      //   historyState(`/tavern/${info.id}`)
      // })
    },

    /**
     * 对话框关闭触发函数
     */
    // dialogClose (info) {
    //   // 如果对话框关闭，改变浏览器地址为详情页面地址
    //   if (!this.popstateModel) historyState(this.marketPath || this.$route.path)
    //   // else this.$root.$children[0].popstate = false
    //   console.log('dialogClose')
    //   this.$refs.market.changeLdbs(info)
    // },

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
