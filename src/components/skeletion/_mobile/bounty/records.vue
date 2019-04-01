<template>
  <div class="mobile-skeletion-bounty-records">
    <div class="skeletion-records-container skeletion-breath">
      <ul class="d-flex f-wrap records-tags-skeletion">
        <li v-for="item in 4" :key="item" class="records-tags-item"></li>
      </ul>
      <ul class="skeletion-records-cards">
        <li v-for="item in 3" :key="item" class="d-flex f-align-start skeletion-records-card">
          <span class="inline-block records-card-icon"></span>
          <div class="v-flex records-card-cnt">
            <h3 class="records-card-title"></h3>
            <p class="records-card-desc"></p>
            <p class="records-card-date"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-bounty-records-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-bounty-records {
    // padding-top: 44px;
  }
  .skeletion-records-container {

  }
  .records-tags-skeletion {

  }
  .records-tags-item {
    width: 60px;
    height: 24px;
    border-radius: 5px;
    background-color: $--skeletion-dark;
    &:not(:last-of-type) {
      margin-right: 12px;
    }
  }
  .skeletion-records-cards {
    margin-top: 18px;
    // padding: 20px;
  }
  .skeletion-records-card {
    padding: 20px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 15px;
    }
  }
  .records-card-icon {
    width: 64px;
    height: 64px;
    background-color: $--skeletion-dark;
  }
  .records-card-cnt {
    margin-left: 24px;
    h3, p {
      background-color: $--skeletion-dark;
    }
  }
  .records-card-title {
    width: 60%;
    height: 22px;
  }
  .records-card-desc {
    margin-top: 8px;
    width: 80%;
    height: 16px;
  }
  .records-card-date {
    margin-top: 8px;
    width: 80%;
    height: 18px;
  }
</style>
