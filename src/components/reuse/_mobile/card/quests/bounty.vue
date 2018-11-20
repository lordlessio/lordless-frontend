<template>
  <div class="mobile-bounty-card" :class="{ 'bottoms': bottoms }">
    <div class="d-flex row-flex mobile-bounty-container">
      <p class="line-height-0 bounty-symbol-icon">
        <svg>
          <use :xlink:href="`#coin-${info.reward.candy.symbol.toLocaleLowerCase()}`"/>
        </svg>
      </p>
      <div class="v-flex bounty-card-cnt">
        <div class="d-flex row-flex bounty-info-box">
          <div class="v-flex bounty-card-info">
            <p class="bounty-info-title">Follow ZRX telegram</p>
            <p class="bounty-info-second">
              <span class="inline-block">罗斯福公馆</span>
              <span class="inline-block bounty-candy-symbol">ZRX</span>
            </p>
            <p class="bottoms-up-info-date">Aug 14 2018 12:32:10</p>
            <p class="bounty-info-status approved">Approved</p>
          </div>
          <div class="text-right bounty-candy-value">
            <p class="TTFontBolder bounty-candy-count">+ 1.2</p>
            <p class="bounty-candy-price">≈ $0.53</p>
          </div>
        </div>
        <div class="d-flex row-flex bounty-timeline-box">
          <p class="bounty-timeline-status">Completed on</p>
          <p class="bounty-timeline-date">Aug 14 2018 12:32:10</p>
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-bounty-card {
    padding: 20px 16px;
    background-color: #fff;
    border-radius: 5px;
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
    padding-left: 11px;
    margin-left: 10px;
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
    color: #4586fc;
  }
  .bounty-timeline-box {
    padding-top: 12px;
    border-top: 1px solid #ddd;
  }
  .bounty-timeline-status {
    font-size: 12px;
    color: #bbb;
  }
  .bounty-timeline-date {
    font-size: 14px;
    color: #777;
  }
</style>
