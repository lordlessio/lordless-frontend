<template>
  <div class="mobile-skeletion-bounty-chests">
    <div class="skeletion-chests-container skeletion-breath">
      <ul class="skeletion-chests-cards">
        <li class="d-flex f-align-start skeletion-chests-card">
          <span class="inline-block chests-card-icon"></span>
          <div class="v-flex chests-card-cnt">
            <div class="chests-card-info">
              <p></p>
              <p></p>
            </div>
            <div class="chests-card-info">
              <p></p>
              <p></p>
            </div>
            <div class="d-flex f-align-center chests-card-candies">
              <span class="inline-block"></span>
              <span class="inline-block"></span>
              <span class="inline-block"></span>
              <span class="inline-block"></span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-bounty-chests-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-bounty-chests {
    // padding-top: 44px;
  }
  .skeletion-chests-container {

  }
  .skeletion-chests-cards {
    // padding: 20px;
  }
  .skeletion-chests-card {
    padding: 20px;
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .chests-card-icon {
    width: 64px;
    height: 64px;
    background-color: $--skeletion-dark;
  }
  .chests-card-cnt {
    margin-left: 24px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .chests-card-info {
    >p {
      &:nth-of-type(1) {
        width: 40%;
        height: 14px;
      }
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 80%;
        height: 20px;
      }
    }
    &:not(:first-of-type) {
      margin-top: 10px;
    }
  }
  .chests-card-candies {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid $--skeletion-dark;
    >span {
      width: 24px;
      height: 24px;
      background-color: $--skeletion-dark;
      border-radius: 100%;
      &:not(:first-of-type) {
        margin-left: 8px;
      }
    }
  }
</style>
