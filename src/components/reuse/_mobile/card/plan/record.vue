<template>
  <div class="d-flex f-align-start plan-record-box" :data-type="recordType">
    <span class="inline-block line-height-0 plan-record-icon">
      <svg>
        <use xlink:href="#icon-sprout"/>
      </svg>
    </span>
    <div class="relative v-flex plan-record-info">
      <p class="text-ellipsis record-info-title" data-type="growhops">LESS {{ planLockDays }} day term deposit</p>
      <p class="text-ellipsis record-info-title" data-type="withdraw">Token withdrawal</p>
      <p class="record-info-type" data-type="growhops">Deposit</p>
      <p class="record-info-type" data-type="withdraw">Token payment</p>
      <p>{{ info.records_at | dateFormat('HH:mm MMM DD YYYY') }}</p>
    </div>
    <p class="TTFontBolder text-right text-nowrap plan-record-amount is-blue" data-type="growhops">+ {{ weiByDecimals(info.hopsAmount).toLocaleString() }}</p>
    <p class="TTFontBolder text-right text-nowrap plan-record-amount" data-type="withdraw">- 97,246,594</p>
  </div>
</template>

<script>
import { weiByDecimals } from 'utils/tool'
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
      return info.planBase.lockTime / 3600 / 24
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
  .plan-record-box {
    padding: 20px 15px;
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
    padding: 8px;
    width: 36px;
    height: 36px;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    box-sizing: border-box;
    border-radius: 5px;
  }
  .plan-record-info {
    padding-top: 26px;
    margin-left: 16px;
    // max-width: 160px;
    // max-width: 160px;
    font-size: 14px;
    color: #bbb;
    >p {
      margin-top: 4px;
      &.record-info-title {
        margin-top: 0;
      }
    }
    &:not(:first-of-type) {

    }
  }
  .record-info-type {
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
    &.is-blue {
      color: #0079FF;
    }
  }
</style>
