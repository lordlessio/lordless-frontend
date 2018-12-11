<template>
  <div class="mobile-me-info">
    <mobile-owner-info
      @logout="logout"
      @home="openHome"/>
  </div>
</template>

<script>
import MobileOwnerInfo from '@/components/content/_mobile/info'
import { userMixins, activatedMixins } from '@/mixins'

import { historyState } from 'utils/tool'
export default {
  name: 'mobile-me-info',
  mixins: [userMixins, activatedMixins],
  data: () => {
    return {
      detailModel: false
    }
  },
  components: {
    MobileOwnerInfo
  },
  methods: {

    /**
     * 打开 home
     */
    openHome (tavern) {
      this.$router.push(`/tavern/${tavern.id}?refer=${encodeURIComponent(this.$route.path)}`)
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
