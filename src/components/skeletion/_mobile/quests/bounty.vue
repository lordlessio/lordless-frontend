<template>
  <div class="mobile-bounty-skeletion">
    <div class="bounty-skeletion-container skeletion-breath">
      <ul class="bounty-skeletion-ul">
        <li
          v-for="item of [1,2,3]"
          :key="item"
          class="d-flex bounty-skeletion-item">
          <p class="skeletion-icon bounty-skeletion-icon">
            <svg>
              <use xlink:href="#icon-alien"/>
            </svg>
          </p>
          <div class="v-flex bounty-skeletion-infobox">
            <div class="bounty-skeletion-info">
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div class="bounty-skeletion-timeline">
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
  name: 'mobile-quests-bountyup-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-bounty-skeletion {
    margin-top: 24px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .bounty-skeletion-item {
    padding: 20px 16px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
  .bounty-skeletion-icon {
    padding: 2px;
    width: 42px;
    height: 42px;
  }
  .bounty-skeletion-infobox {
    margin-left: 10px;
  }
  .bounty-skeletion-info {
    >p {
      height: 16px;
      &:nth-of-type(1) {
        width: 80%;
        height: 18px;
      }
      &:nth-of-type(2) {
        width: 80%;
        margin-top: 6px;
      }
      &:nth-of-type(3) {
        width: 75px;
        height: 24px;
        margin-top: 10px;
        border-radius: 5px;
      }
    }
  }
  .bounty-skeletion-timeline {
    padding-top: 12px;
    margin-top: 12px;
    border-top: 1px solid #ddd;
    >p {
      height: 18px;
    }
  }
</style>
