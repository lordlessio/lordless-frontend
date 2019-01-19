<template>
  <div class="skeletion-mobile-hops-box">
    <div class="skeletion-hops-container skeletion-breath">
      <div class="d-flex f-align-center skeletion-hops-header">
        <span class="inline-block"></span>
        <div class="v-flex hops-header-cnt">
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="skeletion-hops-cnt">
        <h3></h3>
        <p></p>
        <p></p>
        <p></p>
      </div>
      <div class="skeletion-hops-cards">
        <div class="d-flex f-align-center hops-card-item">
          <p class="ImpactFont">HELM</p>
          <div class="v-flex hops-card-right">
            <p></p>
            <div class="hops-card-days">
              <p></p>
              <p></p>
            </div>
            <div class="hops-card-invested">
              <p></p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lordless-hops-skeletion'
}
</script>

<style lang="scss" scoped>
  .skeletion-mobile-hops-box {
    padding-top: 44px;
  }
  .skeletion-hops-header {
    padding: 18px 20px 35px;
    background-color: $--skeletion-light;
    >span {
      width: 42px;
      height: 42px;
      border-radius: 5px;
      background-color: $--skeletion-dark;
    }
  }
  .hops-header-cnt {
    margin-left: 16px;
    >p {
      height: 14px;
      background-color: $--skeletion-dark;
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 120px;
      }
    }
  }

  .skeletion-hops-cnt {
    margin-top: 30px;
    padding: 0 20px;
    >h3 {
      margin-bottom: 16px;
      width: 140px;
      height: 24px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 10px;
      width: 100%;
      height: 16px;
      background-color: $--skeletion-dark;
      &:last-of-type {
        width: 50%;
      }
    }
  }

  .skeletion-hops-cards {
    margin-top: 30px;
    padding: 0 20px;
  }
  .hops-card-item {
    padding: 20px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    >p {
      font-size: 36px;
      color: $--skeletion-dark;
    }
  }
  .hops-card-right {
    margin-left: 16px;
    p {
      background-color: $--skeletion-dark;
    }
    >p {
      width: 100px;
      height: 14px;
    }
  }
  .hops-card-days {
    margin-top: 14px;
    >p {
      &:nth-of-type(1) {
        height: 24px;
      }
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 60%;
        height: 16px;
      }
    }
  }
  .hops-card-invested {
    margin-top: 12px;
    >p {
      height: 16px;
      &:last-of-type {
        margin-top: 6px;
        width: 60%;
      }
    }
  }
</style>
