<template>
  <div class="skeletion-mobile-candy-box">
    <ul class="skeletion-mobile-candy-ul skeletion-breath">
      <li v-for="item of [1,2,3]" :key="item" class="d-flex row-flex skeletion-mobile-candy-item">
        <p class="skeletion-icon skeletion-mobile-candy-icon">
          <svg>
            <use xlink:href="#icon-alien"/>
          </svg>
        </p>
        <p class="v-flex skeletion-mobile-candy-cnt">
          <span></span>
          <span></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'skeletion-mobile-candy'
}
</script>

<style lang="scss">
  .skeletion-mobile-candy-box {
    // padding: 0 20px;
  }
  .skeletion-mobile-candy-ul {
    margin-top: 10px;
  }
  .skeletion-mobile-candy-item {
    padding: 20px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
  .skeletion-mobile-candy-icon {
    padding: 2px;
    width: 42px;
    height: 42px;
  }
  .skeletion-mobile-candy-cnt {
    margin-left: 16px;
    >span {
      display: block;
      height: 18px;
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        width: 80%;
      }
      &:nth-of-type(2) {
        margin-top: 12px;
        width: 80px;
      }
    }
  }
</style>
