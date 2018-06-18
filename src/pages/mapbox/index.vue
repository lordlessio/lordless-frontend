<template>
  <div class="ld-lbs-main">
    <Mapbox/>
  </div>
</template>

<script>
import Mapbox from '@/components/lbs/mapbox'
export default {
  data: () => {
    return {}
  },
  components: {
    Mapbox
  }
}
</script>

<style lang="scss">
  .ld-lbs-main {
    height: 100vh;
  }
</style>
