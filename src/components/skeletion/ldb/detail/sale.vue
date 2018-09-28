<template>
  <div class="ldb-deal-skeletion">
    <div class="deal-box-skeletion">
      <div class="skeletion-breath">
        <h2></h2>
        <p></p>
        <p></p>
        <h2></h2>
      </div>
    </div>
    <div class="skeletion-breath deal-btn-skeletion">
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // ldb-deal-skeletion
  .ldb-deal-skeletion {

  }
  .deal-box-skeletion {
    padding: 20px 25px;
    border-radius: 5px;
    background-color: $--skeletion-light;
    h2 {
      width: 80px;
      height: 50px;
      background-color: $--skeletion-dark;
      &:last-of-type {
        width: 100px;
        margin-top: 20px;
      }
    }
    p {
      margin-top: 10px;
      width: 120px;
      height: 30px;
      background-color: $--skeletion-dark;
      &:last-of-type {
        margin-top: 20px;
        width: 180px;
      }
    }
  }
  .deal-btn-skeletion {
    margin-top: 35px;
    padding: 0 25px;
    >p {
      height: 50px;
      border-radius: 5px;
      background-color: $--skeletion-light;
    }
  }
</style>
