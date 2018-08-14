<template>
  <div class="text-center cursor-pointer ld-building-card" :class="[{ 'sale': sale, 'shadow': shadow }, `popularity-${ldbInfo.chain.popularity}`]">
    <figure @click="$emit('choose', ldbInfo)">
      <div class="building-card-top">
        <div class="building-header">
          <img class="building-curve" src="/static/svg/single/curve.svg">
          <ld-img :src="ldbInfo.ldbIcon.source.preview | reldbIcon"></ld-img>
          <span class="building-sale-bg"></span>
          <p class="d-flex f-auto-center building-sale-tag">
            <span class="building-sale-svg">
              <svg>
                <use xlink:href="#icon-gradient-ldb-sale"/>
              </svg>
            </span>
            <span class="building-sale-price">{{ ldbInfo.chain.auction.price | weiToEth }} ETH</span>
          </p>
        </div>
        <div class="building-main-cnt">
          <h2 class="building-name">{{ ldbInfo.name.zh }}</h2>
          <p class="building-tokenId">#{{ ldbInfo.chain.tokenId }}</p>
          <p class="d-flex f-auto-center building-coords">
            <span>
              <i class="el-icon-location"></i>
            </span>
            <span>&nbsp;{{ ldbInfo.chain.lng | transferCoords | sliceStr }}, {{ ldbInfo.chain.lat | transferCoords | sliceStr }}</span>
          </p>
          <ul class="d-flex f-align-center building-data">
            <li class="v-flex building-data-item">
              <p>{{ ldbInfo.chain.level || 0 }}</p>
              <p>Level</p>
            </li>
            <li class="v-flex building-data-item">
              <p>{{ ldbInfo.chain.popularity || 0 }}</p>
              <p>Popularity</p>
            </li>
            <li class="v-flex building-data-item">
              <p>99</p>
              <p>Members</p>
            </li>
          </ul>
        </div>
      </div>
      <figcaption class="building-card-bottom">
        <ul class="text-left">
          <li class="d-flex col-flex">
            <p class="d-flex f-align-center">
              <span class="v-flex">AP</span>
              <span>{{ ldbInfo.apLeft }}</span>
            </p>
            <p class="building-progress">
              <ld-progress
                :current="ldbInfo.apLeft"
                :max="ldbInfo.ap"
                :gradient="progressOpts.capacity.gradient">
              </ld-progress>
            </p>
          </li>
          <!-- <li class="d-flex col-flex">
            <p class="d-flex f-align-center">
              <span class="v-flex">Activeness</span>
              <span>{{ ldbInfo.chain.activeness }}</span>
            </p>
            <p class="building-progress">
              <ld-progress
                :current="ldbInfo.chain.activeness"
                :max="1267"
                :gradient="progressOpts.activeness.gradient">
              </ld-progress>
            </p>
          </li> -->
        </ul>
      </figcaption>
    </figure>
  </div>
</template>

<script>
import LdProgress from '@/components/stories/progress'
import LdImg from '@/components/stories/image'
export default {
  props: {
    sale: {
      type: Boolean,
      default: false
    },
    ldbInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    shadow: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      progressOpts: {
        capacity: {
          gradient: {
            start: '#69D1C3',
            end: '#69D1C3'
          }
        },
        activeness: {
          gradient: {
            start: '#4586FC',
            end: '#4586FC'
          }
        }
      }
    }
  },
  components: {
    LdProgress,
    LdImg
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  @mixin header-bg($outside, $inside, $direction: to bottom) {
    .building-header {
      background-image: -moz-radial-gradient($inside, $outside); /* new syntax */
      background-image: -webkit-radial-gradient($inside, $outside); /* new syntax */
      background-image: radial-gradient($inside, $outside);
    }
  }

  .ld-building-card {
    background-color: #fff;
    border-radius: 5px;
    transition: all .15s ease;
    &.sale {
      .building-sale-tag, .building-sale-bg {
        visibility: visible;
      }
    }
    &.shadow {
      .building-card-bottom {
        box-shadow: 0px 20px 25px -15px rgba(0, 0, 0, 0.25);
      }
    }
    &.popularity-1 {
      @include header-bg(#8BC1FF, #C3DEFC);
    }
    &.popularity-2 {
      @include header-bg(#97DBD9, #E7FDE1);
    }
    &.popularity-3 {
      @include header-bg(#C0C0FF, #F2F1FD);
    }
    &.popularity-4 {
      @include header-bg(#FFC3AE, #FDF1E1);
    }
    &.popularity-5 {
      @include header-bg(#FFDA99, #FFE7C7);
    }
  }

  /**
   *  building-header  --- begin
   */
  .building-header {
    position: relative;
    height: 300px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    >.image-box {
      z-index: 2;
    }
  }
  .building-sale-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url('/static/svg/single/sale-bg.svg');
    background-size: 200%;
    background-position-x: 50%;
    background-position-y: 45%;
    opacity: .3;
    background-repeat: no-repeat;
    visibility: hidden;
  }
  .building-sale-tag {
    position: absolute;
    left: 0;
    top: 15px;
    width: 100%;
    visibility: hidden;
    z-index: 5;
  }
  .building-sale-svg {
    margin-right: 5px;
    display: inline-block;
    width: 44px;
    height: 44px;
  }
  .building-sale-price {
    padding: 4px 12px;
    color: #fff;
    font-size: 16px;
    background-image: linear-gradient(to bottom, #16222A, #3A6073);
    border-radius: 20px;
  }

  .building-curve {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    z-index: 3;
  }

  /**
   *  building-header  --- end
   */

  /**
   *  building-main-cnt --- begin
   */
  .building-main-cnt {
    padding: 0 20px 30px;
    >p {
      margin-top: 5px;
    }
  }
  .building-name {
    font-size: 18px;
    color: #777777;
  }
  .building-tokenId {
    font-size: 14px;
    color: #999;
  }
  .building-coords {
    font-size: 16px;
    color: #4586FC;
  }

  .building-data {
    position: relative;
    margin-top: 25px;
  }
  .building-data-item {
    position: relative;
    >p {
      font-size: 14px;
      color: #999;
      &:first-of-type {
        margin-bottom: 5px;
        font-size: 18px;
        color: #373737;
      }
    }
    // &:not(:first-of-type) {
    //   &::before {
    //     content: '';
    //     position: absolute;
    //     top: 50%;
    //     left: 0;
    //     width: 1px;
    //     height: 50%;
    //     background-color: #AAAAAA;
    //     transform: translate(-50%, -50%);
    //   }
    // }
  }

  /**
   *  building-main-cnt --- end
   */


  /**
   *  building-card-bottom  --- begin
   */
  .building-card-bottom {
    padding: 35px 30px;
    font-size: 14px;
    color: #999;
    background-color: #fff;
    border-top: 1px solid #DDDDDD;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all .15s ease;
    li {
      &:not(:first-of-type) {
        margin-top: 10px;
      }
      >p {
        &:first-of-type {
          margin-bottom: 5px;
        }
      }
    }
  }
  .building-progress {
    width: 100%;
    height: 5px;
    border-radius: 5px;
    overflow: hidden;
  }
  /**
   *  building-card-bottom  --- end
   */

   @media screen and (min-width: 768px) {
    .ld-building-card {
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0px 10px 25px 0 rgba(0, 0, 0, 0.25);
        .building-card-bottom {
          box-shadow: none;
        }
      }
    }
   }
</style>
