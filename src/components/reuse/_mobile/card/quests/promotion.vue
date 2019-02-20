<template>
  <div class="mobile-promotion-card" :class="{ 'is-lg': lg, 'is-shadow': shadow }">
    <div class="promotion-card-container">
      <div class="d-flex f-align-center promotion-card-top" @click.stop="$router.push(`/project/${info.airdrop.project._id}`)">
        <span class="inline-block line-height-0 card-top-icon">
          <svg>
            <use xlink:href="#icon-horn"/>
          </svg>
        </span>
        <span class="inline-block card-top-symbol">
          <span class="text-upper">{{ info.airdrop.project.symbol }}</span>
         Windfall</span>
        <span class="inline-block line-height-0 card-top-icon arrow">
          <svg>
            <use xlink:href="#icon-arrow-line-right"/>
          </svg>
        </span>
      </div>
      <a class="d-flex promotion-card-bottom" :href="`${ETHERSCANURL}/tx/${info.tx}`" target="_blank">
        <span class="inline-block line-height-0 project-symbol-img">
          <lordless-candy-icon
            :url="info.airdrop.project.iconUrl"
            :symbol="info.airdrop.project.symbol"/>
        </span>
        <!-- <span v-if="info.airdrop.project.iconUrl && info.airdrop.project.symbol === 'BITE'" class="inline-block line-height-0 project-symbol-img">
          <img class="full-width" :alt="`${info.airdrop.project.symbol} icon`" :src="ossOrigin + info.airdrop.project.iconUrl"/>
        </span>
        <span v-else class="inline-block promotion-symbol-icon">
          <svg>
            <use :xlink:href="`#coin-${info.airdrop.project.symbol.toLocaleLowerCase()}`"/>
          </svg>
        </span> -->
        <div class="v-flex d-flex f-align-center promotion-info-box">
          <div class="v-flex">
            <p class="TTFontBolder">{{ info.airdrop.project.symbol }}</p>
            <p class="promotion-info-date">{{ info.update_at | dateFormat('MMM. DD YYYY') }}</p>
          </div>
          <div v-if="info.status === -2 || info.status === -1" class="TTFontBolder promotion-failed-info">
            <!-- {{ info.status === -1 ? 'Failed' : 'Token Empty!' }} -->
            Failed
          </div>
          <div v-else class="promotion-receive-info" :class="{ 'is-pending': info.status === 0 }">
            <p class="TTFontBolder promotion-receive-count">+ {{ info.airdrop.countPerUser | weiByDecimals(info.airdrop.decimals) }}</p>
            <p class="TTFontBolder text-right promotion-info-pending">Pending</p>
            <p v-if="info.airdrop.project.USD2TokenCount" class="promotion-receive-value">≈ $ {{ info.airdrop.countPerUser / 1e18 / info.airdrop.project.USD2TokenCount | formatDecimal }}</p>
          </div>
          <!-- <p class="d-flex f-align-center">
            <span class="v-flex inline-block text-upper">{{ info.airdrop.project.symbol }}</span>
            <span class="inline-block TTFontBolder">+ {{ info.airdrop.countPerUser | weiByDecimals(info.airdrop.decimals) }}</span>
          </p>
          <p class="d-flex f-align-center">
            <span class="v-flex inline-block">{{ info.update_at | dateFormat('MMM. DD YYYY') }}</span>
            <span v-if="info.airdrop.project.USD2TokenCount" class="inline-block">≈ $ {{ info.airdrop.countPerUser / 1e18 / info.airdrop.project.USD2TokenCount | formatDecimal }}</span>
          </p> -->
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
    },
    lg: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    },
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-promotion-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    &.is-shadow {
      box-shadow: 0 0 10px 3px rgba(221, 221, 221, 1);
    }
    &.is-lg {
      .promotion-card-top {
        padding: 0 40px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
      .card-top-symbol {
        margin-left: 12px;
        margin-right: 6px;
      }
      .card-top-icon {
        width: 24px;
        height: 24px;
        fill: #bbb;
        &.arrow {
          width: 12px;
          height: 12px;
        }
      }
      .promotion-card-bottom {
        padding: 18px 40px;
      }
      .promotion-symbol-icon {
        padding: 14px;
        width: 56px;
        height: 56px;
      }
      .promotion-info-box {
        margin-left: 18px;
        >p {
          &:nth-of-type(1) {
            font-size: 20px;
            @include TTFontBolder();
          }
          &:nth-of-type(2) {
            font-size: 16px;
          }
        }
      }
    }
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
  .project-symbol-img {
    width: 48px;
    height: 48px;
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
  // .promotion-symbol-icon {
  //   padding: 8px;
  //   box-sizing: border-box;
  //   width: 36px;
  //   height: 36px;
  //   background-color: #0079FF;
  //   fill: #fff;
  //   border-radius: 100%;
  //   overflow: hidden;
  // }
  .promotion-info-box {
    margin-left: 8px;
    font-size: 20px;
    color: #555;
    // >p {
    //   &:nth-of-type(1) {
    //     font-size: 16px;
    //     >span {
    //       color: #0079FF;
    //       &:nth-of-type(1) {
    //         color: #555;
    //       }
    //     }
    //   }
    //   &:nth-of-type(2) {
    //     font-size: 14px;
    //     color: #0079FF;
    //       >span {
    //         &:nth-of-type(1) {
    //           color: #bbb;
    //         }
    //       }
    //   }
    // }
  }
  .promotion-receive-info {
    color: #0079FF;
    &.is-pending {
      .promotion-info-pending {
        display: block;
      }
      .promotion-receive-value, .promotion-receive-count {
        display: none;
      }
    }
  }
  .promotion-info-pending {
    display: none;
    font-size: 16px;
    color: #0079FF;
    // color: #bbb;
  }
  .promotion-info-date, .promotion-receive-value {
    font-size: 14px;
  }
  .promotion-info-date {
    color: #bbb;
  }
  .promotion-failed-info {
    font-size: 16px;
    color: #F5515F;
  }
</style>
