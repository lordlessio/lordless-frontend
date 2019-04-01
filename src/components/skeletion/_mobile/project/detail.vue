<template>
  <div class="mobile-project-detail-skeletion skeletion-breath">
    <div class="project-detail-container">
      <!-- <p class="d-flex f-align-center">
        <span class="inline-block detail-symbol-icon"></span>
        <span class="inline-block detail-symbol-text"></span>
      </p>
      <h2></h2> -->
      <div class="detail-promotion-skeletion">
        <p class="detail-promotion-poster"></p>
        <div class="detail-promotion-info">
          <p class="detail-promotion-title"></p>
          <p class="detail-promotion-bar"></p>
          <p class="detail-promotion-claimed"></p>
        </div>
      </div>
      <!-- <div class="detail-intro-skeletion">
        <h3></h3>
        <ul class="intro-ul-skeletion">
          <li v-for="item in 3" :key="item" class="intro-li-skeletion">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-project-detail-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-project-detail-skeletion {
    padding: 20px;
  }
  .detail-promotion-skeletion {
    margin-top: 10px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    overflow: hidden;
  }
  .detail-promotion-poster {
    height: 128px;
    background-color: $--skeletion-dark;
  }
  .detail-promotion-info {
    padding: 20px;
  }
  .detail-promotion-title {
    height: 20px;
    background-color: $--skeletion-dark;
  }
  .detail-promotion-bar {
    margin-top: 12px;
    height: 28px;
    background-color: $--skeletion-dark;
    border-radius: 5px;
    overflow: hidden;
  }
  .detail-promotion-claimed {
    margin-top: 10px;
    width: 100px;
    height: 35px;
    background-color: $--skeletion-dark;
  }

  // detail-intro-skeletion
  // .detail-intro-skeletion {
  //   // padding: 20px;
  //   margin-top: 24px;
  //   >h3 {
  //     width: 100px;
  //     height: 24px;
  //     background-color: $--skeletion-light;
  //   }
  // }
  // .intro-ul-skeletion {
  //   margin-top: 20px;
  //   // padding: 20px;
  // }
  // .intro-li-skeletion {
  //   &:not(:first-of-type) {
  //     margin-top: 20px;
  //   }
  //   p {
  //     height: 16px;
  //     background-color: $--skeletion-light;
  //   }
  //   >p {
  //     width: 95%;
  //     &:first-of-type {
  //       margin-bottom: 10px;
  //       width: 150px;
  //     }
  //     &:not(:first-of-type) {
  //       margin-top: 5px;
  //     }
  //     &:last-of-type {
  //       width: 120px;
  //     }
  //   }
  // }
</style>
