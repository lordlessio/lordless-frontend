<template>
  <div v-if="showBar" class="mobile-sale-bar">
    <div class="d-flex f-align-center sale-bar-container">
      <span class="v-flex text-upper sale-bar-price">{{ info.chain.auction.price | weiToEth }} ETH</span>
      <div class="text-nowrap sale-bar-time">
        <div v-if="info.chain.auction.isOnPreAuction">
          <p class="text-right line-height-1 deal-sale-svg presale">
            <svg>
              <use xlink:href="#icon-presale"/>
            </svg>
          </p>
          <countdown @countdownprogress="countdownprogress" class="deal-ldb-endtime presale" :time="new Date(info.chain.auction.startAt) - new Date()" :interval="1000" tag="div">
            <template slot-scope="props">
              <div class="d-flex f-align-center deal-ldb-presale">
                <div>
                  <p class="presale-time-num">{{ props.totalHours }}</p>
                  <p>h</p>
                </div>
                <div>
                  <p class="presale-time-num">{{ props.minutes }}</p>
                  <p>m</p>
                </div>
                <div>
                  <p class="presale-time-num">{{ props.seconds }}</p>
                  <p>s</p>
                </div>
              </div>
            </template>
          </countdown>
        </div>
        <div v-if="info.chain.auction.isOnAuction">
          <p class="text-right line-height-1 deal-sale-svg">
            <svg>
              <use xlink:href="#icon-sale"/>
            </svg>
          </p>
          <countdown v-if="new Date(info.chain.auction.endAt) - new Date() >= 0" class="deal-ldb-endtime" :time="new Date(info.chain.auction.endAt) - new Date()" :interval="3000" tag="p">
            <template slot-scope="props">Expire in {{ props | formatDue(1, 'plural') }}</template>
          </countdown>
          <p v-else class="deal-ldb-endtime color-red">Over Due</p>
        </div>
      </div>
      <div class="text-center tavern-deal-btns">
        <lordless-btn
          v-if="showSale"
          class="tavern-deal-btn"
          theme="blue"
          inverse
          :disabled="pendings.isSelling"
          @click="$emit('sale')">{{ pendings.isSelling ? 'Saling' : 'Sale' }}</lordless-btn>

        <lordless-btn
          v-if="showCancelSale"
          class="tavern-deal-btn"
          theme="blue"
          inverse
          :disabled="pendings.isCanceling"
          @click="$emit('cancel')">{{ pendings.isCanceling ? 'Cancel Saling' : 'Cancel Sale'}}</lordless-btn>

        <lordless-btn
          v-if="showBuy"
          class="tavern-deal-btn"
          theme="blue"
          inverse
          :disabled="pendings.isBuying || info.chain.auction.isOnPreAuction"
          @click="$emit('buy')">
          <span v-if="info.chain.auction.isOnPreAuction">Buy</span>
          <span v-else-if="showSign">Sign to Buy</span>
          <span v-else>{{ pendings.isBuying ? 'Buying' : 'Buy now' }}</span>
        </lordless-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    pendings: {
      type: Object,
      default: () => {}
    },

    user: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {

    showSale () {
      // const { init, isSell } = this.contractStatus
      const info = this.info
      return !this.showSign && this.isOwner && !info.chain.auction.isOnAuction && !info.chain.auction.isOnPreAuction
    },

    showCancelSale () {
      // const { init, isSell } = this.contractStatus
      const info = this.info
      return !this.showSign && this.isOwner && info.chain.auction.isOnAuction
    },

    showBuy () {
      // const { init, isSell } = this.contractStatus
      const info = this.info
      return !this.isOwner && (info.chain.auction.isOnAuction || info.chain.auction.isOnPreAuction)
    },

    showSign () {
      return !this.user.address
    },

    isOwner () {
      // contract mixin 合约检查状态
      // const { init, ldbNFTOwner, crowdsaleOwner } = this.contractStatus
      const info = this.info
      return !this.showSign && info.lord && info.lord.address === this.user.address
      // return (!this.showSign && info.lord.address === this.userInfo.address) && (ldbNFTOwner || crowdsaleOwner) && init
    },
    showBar () {
      const info = this.info
      return this.isOwner || info.chain.auction.isOnAuction
    }
  },
  methods: {
    countdownprogress (data) {
      if (data.totalSeconds <= 0) {
        this.$set(this.info.chain.auction, 'isOnAuction', true)
        this.$set(this.info.chain.auction, 'isOnPreAuction', false)
      }
    },
    init () {
      document.body.appendChild(this.$el)
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  },
  beforeDestroy () {
    this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-sale-bar {
    position: fixed;
    // position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-top: 1px solid #ddd;
    overflow: hidden;
    z-index: 2199;
  }
  .sale-bar-price {
    // padding: 0 20px;
    padding-left: 20px;
    font-family: $--font-TTNormsBold;
    font-size: 20px;
    color: $--text-blue-color;
  }
  // .sale-bar-time {
  //   font-size: 14px;
  // }
  .deal-ldb-endtime {
    font-size: 14px;
    color: $--text-third-color;
    &.presale {
      color: $--text-main-color;
    }
  }
  .tavern-deal-btns {
    margin-left: 15px;
    >button {
      padding: 15px 18px;
      height: 100%;
      border-radius: 0;
    }
  }
  .tavern-deal-btn {
    margin: 0;
    &:disabled {
      background-color: #aaa !important;
    }
  }
  .deal-sale-svg {
    >svg {
      width: 58px;
      height: 16px;
      fill: #EB8785;
    }
    &.presale {
      width: 103px;
      height: 16px;
    }
  }
</style>
