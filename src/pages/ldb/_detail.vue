<template>
  <div class="ldb-detail-box">
    <LdbDetail ref="ldbDetail" theme="gray" :ldbId="$route.params.ldbId"/>
  </div>
</template>

<script>
import LdbDetail from '@/components/ldb/detail'
export default {
  data: () => {
    return {}
  },
  components: {
    LdbDetail
  },
  methods: {
    init () {
      // this.$refs.ldbDetail.init()
    }
  },
  mounted () {
    this.$refs.ldbDetail.init()
  }
}
</script>

<style lang="scss">
  .ldb-detail-box {
    // padding-bottom: 120px;
  }
</style>
