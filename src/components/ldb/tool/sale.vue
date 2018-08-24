<template>
  <div class="relative ldb-deal-status">

    <!-- ldb detail sale skeletion -->
    <transition name="ld-suspension-hide-fade">
      <sale-skeletion v-if="loading"></sale-skeletion>
    </transition>

    <transition name="ld-hide-fade">
      <section v-if="!loading && (info.chain.auction.isOnAuction || info.chain.auction.isOnPreAuction || isOwner)" class="ldb-deal-cnt">
        <figure>
          <h2 class="TTFontBold deal-ldb-tokenId">#{{ info.chain.tokenId }}</h2>
          <p class="deal-ldb-name">{{ info.name.zh }}</p>
          <span v-if="info.chain.auction.isOnPreAuction" class="deal-presale-svg">
            <svg>
              <use xlink:href="#icon-presale"/>
            </svg>
          </span>
          <div v-if="info.chain.auction.isOnAuction" class="deal-ldb-auction">
            <countdown v-if="new Date(info.chain.auction.endAt) - new Date() >= 0" class="deal-ldb-endtime" :time="new Date(info.chain.auction.endAt) - new Date()" :interval="3000" tag="p">
            <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
              <template slot-scope="props">Expire in {{ props | formatDue(1, 'plural') }}</template>
            </countdown>
            <p v-else class="deal-ldb-endtime color-red">Over Due</p>
          </div>
          <div v-if="info.chain.auction.isOnPreAuction" class="deal-ldb-auction">
            <p class="deal-ldb-endtime">The auction starts in</p>
            <countdown @countdownprogress="countdownprogress" class="deal-ldb-endtime" :time="new Date(info.chain.auction.startAt) - new Date()" :interval="1000" tag="div">
            <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
              <template slot-scope="props">
                <div class="d-flex f-align-center deal-ldb-presale">
                  <div>
                    <p class="presale-time-num">{{ props.totalHours }}</p>
                    <p>hours</p>
                  </div>
                  <div>
                    <p class="presale-time-num">{{ props.minutes }}</p>
                    <p>minitues</p>
                  </div>
                  <div>
                    <p class="presale-time-num">{{ props.seconds }}</p>
                    <p>seconds</p>
                  </div>
                </div>
              </template>
            </countdown>
          </div>
          <figcaption>
            <h2>{{ info.chain.auction.price | weiToEth }} ETH</h2>
          </figcaption>
        </figure>
        <div class="text-center ldb-deal-btns">
          <ld-btn
            v-if="showSale"
            class="ldb-deal-btn"
            theme="blue"
            shadow
            inverse
            :disabled="pendings.isSelling"
            @click="$emit('sale')">{{ pendings.isSelling ? 'Saling' : 'Sale' }}</ld-btn>

          <ld-btn
            v-if="showCancelSale"
            class="ldb-deal-btn"
            theme="blue"
            shadow
            inverse
            :disabled="pendings.isCanceling"
            @click="$emit('cancel')">{{ pendings.isCanceling ? 'Cancel Saling' : 'Cancel Sale'}}</ld-btn>

          <ld-btn
            v-if="showBuy"
            class="ldb-deal-btn"
            theme="blue"
            shadow
            inverse
            :disabled="pendings.isBuying || info.chain.auction.isOnPreAuction"
            @click="$emit('buy')">
            <span v-if="info.chain.auction.isOnPreAuction">Buy</span>
            <span v-else-if="showSign">Sign to Buy</span>
            <span v-else>{{ pendings.isBuying ? 'Buying' : 'Buy now' }}</span>
          </ld-btn>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import SaleSkeletion from '@/components/skeletion/ldb/detail/tool/sale'

import LdBtn from '@/components/stories/button'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },

    pendings: {
      type: Object,
      default: () => {
        return {}
      }
    },

    contractStatus: {
      type: Object,
      default: () => {
        return {}
      }
    },

    user: {
      type: Object,
      default: () => {
        return {}
      }
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
      return info.chain.auction.isOnAuction || info.chain.auction.isOnPreAuction
    },

    showSign () {
      return !this.user.address
    },

    isOwner () {
      // contract mixin 合约检查状态
      const { init, ldbNFTOwner, crowdsaleOwner } = this.contractStatus
      const info = this.info
      return (!this.showSign && info.lord.address === this.user.address) && (ldbNFTOwner || crowdsaleOwner) && init
      // return (!this.showSign && info.lord.address === this.userInfo.address) && (ldbNFTOwner || crowdsaleOwner)
    }
  },
  components: {
    SaleSkeletion,

    LdBtn
  },
  methods: {
    countdownprogress (data) {
      if (data.totalSeconds <= 0) {
        this.$set(this.info.chain.auction, 'isOnAuction', true)
        this.$set(this.info.chain.auction, 'isOnPreAuction', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-deal-status
  .ldb-deal-status {
    // padding-bottom: 65px;
    color: #999;
  }
  .ldb-deal-cnt {
    h2 {
      color: #555;
    }
    .deal-ldb-tokenId {
      color: #777;
      font-weight: normal;
    }
    >figure {
      position: relative;
      padding: 20px 25px;
      // background-image: linear-gradient(45deg, #16222A, #3A6073);
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    }
    figcaption {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #bbb;
    }
  }
  .deal-presale-svg {
    display: inline-block;
    position: absolute;
    right: 25px;
    top: 25px;
    width: 100px;
    height: 15px;
    fill: $--text-blue-color;
  }
  .deal-ldb-name {
    font-size: 20px;
  }
  .deal-ldb-auction {
    margin-top: 10px;
  }
  .deal-ldb-presale {
    margin-top: 15px;
    >div {
      text-align: center;
      width: 80px;
      margin-right: 30px;
      &:not(:last-of-type) {
        position: relative;
        &:after {
          content: ':';
          position: absolute;
          right: -15px;
          top: 0;
          font-size: 20px;
          font-family: $--font-TTNormsBold;
          color: #555;
        }
      }
       >p {
        font-size: 16px;
        color: #bbb;
      }
    }
    .presale-time-num {
      font-family: $--font-TTNormsBold;
      font-size: 22px;
      color: #555;
    }
  }
  .deal-ldb-endtime {
    font-size: 18px;
  }
  .ldb-deal-btns {
    margin-top: 35px;
    padding: 0 25px;
  }
  .ldb-deal-btn {
    width: 100%;
    padding: 13px 0;
    font-size: 20px;
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
</style>
