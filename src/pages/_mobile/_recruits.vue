<template>
  <div class="tavern-recruits-page">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-bind="scrollOpt"
      :text="`#${$route.params.tavernId} recruits`"
      @history="tCloseHandle"/>
    <mobile-tavern-recruits/>
  </div>
</template>

<script>
import MobileTavernRecruits from '@/components/content/_mobile/recruits'
export default {
  name: 'mobile-tavern-recruits-page',
  data: () => {
    return {
      scrollOpt: {
        show: true,
        history: true
      }
    }
  },
  components: {
    MobileTavernRecruits
  },
  methods: {
    tCloseHandle () {
      sessionStorage.setItem('lordless_direction', '_reverse')

      const refer = this.$route.query.refer || `/tavern/${this.$route.params.tavernId}`
      this.$nextTick(() => this.$router.push(`${decodeURIComponent(refer)}`))
    }
  }
}
</script>

<style>

</style>
