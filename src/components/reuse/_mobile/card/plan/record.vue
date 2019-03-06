<template>
  <div class="d-flex f-align-start plan-record-box" :data-type="recordType">
    <span class="inline-block line-height-0 plan-record-icon" data-type="growhops">
      <svg>
        <use xlink:href="#icon-sprout"/>
      </svg>
    </span>
    <span class="inline-block line-height-0 plan-record-icon" data-type="withdraw">
      <svg>
        <use xlink:href="#icon-outcome"/>
      </svg>
    </span>
    <div class="v-flex d-flex f-align-start plan-record-info">
      <div class="relative v-flex record-main-info">
        <p class="text-ellipsis record-info-title" data-type="growhops">LESS {{ planLockDays }} day term deposit</p>
        <p class="text-ellipsis record-info-title" data-type="withdraw">Token withdrawal</p>
        <p class="record-info-type" data-type="growhops">Deposit</p>
        <p class="record-info-type" data-type="withdraw">Token payment</p>
        <p class="record-info-time">{{ info.recordsAt * 1000 | dateFormat('HH:mm MMM DD YYYY') }}</p>
      </div>
      <div class="plan-record-amount">
        <p class="TTFontBolder text-right text-nowrap is-blue" data-type="growhops">+ {{ formatMoneyNumber(weiByDecimals(info.hopsAmount)) }}</p>
        <p class="TTFontBolder text-right text-nowrap is-black" data-type="withdraw">- {{ formatMoneyNumber(weiByDecimals(info.needHopsAmount)) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { weiByDecimals, formatMoneyNumber } from 'utils/tool'
export default {
  name: 'plan-record-card',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    recordType: {
      type: String,
      default: 'growhops'
    }
  },
  computed: {
    planLockDays () {
      const info = this.info
      if (!info._id) return {}
      return info.planBase ? info.planBase.lockTime / 3600 / 24 : 0
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },
    formatMoneyNumber () {
      return formatMoneyNumber(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .plan-record-box {
    padding-bottom: 20px;
    padding-left: 15px;
    background-color: #fff;
    &[data-type="growhops"] {
      [data-type="withdraw"] {
        display: none;
      }
    }
    &[data-type="withdraw"] {
      [data-type="growhops"] {
        display: none;
      }
    }
  }
  .plan-record-icon {
    margin-top: 20px;
    padding: 8px;
    width: 36px;
    height: 36px;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    box-sizing: border-box;
    border-radius: 5px;
  }
  .plan-record-info {
    margin-left: 16px;
    padding-top: 20px;
    padding-right: 18px;
    font-size: 14px;
    color: #bbb;
  }
  .record-main-info {
    padding-top: 26px;
  }
  .record-info-time {
    margin-top: 4px;
  }
  .record-info-type {
    margin-top: 4px;
    color: #999;
  }
  .record-info-title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    color: #555;
  }
  .plan-record-amount {
    margin-left: 16px;
    min-width: 50px;
    font-size: 16px;
    .is-blue {
      color: #0079FF;
    }
    .is-black {
      color: #0B2A48;
    }
  }
</style>
