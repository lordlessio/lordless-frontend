<template>
  <div class="ldb-records-skeletion">
    <h3 class="skeletion-breath"></h3>
    <div class="skeletion-breath">
      <p></p>
      <div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // ldb-records-skeletion
  .ldb-records-skeletion {
    // background-color: $--skeletion-light;
    >h3 {
      height: 40px;
      background-color: $--skeletion-light;
    }
    >div {
      margin-top: 30px;
      >p {
        height: 18px;
        background-color: $--skeletion-light;
      }
      >div {
        margin-top: 15px;
        height: 60px;
        border-radius: 5px;
        background-color: $--skeletion-light;
      }
    }
  }
</style>
