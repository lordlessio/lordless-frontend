<template>
  <div class="ldb-deal-status">
    <div v-if="loading" class="ldb-deal-skeletion">
      <div class="deal-box-skeletion">
        <div class="skeletion-breath">
          <h2></h2>
          <p></p>
          <p></p>
          <h2></h2>
        </div>
      </div>
      <div class="skeletion-breath deal-btn-skeletion">
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-fade">
      <section v-if="!loading && (info.chain.auction.isOnAuction || isOwner)" class="ldb-deal-cnt">
        <figure>
          <h2>#{{ info.chain.tokenId }}</h2>
          <p class="deal-ldb-name">{{ info.name.zh }}</p>
          <countdown v-if="new Date(info.chain.auction.endAt) - new Date() >= 0" class="deal-ldb-endtime" :time="new Date(info.chain.auction.endAt) - new Date()" :interval="3000" tag="p">
            <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
            <template slot-scope="props">Expire in {{ props | formatDue(1, 'plural') }}</template>
          </countdown>
          <p v-else class="deal-ldb-endtime color-red">Over Due</p>
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
            :disabled="pendings.isBuying"
            @click="$emit('buy')">
            <span v-if="showSign">Sign to Buy</span>
            <span v-else>{{ pendings.isBuying ? 'Buying' : 'Buy now' }}</span>
          </ld-btn>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
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
      return !this.showSign && this.isOwner && !info.chain.auction.isOnAuction
    },

    showCancelSale () {
      // const { init, isSell } = this.contractStatus
      const info = this.info
      return !this.showSign && this.isOwner && info.chain.auction.isOnAuction
    },

    showBuy () {
      // const { init, isSell } = this.contractStatus
      const info = this.info
      return info.chain.auction.isOnAuction
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
    LdBtn
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';

  // ldb-deal-skeletion
  .ldb-deal-skeletion {

  }
  .deal-box-skeletion {
    padding: 20px 25px;
    border-radius: 5px;
    background-color: $--skeletion-light;
    h2 {
      width: 80px;
      height: 50px;
      background-color: $--skeletion-dark;
      &:last-of-type {
        width: 100px;
        margin-top: 20px;
      }
    }
    p {
      margin-top: 10px;
      width: 120px;
      height: 30px;
      background-color: $--skeletion-dark;
      &:last-of-type {
        margin-top: 20px;
        width: 180px;
      }
    }
  }
  .deal-btn-skeletion {
    margin-top: 35px;
    padding: 0 25px;
    >p {
      height: 50px;
      border-radius: 5px;
      background-color: $--skeletion-light;
    }
  }


  // ldb-deal-status
  .ldb-deal-status {
    // padding-bottom: 65px;
    color: #fff;
  }
  .ldb-deal-cnt {
    >figure {
      padding: 20px 25px;
      background-image: linear-gradient(45deg, #16222A, #3A6073);
      border-radius: 5px;
    }
    figcaption {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #fff;
    }
  }
  .deal-ldb-name {
    font-size: 20px;
  }
  .deal-ldb-endtime {
    margin-top: 10px;
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
