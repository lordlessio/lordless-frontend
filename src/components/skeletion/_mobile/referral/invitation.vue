<template>
  <div class="referral-invitation-skeletion">
    <div class="invitation-skeletion-container skeletion-breath">
      <div class="invitation-header-skeletion">
        <div class="d-flex f-align-center header-top-skeletion">
          <span class="inline-block header-top-icon"></span>
          <div class="v-flex header-top-text">
            <p></p>
            <p></p>
          </div>
        </div>
        <div class="header-middle-skeletion">
          <p></p>
          <h3></h3>
        </div>
        <div class="header-bottom-skeletion">
          <span class="inline-block header-bottom-btn"></span>
        </div>
      </div>
      <div class="invitation-content-skeletion">
        <h3></h3>
        <div class="d-flex col-flex content-item-skeletion">
          <p></p>
          <div class="content-item-card">
            <span class="inline-block"></span>
            <p></p>
            <p></p>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-referral-invitation-skeletion'
}
</script>

<style lang="scss" scoped>
  .referral-invitation-skeletion {

  }
  .invitation-skeletion-container {

  }
  .invitation-header-skeletion {
    padding: 54px 20px 25px;
    background-color: $--skeletion-light;
  }
  .header-top-skeletion {

  }
  .header-top-icon {
    width: 48px;
    height: 32px;
    background-color: $--skeletion-dark;
  }
  .header-top-text {
    margin-left: 16px;
    >p {
      width: 60%;
      height: 18px;
      background-color: $--skeletion-dark;
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 80%;
        height: 22px;
      }
    }
  }
  .header-middle-skeletion {
    margin-top: 24px;
    >p {
      width: 50%;
      height: 18px;
      background-color: $--skeletion-dark;
    }
    >h3 {
      margin-top: 8px;
      width: 80%;
      height: 28px;
      background-color: $--skeletion-dark;
    }
  }
  .header-bottom-skeletion {
    margin-top: 24px;
  }
  .header-bottom-btn {
    width: 200px;
    height: 44px;
    border-radius: 5px;
    background-color: $--skeletion-dark;
  }

  .invitation-content-skeletion {
    padding: 32px 24px 24px;
    >h3 {
      margin-bottom: 32px;
      width: 80%;
      height: 30px;
      background-color: $--skeletion-dark;
    }
  }
  .content-item-skeletion {
    >p {
      width: 60%;
      height: 22px;
      background-color: $--skeletion-dark;
    }
  }
  .content-item-card {
    margin-top: 18px;
    padding: 32px 20px;
    background-color: $--skeletion-light;
    >span {
      margin: 0 auto;
      width: 115px;
      height: 64px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 6px;
      height: 16px;
      background-color: $--skeletion-dark;
      &:first-of-type {
        margin-top: 16px;
      }
      &:last-of-type {
        width: 60%;
      }
    }
  }
</style>
