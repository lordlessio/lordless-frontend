<template>
  <div class="bounty-chest-card-box" @click.stop="$router.push(`/bountyChest/${info.bountyId || info._id}`)">
    <div class="d-flex f-align-start chest-card-container">
      <span class="inline-block line-height-0 chest-card-gift" :class="chestGifts[chestStatus]">
        <svg>
          <use :xlink:href="`#icon-bounty-${chestGifts[chestStatus]}`"/>
        </svg>
      </span>
      <div class="relative v-flex chest-card-right" :data-status="chestStatus">
        <div class="chest-right-info-item">
          <p>Bounty Chest</p>
          <p>#{{ info.bountyId || 'wating' }}</p>
        </div>
        <div class="chest-right-info-item">
          <p>Unlocking cost</p>
          <p class="TTFontBolder">{{ weiByDecimals(info.needHopsAmount).toLocaleString() }} HOPS</p>
        </div>
        <ul class="d-flex f-align-center chest-right-bottom">
          <li
            v-for="(candyInfo, index) of info.info" :key="index"
            class="inline-block chest-candy-item">
            <span class="inline-block line-height-0 chest-candy-icon">
              <svg>
                <use :xlink:href="`#coin-${candyInfo.candy.symbol.toLocaleLowerCase()}`"/>
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { weiByDecimals, formatDecimal } from 'utils/tool'
export default {
  name: 'bounty-chest-card',
  props: {
    info: {
      type: Object,
      default: () => { return {} }
    }
  },
  data: () => {
    return {
      chestGifts: {
        wrapping: 'gift-wrapping',
        failed: 'gift-failed',
        opened: 'gift-opened',
        unlocking: 'gift',
        unopened: 'gift'
      }
    }
  },
  computed: {
    chestStatus () {
      let _status = 'wrapping'
      const info = this.info
      if (!info._id) return _status
      switch (true) {
        case info.packageBountyTx[0].status === 0:
          _status = 'wrapping'
          break
        case info.packageBountyTx[0].status !== 1:
          _status = 'failed'
          break
        case info.packageBountyTx[0].status === 1 && info.openBountyTx[0] && info.openBountyTx[0].status === 1:
          _status = 'opened'
          break
        case info.packageBountyTx[0].status === 1 && info.openBountyTx[0] && info.openBountyTx[0].status !== 1:
          _status = 'unlocking'
          break
        case info.packageBountyTx[0].status === 1 && !info.openBountyTx[0]:
          _status = 'unopened'
          break
        default:
          _status = 'wrapping'
          break
      }
      return _status
    },
    bountyGift () {
      let _name = 'gift-wrapping'
      const info = this.info
      if (!info._id) return _name
      switch (true) {
        case info.packageBountyTx[0].status === 0:
          _name = 'gift-wrapping'
          break
        case info.packageBountyTx[0].status !== 1:
          _name = 'gift-failed'
          break
        case info.packageBountyTx[0].status === 1 && info.openBountyTx[0] && info.openBountyTx[0].status === 1:
          _name = 'gift-opened'
          break
        case info.packageBountyTx[0].status === 1 && (!info.openBountyTx[0] || info.openBountyTx[0].status !== 1):
          _name = 'gift'
          break
        default:
          _name = 'gift-wrapping'
          break
      }
      return _name
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    formatDecimal () {
      return formatDecimal(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .bounty-chest-card-box {
    border-radius: 5px;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }
  .chest-card-container {
    padding: 20px;
  }
  .chest-card-gift {
    width: 60px;
    height: 60px;
    background-color: transparent;
    &.gift-wrapping {
      filter: drop-shadow(0px 0px 6px #0079FF);
    }
    &.gift-failed {
      filter: drop-shadow(0, 0, 6px, #F5515F);
    }
    &.gift {
      filter: drop-shadow(0, 0, 6px, #FFCC66);
    }
    &.gift-opened {
      filter: drop-shadow(0, 0, 6px, #7D72F0);
    }
  }
  .chest-card-right {
    margin-left: 24px;
    &::before {
      content: attr(data-status);
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      color: #0079FF;
      text-transform: uppercase;
    }
  }
  .chest-right-info-item {
    >p {
      font-size: 12px;
      color: #777;
      &:nth-of-type(2) {
        font-size: 16px;
        color: #0B2A48;
      }
    }
    &:not(:first-of-type) {
      margin-top: 8px;
    }
  }
  .chest-right-bottom {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
  }
  .chest-candy-item {
    &:not(:first-of-type) {
      margin-left: 8px;
    }
  }
  .chest-candy-icon {
    padding: 6px;
    width: 24px;
    height: 24px;
    fill: #fff;
    background-color: #0079FF;
    box-sizing: border-box;
    border-radius: 100%;
  }
</style>
