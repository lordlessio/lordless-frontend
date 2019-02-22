<template>
  <div class="mobile-bc-page">
    <mobile-b-c/>
  </div>
</template>

<script>
import MobileBC from '@/components/content/_mobile/bc'
import { activatedMixins } from '@/mixins'
export default {
  name: 'mobile-bc-page',
  mixins: [activatedMixins],
  components: {
    MobileBC
  }
}
</script>

<style lang="scss" scoped>
  // .mobile-bc-page {
  //   @include viewport-unit(width, 100vw);
  // }
</style>
