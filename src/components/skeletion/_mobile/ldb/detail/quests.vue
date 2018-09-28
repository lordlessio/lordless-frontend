<template>
  <div class="mobile-quests-skeletion">
    <h3 class="skeletion-breath"></h3>
    <div class="d-flex f-align-end skeletion-breath">
      <div class="d-flex col-flex mobile-quests-top">
        <p></p>
        <p></p>
      </div>
      <div class="v-flex d-flex col-flex f-justify-around mobile-quests-middle">
        <p></p>
        <p>
          <span></span>
          <span></span>
          <span></span>
        </p>
      </div>
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // mobile-quests-skeletion
  .mobile-quests-skeletion {
    // background-color: $--skeletion-light;
    span {
      display: block;
    }
    >h3 {
      margin-top: 30px;
      width: 150px;
      height: 30px;
      background-color: $--skeletion-light;
    }
    >div {
      padding: 30px 25px;
      margin-top: 20px;
      height: 180px;
      box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
      border-radius: 5px;
      >p {
        width: 80px;
        height: 40px;
        border-radius: 5px;
        background-color: $--skeletion-light;
      }
    }
  }
  .mobile-quests-top {
    >p {
      width: 70px;
      height: 70px;
      border-radius: 100%;
      background-color: $--skeletion-light;
      &:not(:first-of-type) {
        margin-top: -10px;
      }
    }
  }
  .mobile-quests-middle {
    margin-left: 20px;
    height: 100%;
    >p {
      &:first-of-type {
        height: 25px;
        background-color: $--skeletion-light;
      }
      >span {
        margin-top: 6px;
        width: 100px;
        height: 20px;
        background-color: $--skeletion-light;
      }
    }
  }
</style>
