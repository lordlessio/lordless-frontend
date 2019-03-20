<template>
  <div class="referral-rewards-skeletion">
    <div class="rewards-container-skeletion skeletion-breath" :class="{ 'is-website': isWebsite }">
      <div class="d-flex f-align-center rewards-tabs-skeletion">
        <span class="inline-block line-height-0 rewards-tabs-icon">
          <svg>
            <use xlink:href="#icon-back"/>
          </svg>
        </span>
        <span class="inline-block rewards-tabs-item"></span>
        <span class="inline-block rewards-tabs-item"></span>
      </div>
      <h3></h3>
      <ul class="rewards-cnt-skeletion">
        <li v-for="item in 3" :key="item" class="d-flex f-align-start rewards-item-skeletion">
          <span class="inline-block rewards-item-icon"></span>
          <div class="v-flex d-flex col-flex rewards-item-info">
            <p class="rewards-info-title"></p>
            <p class="rewards-info-address"></p>
            <p class="rewards-info-date"></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-referral-rewards-skeletion',
  props: {
    isWebsite: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .rewards-container-skeletion {
    margin-top: -44px;
    &.is-website {
      margin-top: 0;
      .rewards-tabs-skeletion {
        display: none;
      }
    }
  }
  .rewards-tabs-skeletion {
    height: 44px;
    background-color: $--skeletion-light;
    border-bottom: 1px solid $--skeletion-dark;
  }
  .rewards-tabs-icon {
    margin-left: 12px;
    padding: 8px;
    width: 34px;
    height: 34px;
    fill: $--skeletion-dark;
    box-sizing: border-box;
  }
  .rewards-tabs-item {
    margin-left: 20px;
    width: 80px;
    height: 20px;
    background-color: $--skeletion-dark;
  }

  .rewards-cnt-skeletion {
    p, span {
      background-color: $--skeletion-dark;
    }
  }
  .rewards-item-skeletion {
    padding-top: 20px;
    padding-left: 20px;
    background-color: $--skeletion-light;
    &:not(:last-of-type) {
      .rewards-item-info {
        border-bottom: 1px solid $--skeletion-dark;
      }
    }
  }
  .rewards-item-icon {
    width: 32px;
    height: 32px;
    border-radius: 100%;
  }
  .rewards-item-info {
    margin-left: 12px;
    padding-right: 20px;
    padding-bottom: 20px;
  }
  .rewards-info-title {
    width: 60%;
    height: 20px;
  }
  .rewards-info-address {
    margin-top: 6px;
    width: 80%;
    height: 20px;
  }
  .rewards-info-date {
    margin-top: 6px;
    width: 50%;
    height: 20px;
  }
</style>
