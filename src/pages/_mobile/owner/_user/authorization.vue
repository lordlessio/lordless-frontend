<template>
  <div class="d-flex user-authorization-box">
    <token-authorizations :tokenBets="tokenBets" theme="dark"/>
  </div>
</template>

<script>
import TokenAuthorizations from '@/components/reuse/authorizations/token'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-authorization',
  computed: {
    ...mapState('candy', [
      'candySymbols'
    ]),
    ...mapState('contract', [
      'airdropTokens',
      'tokenAllowances'
    ]),
    tokenBets () {
      const candies = this.candySymbols.list
      return candies.map(candy => {
        return {
          candy,
          balance: 1
        }
      })
    }
  },
  components: {
    TokenAuthorizations
  },
  mounted () {
    console.log('tokenBets', this.tokenBets)
  }
}
</script>

<style lang="scss" scoped>

  .user-authorization-box {
    padding: 94px 30px 30px;
    font-size: 16px;
  }
  // .user-authorization-cnt {
  //   margin-top: 35px;
  // }
  .authorization-cnt-container {

  }
  .authorization-item {
    @include margin('top', 25px, 1, -2);
  }
</style>
