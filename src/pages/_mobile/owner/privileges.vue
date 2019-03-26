<template>
  <div class="user-privileges-box">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-bind="scrollOpt"
      @history="historyBack"/>
    <user-privileges/>
  </div>
</template>

<script>
import UserPrivileges from '@/components/content/_mobile/user/privileges'
export default {
  name: 'mobile-user-privileges-page',
  computed: {
    scrollOpt () {
      return {
        history: true,
        text: 'Privileges'
      }
    }
  },
  components: {
    UserPrivileges
  },
  methods: {
    historyBack (path = '/owner/info') {
      sessionStorage.setItem('lordless_direction', '_reverse')
      const refer = this.$route.query.refer
      return this.$router.push(refer || path)
    }
  }
}
</script>

<style>

</style>
