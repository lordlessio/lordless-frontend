<template>
  <div class="skeletion-bounty-detail-box">
    <div class="bounty-detail-container skeletion-breath">
      <div class="d-flex f-align-center bounty-detail-header">
        <span class="inline-block detail-header-icon"></span>
        <div class="v-flex detail-header-right">
          <p></p>
          <h1></h1>
        </div>
      </div>
      <ul class="bounty-detail-bounties">
        <li class="package-item-title"></li>
        <li v-for="item in 3" :key="item" class="d-flex f-justify-center bounty-detail-item">
          <p></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bounty-detail-skeletion'
}
</script>

<style lang="scss" scoped>
  .skeletion-bounty-detail-box {
    margin-top: 44px;
  }
  .bounty-detail-container {
    // padding: 24px;
  }
  .bounty-detail-header {
    padding: 24px;
    background-color: $--skeletion-light;
  }
  .detail-header-icon {
    width: 64px;
    height: 64px;
    background-color: $--skeletion-dark;
  }
  .detail-header-right {
    margin-left: 24px;
    >p {
      width: 80%;
      height: 24px;
      background-color: $--skeletion-dark;
    }
    >h1 {
      margin-top: 12px;
      width: 40%;
      height: 30px;
      background-color: $--skeletion-dark;
    }
  }


  .bounty-detail-bounties {
    padding: 24px;
  }
  .package-item-title {
    width: 40%;
    height: 24px;
    background-color: $--skeletion-dark;
  }
  .bounty-detail-item {
    margin-top: 12px;
    padding: 18px;
    border-radius: 5px;
    background-color: $--skeletion-light;
    >p {
      width: 100%;
      height: 16px;
      background-color: $--skeletion-dark;
    }
  }
</style>
