<template>
  <div class="initial-box skeletion-breath skeletion-market-item">
    <div class="skeletion-light item-poster"></div>
    <div class="d-flex f-align-center item-bottom">
      <span class="skeletion-light item-svg">
        <svg>
          <use xlink:href="#icon-crown"/>
        </svg>
      </span>
      <span class="v-flex skeletion-light item-name"></span>
      <span class="skeletion-light item-level"></span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .skeletion-market-item {
    position: relative;
  }
  .item-poster {
    width: 100%;
    padding-top: 100%;
    border-radius: 5px;
  }
  .item-bottom {
    margin-top: 12px;
    position: relative;
    >span {
      display: inline-block;
      height: 25px;
    }
  }
  .item-svg {
    width: 25px;
    background-color: transparent;
  }
  .item-name {
    margin-left: 8px;
    margin-right: 5px;
    border-radius: 3px;
  }
  .item-level {
    width: 35px;
    border-radius: 3px;
  }
</style>
