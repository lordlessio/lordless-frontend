<template>
  <div class="ld-market">
    <div class="page-container">
      <div class="d-flex f-align-center market-search-box">
        <span class="el-input__icon el-icon-search ld-auto-icon"></span>
        <span class="v-flex">
          <input class="lordless-input market-search-input" type="text" placeholder="搜索" v-model="marketSearch"/>
        </span>
      </div>
      <el-row :gutter="20" v-if="!ldbsLoading">
        <el-col
          v-for="(item, index) of skeletionLdbs" :key="index"
          :sm="12" :md="8" :lg="6"
          >
          <skeletion-list class="skeletion-item"></skeletion-list>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="market-cnt-box" v-if="ldbsLoading">
        <el-col
          v-for="item of ldbs" :key="item._id"
          :sm="12" :md="8" :lg="6">
          <div class="market-cnt-item" @click.stop="openDetail(item)">
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
                <span>{{ item.chainSystem.value }}</span>
              </div>
            </figure>
            <div class="d-flex f-align-center text-color-main item-desc">
              <span class="crown-span">
                <svg>
                  <use :xlink:href="`#icon-crown-l${item.levelSystem.level}`"/>
                </svg>
              </span>
              <span>{{ item.name.zh }}</span>
              <span class="item-desc-level text-color-secondary">· {{ item.levelSystem.level }}段</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="d-flex f-align-center market-pagination-box">
        <skeletion-pager v-if="!ldbsLoading"></skeletion-pager>
        <div
          v-if="ldbsLoading"
          class="v-flex market-pagination-pages">
          <el-pagination
            background
            layout="pager"
            :total="1000">
          </el-pagination>
        </div>
        <div
          v-if="ldbsLoading"
          class="market-pagination-switch">
          <span>上一页</span>
          <span>下一页</span>
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
import DetailDialog from '@/components/reuse/ldb/detailDialog'
import { historyState } from 'utils/tool'
import ImgBox from '@/components/stories/image'

import SkeletionList from '@/components/skeletion/market_list'
import SkeletionPager from '@/components/skeletion/pagination'

export default {
  data: () => {
    return {

      // ldb 建筑列表
      ldbs: [],

      // ldb dialog 显示控制
      detailModel: false,

      // ldb current detail Info
      detailInfo: {},

      // market search model
      marketSearch: '',

      // skeletion options
      skeletionLdbs: [1, 2, 3, 4, 5, 6, 7, 8, 9],

      // loading options
      ldbsLoading: true
    }
  },
  components: {
    ImgBox,
    DetailDialog,
    SkeletionList,
    SkeletionPager
  },
  methods: {

    // 根据 photos 获取 ldb cover image
    // ldbImage (photos) {
    //   if (objectType(photos)[0] !== 'array') return photos
    //   return decodeURIComponent(photos[0].split(',')[0])
    // },

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
    async getLdbs () {
      this.ldbsLoading = false
      const res = await getChainLdbs()
      if (res.code === 1000) {
        this.ldbs = res.data.list
      }
      this.ldbsLoading = true
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
  @import '@/assets/stylus/mixin/class_mixin.scss';
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .ld-market {

  }
  .market-cnt-box {

  }

  /*
   * skeletion style -- begin
   */
  .skeletion-item {
    @include margin-around(0, 20px, 50px, 20px, 1.5);
  }
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
    .icon-sale-unit {
      margin-right: 2px;
      width: 6px;
      height: 8px;
      line-height: 0;
    }
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
