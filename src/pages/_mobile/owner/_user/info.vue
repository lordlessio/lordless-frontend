<template>
  <div class="mobile-me-info">
    <mobile-owner-info
      @logout="logout"
      @home="openHome"/>

    <tavern-dialog
      v-model="detailModel"
      :ldbId="tavernId"
      @close="dialogClose"
      @tipClick="detailModel = false"/>
  </div>
</template>

<script>
import MobileOwnerInfo from '@/components/content/_mobile/info'
import TavernDialog from '@/components/reuse/dialog/ldb/detail'
import { userMixins, activatedMixins } from '@/mixins'

import { historyState } from 'utils/tool'
import { mapState } from 'vuex'
export default {
  name: 'mobile-me-info',
  mixins: [userMixins, activatedMixins],
  data: () => {
    return {
      detailModel: false,
      tavernId: null
    }
  },
  computed: {
    ...mapState('status', {
      popstateModel: 'popstate'
    })
  },
  watch: {
    popstateModel (val) {
      console.log('popstate', val, location.pathname)
      if (val && location.pathname.includes('/owner/info')) {
        this.detailModel = false
      }
    }
  },
  components: {
    MobileOwnerInfo,
    TavernDialog
  },
  methods: {

    /**
     * 打开 home
     */
    openHome (tavern) {
      this.detailModel = true
      this.tavernId = tavern.id
      historyState(`/tavern/${tavern.id}`)
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose (info) {
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!this.popstateModel) historyState(this.marketPath || this.$route.path)
    }
  }
}
</script>

<style>

</style>
