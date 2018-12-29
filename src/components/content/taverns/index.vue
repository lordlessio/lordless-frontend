<template>
  <div class="ld-taverns">
    <div class="d-flex col-flex page-container taverns-container md">
      <section class="text-center taverns-header">
        <h1>Taverns</h1>
        <p>Tavern is a rare and specific digital asset in LORDLESS and it is an ERC-721 token. Most of the interactions in the virtual world are dependent on Tavern. Since the tavern is the most central and rare asset in LORDLESS, the official will issue a total of 4,000 taverns in multiple phases.</p>
      </section>
      <section id="taverns-sort-bar" class="alone-layer lg-d-flex f-align-center taverns-sort-bar">
        <p class="TTFontBolder lg-v-flex sm-text-left sm-mar-b4 taverns-sale-desc">Total {{ ldbs.total }} Taverns on sale</p>
        <div class="d-flex f-align-center">
          <span class="taverns-sort-by">Sort <span class="sm-hidden">by</span></span>
          <ld-select
            class="taverns-sort-select"
            v-model="ldbSort"
            :items="sortItems"
            @change="sortChange">
          </ld-select>
          <div class="taverns-switch-input">
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
      <section class="d-flex col-flex v-flex taverns-ldbs-box">
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
            <p>Taverns have no building now.</p>
            <div class="d-flex f-auto-center TTFontBolder">
              <span>See all Taverns in</span>
              <span class="inline-block">
                <lordless-btn
                  class="TTFontBolder no-asset-btn"
                  theme="default"
                  shadow
                  @click="$router.push('map')">Map</lordless-btn>
              </span>
            </div>
          </div>
        </transition>
        <transition name="ld-hide-in-fade">
          <el-row v-show="ldbs.total && !ldbsLoading" :gutter="20" class="v-flex taverns-cnt-box">
            <el-col
              class="taverns-cnt-item"
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
        <div class="taverns-pagination-box">
          <skeletion-pager v-if="ldbsLoading && !ldbs.total"/>
          <lordless-pagination
            v-if="ldbs.total"
            :scrollE="pageScrollE"
            :scrollOffset="150"
            class="taverns-pagination-pages"
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
      return document.getElementById('taverns-sort-bar')
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

  .ld-taverns {
    background-color: #f8f8f8;
  }
  .taverns-container {
    // min-height: 100%;
    @include viewport-unit(min-height, 100vh, 80px);
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }

  /**
   *  taverns-header --- begin
   */
  .taverns-header {
    margin: 0 auto;
    max-width: 610px;
    padding: 95px 0;
    >h1 {
      font-size: 48px;
      color: #0B2A48;
    }
    >p {
      margin-top: 24px;
      font-size: 18px;
      color: #777;
    }
  }
  .taverns-sort-select {
    margin-left: 20px;
  }
  .taverns-switch-input {
    display: inline-block;
    margin-left: 20px;
  }
  /**
   *  taverns-header --- end
   */

  /**
   *  taverns-sort-bar --- begin
   */
  .taverns-sort-bar {
    padding: 30px 35px;
    color: #fff;
    border-radius: 5px;
    background-image: linear-gradient(45deg, #FF66A1, #FF9E7A);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    @include padding('left', 35px, 3, -2);
  }
  .taverns-sale-desc {
    font-size: 20px;
  }
  .taverns-sort-by {
    font-size: 18px;
  }
  /**
   *  taverns-sort-bar --- begin
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
   *  taverns-ldbs-box --- begin
   */
  .taverns-ldbs-box {
    margin-top: 90px;
  }
  .taverns-cnt-item {
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
   *  taverns-ldbs-box --- end
   */

  /*
   * taverns-pagination-box     --begin
   */
  .taverns-pagination-box {
    margin-top: 50px;
    margin-bottom: 60px;
  }
  .taverns-pagination-pages {

  }
  .taverns-pagination-switch {
    font-size: 18px;
    >span {
      margin-left: 30px;
      display: inline-block;
      cursor: pointer;
    }
  }
  /*
   * taverns-pagination-box     --end
   */
</style>
