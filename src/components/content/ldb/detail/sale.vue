<template>
  <div class="relative alone-layer tavern-deal-status">

    <!-- tavern detail sale skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
    <!-- </transition> -->

    <transition name="ld-hide-fade">
      <sale-skeletion v-if="loading"/>
      <section v-else-if="!loading && (info.chain.auction.isOnAuction || info.chain.auction.isOnPreAuction || isOwner)" class="TTFontBolder tavern-deal-cnt">
        <div class="tavern-deal-container">
          <div class="d-flex tavern-deal-info">
            <p class="text-nowrap d-flex f-align-center deal-price-box">
              <span class="inline-block line-height-0 deal-eth-icon">
                <svg>
                  <use xlink:href="#icon-eth-price"/>
                </svg>
              </span>
              <span>{{ (info.chain.auction.price / 1e18).toLocaleString() }}</span>
            </p>
            <div class="TTFontBold v-flex text-right text-nowrap">
              <p class="deal-tavern-sale-top line-height-1">
                <span class="inline-block tavern-sale-icon" :class="{ 'is-sale': info.chain.auction.isOnAuction, 'is-auction': showSale }">
                  <svg>
                    <use :xlink:href="`#icon-${showSale ? 'auction' : info.chain.auction.isOnAuction ? 'sale' : 'presale'}`"/>
                  </svg>
                </span>
              </p>
              <div v-if="showSale" class="deal-tavern-auction">Last buying price</div>
              <div v-else-if="info.chain.auction.isOnAuction" class="deal-tavern-auction">
                <countdown v-if="new Date(info.chain.auction.endAt) - new Date() >= 0" class="deal-tavern-endtime" :time="new Date(info.chain.auction.endAt) - new Date()" :interval="3000" tag="p">
                <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                  <template slot-scope="props">Expire in {{ props | formatDue(1, 'plural') }}</template>
                </countdown>
                <p v-else class="deal-tavern-endtime color-red">Over Due</p>
              </div>
              <div v-else-if="info.chain.auction.isOnPreAuction" class="deal-tavern-auction">
                <!-- <p class="deal-tavern-endtime">The auction starts in</p> -->
                <countdown @countdownprogress="countdownprogress" class="deal-tavern-endtime" :time="new Date(info.chain.auction.startAt) - new Date()" :interval="1000" tag="div">
                <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                  <template slot-scope="props">
                    <div class="deal-tavern-presale">
                      {{ props.totalHours }} h : {{ props.minutes }} m : {{ props.seconds }} s
                    </div>
                  </template>
                </countdown>
              </div>
            </div>
          </div>
          <div class="tavern-deal-btns">

            <lordless-btn
              v-if="showSale"
              class="ldb-deal-btn"
              theme="red-linear"
              shadow
              :disabled="pendings.isSelling"
              @click="$emit('sale')">{{ pendings.isSelling ? 'Saling' : 'Sale' }}</lordless-btn>

            <lordless-btn
              v-else-if="showBuy"
              class="ldb-deal-btn"
              theme="red-linear"
              shadow
              :disabled="pendings.isBuying || info.chain.auction.isOnPreAuction"
              @click="$emit('buy')">
              <span>{{ info.chain.auction.isOnPreAuction ? 'Stay tuned' : pendings.isBuying ? 'Buying' : 'Be the tavernkeep now!' }}</span>
            </lordless-btn>

            <lordless-btn
              v-if="showCancelSale"
              class="ldb-deal-btn"
              theme="red-linear"
              shadow
              :disabled="pendings.isCanceling"
              @click="$emit('cancel')">{{ pendings.isCanceling ? 'Cancel Saling' : 'Cancel Sale'}}</lordless-btn>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import SaleSkeletion from '@/components/skeletion/ldb/detail/sale'
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

    // contractStatus: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },

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
      // return true
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
      return !this.showSign && info.lord.address === this.user.address
      // return (!this.showSign && info.lord.address === this.userInfo.address) && (ldbNFTOwner || crowdsaleOwner) && init
    }
  },
  components: {
    SaleSkeletion
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
  .tavern-deal-status {
    border-radius: 5px;
    box-shadow: 0 3px 10px 2px rgba(0, 0, 0, .15);
  }
  .tavern-deal-cnt {
    border-radius: 5px;
    overflow: hidden;
  }
  .tavern-deal-container {

  }
  .tavern-deal-info {
    padding: 8px 24px;
    background-color: #fff;
  }
  .deal-price-box {
    font-size: 24px;
    color: $--text-blue-color;
  }
  .deal-eth-icon {
    margin-right: 4px;
    width: 14px;
    height: 18px;
    fill: $--text-blue-color;
    stroke-width: 2px;
    stroke: $--text-blue-color;
  }
  .deal-tavern-sale-top {

  }
  .tavern-sale-icon {
    margin: 2px 0;
    width: 124px;
    height: 20px;
    fill: $--text-blue-color;
    &.is-sale {
      width: 73px;
    }
    &.is-auction {
      width: 124px;
    }
  }

  .deal-tavern-auction {
    // margin-top: 10px;
    font-size: 16px;
    color: #777;
  }

  .ldb-deal-btn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border-radius: 0;
    font-size: 18px;
  }
</style>
