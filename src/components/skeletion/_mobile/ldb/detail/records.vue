<template>
  <div class="mobile-records-skeletion">
    <h3 class="skeletion-breath"></h3>
    <div class="skeletion-breath">
      <p class="sm"></p>
      <div></div>
      <p class="sm"></p>
      <p></p>
      <p class="sm"></p>
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // mobile-records-skeletion
  .mobile-records-skeletion {
    >h3 {
      margin-top: 30px;
      width: 150px;
      height: 30px;
      background-color: $--skeletion-light;
    }
    >div {
      padding: 20px 20px 30px;
      margin-top: 20px;
      box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
      border-radius: 5px;
      >p {
        width: 90%;
        height: 18px;
        background-color: $--skeletion-light;
        &.sm {
          width: 80px;
        }
        &:not(:first-of-type) {
          margin-top: 10px;
        }
      }
      >div {
        margin-top: 6px;
        width: 150px;
        height: 25px;
        background-color: $--skeletion-light;
      }
    }
  }
</style>
