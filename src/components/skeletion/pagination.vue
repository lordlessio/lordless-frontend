<template>
  <div class="skeletion-breath skeletion-pagination-box">
    <ul class="d-flex f-align-center">
      <li v-for="(item, index) of [1,2,3,4,5,6,7,8]"
          :key="index"
          class="skeletion-light pager-number"
          :class="{ 'skeletion-dark': index === 0, 'el-icon el-icon-more': index === 6 }">
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  .skeletion-pagination-box {

  }
  .pager-number {
    margin: 0 5px;
    width: 40px;
    height: 40px;
    border-radius: 2px;
    &:not(.more) {
      display: inline-block;
    }
    &.el-icon-more {
      text-align: center;
      line-height: 40px;
      color: #ddd;
    }
  }
</style>
