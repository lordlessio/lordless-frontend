<template>
  <div class="ldb-detail-box">
    <LdbDetail ref="ldbDetail" theme="light" :ldbId="$route.params.ldbId"/>
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
    this.$nextTick(() => this.$refs.ldbDetail.init())
  }
}
</script>
