<template>
  <div class="d-flex user-authorization-box">
    <token-authorizations isAll theme="dark"/>
  </div>
</template>

<script>
import TokenAuthorizations from '@/components/reuse/authorizations/token'
// import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-authorization',
  computed: {
    // ...mapState('candy', [
    //   'candySymbols'
    // ]),
    // ...mapState('contract', [
    //   'tokensContract'
    // ]),
    // tokenBets () {
    //   const filter = [ 'less' ]
    //   const candies = this.candySymbols.list || []
    //   const tokenBets = []
    //   for (const candy of candies) {
    //     if (filter.includes(candy.symbol.toLocaleLowerCase())) {
    //       tokenBets.push({
    //         candy,
    //         count: 1e18
    //       })
    //     }
    //   }
    //   return tokenBets
    // }
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
