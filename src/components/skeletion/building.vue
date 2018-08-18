<template>
  <div class="ld-building-skeletion">
    <div class="building-poster-skeletion skeletion-breath"></div>
    <div class="building-content-skeletion skeletion-breath">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div class="building-bottom-skeletion skeletion-breath">
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-building-skeletion {
    background-color: $--skeletion-light;
    border-radius: 5px;
    overflow: hidden;
  }
  .building-poster-skeletion {
    height: 280px;
    background-color: #dddddd80;
  }
  .building-content-skeletion {
    padding: 0 35px 30px;
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        margin-top: 20px;
        height: 25px;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        height: 18px;
      }
      &:nth-of-type(3) {
        margin-top: 10px;
        height: 20px;
      }
      &:nth-of-type(4) {
        margin-top: 25px;
        height: 25px;
      }
      &:nth-of-type(5) {
        margin-top: 10px;
        height: 18px;
      }
    }
  }
  .building-bottom-skeletion {
    padding: 35px 30px;
    >p {
      height: 25px;
      background-color: $--skeletion-dark;
    }
  }
</style>
