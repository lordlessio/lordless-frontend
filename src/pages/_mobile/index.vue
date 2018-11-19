<template>
  <div class="mobile-main-page">
    <router-view class="mobile-children-page"/>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  .mobile-main-page {
    margin: 0 auto;
    max-width: 768px;
    background-color: #f8f8f8;
  }
  .mobile-children-page {
    // padding: 0 20px;
    @include viewport-unit(min-height, 100vh, 60px);
  }
  .children-none-data-box {
    margin: 0 auto;
    width: 80%;
    text-align: center;
  }
  .children-none-data-container {

  }
  .children-none-data-icon {
    margin: 0 auto;
    width: 120px;
    line-height: 0;
    fill: #999;
  }
  .children-none-data-desc {
    margin-bottom: 36px;
    font-size: 16px;
    color: #999;
  }
  .children-none-data-btn {
    width: 100%;
    padding: 12px 0;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
