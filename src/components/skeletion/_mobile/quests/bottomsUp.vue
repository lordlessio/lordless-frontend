<template>
  <div class="mobile-bottoms-up-skeletion">
    <div class="bottoms-up-skeletion-container skeletion-breath">
      <ul class="bottoms-skeletion-ul">
        <li
          v-for="item of [1,2,3]"
          :key="item"
          class="d-flex bottoms-skeletion-item">
          <p class="skeletion-icon bottoms-skeletion-icon">
            <svg>
              <use xlink:href="#icon-alien"/>
            </svg>
          </p>
          <div class="v-flex bottoms-skeletion-info">
            <p></p>
            <p></p>
            <p></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-quests-bottomsup-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-bottoms-up-skeletion {
    margin-top: 24px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .bottoms-skeletion-item {
    padding: 20px 16px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
  .bottoms-skeletion-icon {
    padding: 2px;
    width: 42px;
    height: 42px;
  }
  .bottoms-skeletion-info {
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
