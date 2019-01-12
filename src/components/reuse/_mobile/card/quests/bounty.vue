<template>
  <div class="full-width mobile-bounty-card" :class="{ 'bottoms': bottoms, 'transparent': transparent }">
    <div class="d-flex row-flex mobile-bounty-container">
      <p class="line-height-0 bounty-symbol-icon">
        <svg>
          <use :xlink:href="`#coin-${info.reward.candy.symbol.toLocaleLowerCase()}`"/>
        </svg>
      </p>
      <div class="v-flex bounty-card-cnt">
        <div class="d-flex row-flex bounty-info-box">
          <div class="v-flex bounty-card-info">
            <p class="bounty-info-title">{{ info.ldbTaskType.name }}</p>
            <p class="bounty-info-second">
              <span>{{ info.ldb.info.name.zh }}</span>
              <span class="text-upper bounty-candy-symbol">{{ info.reward.candy.symbol }}</span>
            </p>
            <p class="bottoms-up-info-date">{{ info.update_at | dateFormat('MMM. DD YYYY HH:mm:ss') }}</p>
            <p class="inline-block bounty-info-status" :class="info.status === 0 ? 'under' : info.status === 1 ? 'approved' : 'rejected'">
              {{ info.status === 0 ? 'Under way' : info.status === 1 ? 'Approved' : 'Rejected' }}
            </p>
          </div>
          <div class="text-right bounty-candy-value">
            <p class="TTFontBolder bounty-candy-count">+ {{ info.executor.reward.count | formatDecimal }}</p>
            <p class="bounty-candy-price">≈ $ {{ info.executor.reward.count / info.reward.candy.USD2TokenCount | formatDecimal }}</p>
          </div>
        </div>
        <div class="d-flex row-flex bounty-timeline-box">
          <p class="bounty-timeline-status">{{ info.status === 0 ? 'Due on' : info.status === 1 ? 'Completed on' : 'Over due on' }}</p>
          <p class="v-flex text-right bounty-timeline-date">{{ info.status === 1 ? info.roundId.update_at : info.roundId.endAt | dateFormat('MMM. DD YYYY HH:mm:ss') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-quest-bounty',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    bottoms: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-bounty-card {
    padding: 20px 16px;
    background-color: #fff;
    border-radius: 5px;
    &.transparent {
      background-color: transparent;
    }
    &.bottoms {
      .bounty-info-status, .bounty-timeline-box {
        display: none;
      }
      .bottoms-up-info-date {
        display: block;
      }
    }
  }
  .bounty-symbol-icon {
    padding: 8px;
    width: 36px;
    height: 36px;
    fill: #fff;
    background-color: #4586fc;
    border-radius: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .bounty-card-cnt {
    margin-left: 10px;
  }
  .bounty-info-title {
    font-size: 16px;
    color: #555;
  }
  .bounty-info-second {
    margin-top: 3px;
    font-size: 12px;
    color: #999;
  }
  .bounty-candy-symbol {
    position: relative;
    padding-left: 7px;
    margin-left: 6px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: 10px;
      background-color: rgba(200, 200, 200, .5);
      transform: translateY(-50%);
    }
  }
  .bottoms-up-info-date {
    display: none;
    margin-top: 8px;
    font-size: 14px;
    color: #bbb;
  }
  .bounty-info-status {
    margin-top: 5px;
    padding: 4px 8px;
    font-size: 12px;
    color: #fff;
    border-radius: 5px;
    &.approved {
      background-color: #69D1C3;
    }
    &.rejected {
      background-color: #EB8785;
    }
    &.under {
      background-color: #4586FC;
    }
  }

  .bounty-candy-value {
    font-size: 16px;
    color: #4586fc;
  }
  .bounty-candy-price {
    font-size: 14px;
  }
  .bounty-timeline-box {
    margin-top: 12px;
    padding-top: 12px;
    font-size: 14px;
    border-top: 1px solid #ddd;
  }
  .bounty-timeline-status {
    color: #bbb;
  }
  .bounty-timeline-date {
    color: #777;
  }
</style>
