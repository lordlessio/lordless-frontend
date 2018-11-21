<template>
  <div class="mobile-reward-skeletion">
    <div class="reward-skeletion-container skeletion-breath">
      <ul class="reward-skeletion-ul">
        <li
          v-for="item of [1]"
          :key="item"
          class="reward-skeletion-item">
          <div class="reward-top-skeletion">
            <div v-for="item of [1, 2]"
                :key="item" class="top-item-skeletion">
              <p></p>
              <p></p>
            </div>
          </div>
          <div class="d-flex reward-bottom-skeletion">
            <p class="skeletion-icon reward-skeletion-icon">
              <svg>
                <use xlink:href="#icon-alien"/>
              </svg>
            </p>
            <div class="v-flex reward-skeletion-info">
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-quests-rewardup-skeletion'
}
</script>

<style lang="scss" scoped>
  .reward-skeletion-item {
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .reward-top-skeletion {
    padding: 18px 25px;
  }
  .top-item-skeletion {
    >p {
      &:nth-of-type(1) {
        width: 80%;
        height: 18px;
      }
      &:nth-of-type(2) {
        margin-top: 6px;
        width: 100px;
        height: 14px;
      }
    }
    &:nth-of-type(1) {
      padding-bottom: 16px;
    }
    &:nth-of-type(2) {
      border-top: 1px solid rgba(221, 221, 221, .5);
      padding-top: 16px;
    }
  }
  .mobile-reward-skeletion {
    margin-top: 24px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .reward-bottom-skeletion {
    padding: 20px 16px;
  }
  .reward-skeletion-icon {
    padding: 2px;
    width: 42px;
    height: 42px;
  }
  .reward-skeletion-info {
    margin-left: 10px;
    >p {
      height: 16px;
      &:nth-of-type(1) {
        width: 80%;
        height: 18px;
      }
      &:nth-of-type(2) {
        width: 80%;
        margin-top: 5px;
      }
      &:nth-of-type(3) {
        width: 60%;
        margin-top: 10px;
      }
    }
  }
</style>
