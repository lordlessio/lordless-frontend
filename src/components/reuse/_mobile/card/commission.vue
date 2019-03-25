<template>
  <div class="commission-card-box">
    <div class="d-flex f-align-start commission-card-container">
      <span class="inline-block line-height-0 commission-token-icon">
        <svg>
          <use xlink:href="#coin-hops"/>
        </svg>
      </span>
      <div class="v-flex d-flex f-align-center commission-card-cnt">
        <div class="v-flex commission-info-box">
          <p>HOPS commission</p>
          <p class="d-flex f-align-center commission-address-box">
            <lordless-blockies :scale="3" :seed="info.from" jump/>
            <span class="commission-user-address">{{ info.from | splitAddress({ before: 8, end: 6, symbol: '******' }) }}</span>
          </p>
          <p class="commission-info-date">{{ new Date(info.created_at) | dateFormat('HH:mm MMM dd YYYY') }}</p>
        </div>
        <p class="TTFontBolder commission-hops-count">+{{ weiByDecimals(info.rewardCount, info.candy.decimals) | formatMoneyNumber }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { weiByDecimals } from 'utils/tool'
export default {
  name: 'lordless-commission-card',
  props: {
    info: {
      type: Object,
      default: () => {}
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
  .commission-card-box {

  }
  .commission-card-container {
    padding-top: 20px;
    padding-left: 20px;
    line-height: 1.2;
    background-color: #fff;
  }
  .commission-token-icon {
    padding: 6px;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    fill: #fff;
    box-sizing: border-box;
  }
  .commission-card-cnt {
    margin-left: 12px;
    padding-right: 20px;
    padding-bottom: 20px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #ddd;
    }
  }
  .commission-info-box {
    font-size: 16px;
    color: #555;
  }
  .commission-address-box {
    margin-top: 8px;
  }
  .commission-user-address {
    margin-left: 4px;
    font-size: 14px;
    color: #777;
  }
  .commission-info-date {
    margin-top: 8px;
    font-size: 14px;
    color: #bbb;
  }
  .commission-hops-count {
    color: $--main-blue-color;
  }
</style>
