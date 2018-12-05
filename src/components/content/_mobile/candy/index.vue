<template>
  <div class="d-flex col-flex relative mobile-candies-box">
    <div ref="candies-holding-parent">
      <div ref="candies-holding-box" class="relative candies-holding-box">
        <div class="d-flex col-flex f-auto-center candies-holding-container">
          <p class="candies-holding-title">Total holding</p>
          <p class="TTFontBolder candies-holding-value-box">
            <span class="inline-block candies-holding-symbol">$</span>
            <count-up class="inline-block candies-holding-value" :startVal="0" :decimals="4" :endVal="holdingValue" :duration="1000" :isReady="holdingValue !== null"></count-up>
          </p>
          <el-tooltip effect="dark" content="Coming soon" placement="left" :hide-after="2000">
            <span class="inline-block line-height-0 nav-withdraw-icon">
              <svg>
                <use xlink:href="#icon-withdraw"/>
              </svg>
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <asset-sort-bar
      v-if="loading || assets.total"
      :sortItems="sortItems"
      :total="assets.total"
      :scrollHeight="100"
      :topHeight="44"
      @sort="sortChange"
      @order="orderChange"/>
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
            <lordless-btn class="TTFontBolder children-none-data-btn" theme="blue" inverse shadow @click="$router.push('/taverns')">Buy a tavern</lordless-btn>
          </div>
        </div>
      </div>
      <div v-else-if="!loading && assets.total" class="v-flex d-flex col-flex mobile-candies-container">
        <div class="v-flex candies-main-cnt">
          <ul class="candies-list">
            <li
              class="candies-item"
              v-for="(asset, index) of [].concat(assets.list, assets.list)" :key="index">
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

import AssetSortBar from '@/components/reuse/_mobile/sortBar'
import MobileAssetCard from '@/components/reuse/_mobile/card/asset'
import { getUserAssets } from 'api'

import { addClass, removeClass } from 'utils/tool'

import { mapState } from 'vuex'

export default {
  name: 'mobile-candies-content',
  data: () => {
    return {
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
      this.loading = true
      const res = await getUserAssets()
      if (res.code === 1000 && res.data) {
        this.reSortAssets({}, res.data)
        this.holdingValue = res.data.totalValue
        console.log('------ ', res.data.totalValue)
      }
      this.loading = false
    },
    scrollListener () {
      let navbarInverse = false
      const dom = this.$refs['candies-holding-box']
      const scrollMark = 100
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (!navbarInverse && scrollTop >= scrollMark) {
          addClass('is-fixed', dom)
          navbarInverse = true
        } else if (navbarInverse && scrollTop < scrollMark) {
          removeClass('is-fixed', dom)
          navbarInverse = false
        }
      }
      this.scrollFunc = func
      this.$nextTick(() => document.addEventListener('scroll', this.scrollFunc))
    },
    init () {
      this.getAssets()

      document.body.appendChild(this.$refs['candies-holding-box'])
      this.scrollListener()
    },
    destory () {
      this.scrollFunc && document.removeEventListener('scroll', this.scrollFunc)

      const parent = this.$refs['candies-holding-parent']
      parent && parent.appendChild(this.$refs['candies-holding-box'])
    }
  },
  beforeDestroy () {
    this.destory()
  },
  deactivated () {
    this.destory()
  },
  activated () {
    this.init()
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-candies-box {
    padding-top: 140px;
    margin-top: -52px;
    // padding-bottom: 35px;
    // box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 60px);
  }
  .candies-holding-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 140px;
    color: #fff;
    background-color: #0079FF;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    transition: all .3s ease-in-out, height 0s 0s;
    &.is-fixed {
      position: fixed;
      height: 44px;
      background-image: linear-gradient(-225deg, #0079FF 0%, #0079FF 100%);
      .candies-holding-container {
        padding-top: 0;
      }
      .candies-holding-title {
        display: none;
      }
      // .candies-holding-value-box {
      //   height: 28px;
      //   // line-height: 28px;
      // }
      .candies-holding-symbol {
        // font-size: 16px;
        // line-height: 28px;
        transform: translateY(0);
      }
      .candies-holding-value {
        font-size: 16px;
      }
    }
  }
  .candies-holding-container {
    padding-top: 10px;
    height: 100%;
  }
  .candies-holding-title {
    margin-bottom: 8px;
    font-size: 14px;
  }
  .candies-holding-symbol {
    font-size: 20px;
    transform: translateY(-15px);
    transition: all .3s ease-in-out;
  }
  .candies-holding-value {
    font-size: 36px;
    // transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-withdraw-icon {
    position: absolute;
    right: 20px;
    top: 15px;
    width: 20px;
    height: 20px;
    fill: #fff;
  }

  .candies-main-cnt {
    // margin-top: 10px;
    padding: 0 20px 35px;
    @include overflow();
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
