<template>
  <div class="page-privacy-box">
    <div class="page-container md">
      <privacy class="privacy-cnt"/>
    </div>
  </div>
</template>

<script>
import Privacy from '@/components/content/sign/privacy.vue'
export default {
  components: {
    Privacy
  }
}
</script>

<style lang="scss" scoped>
  .page-privacy-box {
    padding-bottom: 80px;
    background-color: #f8f8f8;
    @include padding('top', 200px, -2)
  }
  .privacy-cnt {
    padding: 50px;
    background-color: #fff;
  }
</style>
