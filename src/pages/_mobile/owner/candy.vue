<template>
  <div class="mobile-candy-page">
    <mobile-candy/>
  </div>
</template>

<script>
import MobileCandy from '@/components/content/_mobile/candy'
import { activatedMixins } from '@/mixins'
export default {
  name: 'mobile-candy-page',
  mixins: [activatedMixins],
  components: {
    MobileCandy
  }
}
</script>

<style lang="scss" scoped>
  .mobile-candy-page {
    padding-top: 52px;
    @include viewport-unit(min-height, 100vh, 60px);
  }
</style>
