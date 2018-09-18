<template>
  <div class="ldb-approved-skeletion">
    <!-- <h3 class="skeletion-breath"></h3> -->
    <div class="skeletion-breath">
      <p>
        <span></span>
        <span></span>
      </p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  // ldb-approved-skeletion
  .ldb-approved-skeletion {
    padding: 50px 30px 40px;
    border-radius: 5px;
    background-color: $--skeletion-light;
    >div {
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          text-align: center;
          background-color: transparent;
          >span {
            display: inline-block;
            width: 90px;
            height: 90px;
            border-radius: 100%;
            background-color: $--skeletion-dark;
            &:not(:first-of-type) {
              margin-left: -15px;
            }
          }
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          height: 18px;
        }
        &:nth-of-type(3) {
          margin-top: 20px;
          height: 18px;
        }
        &:nth-of-type(4) {
          margin-top: 15px;
          height: 25px;
        }
        &:nth-of-type(5) {
          margin-top: 10px;
          height: 18px;
        }
      }
    }
  }
</style>
