<template>
  <div class="skeletion-mobile-planBase-box">
    <div class="skeletion-planBase-container skeletion-breath">
      <div class="d-flex f-align-center skeletion-planBase-header">
        <span class="inline-block"></span>
        <div class="v-flex planBase-header-cnt">
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="skeletion-planBase-amount">
        <p></p>
        <h3></h3>
        <div class="d-flex f-align-center planBase-amount-tips">
          <span class="inline-block"></span>
          <div class="v-flex">
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
      <div class="skeletion-planBase-cnt">
        <h3></h3>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'planBase-detail-skeletion'
}
</script>

<style lang="scss" scoped>
  .skeletion-mobile-planBase-box {
    padding-top: 44px;
  }
  .skeletion-planBase-header {
    padding: 18px 24px;
    background-color: $--skeletion-light;
    >span {
      width: 62px;
      height: 62px;
      border-radius: 5px;
      background-color: $--skeletion-dark;
    }
  }
  .planBase-header-cnt {
    margin-left: 16px;
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        width: 80px;
        height: 14px;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        width: 90%;
        height: 18px;
      }
    }
  }

  .skeletion-planBase-amount {
    margin-top: 30px;
    padding: 20px;
    background-color: $--skeletion-light;
    >p {
      height: 20px;
      background-color: $--skeletion-dark;
    }
    >h3 {
      margin-top: 12px;
      height: 30px;
      background-color: $--skeletion-dark;
    }
  }
  .planBase-amount-tips {
    // padding-left: 24px;
    margin-top: 16px;
    >span {
      width: 30px;
      height: 30px;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-left: 16px;
      >p {
        height: 16px;
        background-color: $--skeletion-dark;
        &:last-of-type {
          margin-top: 8px;
          width: 60%;
        }
      }
    }
  }

  .skeletion-planBase-cnt {
    margin-top: 30px;
    padding: 20px;
    background-color: $--skeletion-light;
    >h3 {
      margin-bottom: 16px;
      width: 140px;
      height: 20px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 10px;
      width: 100%;
      height: 16px;
      background-color: $--skeletion-dark;
    }
  }
</style>
