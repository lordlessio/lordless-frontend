<template>
  <div class="mobile-me-info">
    <mobile-owner-info-detail @home="openHome"/>
  </div>
</template>

<script>
import MobileOwnerInfoDetail from '@/components/content/_mobile/user/detail'

export default {
  name: 'mobile-me-info',
  data: () => {
    return {}
  },
  components: {
    MobileOwnerInfoDetail
  },
  methods: {
    /**
     * 打开 home
     */
    openHome (tavern) {
      this.$router.push(`/tavern/${tavern.id}?refer=${encodeURIComponent(this.$route.path)}`)
    }
  }
}
</script>

<style>

</style>
