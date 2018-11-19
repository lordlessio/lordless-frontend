<template>
  <div class="d-flex col-flex mobile-candies-box">
    <div v-if="assets.length" class="v-flex d-flex f-auto-center children-none-data-box none-candies-box">
      <div class="children-none-data-container none-candies-container">
        <p class="children-none-data-icon">
          <svg>
            <use xlink:href="#icon-no-candy"/>
          </svg>
        </p>
        <p class="children-none-data-desc">You have no candy now.<br/>You can apply a quest to earn bounty or buy a tavern to get reward.</p>
        <div>
          <lordless-btn class="TTFontBolder children-none-data-btn" theme="blue" inverse shadow @click="$router.push('/market')">Buy a tavern</lordless-btn>
        </div>
      </div>
    </div>
    <div v-if="!assets.length" class="v-flex d-flex col-flex mobile-candies-container">
      <asset-sort-bar
        :sortItems="sortItems"
        :total="assets.length"
        :static="true"
        @sort="sortChange"
        @order="orderChange"/>
      <div class="v-flex candies-main-cnt">
        <ul class="candies-list">
          <li
            class="candies-item"
            v-for="asset of assets" :key="asset._id">
            <mobile-asset-card :info="asset"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import AssetSortBar from '@/components/reuse/_mobile/sortBar'
import MobileAssetCard from '@/components/reuse/_mobile/card/asset'
import { getUserAssets } from 'api'

import { mapState } from 'vuex'

export default {
  name: 'mobile-candies-content',
  data: () => {
    return {
      assets: [],

      assetOrder: 'desc',

      assetSort: 'alphabe',
      sortItems: {
        alphabe: 'Alphabetical',
        holdings: 'Holdings'
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    AssetSortBar,
    MobileAssetCard
  },
  methods: {
    sortChange (sort) {
      this.assetSort = sort
      this.getAssets({ sort })
    },
    orderChange (order) {
      this.assetOrder = order
      this.getAssets({ order })
    },
    async getAssets ({ sort, order } = {}) {
      const res = await getUserAssets({ sort, order })
      if (res.code === 1000 && res.data) {
        this.assets = res.data
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      console.log('userInfo', this.userInfo)
      this.getAssets()
    })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-candies-box {
    @include viewport-unit(min-height, 100vh, 112px);
  }
  .candies-main-cnt {
    margin-top: 10px;
    padding: 0 20px;
    @include overflow();
  }
  .candies-item {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
</style>
