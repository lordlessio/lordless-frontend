<template>
  <div class="text-center cursor-pointer alone-layer ld-building-card" :class="[{ 'sale': sale || presale, 'shadow': shadow }]">
    <figure @click="$emit('choose', info)">
      <div class="building-card-top">
        <div class="building-header" :class="`building-popularity-${info.chain.popularity}`">
          <div class="building-level">
            <img alt="tavern popularity image" :src="`/img/ldb-level-${info.chain.popularity}.png` | originSource({ size: 120 })"/>
          </div>
          <img alt="tavern curve" class="building-curve" src="~/static/svg/single/curve.svg">
          <lordless-img
            alt="tavern preview"
            :src="info.ldbIcon.source.preview | reldbIcon"/>
          <span class="building-sale-bg"></span>
          <p class="d-flex col-flex f-auto-center building-sale-tag">
            <span class="building-sale-svg">
              <svg>
                <use :xlink:href="`#icon-${presale ? 'presale' : 'sale'}`"/>
              </svg>
            </span>
            <span class="building-sale-price">{{ info.chain.auction.price | weiToEth }} ETH</span>
          </p>
        </div>
        <div class="building-main-cnt">
          <h2 class="building-name">{{ info.name.zh }}</h2>
          <p class="building-tokenId">#{{ info.chain.tokenId }}</p>
          <p class="d-flex f-auto-center building-coords">
            <span class="inline-block building-coords-icon">
              <svg>
                <use xlink:href="#icon-location"/>
              </svg>
              <!-- <i class="el-icon-location"></i> -->
            </span>
            <span>&nbsp;{{ info.chain.lng | transferCoords | sliceStr }}, {{ info.chain.lat | transferCoords | sliceStr }}</span>
          </p>
          <ul class="d-flex f-align-center building-data">
            <li class="v-flex building-data-item">
              <p>{{ info.chain.level || 0 }}</p>
              <p>Level</p>
            </li>
            <!-- <li class="v-flex building-data-item">
              <p>{{ info.chain.popularity || 0 }}</p>
              <p>Popularity</p>
            </li> -->
            <li class="v-flex building-data-item">
              <p>{{ info.members }}</p>
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
              <span>{{ info.apLeft }}</span>
            </p>
            <p class="building-progress">
              <lordless-progress
                :current="info.apLeft"
                :max="info.ap"
                :gradient="progressOpts.capacity.gradient">
              </lordless-progress>
            </p>
          </li>
          <!-- <li class="d-flex col-flex">
            <p class="d-flex f-align-center">
              <span class="v-flex">Activeness</span>
              <span>{{ info.chain.activeness }}</span>
            </p>
            <p class="building-progress">
              <lordless-progress
                :current="info.chain.activeness"
                :max="1267"
                :gradient="progressOpts.activeness.gradient">
              </lordless-progress>
            </p>
          </li> -->
        </ul>
      </figcaption>
    </figure>
  </div>
</template>

<script>
export default {
  props: {
    sale: {
      type: Boolean,
      default: false
    },
    presale: {
      type: Boolean,
      default: false
    },
    info: {
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
            start: '#4586FC',
            end: '#4586FC'
          }
        }
        // activeness: {
        //   gradient: {
        //     start: '#4586FC',
        //     end: '#4586FC'
        //   }
        // }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ld-building-card {
    background-color: #fff;
    border-radius: 5px;
    transition: all .15s ease;
    &.sale {
      .building-sale-tag {
        visibility: visible;
      }
    }
    &.shadow {
      .building-card-bottom {
        box-shadow: 0px 20px 25px -15px rgba(0, 0, 0, 0.25);
      }
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
  .building-level {
    position: absolute;
    top: -15px;
    right: -15px;
    width: 80px;
    height: 80px;
    z-index: 3;
    >img {
      width: 100%;
    }
  }
  .building-sale-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url('~static/svg/single/sale-bg.svg');
    background-size: 200%;
    background-position-x: 50%;
    background-position-y: 45%;
    opacity: .3;
    background-repeat: no-repeat;
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
    height: 15px;
    fill: $--text-blue-color;
  }
  .building-sale-price {
    margin-top: 10px;
    padding: 4px 12px;
    color: #fff;
    font-size: 16px;
    background-image: linear-gradient(to right, #3588FD, #00C0EB);
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
    color: #555;
  }
  .building-tokenId {
    font-size: 14px;
    color: #999;
  }
  .building-coords {
    font-size: 16px;
    color: #bbb;
  }
  .building-coords-icon {
    fill: #bbb;
    width: 16px;
    height: 16px;
  }

  .building-data {
    position: relative;
    margin: 25px auto 0;
    max-width: 230px;
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
