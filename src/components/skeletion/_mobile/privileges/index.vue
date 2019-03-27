<template>
  <div class="main-privileges-skeletion">
    <div class="privileges-skeletion-container skeletion-breath">
      <h3 class="privileges-card-title"></h3>
      <ul class="d-flex col-flex privileges-card-skeletion">
        <li v-for="item in 3" :key="item" class="d-flex f-align-center privileges-card-item">
          <span class="inline-block line-height-0 privileges-card-icon"></span>
          <div class="v-flex privileges-card-cnt">
            <h3></h3>
            <p></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-privileges-skeletion'
}
</script>

<style lang="scss" scoped>
  .main-privileges-skeletion {

  }
  .privileges-skeletion-container {
    padding: 64px 20px 50px;
  }
  .privileges-card-title {
    width: 45%;
    height: 20px;
    background-color: $--skeletion-dark;
  }
  .privileges-card-skeletion {
    margin-top: 12px;
    padding: 0 20px;
    background-color: $--skeletion-light;
  }
  .privileges-card-item {
    padding: 20px 0;
    &:not(:first-of-type) {
      border-top: 1px solid $--skeletion-border;
    }
  }
  .privileges-card-icon {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    background-color: $--skeletion-dark;
  }
  .privileges-card-cnt {
    margin-left: 12px;
    >h3 {
      width: 50%;
      height: 20px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 8px;
      width: 80%;
      height: 16px;
      background-color: $--skeletion-dark;
    }
  }
</style>
