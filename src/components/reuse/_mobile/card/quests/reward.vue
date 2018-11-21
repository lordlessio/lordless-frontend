<template>
  <div class="mobile-reward-card">
    <div class="mobile-reward-container">
      <div class="d-flex reward-info-box">
        <div class="v-flex reward-info-cnt">
          <p class="reward-info-title">{{ info.ldbTaskType.name }}</p>
          <p class="text-upper reward-mark">{{ info.reward.candy.symbol }}</p>
        </div>
        <div class="text-right reward-info-value">
          <p class="TTFontBolder">+ {{ info.lord.reward.count | formatDecimal }}</p>
          <p class="reward-info-price">≈ $ {{ info.lord.reward.count / info.reward.candy.USD2TokenCount | formatDecimal }}</p>
        </div>
      </div>
      <div class="d-flex reward-tavern-box">
        <div class="v-flex reward-tavern-info">
          <p class="reward-info-title reward-tavern-name">{{ info.ldb.info.name.zh }}</p>
          <p class="reward-mark">ACT</p>
        </div>
         <div class="text-right reward-info-value">
          <p class="TTFontBolder">+ {{ info.ldb.activeness }}</p>
        </div>
      </div>
    </div>
    <div class="d-flex row-flex reward-from-box">
      <mobile-quest-bounty transparent bottoms :info="info"/>
    </div>
  </div>
</template>

<script>
import MobileQuestBounty from '@/components/reuse/_mobile/card/quests/bounty'
export default {
  name: 'mobile-quest-reward',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    MobileQuestBounty
  }
}
</script>

<style lang="scss" scoped>
  .mobile-reward-card {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  .mobile-reward-container {
    padding: 18px 26px;
  }
  .reward-from-box {
    background-color: #F8F8F8;
  }

  .reward-info-box {
    padding-bottom: 16px;
    border-bottom: 1px solid #ddd;
  }
  .reward-info-title {
    font-size: 16px;
    color: #555;
  }
  .reward-mark {
    margin-top: 3px;
    font-size: 12px;
    color: #999;
  }
  .reward-tavern-box {
    padding-top: 16px;
  }

  .reward-info-value {
    font-size: 16px;
    color: #4586FC;
  }
  .reward-info-price {
    font-size: 14px;
  }
</style>
