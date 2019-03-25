<template>
  <div class="text-center cursor-pointer alone-layer ld-building-card" :class="[{ 'sale': sale || presale, 'shadow': shadow }]">
    <figure @click="$emit('choose', info)">
      <div class="building-card-top">

        <div class="building-header">
          <lordless-tavern-poster
            :src="info.ldbIcon.source.preview"
            :popularity="info.chain.popularity"
            :presale="presale"
            showPopularity/>
        </div>
        <!-- <div class="TTFontBolder building-sale-tag">
          <div class="d-inline-flex f-align-center sale-tag-container">
            <span class="inline-block line-height-0 building-price-tag">
              <svg>
                <use xlink:href="#icon-price-tag"></use>
              </svg>
            </span>
            <span class="inline-block line-height-0 building-eth-price">
              <svg>
                <use xlink:href="#icon-eth-price"></use>
              </svg>
            </span>
            <span class="inline-block">
              {{ info.chain.auction.price | weiToEth }}
            </span>
          </div>
        </div> -->
        <div class="building-main-cnt">
          <p class="building-tokenId">#{{ info.chain.tokenId }}</p>
          <h2 class="text-multi-ellipsis building-name">{{ info.name.zh }}</h2>
          <p class="d-flex f-auto-center building-coords">
            <span class="inline-block line-height-0 building-coords-icon">
              <svg>
                <use xlink:href="#icon-location"/>
              </svg>
              <!-- <i class="el-icon-location"></i> -->
            </span>
            <span>&nbsp;{{ info.chain.lng | transferCoords | sliceStr }}, {{ info.chain.lat | transferCoords | sliceStr }}</span>
          </p>
          <div class="building-lord-box">
            <div v-if="info.lord"
              class="d-flex f-auto-center building-lord-info">
              <lordless-blockies
                theme="dark"
                :scale="4"
                :size="6"
                :seed="info.lord._id || info.lord"
                jump/>
              <span class="building-lord-address">{{ info.lord._id || info.lord | splitAddress({ before: 6, end: 2, symbol: '**' }) }}</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption class="relative building-card-bottom">
        <div class="building-bottom-progress">
          <lordless-progress
            class="building-bottom-progress"
            :current="info.apLeft"
            :max="info.ap"
            :gradient="progressOpts.capacity.gradient"/>
        </div>

        <ul class="d-flex f-align-center building-data">
          <li class="v-flex building-data-item">
            <p>{{ (info.ap || 0).toLocaleString() }}</p>
            <p>Max AP</p>
          </li>
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
            <p>Hunters</p>
          </li>
        </ul>
        <!-- <ul class="text-left">
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
        </ul> -->
      </figcaption>
    </figure>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'
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
            direction: '45deg',
            start: '#124BDC',
            end: '#0079FF'
          }
        }
      }
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
  .ld-building-card {
    background-color: #fff;
    border-radius: 5px;
    transition: all .15s ease;
    // &.sale {
    //   .building-sale-tag {
    //     visibility: visible;
    //   }
    // }
    &.shadow {
      // .building-card-bottom {
      //   box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
      // }
      box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.15)
    }
  }

  /**
   *  building-header  --- begin
   */
  .building-header {
    height: 260px;
  }

  /**
   *  building-header  --- end
   */

  /**
   *  building-lord-box  --- begin
   */
  .building-lord-box {
    margin-top: 8px;
    height: 24px;
    line-height: 24px;
  }
  .building-lord-info {

  }
  .building-lord-address {
    margin-left: 6px;
    font-size: 16px;
    color: #555;
  }
  /**
   *  building-lord-box  --- end
   */

  // .building-sale-tag {
  //   position: relative;
  //   z-index: 9;
  // }
  // .sale-tag-container {
  //   padding: 0 18px;
  //   background-image: linear-gradient(-45deg, #796FEE 0%, #534BD6 100%);
  //   border-radius: 18px;
  //   height: 36px;
  //   line-height: 36px;
  //   font-size: 20px;
  //   color: #fff;
  //   fill: #fff;
  // }
  // .building-price-tag {
  //   width: 16px;
  //   height: 16px;
  // }
  // .building-eth-price {
  //   margin-left: 8px;
  //   margin-right: 6px;
  //   width: 10px;
  //   height: 14px;
  //   stroke-width: 2;
  //   stroke: #fff;
  // }

  /**
   *  building-main-cnt --- begin
   */
  .building-main-cnt {
    // margin-top: 25px;
    padding: 0 20px 30px;
    >p {
      margin-top: 5px;
    }
  }
  .building-name {
    height: 50px;
    font-size: 18px;
    color: #0B2A48;
    -webkit-line-clamp: 2;
  }
  .building-tokenId {
    margin-top: 0px;
    font-size: 18px;
    color: #999;
  }
  .building-coords {
    font-size: 16px;
    color: #999;
  }
  .building-coords-icon {
    fill: #999;
    width: 12px;
    height: 12px;
  }

  .building-data {
    position: relative;
    // margin: 25px auto 0;
    max-width: 230px;
  }
  .building-data-item {
    position: relative;
    >p {
      font-size: 12px;
      color: #999;
      &:first-of-type {
        margin-bottom: 4px;
        font-size: 16px;
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
    padding: 24px 22px 30px;
    font-size: 14px;
    color: #999;
    background-color: #fff;
    border-top: 1px solid #DDDDDD;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    transition: all .15s ease;
    overflow: hidden;
    li {
      // &:not(:first-of-type) {
      //   margin-top: 10px;
      // }
      >p {
        &:first-of-type {
          margin-bottom: 4px;
        }
      }
    }
  }
  // .building-progress {
  //   width: 100%;
  //   height: 5px;
  //   border-radius: 5px;
  //   overflow: hidden;
  // }
  .building-bottom-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6px;
  }
  /**
   *  building-card-bottom  --- end
   */

   @media screen and (min-width: 768px) {
    .ld-building-card {
      &:hover {
        transform: translateY(-2px);
        // box-shadow: 0px 10px 25px 0 rgba(0, 0, 0, 0.25);
        box-shadow: 0px 2px 20px 3px rgba(0, 0, 0, 0.15);
        .building-card-bottom {
          box-shadow: none;
        }
      }
    }
   }
</style>
