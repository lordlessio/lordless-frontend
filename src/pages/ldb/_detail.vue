<template>
  <div class="ldb-detail-box">
    <ldb-detail ref="ldbDetail" theme="light"/>
  </div>
</template>

<script>
import LdbDetail from '@/components/content/ldb/detail'
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
    const { ldbId } = this.$route.params
    this.$nextTick(() => this.$refs.ldbDetail.init(ldbId))
  }
}
</script>
