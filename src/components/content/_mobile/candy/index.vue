<template>
  <div class="d-flex col-flex mobile-candies-box">
    <asset-sort-bar
      v-if="loading || assets.length"
      :sortItems="sortItems"
      :total="assets.length"
      static
      @sort="sortChange"
      @order="orderChange"/>
    <transition name="ld-hide-fade" mode="out-in">
      <mobile-asset-skeletion v-if="loading"/>
      <div v-else-if="!loading && !assets.length" class="v-flex d-flex f-auto-center children-none-data-box none-candies-box">
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
      <div v-else-if="!loading && assets.length" class="v-flex d-flex col-flex mobile-candies-container">
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
    </transition>
  </div>
</template>

<script>
import MobileAssetSkeletion from '@/components/skeletion/_mobile/candy'

import AssetSortBar from '@/components/reuse/_mobile/sortBar'
import MobileAssetCard from '@/components/reuse/_mobile/card/asset'
import { getUserAssets } from 'api'

import { mapState } from 'vuex'

export default {
  name: 'mobile-candies-content',
  data: () => {
    return {
      loading: true,
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
    MobileAssetSkeletion,

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
    candyConnect () {

    },
    async getAssets ({ sort, order } = {}) {
      this.loading = true
      const res = await getUserAssets({ sort, order })
      if (res.code === 1000 && res.data) {
        this.assets = res.data
      }
      this.loading = false
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
