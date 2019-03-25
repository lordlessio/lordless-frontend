<template>
  <div class="mobile-user-detail">
    <mobile-user-info-detail address @home="openHome"/>
  </div>
</template>

<script>
import MobileUserInfoDetail from '@/components/content/_mobile/user/detail'

export default {
  name: 'mobile-user-detail-page',
  computed: {
    address () {
      return this.$route.params.address
    }
  },
  components: {
    MobileUserInfoDetail
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
