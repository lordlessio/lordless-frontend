<template>
  <div class="tavern-commissions-page">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-bind="scrollOpt"
      :text="`#${$route.params.tavernId} commissions`"
      @history="tCloseHandle"/>
    <tavern-commissions/>
  </div>
</template>

<script>
import TavernCommissions from '@/components/content/_mobile/commissions'
export default {
  name: 'mobile-tavern-commissions-page',
  data: () => {
    return {
      scrollOpt: {
        show: true,
        history: true
      }
    }
  },
  components: {
    TavernCommissions
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
