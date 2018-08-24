<template>
  <div class="ldb-tasks-skeletion">
    <h3></h3>
    <p></p>
    <div></div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-tasks-skeletion
  .ldb-tasks-skeletion {
    >h3 {
      height: 40px;
      background-color: $--skeletion-light;
    }
    >p {
      margin-top: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: $--skeletion-light;
    }
    >div {
      margin: 80px auto 0;
      position: relative;
      width: 60%;
      height: 223px;
      border-radius: 5px;
      background-color: $--skeletion-light;
      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background-color: $--skeletion-light;
        transform: translateY(-50%);
      }
      &::before {
        left: -25%;
      }
      &::after {
        right: -25%;
      }
    }
  }
</style>
