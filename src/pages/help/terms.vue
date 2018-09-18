<template>
  <div class="page-terms-box">
    <div class="page-container md">
      <terms class="terms-cnt"/>
    </div>
  </div>
</template>

<script>
import Terms from '@/components/content/sign/terms.vue'
export default {
  components: {
    Terms
  }
}
</script>

<style lang="scss" scoped>
  .page-terms-box {
    padding-bottom: 80px;
    background-color: #f8f8f8;
    @include padding('top', 200px, -2)
  }
  .terms-cnt {
    padding: 50px;
    background-color: #fff;
  }
</style>
