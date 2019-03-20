<template>
  <div class="website-package-bounty-box">
    <div class="package-bounty-container">
      <h1 class="d-flex f-align-baseline text-cap owner-children-title">
        <span class="v-flex">Package Bounty</span>
      </h1>
      <div class="package-bounty-cnt">
        <package-bounty :isMobile="false"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PackageBounty from '@/components/content/_mobile/bounty/package'
export default {
  name: 'website-package-bounty',
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    PackageBounty
  },
  methods: {

    // 初始化 packageBounty
    initPackageBounty () {

    }
  },
  watch: {
    userInfo (val, oval) {
      if (val && oval) this.initPackageBounty()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initPackageBounty()
    })
  }
}
</script>

<style lang="scss" scoped>
  .website-package-bounty-box {
    // padding-top: 30px;
    height: 100%;
  }
  .package-bounty-container {
    height: 100%;
    >h1 {
      // padding: 0 30px;
    }
  }
  .package-bounty-cnt {
    margin-top: 30px;
    // padding: 0 30px;
    // @include overflow();
    // padding: 30px 35px 0;
  }
</style>
