<template>
  <div class="main-referee-skeletion">
    <div class="referee-skeletion-container skeletion-breath">
      <div class="d-flex col-flex referee-header-skeletion">
        <p></p>
        <h3></h3>
      </div>
      <div class="d-flex col-flex referee-cnt-skeletion">
        <span class="inline-block line-height-0 referee-cnt-icon">
          <svg>
            <use xlink:href="#icon-certificate"/>
          </svg>
        </span>
        <p></p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-referee-skeletion'
}
</script>

<style lang="scss" scoped>
  .main-referee-skeletion {

  }
  .referee-skeletion-container {

  }
  .referee-header-skeletion {
    margin-top: 44px;
    padding: 8px 20px 0;
    height: 80px;
    background-color: $--skeletion-light;
    >p {
      width: 50%;
      height: 18px;
      background-color: $--skeletion-dark;
    }
    >h3 {
      margin-top: 10px;
      width: 70%;
      height: 28px;
      background-color: $--skeletion-dark;
    }
  }
  .referee-cnt-skeletion {
    padding: 64px 20px 0;
    >p {
      margin: 12px auto 0;
      width: 80%;
      height: 20px;
      background-color: $--skeletion-dark;
      &:first-of-type {
        margin-top: 24px;
      }
    }
  }
  .referee-cnt-icon {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    fill: $--skeletion-dark;
  }
</style>
