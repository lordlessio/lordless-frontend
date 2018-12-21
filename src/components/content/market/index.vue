<template>
  <div class="ld-market">
    <div class="d-flex col-flex page-container market-container md">
      <section class="text-center market-header">
        <h1>Marketplace</h1>
        <p>Marketplace is an easy, convenient way to buy and sell your Tavern.<br>
          <span>
            You can list Taverns in the marketplace to reach thousands of people<br>
            in LORDLESS and find unique Taverns for sale.
          </span>
        </p>
      </section>
      <section id="market-sort-bar" class="alone-layer lg-d-flex f-align-center market-sort-bar">
        <p class="lg-v-flex sm-text-left sm-mar-b4">Total {{ ldbs.total }} Taverns on sale</p>
        <div class="d-flex f-align-center">
          <span>Sort <span class="sm-hidden">by</span></span>
          <ld-select
            class="market-sort-select"
            v-model="ldbSort"
            :items="sortItems"
            @change="sortChange">
          </ld-select>
          <div class="market-switch-input">
            <switch-input
              class="sm-hidden"
              v-model="ldbOrder"
              :items="orderItems"
              @change="orderChange">
            </switch-input>
            <switch-input
              class="lg-hidden sm"
              v-model="ldbOrder"
              :items="smOrderItems"
              @change="orderChange">
            </switch-input>
          </div>
        </div>
      </section>
      <section class="d-flex col-flex v-flex market-ldbs-box">
        <el-row :gutter="20" v-if="ldbsLoading">
          <el-col
            v-for="item in 4" :key="item"
            :xs="12" :sm="6">
            <skeletion-building class="skeletion-building-item"/>
          </el-col>
        </el-row>
        <transition name="ld-hide-in-fade">
          <div
            v-if="!ldbs.total && !ldbsLoading"
            class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
            <svg>
              <use xlink:href="#icon-no-selling-ldb"/>
            </svg>
            <p>Market have no building now.</p>
            <div class="d-flex f-auto-center TTFontBolder">
              <span>See all Taverns in</span>
              <span class="inline-block">
                <lordless-btn
                  class="TTFontBolder no-asset-btn"
                  theme="default"
                  shadow
                  @click="$router.push('mapbox')">Map</lordless-btn>
              </span>
            </div>
          </div>
        </transition>
        <transition name="ld-hide-in-fade">
          <el-row v-show="ldbs.total && !ldbsLoading" :gutter="20" class="v-flex market-cnt-box">
            <el-col
              class="market-cnt-item"
              v-for="ldb of ldbs.list" :key="ldb._id"
              :xs="12" :sm="6">
              <building-card
                :sale="ldb.chain.auction.isOnAuction"
                :presale="ldb.chain.auction.isOnPreAuction"
                :info="ldb"
                @choose="openDetail">
              </building-card>
            </el-col>
          </el-row>
        </transition>
        <div class="market-pagination-box">
          <skeletion-pager v-if="ldbsLoading && !ldbs.total"/>
          <lordless-pagination
            v-if="ldbs.total"
            :scrollE="pageScrollE"
            :scrollOffset="150"
            class="market-pagination-pages"
            theme="blue"
            :total="ldbs.total"
            :currentPage="ldbs.pn"
            :size="ldbs.ps"
            background
            @currentChange="pageChange"/>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
import { scrollTo } from 'utils/tool'

import LdSelect from '@/components/stories/select'
import SwitchInput from '@/components/stories/switchInput'
import BuildingCard from '@/components/reuse/card/building'

import SkeletionBuilding from '@/components/skeletion/building'
import SkeletionPager from '@/components/skeletion/pagination'

export default {
  data: () => {
    return {
      // ldb 建筑列表
      ldbs: {
        pn: 1,
        ps: 12,
        list: [],
        total: 0
      },

      // loading options
      ldbsLoading: true,

      // sort model
      ldbSort: 'popular',

      // sort 列表选项
      sortItems: [
        {
          value: 'popular',
          label: 'Popularity'
        },
        {
          value: 'influence',
          label: 'Influential'
        }, {
          value: 'price',
          label: 'Price'
        }
      ],

      // order model
      ldbOrder: 'desc',

      orderItems: [
        {
          value: 'desc',
          label: 'High to Low'
        }, {
          value: 'asc',
          label: 'Low to High'
        }
      ],
      smOrderItems: [
        {
          value: 'desc',
          label: 'High'
        }, {
          value: 'asc',
          label: 'Low'
        }
      ]
    }
  },
  computed: {
    pageScrollE () {
      return document.getElementById('market-sort-bar')
    }
  },
  components: {
    LdSelect,
    SwitchInput,
    BuildingCard,

    // SkeletionList,
    SkeletionBuilding,
    SkeletionPager
  },
  methods: {

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$emit('openDetail', info)
    },

    /**
     * 改变列表信息
     */
    changeLdbs (info, list = this.ldbs.list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id === info._id) {
          list[i] = info
          break
        }
      }
      this.$set(this.ldbs, 'list', list)
      this.$forceUpdate()
    },

    /**
     * 获取 ldb 列表信息
     */
    async getLdbs ({ pn = this.ldbs.pn, ps = this.ldbs.ps, sort = this.ldbSort, order = this.ldbOrder } = {}) {
      this.ldbsLoading = true
      const params = {
        pn, ps, sort, order
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.ldbs = res.data
      }
      this.ldbsLoading = false
    },

    sortChange (sort) {
      this.getLdbs({ sort })
    },

    orderChange (order) {
      this.getLdbs({ order })
    },

    pageChange (page) {
      this.getLdbs({ pn: page })

      const path = `${this.$route.path}?page=${page}`
      this.$emit('path', path)
    }
  },
  watch: {
    detailModel (val) {
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!val) {
        window.history.pushState(null, null, this.$route.path)
      }
    }
  },
  mounted () {
    scrollTo(0)
    this.$nextTick(() => {
      const pn = parseInt(this.$route.query.page || 1)
      this.getLdbs({ pn })
    })
  }
}
</script>

<style lang="scss" scoped>

  .ld-market {
    background-color: #f8f8f8;
  }
  .market-container {
    // min-height: 100%;
    @include viewport-unit(min-height, 100vh, 80px);
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }

  /**
   *  market-header --- begin
   */
  .market-header {
    padding: 95px 0;
    >h1 {
      font-size: 48px;
    }
    >p {
      margin-top: 25px;
      font-size: 20px;
      color: #999;
    }
  }
  .market-sort-select {
    margin-left: 20px;
  }
  .market-switch-input {
    display: inline-block;
    margin-left: 20px;
  }
  /**
   *  market-header --- end
   */

  /**
   *  market-sort-bar --- begin
   */
  .market-sort-bar {
    padding: 30px 35px;
    color: #fff;
    border-radius: 5px;
    background-image: linear-gradient(45deg, #FF66A1, #FF9E7A);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    @include padding('left', 35px, 3, -2);
  }
  /**
   *  market-sort-bar --- begin
   */

  /*
   * skeletion style -- begin
   */
  .skeletion-building-item {
    margin-bottom: 50px;
  }
  /*
   * skeletion style -- end
   */

  /**
   *  market-ldbs-box --- begin
   */
  .market-ldbs-box {
    margin-top: 90px;
  }
  .market-cnt-item {
    margin-bottom: 50px;
    padding-left: 10px;
    padding-right: 10px;
    color: #fff;
    cursor: pointer;
  }
  .item-cards {
    position: relative;
    border-radius: 5px;
    > figcaption {
      position: relative;
      padding-top: 100%;
      border-radius: 5px;
      overflow: hidden;
    }
  }

  .auction-box {
    padding: 3px 10px;
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 20px;
    font-size: 14px;
    color: $--text-main-color;
    background-color: rgba(255, 255, 255, .4);
    >span {
      display: inline-block;
    }
  }
  .item-desc {
    margin-top: 12px;
    @include fontSize(18px, 1.2);
    >span {
      display: inline-block;
    }
    .crown-span {
      margin-right: 8px;
      display: inline-block;
      width: 23px;
      height: 18px;
    }
  }
  .item-desc-level {
    margin-left: 5px;
    width: 50px;
  }
  /**
   *  market-ldbs-box --- end
   */

  /*
   * market-pagination-box     --begin
   */
  .market-pagination-box {
    margin-top: 50px;
    margin-bottom: 60px;
  }
  .market-pagination-pages {

  }
  .market-pagination-switch {
    font-size: 18px;
    >span {
      margin-left: 30px;
      display: inline-block;
      cursor: pointer;
    }
  }
  /*
   * market-pagination-box     --end
   */
</style>
