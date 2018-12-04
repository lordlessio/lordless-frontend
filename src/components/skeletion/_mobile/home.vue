<template>
  <div class="mobile-home-skeletion">
    <div class="home-skeletion-contaienr skeletion-breath">
      <h2></h2>
      <div class="home-promotion-skeletion">
        <p class="home-promotion-poster"></p>
        <div class="home-promotion-info">
          <p class="home-promotion-title"></p>
          <p class="home-promotion-bar"></p>
          <p class="home-promotion-claimed"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-home-skeletion'
}
</script>

<style lang="scss">
  .mobile-home-skeletion {
    padding: 20px 0;
  }
  .home-skeletion-contaienr {
    >h2 {
      width: 200px;
      height: 30px;
      background-color: $--skeletion-light;
    }
  }
  .home-promotion-skeletion {
    margin-top: 10px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    overflow: hidden;
  }
  .home-promotion-poster {
    height: 340px;
    background-color: $--skeletion-dark;
  }
  .home-promotion-info {
    padding: 20px;
  }
  .home-promotion-title {
    height: 20px;
    background-color: $--skeletion-dark;
  }
  .home-promotion-bar {
    margin-top: 12px;
    height: 28px;
    background-color: $--skeletion-dark;
    border-radius: 5px;
    overflow: hidden;
  }
  .home-promotion-claimed {
    margin-top: 10px;
    width: 100px;
    height: 35px;
    background-color: $--skeletion-dark;
  }
</style>
