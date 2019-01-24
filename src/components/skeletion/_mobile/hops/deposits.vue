<template>
  <div class="mobile-skeletion-deposits-box">
    <div class="skeletion-deposits-container skeletion-breath">
      <div class="skeletion-deposits-header">
        <div class="d-flex f-align-center deposits-header-item">
          <span class="inline-block header-item-icon"></span>
          <div class="v-flex header-item-right">
            <p></p>
            <p></p>
          </div>
        </div>
        <div class="d-flex f-align-center deposits-header-item">
          <span class="inline-block header-item-icon"></span>
          <div class="v-flex header-item-right">
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
      <ul class="skeletion-deposits-cnt">
        <li class="deposits-cnt-item">
          <h3></h3>
          <div class="cnt-item-info">
            <p></p>
            <p></p>
            <p></p>
          </div>
          <p></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-deposits-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-deposits-box {
    margin-top: 44px;
  }
  .skeletion-deposits-container {

  }
  .skeletion-deposits-header {
    padding: 10px 24px;
    background-color: $--skeletion-light;
  }
  .deposits-header-item {
    padding: 18px 0;
    &:not(:first-of-type) {
      border-top: 2px solid $--skeletion-dark;
    }
  }
  .header-item-icon {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    background-color: $--skeletion-dark;
  }
  .header-item-right {
    margin-left: 16px;
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        width: 70%;
        height: 18px;
      }
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 50%;
        height: 24px;
      }
    }
  }

  .skeletion-deposits-cnt {
    margin-top: 24px;
    padding: 0 20px;
  }
  .deposits-cnt-item {
    padding: 20px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 24px;
    }
    border-radius: 5px;
    >h3 {
      margin-bottom: 16px;
      width: 60%;
      height: 24px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 20px;
      height: 30px;
      border-top: 1px solid $--skeletion-dark;
      background-color: $--skeletion-dark;
    }
  }
  .cnt-item-info {
    padding-top: 12px;
    border-top: 1px solid $--skeletion-dark;
    >p {
      height: 16px;
      background-color: $--skeletion-dark;
      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
  }
</style>
