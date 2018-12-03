<template>
  <div class="tavern-poster" :class="[`building-popularity-${popularity}`, { 'shadow': shadow }]">
    <div v-if="showPopularity" class="tavern-popularity-poster" :class="{ 'is-mobile': isMobile }">
      <img alt="tavern popularity image" :src="originSource(`/img/tavern/ldb-level-${popularity}.png`, { size: 120 })"/>
    </div>
    <img alt="tavern curve" class="tavern-curve" :src="originSource('/svg/curve.svg', { size: -1 })">
    <lordless-img
      alt="tavern preview"
      :src="src | reldbIcon"/>
    <span class="tavern-sale-bg" :style="`background-image: url(${originSource('/svg/sale-bg.svg', { size: -1 })})`"></span>
    <p class="d-flex col-flex f-auto-center tavern-sale-tag" v-if="showSale">
      <span class="tavern-sale-svg">
        <svg>
          <use :xlink:href="`#icon-${presale ? 'presale' : 'sale'}`"/>
        </svg>
      </span>
      <span class="tavern-sale-price">{{ salePrice | weiToEth }} ETH</span>
    </p>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'
export default {
  name: 'lordless-tavern-poster',
  props: {
    src: String,
    popularity: Number,
    salePrice: Number,
    presale: {
      type: Boolean,
      default: false
    },

    showSale: {
      type: Boolean,
      default: false
    },

    showPopularity: {
      type: Boolean,
      default: false
    },

    isMobile: {
      type: Boolean,
      default: false
    },

    shadow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    originSource () {
      return originSource(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  tavern-poster  --- begin
   */
  .tavern-poster {
    position: relative;
    width: 100%;
    height: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    >.image-box {
      z-index: 2;
    }
    &.shadow {
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .25);
      .tavern-curve {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
  }
  .tavern-popularity-poster {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 80px;
    height: 80px;
    z-index: 3;
    >img {
      width: 100%;
    }
    &.is-mobile {
      top: 0;
      right: 0;
      width: 40px;
      height: 40px;
    }
  }
  .tavern-sale-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // background-image: url('~static/svg/single/sale-bg.svg');
    background-size: 200%;
    background-position-x: 50%;
    background-position-y: 45%;
    opacity: .3;
    background-repeat: no-repeat;
  }
  .tavern-sale-tag {
    position: absolute;
    left: 0;
    top: 15px;
    width: 100%;
    // visibility: hidden;
    z-index: 5;
  }
  .tavern-sale-svg {
    margin-right: 5px;
    display: inline-block;
    height: 15px;
    fill: $--text-blue-color;
  }
  .tavern-sale-price {
    margin-top: 10px;
    padding: 4px 12px;
    color: #fff;
    font-size: 16px;
    background-image: linear-gradient(to right, #3588FD, #00C0EB);
    border-radius: 20px;
  }

  .tavern-curve {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    z-index: 3;
  }

  /**
   *  tavern-poster  --- end
   */
</style>
