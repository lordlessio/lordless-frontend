<template>
  <div class="text-center cursor-pointer alone-layer ld-building-card" :class="[{ 'sale': sale || presale, 'shadow': shadow }]">
    <figure @click="$emit('choose', info)">
      <div class="building-card-top">

        <div class="building-header">
          <lordless-tavern-poster
            :src="info.ldbIcon.source.preview"
            :popularity="info.chain.popularity"
            :presale="presale"
            :salePrice="info.chain.auction.price"
            showPopularity
            showSale/>
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
              <p>Hunters</p>
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
            start: '#4586FC',
            end: '#4586FC'
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
    height: 300px;
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
