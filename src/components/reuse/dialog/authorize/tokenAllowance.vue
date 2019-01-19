<template>
  <div v-if="value" class="crowdsale-box">
    <token-authorizations
      ref="tokenAuthorizations"
      :tokenBets="tokenBets"
      :planType="tokenAllowanceType"/>
  </div>
</template>

<script>
import TokenAuthorizations from '@/components/reuse/authorizations/token'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },

    tokenBets: {
      type: Array,
      default: () => []
    },

    tokenAllowanceType: String
  },
  // watch: {
  //   value (val) {
  //     if (val) {
  //       this.$nextTick(() => {
  //         this.$refs.tokenAuthorizations.initTokenAllowance()
  //       })
  //     }
  //   }
  // },
  components: {
    TokenAuthorizations
  }
}
</script>

<style lang="scss" scoped>
  .crowdsale-box {
    padding-bottom: 30px;
    border-radius: 5px;
    box-sizing: border-box;
    @media screen and (max-width: 768px) {
      padding-top: 30px;
      padding-bottom: 10px;
    }
  }
</style>
