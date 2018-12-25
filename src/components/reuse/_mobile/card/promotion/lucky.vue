<template>
  <div class="promotion-lucky-card">
    <div class="lucky-section-item">
      <p class="lucky-section-title">
        <span>Bets</span>
      </p>
      <div class="lucky-section-content bets">
        <div class="lucky-left-content">
          <p>- 0.01 ETH</p>
          <p>- 100 LESS</p>
        </div>
      </div>
    </div>
    <div class="lucky-section-item">
      <p class="d-flex f-align-center lucky-section-title">
        <span>Winnings</span>
        <span class="v-flex text-right">Probability</span>
      </p>
      <div class="d-flex f-align-start lucky-section-content winnings">
        <div class="v-flex lucky-left-content">
          <p>+ 0.05 ETH</p>
          <p>+ 1K LESS</p>
        </div>
        <div class="lucky-right-content">
          <p>20%</p>
          <p>100%</p>
        </div>
      </div>
    </div>
    <div class="d-flex f-align-center lucky-section-item lucky-bottom-section">
      <p class="v-flex d-flex f-align-center lg-cursor-pointer lg-hover-underline" @click.stop="showTip">
        <span class="inline-block line-height-0 lucky-tips-icon">
          <svg>
            <use xlink:href="#icon-tips"/>
          </svg>
        </span>
        <span>Rules & Detail</span>
      </p>
      <lordless-btn class="lucky-claim-btn" theme="red-linear">Play now</lordless-btn>
    </div>
    <lordless-lucky-rules v-model="rulesModel"/>
  </div>
</template>

<script>
export default {
  name: 'promotion-lucky-card',
  data: () => {
    return {
      rulesModel: false
    }
  },
  methods: {
    showTip () {
      this.rulesModel = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .promotion-lucky-card {
    padding: 20px;
    background-color: #fff;
  }
  .lucky-section-item {
    &:not(:first-of-type) {
      margin-top: 22px;
    }
  }
  .lucky-section-title {
    padding-bottom: 8px;
    font-size: 16px;
    color: #777;
    border-bottom: 1px solid #ddd;
  }
  .lucky-section-content {
    padding-top: 4px;
    @include TTFontBolder();
    font-size: 16px;
    color: #00C1A7;
    &.bets {
      color: #F5515F;
    }
    p {
      margin-top: 8px;
    }
  }

  .lucky-right-content {
    color: #999;
  }

  .lucky-bottom-section {
    font-size: 14px;
    color: #777;
  }
  .lucky-tips-icon {
    margin-right: 4px;
    width: 15px;
    height: 15px;
    fill: #777;
  }
  .lucky-claim-btn {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border: none;
    @include TTFontBold();
  }
</style>
