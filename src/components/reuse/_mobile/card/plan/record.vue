<template>
  <div class="d-flex f-align-start plan-record-box">
    <span class="inline-block line-height-0 plan-record-icon">
      <svg>
        <use :xlink:href="recordInfo.icon"/>
      </svg>
    </span>
    <div class="v-flex d-flex f-align-start plan-record-info">
      <div class="relative v-flex record-main-info">
        <p class="text-ellipsis record-info-title">{{ recordInfo.title }}</p>
        <p class="record-info-time">{{ recordInfo.date | dateFormat('HH:mm MMM DD YYYY') }}</p>
      </div>
      <div class="plan-record-amount">
        <p v-if="recordInfo.cost" class="TTFontBolder text-right text-nowrap is-black">- {{ recordInfo.cost || 0 }}</p>
        <p v-else class="TTFontBolder text-right text-nowrap is-blue">+ {{ recordInfo.reward || 0 }}</p>
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
    user: {
      type: String,
      default: null
    },
    recordType: {
      type: String,
      default: 'growhops'
    }
  },
  computed: {
    infoType () {
      const recordType = this.recordType
      if (recordType === 'commission') {
        const taskType = this.info.taskType
        switch (true) {
          case taskType === 12:
            return 'referrerCommission'
          case taskType === 13:
            return 'recruitTicket'
          case taskType === 14:
            return 'recruitCommission'
        }
      }
      return this.recordType
    },
    recordInfo () {
      const info = this.info
      if (!info || !info._id) return {}
      const infoType = this.infoType

      let obj = {
        date: info.recordsAt * 1000
      }
      switch (true) {
        case infoType === 'growhops':
          obj = {
            icon: '#icon-check',
            title: `${this.planLockDays} day term deposit`,
            reward: formatMoneyNumber(weiByDecimals(info.hopsAmount)),
            date: info.recordsAt * 1000
          }
          break
        case infoType === 'withdraw':
          obj = {
            icon: '#icon-key',
            title: 'Unlock Bounty Chest',
            cost: formatMoneyNumber(weiByDecimals(info.needHopsAmount)),
            date: info.recordsAt * 1000
          }
          break
        case infoType === 'recruitFee':
          obj = {
            icon: '#icon-fee',
            title: 'Tavern recruit fee',
            cost: formatMoneyNumber(weiByDecimals(info.rewardCount)),
            date: info.recordsAt * 1000
          }
          break
        case infoType === 'recruitTicket':
          obj = {
            icon: '#icon-people',
            title: 'Tavern recruit ticket',
            reward: formatMoneyNumber(weiByDecimals(info.rewardCount)),
            date: info.recordsAt * 1000
          }
          break
        case infoType === 'referrerCommission':
          obj = {
            icon: '#icon-recruit-user',
            title: 'Recruit commission',
            reward: formatMoneyNumber(weiByDecimals(info.rewardCount)),
            date: info.recordsAt * 1000
          }
          break
        case infoType === 'recruitCommission':
          obj = {
            icon: '#icon-recruit-user',
            title: 'Referrer commission',
            reward: formatMoneyNumber(weiByDecimals(info.rewardCount)),
            date: info.recordsAt * 1000
          }
          break
      }
      return obj
    },
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
  }
  .plan-record-icon {
    margin-top: 20px;
    // padding: 8px;
    width: 28px;
    height: 28px;
    fill: $--main-blue-color;
    // background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
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
