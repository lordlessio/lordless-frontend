<template>
  <div class="m-building-card" :class="{ 'shadow': shadow }">
    <figure class="d-flex f-align-stretch" @click="$emit('choose', info)">
      <div class="building-header-container">
        <lordless-tavern-poster
          :src="info.ldbIcon.source.preview"
          :popularity="info.chain.popularity"
          isMobile
          shadow
          showPopularity/>
      </div>
      <div class="v-flex d-flex col-flex m-building-info">
        <figcaption>
          <p class="m-building-sale" :class="{ 'presale': presale }">
            <svg>
              <use :xlink:href="`#icon-${presale ? 'presale' : 'sale'}`"/>
            </svg>
          </p>
          <p class="m-building-name">{{ info.name.zh }}</p>
        </figcaption>

        <div class="building-info-bottom">
          <div class="d-flex">
            <p class="v-flex">Level <span>{{ info.chain.level || 0 }}</span></p>
            <p class="v-flex">Hunters <span>{{ info.members || 0 }}</span></p>
          </div>
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
          <h3 class="text-upper">{{ info.chain.auction.price | weiToEth }} ETH</h3>
        </div>
      </div>
    </figure>
  </div>
</template>

<script>
import { originSource } from 'utils/tool'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    shadow: {
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
    originSource () {
      return originSource(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .m-building-card {
    padding: 20px;
    border-radius: 5px;
    background-color: #fff;
    &.shadow {
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .1);
    }
  }
  .building-header-container {
    width: 120px;
    height: 120px;
  }
  .m-building-sale {
    width: 42px;
    height: 19px;
    >svg {
      width: 100%;
      height: 100%;
    }
    &.presale {
      width: 62px;
    }
  }

  .m-building-info {
    margin-left: 20px;
    font-size: 16px;
    svg {
      fill: $--text-blue-color;
    }
  }
  .building-info-bottom {
    p {
      color: #999;
    }
    span {
      color: #777;
    }
    h3 {
      margin-top: 3px;
      color: $--text-blue-color;
    }
  }
  .m-building-name {
    color: #555;
    font-weight: 500;
  }
  .building-apleft-bar {
    margin-top: 10px;
    margin-bottom: 14px;
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
