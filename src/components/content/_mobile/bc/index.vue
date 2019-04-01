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
      <mobile-b-c-records v-else-if="currentTab === 'records'"/>
      <mobile-b-c-chests v-else :chestModel="currentChest"/>
      <lordless-fixed :bottom="85" :right="32" initial class="package-bc-container">
        <div class="cursor-pointer d-flex f-auto-center package-bc-box" @click.stop="$router.push(`/owner/bountyChest?refer=${$route.fullPath}`)">
          <span class="inline-block line-height-0 package-bc-icon">
            <svg>
              <use xlink:href="#icon-hammer"/>
            </svg>
          </span>
        </div>
      </lordless-fixed>
    </div>
  </div>
</template>

<script>
import MobileBCHoldingNav from '@/components/content/_mobile/bc/holding'

import MobileBCMaterials from '@/components/content/_mobile/bc/materials'
import MobileBCRecords from '@/components/content/_mobile/bc/records'
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
    MobileBCRecords,

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

  // package-bc-box
  .package-bc-box {
    width: 60px;
    height: 60px;
    background-image: linear-gradient(-225deg, #124bdc 0%, #0079ff 100%);
    box-shadow: 0px 0px 12px 0px #0079ff;
    border-radius: 20px;
    transform: rotate(45deg);
    box-sizing: border-box;
  }
  .package-bc-icon {
    width: 32px;
    height: 32px;
    fill: #fff;
    transform: rotate(-45deg);
  }
</style>
