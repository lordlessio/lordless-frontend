<template>
  <div class="user-detail-skeletion">
    <div class="relative user-container-skeletion skeletion-breath">
      <div class="user-header-skeletion">
        <div class="d-flex col-flex f-auto-center user-header-cnt-skeletion">
          <p class="inline-block user-header-avatar"></p>
          <div class="user-header-address">
            <p></p>
            <p></p>
          </div>
          <ul class="d-flex f-align-center user-header-boosts">
            <li v-for="item in 5" :key="item" class="v-flex header-boost-item">
              <p></p>
            </li>
          </ul>
          <div v-for="item in 2" :key="item" class="user-header-progress-box">
            <p class="header-progress-title"></p>
            <h3 class="header-progress-bar"></h3>
            <p class="header-progress-tip"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-user-detail-skeletion'
}
</script>

<style lang="scss" scoped>
  .user-container-skeletion {
    padding: 100px 20px 30px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 120%;
      height: 238px;
      background-color: $--skeletion-dark;
      border-bottom-left-radius: 100%;
      border-bottom-right-radius: 100%;
      transform: translateX(-50%);
      z-index: -1;
    }
    p, h3 {
      background-color: $--skeletion-dark;
    }
  }
  .user-header-skeletion {
    padding: 0 27px;
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .user-header-cnt-skeletion {
    transform: translateY(-36px);
  }
  .user-header-avatar {
    width: 72px;
    height: 72px;
    border-radius: 5px;
    background-color: rgba(214, 214, 214, 1) !important;
  }
  .user-header-address {
    margin-top: 12px;
    >p {
      margin: 0 auto;
      width: 150px;
      height: 14px;
      height: $--skeletion-dark;
      &:not(:first-of-type) {
        margin-top: 6px;
      }
    }
  }

  .user-header-boosts {
    margin-top: 24px;
    width: 100%;
  }

  .header-boost-item {
    >p {
      width: 28px;
      height: 28px;
      border-radius: 5px;
    }
  }

  .user-header-progress-box {
    margin-top: 24px;
    width: 100%;
    >h3 {
      margin-top: 10px;
      height: 22px;
      border-radius: 5px;
    }
    .header-progress-title {
      width: 40%;
      height: 16px;
    }
    .header-progress-tip {
      margin-top: 6px;
      width: 60%;
      height: 14px;
    }
  }
</style>
