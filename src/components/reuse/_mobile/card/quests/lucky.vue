<template>
  <div class="mobile-lucky-card" :class="{ 'is-lg': lg, 'is-shadow': shadow }">
    <div class="lucky-card-container">
      <div class="d-flex f-align-center lucky-card-top" @click.stop="$router.push('/project/promotions')">
        <span class="inline-block line-height-0 card-top-icon">
          <svg>
            <use xlink:href="#icon-horn"/>
          </svg>
        </span>
        <span class="inline-block card-top-symbol">
          <!-- <span class="text-upper">{{ 'ETH' }}</span> -->
         Lucky Blocks</span>
        <span class="inline-block line-height-0 card-top-icon arrow">
          <svg>
            <use xlink:href="#icon-arrow-line-right"/>
          </svg>
        </span>
      </div>
      <div class="lucky-card-content">
        <div class="relative lucky-info-content" :class="{ 'pending': pending, 'failed': failed }">
          <div class="lucky-section-item">
            <p class="lucky-section-title">
              <span>Bets</span>
            </p>
            <div class="lucky-section-content">
              <div class="lucky-left-content bets">
                <div class="d-flex f-align-center" v-if="info.luckyblock.blockInfos.ethBets">
                  <p class="v-flex">- {{ weiByDecimals(info.luckyblock.blockInfos.ethBets.count, info.luckyblock.blockInfos.ethBets.decimals).toLocaleString() }} ETH</p>
                </div>
                <div class="d-flex f-align-center" v-for="(item, index) of info.luckyblock.blockInfos.tokenBets" :key="index">
                  <p class="v-flex">- {{ weiByDecimals(item.count, item.decimals).toLocaleString() }} {{ item.candy.symbol }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="lucky-section-item">
            <p class="d-flex f-align-center lucky-section-title">
              <span>Winnings</span>
              <span class="v-flex text-right">Probability</span>
            </p>
            <div class="d-flex f-align-start lucky-section-content">
              <div class="v-flex lucky-left-content winnings">
                <div class="d-flex f-align-center lucky-winnings-info" :class="{ 'miss': info.status !== 0 && (info.luckyRandom + info.luckyblock.blockInfos.ethWinnings.percent < 100) }" v-if="info.luckyblock.blockInfos.ethWinnings">
                  <p class="v-flex">
                    <span class="inline-block line-height-0 lucky-winnings-icon">
                      <svg>
                        <use :xlink:href="`#icon-${(info.status === 0 || (info.luckyRandom + info.luckyblock.blockInfos.ethWinnings.percent >= 100)) ? 'ok' : 'close'}`"/>
                      </svg>
                    </span>
                    <span>+ {{ weiByDecimals(info.luckyblock.blockInfos.ethWinnings.count, info.luckyblock.blockInfos.ethWinnings.decimals).toLocaleString() }} ETH</span>
                  </p>
                  <p class="lucky-right-content">{{ info.luckyblock.blockInfos.ethWinnings.percent }}%</p>
                </div>
                <div
                  v-for="(item, index) of info.luckyblock.blockInfos.tokenWinnings" :key="index"
                  class="d-flex f-align-center lucky-winnings-info"
                  :class="{ 'miss': info.status !== 0 && (info.luckyRandom + item.percent < 100) }">
                  <p class="v-flex">
                    <span class="inline-block line-height-0 lucky-winnings-icon">
                      <svg>
                        <use :xlink:href="`#icon-${(info.status === 0 || (info.luckyRandom + item.percent >= 100)) ? 'ok' : 'close'}`"/>
                      </svg>
                    </span>
                    <span>+ {{ weiByDecimals(item.count, item.decimals).toLocaleString() }} {{ item.candy.symbol }}</span>
                  </p>
                  <p class="lucky-right-content">{{ item.percent }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex f-align-center lucky-section-item lucky-bottom-section">
          <div class="v-flex">
            <div class="TTFontBolder d-flex f-align-center lucky-status-info">
              <p>
                <span v-if="failed">Tx is failed.</span>
                <span v-else-if="pending">Result is pending.</span>
                <span v-else-if="isFullWinning">LUCKY man!</span>
                <span v-else>Have a nice day.</span>
              </p>
              <span class="inline-block line-height-0 lucky-status-icon">
                <svg>
                  <use :xlink:href="statusIcon"/>
                </svg>
              </span>
            </div>
            <p class="lucky-info-date">{{ info.created_at | dateFormat('MMM. DD YYYY HH:mm:ss') }}</p>
          </div>
          <div class="lucky-view-btns">
            <lordless-btn theme="blue" class="lucky-view-btn" inverse>
              <a class="inline-block" :href="`${ETHERSCANURL}/tx/${info.tx}`" target="_blank">View detail</a>
            </lordless-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { weiByDecimals } from 'utils/tool'
export default {
  name: 'mobile-quest-lucky-card',
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
    },
    failed () {
      const { status } = this.info || {}
      return status === -1 || status === -2
    },
    pending () {
      return this.info.status === 0
    },

    // 获取所有 token winning 的阀值
    allWinningRandoms () {
      let randoms = []
      const { luckyRandom, luckyblock } = this.info
      const { blockInfos } = luckyblock || {}
      const { ethWinnings, tokenWinnings } = blockInfos || {}
      randoms.push(ethWinnings.percent)

      for (const tokenW of tokenWinnings) {
        randoms.push(tokenW.percent)
      }

      randoms = randoms.sort((a, b) => a - b)

      return {
        random: luckyRandom,
        randoms,
        maxRandom: randoms[randoms.length - 1],
        minRandom: randoms[0]
      }
    },
    // 是否赢得了全奖
    isFullWinning () {
      const { random, minRandom } = this.allWinningRandoms

      return random + minRandom >= 100
    },
    // 是否没有得奖
    isUnWinning () {
      const { random, maxRandom } = this.allWinningRandoms

      return random + maxRandom < 100
    },

    statusIcon () {
      switch (true) {
        case this.failed:
          return '#icon-annoyed'
        case this.pending:
          return '#icon-smile'
        case this.isFullWinning:
          return '#icon-kiss'
        default:
          return '#icon-cool'
      }
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
  .mobile-lucky-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    &.is-shadow {
      box-shadow: 0 0 10px 3px rgba(221, 221, 221, 1);
    }
    &.is-lg {
      .lucky-card-top {
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
    }
  }
  .lucky-card-container {

  }
  .lucky-card-top {
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

  /**
    * lucky-card-content  -- begin
    */
  .lucky-card-content {
    padding: 20px;
  }
  .lucky-info-content {
    &.pending, &.failed {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, .6);
        z-index: 1;
      }
      &::after {
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        font-size: 48px;
        color: #555;
        text-align: center;
        transform: translateY(-50%);
        z-index: 2;
        @include TTFontBolder();
      }
    }
    &.pending {
      &::after {
        content: 'PENDING';
      }
      .lucky-left-content {
        color: #555;
      }
      .lucky-winnings-icon {
        display: none;
      }
    }
    &.failed {
      &::after {
        content: 'FAILED';
      }
      .lucky-left-content {
        color: #555;
      }
      .lucky-winnings-icon {
        display: none;
      }
      .bets {
        text-decoration: line-through;
      }
    }
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
    p {
      margin-top: 8px;
    }
  }

  .lucky-left-content {
    color: #00C1A7;
    &.bets {
      color: #F5515F;
    }
  }

  .lucky-right-content {
    color: #999;
  }

  // lucky-winnings-info
  .lucky-winnings-info {
    // color: #00C1A7;
    fill: #fff;
    &.miss {
      color: #999;
      .lucky-winnings-icon {
        padding: 2px;
        stroke-width: 2;
        stroke: #fff;
        background-color: #999;
      }
    }
  }
  .lucky-winnings-icon {
    margin-right: 8px;
    padding: 1px;
    width: 16px;
    height: 16px;
    background-color: #00C1A7;
    border-radius: 100%;
    box-sizing: border-box;
  }

  // lucky-bottom-section
  .lucky-bottom-section {
    font-size: 14px;
    color: #bbb;
  }
  .lucky-status-info {
    font-size: 16px;
    color: #0B2A48;
  }
  .lucky-status-icon {
    margin-left: 8px;
    width: 18px;
    height: 18px;
  }

  // lucky-view-btns
  .lucky-view-btns {

  }
  .lucky-view-btn {
    padding: 0;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    >a {
      padding: 0 16px;
      color: inherit;
    }
  }

  /**
    * lucky-card-content  -- end
    */
</style>
