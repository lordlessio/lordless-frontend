<template>
  <div class="d-flex col-flex relative mobile-candies-box">
    <mobile-nav-bar
      v-if="!loading && !assets.total"
      ref="mobile-nav-bar"
      text="Candies"
      :scroll="false"
      fixed/>
    <transition name="ld-hide-fade" mode="out-in">
      <mobile-asset-skeletion v-if="loading"/>
      <div v-else-if="!loading && !assets.total" class="v-flex d-flex f-auto-center children-none-data-box none-candies-box">
        <div class="children-none-data-container none-candies-container">
          <p class="children-none-data-icon">
            <svg>
              <use xlink:href="#icon-no-candy"/>
            </svg>
          </p>
          <p class="children-none-data-desc">You have no candy now.<br/>You can apply a quest to earn bounty or buy a tavern to get reward.</p>
          <div>
            <lordless-btn class="TTFontBolder children-none-data-btn" theme="blue" inverse shadow @click="$router.push('/taverns')">Apply a quest</lordless-btn>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && assets.total" class="v-flex d-flex col-flex mobile-candies-container">
        <mobile-candy-holding-nav :holdingValue="holdingValue"/>
        <asset-sort-bar
          :sortItems="sortItems"
          :total="assets.total"
          :scrollHeight="100"
          :topHeight="44"
          @sort="sortChange"
          @order="orderChange"/>
        <div class="v-flex candies-main-cnt">
          <ul class="candies-list">
            <li
              class="candies-item"
              v-for="(asset, index) of assets.list" :key="index">
              <mobile-asset-card :info="asset" :totalValue="assets.totalValue"/>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import MobileAssetSkeletion from '@/components/skeletion/_mobile/candy'
import MobileCandyHoldingNav from '@/components/content/_mobile/candy/holding'

import AssetSortBar from '@/components/reuse/_mobile/sortBar'
import MobileAssetCard from '@/components/reuse/_mobile/card/asset'
import { getUserAssets } from 'api'

// import { addClass, removeClass } from 'utils/tool'

import { mapState } from 'vuex'

export default {
  name: 'mobile-candies-content',
  data: () => {
    return {
      rendered: false,
      loading: true,
      holdingValue: null,
      assets: [],

      assetOrder: -1,

      assetSort: 'alphabe',
      sortItems: {
        alphabe: 'Alphabetical',
        holdings: 'Holdings'
      },
      scrollFunc: null
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    MobileAssetSkeletion,
    MobileCandyHoldingNav,

    AssetSortBar,
    MobileAssetCard
  },
  methods: {
    sortChange (sort) {
      this.assetSort = sort
      this.reSortAssets({ sort })
    },
    orderChange (order) {
      this.assetOrder = order
      this.reSortAssets({ order })
    },

    // 重排 assets 数据
    reSortAssets ({ sort = this.assetSort, order = this.assetOrder } = {}, data = this.assets) {
      const _data = JSON.parse(JSON.stringify(data))
      let _list = _data.list || []
      order = parseInt(order)
      if (sort === 'alphabe') {
        _list = _list.sort((a, b) => {
          if (a.candy.symbol > b.candy.symbol) return order
          else return -1 * order
        })
      } else {
        _list = _list.sort((a, b) => {
          return (a.value - b.value) * order
        })
      }
      _data.list = _list
      console.log('_data', _data.list.map(item => item.candy.symbol))
      this.$set(this, 'assets', _data)
    },

    // 获取用户 assets
    async getAssets () {
      if (this.rendered) return
      this.loading = true
      const res = await getUserAssets()
      if (res.code === 1000 && res.data) {
        this.reSortAssets({}, res.data)
        this.holdingValue = res.data.totalValue
        console.log('------ ', res.data.totalValue)
      }
      this.loading = false
    },
    init () {
      this.getAssets()
      this.rendered = false
    }
  },
  activated () {
    this.init()
  },
  mounted () {
    this.init()
    this.rendered = true
  }
}
</script>

<style lang="scss" scoped>
  .mobile-candies-box {
    margin-top: -52px;
    // padding-bottom: 35px;
    // box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 60px);
  }

  .candies-main-cnt {
    // margin-top: 10px;
    padding: 0 20px 35px;
    @include overflow();
  }
  .mobile-candies-container {
    padding-top: 140px;
  }
  .candies-list {
    position: relative;
    padding-top: 20px;
    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: #ddd;
    }
  }
  .candies-item {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
</style>
