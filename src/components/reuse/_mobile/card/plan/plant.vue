<template>
  <div class="relative d-flex f-align-start hops-plant-cnt" :class="{ 'not-balance': notBalance }" @click.stop="choosePlan">
    <p class="ImpactFont relative hops-plant-helm">{{ (info.lessToHops / (info.lockTime / 3600 / 24 / 30)).toFixed(1) }}</p>
    <div class="hops-plant-right">
      <h3 class="relative text-upper hops-plant-level">{{ levelText }}</h3>
      <div class="plant-deposits-info">
        <p class="ImpactFont">{{ info.lockTime / 3600 / 24 }} DAY term deposits</p>
        <p class="hops-plant-lessAmount">{{ info.minimumAmount | weiByDecimals }} LESS at least</p>
      </div>
      <p class="plant-income-info"><span class="TTFontBlack">{{ info.lessToHops * 100 }}</span> HOPS income on every  100 LESS invested.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-hops-plant-card',
  props: {
    info: {
      type: Object,
      default: {}
    },
    lessBalance: {
      type: Number,
      default: 0
    }
  },
  computed: {
    notBalance () {
      return this.info.minimumAmount > this.lessBalance
    },
    levelText () {
      const levels = {
        1: 'BASIC',
        2: 'PLUS',
        3: 'PRO'
      }
      return levels[this.info.level]
    }
  },
  methods: {
    choosePlan () {
      if (this.notBalance) return
      this.$emit('choosePlan', this.info)
    }
  }
}
</script>

<style lang="scss" scoped>
  .hops-plant-cnt {
    padding: 16px 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, .1);
    &.not-balance {
      // background-color: #fff;
      .hops-plant-helm, .hops-plant-level, .plant-deposits-info, .plant-income-info {
        color: #bbb;
      }
      .hops-plant-level {
        &::before {
          background-color: #bbb;
        }
      }
      .plant-income-info {
        >span {
          @include TTFontBold();
        }
      }
      .hops-plant-lessAmount {
        margin-top: -2px;
        color: #F5515F;
        @include TTFontBolder();
      }
    }
  }

  .hops-plant-helm {
    margin-right: 16px;
    padding-top: 18px;
    width: 72px;
    // padding-right: 24px;
    font-size: 36px;
    color: #0079FF;
    &::before {
      content: 'HELM';
      position: absolute;
      left: 0;
      top: 0;
      font-size: 16px;
    }
  }

  // .hops-plant-right {
  //   margin-left: 16px;
  // }
  .hops-plant-level {
    padding-left: 10px;
    font-size: 14px;
    color: #777;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 6px;
      height: 14px;
      transform: translateY(-50%);
      background-color: #0079FF;
    }
  }
  .plant-deposits-info {
    margin-top: 8px;
    font-size: 20px;
  }
  .hops-plant-lessAmount {
    font-size: 14px;
    color: #999;
  }

  .plant-income-info {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    font-size: 14px;
    color: #555;
  }
</style>
