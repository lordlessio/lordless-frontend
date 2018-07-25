<template>
  <div class="inherit-box skeletion-breath skeletion-detail-content">
    <!-- <div class="skeletion-light detail-poster"></div> -->
    <div class="detail-content">
      <div class="detail-cnt-header">
        <p class="detail-title detail-header-title"></p>
        <p class="detail-header-location"></p>
      </div>
      <div class="detail-cnt-item detail-cnt-desc">
        <p></p>
        <p></p>
        <p></p>
        <span class="inline-block"></span>
      </div>
      <div class="d-flex f-align-center detail-cnt-item detail-cnt-features">
        <div class="features-item">
          <p class="sm"></p>
          <p class="lg"></p>
        </div>
        <div class="features-item">
          <p class="sm"></p>
          <p class="lg"></p>
        </div>
      </div>
      <div class="detail-cnt-item lg detail-cnt-tasks">
        <p class="detail-title detail-title-lg"></p>
        <span class="inline-block detail-task"></span>
        <span class="inline-block detail-task"></span>
      </div>
      <div class="detail-cnt-item detail-cnt-candy">
        <p class="detail-title detail-title-sm"></p>
        <div class="detail-table">
          <div class="detail-table-title"></div>
          <div class="detail-table-cnt"></div>
        </div>
      </div>
      <div class="detail-cnt-item lg detail-cnt-history">
        <p class="detail-title detail-title-lg"></p>
        <div class="detail-table">
          <div class="detail-table-title"></div>
          <div class="detail-table-cnt"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .skeletion-detail-content {
    padding: 0 25px;
  }
  .detail-poster {
    width: 100%;
    height: calc((100vh / 3 * 2) + 50px);
    min-height: 300px;
  }
  .detail-content {
    margin: 80px auto 100px;
    width: 100%;
    max-width: 1000px;
  }
  .detail-cnt-item {
    margin-top: 40px;
    &.lg {
      margin-top: 100px;
    }
  }
  .detail-title {
    margin: 10px 0 15px;
  }
  .detail-header-title {
    width: 80%;
    max-width: 450px;
    height: 60px;
    background-color: $--skeletion-light;
  }
  .detail-header-location {
    width: 80%;
    max-width: 300px;
    height: 28px;
    background-color: $--skeletion-light;
  }
  .detail-cnt-desc {
    >p, >span {
      margin-bottom: 10px;
      height: 20px;
      background-color: $--skeletion-light;
    }
    >span {
      width: 70%;
    }
  }
  .detail-title-sm {
    width: 120px;
    margin-bottom: 20px;
    height: 35px;
    background-color: $--skeletion-light;
  }
  .detail-title-lg {
    width: 200px;
    margin-bottom: 25px;
    height: 45px;
    background-color: $--skeletion-light;
  }
  .features-item {
    margin-right: 30px;
    width: 50%;
    max-width: 200px;
    >p {
      margin-bottom: 15px;
      background-color: $--skeletion-light;
      &.sm {
        width: 60%;
        height: 25px;
      }
      &.lg {
        height: 35px;
      }
    }
  }
  .detail-task {
    margin-right: 30px;
    width: 40%;
    height: 60px;
    border-radius: 5px;
    background-color: $--skeletion-light;
  }
  .detail-table {
    border-radius: 5px;
  }
  .detail-table-title {
    height: 60px;
    background-color: $--skeletion-dark;
  }
  .detail-table-cnt {
    height: 160px;
    background-color: $--skeletion-light;
  }
</style>
