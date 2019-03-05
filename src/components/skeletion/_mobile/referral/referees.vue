<template>
  <div class="referral-referees-skeletion">
    <div class="referees-skeletion-container skeletion-breath">
      <h3></h3>
      <ul class="referees-cnt-skeletion">
        <li v-for="item in 3" :key="item" class="d-flex f-align-start referees-item-skeletion">
          <span class="inline-block referees-item-icon"></span>
          <div class="v-flex d-flex col-flex referees-item-info">
            <p class="referees-info-address"></p>
            <p class="referees-info-address"></p>
            <p class="referees-info-status"></p>
            <p class="referees-info-date"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-referral-referees-skeletion'
}
</script>

<style lang="scss" scoped>
  .referees-skeletion-container {
    >h3 {
      margin-top: 20px;
      margin-left: 20px;
      width: 60%;
      height: 22px;
      background-color: $--skeletion-dark;
    }
  }
  .referees-cnt-skeletion {
    margin-top: 10px;
  }
  .referees-item-skeletion {
    padding-top: 20px;
    padding-left: 20px;
    background-color: $--skeletion-light;
    &:not(:last-of-type) {
      .referees-item-info {
        border-bottom: 1px solid $--skeletion-dark;
      }
    }
  }
  .referees-item-icon {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    background-color: $--skeletion-dark;
  }
  .referees-item-info {
    margin-left: 12px;
    padding-right: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .referees-info-address {
    height: 18px;
    &:nth-of-type(2) {
      margin-top: 4px;
      width: 40%;
    }
  }
  .referees-info-status {
    margin-top: 10px;
    width: 60px;
    height: 22px;
    border-radius: 5px;
  }
  .referees-info-date {
    margin-top: 10px;
    width: 50%;
    height: 20px;
  }
</style>
