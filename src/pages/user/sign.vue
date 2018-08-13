<template>
  <ld-sign></ld-sign>
</template>

<script>
import LdSign from '@/components/reuse/dialog/authorize/sign'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    LdSign
  },
  watch: {
    userInfo (val) {
      if (val._id) this.$router.push('/user/info')
    }
  },
  mounted () {
    if (this.userInfo._id) this.$router.push('/user/info')
  }
}
</script>

<style>

</style>
