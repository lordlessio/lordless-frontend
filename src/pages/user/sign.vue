<template>
  <div class="lordless-sign-box">
    <div class="container sign-container">
      <ld-sign></ld-sign>
    </div>
  </div>
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
      // if (val._id) this.$router.push('/owner/info')
    }
  },
  mounted () {
    // if (this.userInfo.address) this.$router.push('/owner/info')
  }
}
</script>

<style lang="scss" scoped>

  .lordless-sign-box {
    color: #fff;
    background-image: linear-gradient(135deg, #5961F9, #EE9AE5);
    @include viewport-unit('min-height', 100vh, 310px);
  }
  .sign-container {
    max-width: 600px;
    padding-top: 160px;
    padding-bottom: 80px;
  }
</style>
