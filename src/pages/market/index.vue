<template>
  <div class="ld-market">
    <div class="d-flex col-flex page-container market-container md">
      <!-- <div class="d-flex f-align-center market-search-box">
        <span class="el-input__icon el-icon-search ld-auto-icon"></span>
        <span class="v-flex">
          <input class="lordless-input market-search-input" type="text" placeholder="搜索" v-model="marketSearch"/>
        </span>
      </div> -->
      <section class="text-center market-header">
        <h1>Marketplace</h1>
        <p>Marketplace is an easy, convenient way to buy and sell your Tavern.<br>
          You can list Taverns in the marketplace to reach thousands of people<br>
          in LORDLESS and find unique Taverns for sale.
        </p>
      </section>
      <section class="lg-d-flex f-align-center market-sort-bar">
        <p class="lg-v-flex sm-text-left sm-mar-b4">Total {{ total }} Taverns on sale</p>
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
        <el-row :gutter="40" v-if="ldbsLoading">
          <el-col
            v-for="item of [1,2, 3]" :key="item"
            :xs="24" :sm="8">
            <skeletion-building class="skeletion-building-item"></skeletion-building>
          </el-col>
        </el-row>
        <transition name="ld-hide-in-fade">
          <div
            v-if="!ldbs.length && !ldbsLoading"
            class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
            <svg>
              <use xlink:href="#icon-no-selling-ldb"/>
            </svg>
            <p>Market have no building now.</p>
            <div class="d-flex f-auto-center TTFontBolder">
              <span>See all Taverns in</span>
              <span class="inline-block">
                <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('mapbox')">Map</ld-btn>
              </span>
            </div>
          </div>
        </transition>
        <transition name="ld-hide-in-fade">
          <el-row v-show="ldbs.length && !ldbsLoading" :gutter="40" class="v-flex market-cnt-box">
            <el-col
              class="market-cnt-item"
              v-for="ldb of ldbs" :key="ldb._id"
              :xs="24" :sm="8">
              <building-card
                :sale="ldb.chain.auction.isOnAuction"
                :presale="ldb.chain.auction.isOnPreAuction"
                :info="ldb"
                @choose="openDetail">
              </building-card>
              <!-- <div class="market-cnt-item" @click.stop="openDetail(item)">
                <figure class="item-cards">
                  <figcaption>
                    <img-box absolute :src="`${process.env.LDBICON_ORIGIN}${ldbInfo.ldbIcon.source.preview}`" type="span"></img-box>
                  </figcaption>
                  <div class="d-inline-flex f-align-center auction-box">
                    <span class="icon-auction">
                      <svg>
                        <use xlink:href="#icon-auction"/>
                      </svg>
                    </span>
                    <span class="icon-sale-unit">
                      <svg>
                        <use xlink:href="#icon-sale-unit"/>
                      </svg>
                    </span>
                    <span>{{ item.chain.auction.price }}</span>
                  </div>
                </figure>
                <div class="d-flex f-align-center text-color-main item-desc">
                  <span class="crown-span">
                    <svg>
                      <use :xlink:href="`#icon-crown-l${item.chain.level}`"/>
                    </svg>
                  </span>
                  <span class="text-ellipsis">{{ item.name.zh }}</span>
                  <span class="item-desc-level text-color-secondary">· {{ item.chain.level }}段</span>
                </div>
              </div> -->
            </el-col>
          </el-row>
        </transition>
        <div class="market-pagination-box">
          <skeletion-pager v-if="ldbsLoading && !ldbs.length"></skeletion-pager>
          <Pagination
            v-if="ldbs.length"
            class="market-pagination-pages"
            :total="total"
            :currentPage="paginationPage"
            background
            @currentChange="pageChange">
          </Pagination>
        </div>
      </section>
    </div>
    <detail-dialog
      v-model="detailModel"
      :ldbId="detailInfo._id"
      @close="dialogClose">
    </detail-dialog>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
import { historyState } from 'utils/tool'

import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import LdSelect from '@/components/stories/select'
import SwitchInput from '@/components/stories/switchInput'
import ImgBox from '@/components/stories/image'
import Pagination from '@/components/stories/pagination'
import BuildingCard from '@/components/reuse/card/building'
import LdBtn from '@/components/stories/button'

import SkeletionBuilding from '@/components/skeletion/building'
import SkeletionPager from '@/components/skeletion/pagination'

export default {
  data: () => {
    return {
      // ldb 建筑列表
      ldbs: [],

      total: 0,

      paginationPage: 1,

      marketPath: null,

      // ldb dialog 显示控制
      detailModel: false,

      // ldb current detail Info
      detailInfo: {},

      // market search model
      marketSearch: '',

      // loading options
      ldbsLoading: true,

      // sort model
      ldbSort: 'influence',

      // sort 列表选项
      sortItems: [
        {
          value: 'influence',
          label: 'Influential'
        }, {
          value: 'price',
          label: 'Price'
        }, {
          value: 'popular',
          label: 'Popularity'
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
  components: {
    LdSelect,
    SwitchInput,
    LdBtn,
    BuildingCard,
    Pagination,
    ImgBox,
    DetailDialog,

    // SkeletionList,
    SkeletionBuilding,
    SkeletionPager
  },
  methods: {

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.detailModel = true
      this.$nextTick(() => {
        this.detailInfo = info
        historyState(`/tavern/${info._id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
      historyState(this.marketPath || this.$route.path)
    },

    /**
     * 获取 ldb 列表信息
     */
    async getLdbs ({ page = 1, offset = 9, sort = this.ldbSort, order = this.ldbOrder } = {}) {
      this.ldbsLoading = true
      const params = {
        page,
        offset,
        sort,
        order
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.ldbs = list
        this.total = total
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
      this.getLdbs({ page })

      const path = `${this.$route.path}?page=${page}`
      this.marketPath = path
      historyState(path)
    }
  },
  watch: {
    detailModel (val) {
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!val) {
        window.history.pushState(null, null, this.$route.path)
      }
    },
    marketSearch (val) {
      const ldbs = this.$root.$children[0].ldbs
      if (val) {
        this.ldbs = ldbs.filter(item => item.name.zh.indexOf(val) !== -1)
      } else {
        this.ldbs = ldbs
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      const page = parseInt(this.$route.query.page || 1)
      this.paginationPage = page
      this.getLdbs({ page })
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-market {
    background-color: #f8f8f8;
  }
  .market-container {
    // min-height: 100%;
    @include viewport-unit(min-height, 100vh, 80px);
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  // .market-ldbs-box {
  //   @include padding('left', 20px, 1, -2);
  //   @include padding('right', 20px, 1, -2);
  // }

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

  /*
   * market-search-box -- begin
   */
  // .market-search-box {
  //   margin-bottom: 50px;
  //   border-bottom: 1px solid #C9C9C9;
  //   color: #C9C9C9;
  //   @include fontSize(18px, 1.5);
  // }
  // .market-search-input {
  //   color: $--text-main-color;
  //   border: none;
  //   @include padding('left', 15px, 1.5);
  //   &::placeholder {
  //     color: #C9C9C9;
  //   }
  // }
  /*
   * market-search-box -- end
   */

  /**
   *  market-ldbs-box --- begin
   */
  .market-ldbs-box {
    margin-top: 90px;
  }
  .market-cnt-item {
    color: #fff;
    cursor: pointer;
    @include margin('bottom', 50px, 1);
    @include padding('left', 10px, 1);
    @include padding('right', 10px, 1);
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
    color: $--text-main-color;
    background-color: rgba(255, 255, 255, .4);
    @include fontSize(14px, 1);
    >span {
      display: inline-block;
    }
    // .icon-auction {
    //   margin-right: 4px;
    //   width: 15px;
    //   height: 15px;
    //   fill: $--main-color;
    // }
    // .icon-sale-unit {
    //   margin-right: 2px;
    //   width: 6px;
    //   height: 8px;
    //   line-height: 0;
    // }
  }
  .item-desc {
    @include margin('top', 12px, 1);
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
    @include margin('top', 50px, 1);
    @include margin('bottom', 60px, 1);
  }
  .market-pagination-pages {

  }
  .market-pagination-switch {
    font-size: 18px;
    >span {
      @include margin('left', 30px, 1);
      display: inline-block;
      cursor: pointer;
    }
  }
  /*
   * market-pagination-box     --end
   */
</style>
