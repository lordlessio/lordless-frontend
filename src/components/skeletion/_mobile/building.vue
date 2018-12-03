<template>
  <div class="mobile-skeletion-building">
    <div class="d-flex col-flex f-align-stretch skeletion-building-container skeletion-breath">
      <p class="relative skeletion-building-poster">
        <svg>
          <use xlink:href="#icon-curve"/>
        </svg>
      </p>
      <div class="v-flex d-flex col-flex f-auto-center">
        <p class="skeletion-building-name"></p>
        <p class="skeletion-building-price"></p>
        <div class="skeletion-building-bottom">
          <p class="skeletion-building-markline"></p>
          <p class="skeletion-building-barname"></p>
          <p class="skeletion-building-bar"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'
export default {
  methods: {
    originSource () {
      return originSource(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-building {
    background-color: $--skeletion-light;
  }
  .skeletion-building-container {
    p {
      background-color: $--skeletion-dark;
    }
    // >div {
    //   margin-left: 20px;
    //   p {
    //     margin-top: 10px;
    //     height: 20px;
    //     background-color: $--skeletion-dark;
    //   }
    // }
  }
  .skeletion-building-poster {
    padding-top: 160px;
    width: 160px;
    border-radius: 5px;
    >svg {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 40px;
      fill: $--skeletion-light;
    }
  }
  .skeletion-building-name {
    margin: 0 auto;
    width: 100px;
    height: 14px;
  }
  .skeletion-building-price {
    margin: 5px auto 0;
    width: 60px;
    height: 16px;
  }
  .skeletion-building-bottom {
    margin-top: 12px;
    width: 100%;
    padding: 0 20px 20px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .skeletion-building-markline {
    width: 100%;
    height: 0;
    border-top: 1px solid $--skeletion-dark;
    opacity: .75;
  }
  .skeletion-building-barname {
    margin-top: 12px;
    width: 100%;
    height: 14px;
  }
  .skeletion-building-bar {
    margin-top: 4px;
    height: 6px;
    border-radius: 5px;
  }
</style>
