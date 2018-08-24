<template>
  <div class="d-flex ldb-datas-skeletion">
    <div class="v-flex skeletion-breath">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div class="v-flex skeletion-breath">
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-datas-skeletion
  .ldb-datas-skeletion {
    border-radius: 5px;
    background-color: $--skeletion-light;
    >div {
      padding: 32px 30px;
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 80px;
          height: 30px;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          width: 120px;
          height: 45px;
        }
        &:nth-of-type(3) {
          margin-top: 15px;
          height: 25px;
          border-radius: 5px;
        }
        &:nth-of-type(4) {
          margin-top: 10px;
          width: 50%;
          height: 15px;
        }
      }
    }
  }
</style>
