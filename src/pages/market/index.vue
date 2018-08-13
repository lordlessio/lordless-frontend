<template>
  <div class="ld-market">
    <div class="d-flex col-flex page-container market-container md">
      <div class="d-flex f-align-center market-search-box">
        <span class="el-input__icon el-icon-search ld-auto-icon"></span>
        <span class="v-flex">
          <input class="lordless-input market-search-input" type="text" placeholder="搜索" v-model="marketSearch"/>
        </span>
      </div>
      <div class="d-flex col-flex v-flex market-bottom">
        <div
          v-if="!ldbs.length && ldbsLoading"
          class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
          <svg>
            <use xlink:href="/static/svg/user/building.svg#icon-no-selling-ldb"/>
          </svg>
          <p>Market have no building now.</p>
          <div class="d-flex f-auto-center TTFontBolder">
            <span>See all ldbs in</span>
            <span class="inline-block">
              <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('mapbox')">Map</ld-btn>
            </span>
          </div>
        </div>
        <el-row :gutter="40" v-if="!ldbsLoading">
          <!-- <el-col
            v-for="(item, index) of skeletionLdbs" :key="index"
            :sm="24" :md="8" :lg="6">
            <skeletion-list class="skeletion-item"></skeletion-list>
          </el-col> -->
        </el-row>
        <el-row :gutter="40" class="v-flex market-cnt-box" v-if="ldbs.length && ldbsLoading">
          <el-col
            class="market-cnt-item"
            v-for="ldb of ldbs" :key="ldb._id"
            :xs="24" :sm="12" :lg="8">
            <building-card
              :sale="ldb.chain.auction.isOnAuction"
              :ldbInfo="ldb"
              @choose="openDetail">
            </building-card>
            <!-- <div class="market-cnt-item" @click.stop="openDetail(item)">
              <figure class="item-cards">
                <figcaption>
                  <img-box absolute :src="item.ldbIcon.sourceUrl" type="span"></img-box>
                </figcaption>
                <div class="d-inline-flex f-align-center auction-box">
                  <span class="icon-auction">
                    <svg>
                      <use xlink:href="static/svg/icon.svg#icon-auction"/>
                    </svg>
                  </span>
                  <span class="icon-sale-unit">
                    <svg>
                      <use xlink:href="static/svg/icon.svg#icon-sale-unit"/>
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
        <div class="market-pagination-box">
          <skeletion-pager v-if="!ldbsLoading"></skeletion-pager>
          <Pagination
            v-if="ldbs.length"
            class="market-pagination-pages"
            :total="total"
            background
            @currentChange="pageChange">
          </Pagination>
        </div>
      </div>
    </div>
    <detail-dialog
      v-model="detailModel"
      theme="light"
      :ldbId="detailInfo._id"
      @close="dialogClose">
    </detail-dialog>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
import { historyState } from 'utils/tool'

import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import ImgBox from '@/components/stories/image'
import Pagination from '@/components/stories/pagination'
import BuildingCard from '@/components/reuse/card/building'
import LdBtn from '@/components/stories/button'

// import SkeletionList from '@/components/skeletion/market_list'
import SkeletionPager from '@/components/skeletion/pagination'

export default {
  data: () => {
    return {
      // ldb 建筑列表
      ldbs: [],

      total: 0,

      // ldb dialog 显示控制
      detailModel: false,

      // ldb current detail Info
      detailInfo: {},

      // market search model
      marketSearch: '',

      // skeletion options
      // skeletionLdbs: [1, 2, 3, 4],

      // loading options
      ldbsLoading: true
    }
  },
  components: {
    LdBtn,
    BuildingCard,
    Pagination,
    ImgBox,
    DetailDialog,
    // SkeletionList,
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
        historyState(`/ldb/${info._id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
      historyState(this.$route.path)
    },

    /**
     * 获取 ldb 列表信息
     */
    async getLdbs ({ page = 1, offset = 9 } = {}) {
      this.ldbsLoading = false
      const params = {
        isOnAuction: true,
        page,
        offset
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.ldbs = list
        this.total = total
      }
      this.ldbsLoading = true
    },
    pageChange (e) {
      this.getLdbs({ page: e })
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
      this.getLdbs()
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
  }
  .market-bottom {
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }

  /*
   * skeletion style -- begin
   */
  // .skeletion-item {
  //   @include margin-around(0, 20px, 50px, 20px, 1.5);
  // }
  /*
   * skeletion style -- end
   */

  /*
   * market-search-box -- begin
   */
  .market-search-box {
    margin-bottom: 50px;
    border-bottom: 1px solid #C9C9C9;
    color: #C9C9C9;
    @include fontSize(18px, 1.5);
  }
  .market-search-input {
    color: $--text-main-color;
    border: none;
    @include padding('left', 15px, 1.5);
    &::placeholder {
      color: #C9C9C9;
    }
  }
  /*
   * market-search-box -- end
   */

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
    .icon-auction {
      margin-right: 4px;
      width: 15px;
      height: 15px;
      fill: $--main-color;
    }
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
