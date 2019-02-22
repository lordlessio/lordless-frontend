<template>
  <div class="mobile-bc-box">
    <div class="mobile-bc-container"
      :class="{
        'is-materials': currentTab === 'materials',
        'is-empty-materials': currentTab === 'materials' && holdingValue === 0,
        'is-chests': currentTab === 'chests'
        }">
      <mobile-b-c-holding-nav :holdingValue="holdingValue" :tokenTotal="tokenTotal" @bcTab="chooseBCTab" @bcChest="chooseBCChest"/>
      <mobile-b-c-materials v-if="currentTab === 'materials'" :holdingValue.sync="holdingValue" :tokenTotal.sync="tokenTotal"/>
      <mobile-b-c-chests v-else :chestModel="currentChest"/>
    </div>
  </div>
</template>

<script>
import MobileBCHoldingNav from '@/components/content/_mobile/bc/holding'

import MobileBCMaterials from '@/components/content/_mobile/bc/materials'
import MobileBCChests from '@/components/content/_mobile/bc/chests'

// import { getUserAssets, getBountiesByUser } from 'api'
export default {
  name: 'lordless-bc-component',
  data: () => {
    return {
      currentTab: 'materials',
      currentChest: 'all',
      holdingValue: -1,
      tokenTotal: 0
    }
  },
  components: {
    MobileBCHoldingNav,
    MobileBCMaterials,

    MobileBCChests
  },
  methods: {
    chooseBCTab (value) {
      this.currentTab = value
    },
    chooseBCChest (value) {
      this.currentChest = value
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-bc-box {
    padding-top: 44px;
  }
  .mobile-bc-container {
    box-sizing: border-box;
    transition: all .15s;
    // @include viewport-unit(min-height, 100vh, 44px);
    &.is-materials {
      padding-top: 92px;
    }
    &.is-empty-materials {
      padding-top: 0;
    }
    &.is-chests {
      padding-top: 44px;
    }
  }
</style>
