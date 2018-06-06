<template>
  <div class="ld-lbs-main">
    <AMap viewMode="3D"/>
  </div>
</template>

<script>
import AMap from '@/components/lbs/aMap'
export default {
  components: {
    AMap
  },
  mounted () {}
}
</script>

<style lang="scss">
  .ld-lbs-main {
    margin-top: 60px;
    width: 100%;
    height: 100%;
  }
</style>
