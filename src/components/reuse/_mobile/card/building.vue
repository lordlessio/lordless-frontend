<template>
  <div class="m-building-card" :class="{ 'shadow': shadow }">
    <figure class="d-flex col-flex f-align-stretch" @click="chooseTavern">
      <div class="building-header-container">
        <lordless-tavern-poster
          :src="info.ldbIcon.source.preview"
          :popularity="info.chain.popularity"
          isMedium
          showPopularity/>
      </div>
      <div class="v-flex d-flex col-flex m-building-info">
        <figcaption class="text-center">
          <!-- <p class="m-building-sale" :class="{ 'presale': presale }">
            <svg>
              <use :xlink:href="`#icon-${presale ? 'presale' : 'sale'}`"/>
            </svg>
          </p> -->
          <p class="m-building-name">{{ info.name.zh }}</p>
          <div class="m-building-sale-box">
            <div v-if="!info.chain.auction.isOnAuction && !info.chain.auction.isOnPreAuction"
                class="d-flex f-auto-center building-owner-info">
              <lordless-blockies
                theme="light"
                :scale="3"
                :seed="info.lord._id || info.lord "/>
              <span class="building-owner-address">{{ info.lord._id || info.lord | splitAddress({ before: 3, end: 4 }) }}</span>
            </div>
            <p v-else class="TTFontBolder d-flex f-auto-center m-building-price">
              <span class="inline-block line-height-0 building-price-icon">
                <svg>
                  <use xlink:href="#icon-eth-price"/>
                </svg>
              </span>
              {{ info.chain.auction.price | weiToEth }}
            </p>
          </div>

        </figcaption>

        <div class="building-info-bottom">
          <p class="building-info-markline"></p>
          <!-- <div class="d-flex">
            <p class="v-flex">Level <span>{{ info.chain.level || 0 }}</span></p>
            <p class="v-flex">Hunters <span>{{ info.members || 0 }}</span></p>
          </div> -->
          <div class="building-apleft-bar">
            <p class="d-flex f-justify-between">
              <span>AP</span>
              <span>{{ info.apLeft }}</span>
            </p>
            <div class="apleft-progress-bar">
              <lordless-progress
                :current="info.apLeft"
                :max="info.ap"
                :underColor="apProgress.underColor"
                :gradient="apProgress.gradient"/>
            </div>
          </div>
          <!-- <h3 class="text-upper">{{ info.chain.auction.price | weiToEth }} ETH</h3> -->
        </div>
      </div>
    </figure>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'

// import { mutationTypes } from '@/store/types'
// import { mapMutations } from 'vuex'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    shadow: {
      type: Boolean,
      default: true
    },
    jump: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      apProgress: {
        underColor: '#ddd',
        gradient: {
          direction: 'to right',
          start: '#4586FC',
          end: '#4586FC'
        }
      }
    }
  },
  computed: {
    sale () {
      if (!this.info.chain) return false
      return this.info.chain.auction.isOnAuction
    },
    presale () {
      if (!this.info.chain) return false
      return this.info.chain.auction.isOnPreAuction
    }
  },
  methods: {
    // ...mapMutations('layout', [
    //   mutationTypes.LAYOUT_SET_POP_DIRECTION
    // ]),
    chooseTavern (e, info = this.info) {
      if (!this.jump) {
        this.$emit('choose', info)
        return
      }
      // this[mutationTypes.LAYOUT_SET_POP_DIRECTION]('_forward')
      sessionStorage.setItem('lordless_direction', '_forward')
      this.$router.push(`/tavern/${info.id}`)
    },
    originSource () {
      return originSource(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-building-card {
    // padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    &.shadow {
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .1);
    }
  }
  .building-header-container {
    position: relative;
    padding-top: 160px;
    width: 160px;
    >div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  // .m-building-sale {
  //   width: 42px;
  //   height: 19px;
  //   >svg {
  //     width: 100%;
  //     height: 100%;
  //   }
  //   &.presale {
  //     width: 62px;
  //   }
  // }

  .m-building-info {
    // margin-left: 20px;
    font-size: 12px;
    color: #777;
    // svg {
    //   fill: $--text-blue-color;
    // }
  }
  .m-building-sale-box {
    margin-top: 4px;
    height: 24px;
  }
  .building-owner-address {
    margin-left: 3px;
  }
  .m-building-price {
    font-size: 16px;
    color: #0079FF;
  }
  .m-building-name {
    font-weight: 500;
  }
  .building-price-icon {
    margin-right: 2px;
    width: 10px;
    height: 14px;
    fill: #0079FF;
  }
  .building-info-bottom {
    margin-top: 12px;
    padding: 0 20px 20px;
    // p {
    //   color: #999;
    // }
    // span {
    //   color: #777;
    // }
    // h3 {
    //   margin-top: 3px;
    //   color: $--text-blue-color;
    // }
  }
  .building-info-markline {
    width: 100%;
    height: 0;
    border-top: 1px solid #ddd;
  }
  .building-apleft-bar {
    margin-top: 10px;
    font-size: 14px;
    span {
      color: #999;
    }
  }
  .apleft-progress-bar {
    height: 6px;
    border-radius: 5px;
    overflow: hidden;
  }
</style>
