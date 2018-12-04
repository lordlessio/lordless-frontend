<template>
  <div class="mobile-promotion-card">
    <div class="promotion-card-container">
      <div class="d-flex f-align-center promotion-card-top" @click.stop="$router.push(`/project/${info.airdrop.project._id}`)">
        <span class="inline-block line-height-0 card-top-icon">
          <svg>
            <use xlink:href="#icon-horn"/>
          </svg>
        </span>
        <span class="inline-block card-top-symbol">
          <span class="text-upper">{{ info.airdrop.project.symbol }}</span>
         Airdrop</span>
        <span class="inline-block line-height-0 card-top-icon arrow">
          <svg>
            <use xlink:href="#icon-arrow-line-right"/>
          </svg>
        </span>
      </div>
      <a class="d-flex promotion-card-bottom" :href="`${ETHERSCANURL}/tx/${info.tx}`" target="_blank">
        <span class="inline-block promotion-symbol-icon">
          <svg>
            <use :xlink:href="`#coin-${info.airdrop.project.symbol.toLocaleLowerCase()}`"/>
          </svg>
        </span>
        <div class="v-flex promotion-info-box">
          <p class="d-flex f-align-center">
            <span class="v-flex inline-block text-upper">{{ info.airdrop.project.symbol }}</span>
            <span class="inline-block TTFontBolder">+ {{ info.airdrop.countPerUser | weiToEth }}</span>
          </p>
          <p class="d-flex f-align-center">
            <span class="v-flex inline-block">{{ info.update_at | dateFormat('MMM. DD YYYY') }}</span>
            <span class="inline-block">≈ {{ info.airdrop.countPerUser / 1e18 / info.airdrop.project.USD2TokenCount | formatDecimal }}</span>
          </p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-quest-promotion-card',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-promotion-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  .promotion-card-container {

  }
  .promotion-card-top {
    padding: 0 16px;
    height: 36px;
    line-height: 36px;
    background-color: #f8f8f8;
    font-size: 12px;
    color: #999;
  }
  .card-top-symbol {
    margin: 0 5px;
  }
  .card-top-icon {
    width: 18px;
    height: 18px;
    fill: #999;
    &.arrow {
      width: 10px;
      height: 10px;
    }
  }

  .promotion-card-bottom {
    padding: 16px 20px;
  }
  .promotion-symbol-icon {
    padding: 8px;
    box-sizing: border-box;
    width: 36px;
    height: 36px;
    background-color: #0079FF;
    fill: #fff;
    border-radius: 100%;
    overflow: hidden;
  }
  .promotion-info-box {
    margin-left: 8px;
    >p {
      &:nth-of-type(1) {
        font-size: 16px;
        >span {
          color: #0079FF;
          &:nth-of-type(1) {
            color: #555;
          }
        }
      }
      &:nth-of-type(2) {
        font-size: 14px;
        color: #0079FF;
          >span {
            &:nth-of-type(1) {
              color: #bbb;
            }
          }
      }
    }
  }
</style>
