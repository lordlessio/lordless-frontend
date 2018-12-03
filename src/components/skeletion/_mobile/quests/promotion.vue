<template>
  <div class="mobile-promotion-skeletion">
    <div class="promotion-skeletion-container skeletion-breath">
      <div class="promotion-skeletion-top">
        <p></p>
      </div>
      <div class="d-flex f-align-center promotion-skeletion-bottom">
        <p class="promotion-skeletion-symbol"></p>
        <div class="v-flex promotion-skeletion-info">
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-quest-promotion-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-promotion-skeletion {

  }
  .promotion-skeletion-container {
    border-radius: 100%;
    overflow: hidden;
    background-color: $--skeletion-light;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .promotion-skeletion-top {
    padding: 10px 20px;
    >p {
      width: 150px;
      height: 16px;
    }
  }
  .promotion-skeletion-bottom {
    padding: 16px 20px;
  }
  .promotion-skeletion-symbol {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    background-color: $--skeletion-dark;
  }
  .promotion-skeletion-info {
    margin-left: 8px;
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        width: 90%;
        height: 20px;
      }
      &:nth-of-type(2) {
        margin-top: 4px;
        width: 90%;
        height: 16px;
      }
    }
  }
</style>
