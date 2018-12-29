<template>
  <div class="relative alone-layer tavern-further-status">

    <!-- tavern detail sale skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
    <!-- </transition> -->

    <transition name="ld-hide-fade">
      <sale-skeletion v-if="loading"/>
      <section v-else class="TTFontBolder tavern-further-cnt">
        <div class="TTFontBolder d-flex f-auto-center tavern-further-info">
          <p class="full-width d-flex f-align-center">
            <span>#{{ info.id }}</span>
            <span class="v-flex inline-block text-right tavern-name">{{ info.name.zh }}</span>
          </p>
        </div>
        <lordless-btn
          class="tavern-further-btn"
          theme="red-linear"
          shadow>
            <a class="d-inline-flex f-align-center" :href="`https://opensea.io/assets/0x15820072729d045ec5232ba3bd060ec5df38e09a/${info.id}`" target="_blank">
              <span>Trading on OpenSea</span>
            </a>
        </lordless-btn>
      </section>
    </transition>
  </div>
</template>

<script>
import SaleSkeletion from '@/components/skeletion/ldb/detail/sale'
export default {
  name: 'tavern-detail-further',
  props: {
    info: {
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

    showContent () {
      const { info, loading, isOwner } = this
      return !loading && (info.chain.auction.isOnAuction || info.chain.auction.isOnPreAuction || isOwner)
    },

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
      return !this.showSign && info.lord && info.lord.address === this.user.address
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
  .tavern-further-status {
    border-radius: 5px;
    box-shadow: 0 3px 10px 2px rgba(0, 0, 0, .15);
  }
  .tavern-further-cnt {
    border-radius: 5px;
    overflow: hidden;
  }
  .tavern-deal-container {

  }
  .tavern-further-info {
    padding: 0 24px;
    height: 64px;
    background-color: #fff;
    font-size: 18px;
    font-weight: bold;
    color: #0079FF;
  }
  .tavern-name {
    padding-left: 25px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .tavern-further-btn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .trading-opensea-icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    fill: #fff;
  }
</style>
