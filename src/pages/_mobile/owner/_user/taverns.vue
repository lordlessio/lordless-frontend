<template>
  <div class="d-flex user-building-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <!-- <h1 class="text-cap owner-children-title">Taverns</h1> -->
      <transition name="ld-hide-in-fade">
        <div
          v-if="!buildings.total && !saleBuildings.total && !loading"
          class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
          <svg>
            <use xlink:href="#icon-no-ldb"/>
          </svg>
          <p>You have no Tavern now.</p>
          <div class="d-flex f-auto-center TTFontBolder">
            <span>Try to buy a Tavern in</span>
            <span class="inline-block">
              <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/market')">Marketplace</lordless-btn>
            </span>
          </div>
        </div>
        <div
          v-else
          class="v-flex relative onwer-children-cnt user-building-tabs">
          <el-tabs
            v-model="buildingTab"
            @tab-click="chooseTab">
            <el-tab-pane
              label="All"
              name="all">
              <div class="building-sort">
                <span>Sort by</span>
                <ld-select
                  class="building-sort-select"
                  v-model="buildingSort"
                  :items="sortItems"
                  @change="changeSort">
                </ld-select>
              </div>
              <el-row class="mar-t3" :gutter="30" v-if="loading">
                <el-col
                  v-for="item of [1,2,3]" :key="item"
                  :xs="24" :sm="8">
                  <skeletion-building class="skeletion-building-item"></skeletion-building>
                </el-col>
              </el-row>
              <transition name="ld-hide-in-fade">
                <el-row v-if="buildings.total && !loading" :gutter="30" class="user-buildings-cnt">
                  <el-col
                    :xs="24" :sm="8"
                    class="building-item"
                    v-for="(building, index) of buildings.list"
                    :key="index">
                    <building-card
                      :sale="building.chain.auction.isOnAuction"
                      :presale="building.chain.auction.isOnPreAuction"
                      :info="building"
                      shadow
                      @choose="chooseBuilding">
                    </building-card>
                  </el-col>
                </el-row>
              </transition>
            </el-tab-pane>
            <el-tab-pane
              label="For sale"
              name="sale">
              <el-row class="mar-t3" :gutter="30" v-if="loading">
                <el-col
                  v-for="item of [1,2]" :key="item"
                  :xs="24" :sm="8">
                  <skeletion-building class="skeletion-building-item"></skeletion-building>
                </el-col>
              </el-row>
              <transition name="ld-hide-fade" mode="out-in">
                <div
                  v-if="!saleBuildings.total && !loading"
                  class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-buildings">
                  <svg>
                    <use xlink:href="#icon-no-selling-ldb"/>
                  </svg>
                  <p>You have nothing on sale now.</p>
                  <div class="d-flex f-auto-center TTFontBolder">
                    <span>Make the first selling transaction for your</span>
                    <span class="inline-block">
                      <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="buildingTab = 'all'">LDB</lordless-btn>
                    </span>
                  </div>
                </div>
                <el-row v-else :gutter="20" class="user-buildings-cnt">
                  <el-col
                    :xs="24" :sm="8"
                    class="building-item"
                    v-for="(sBuilding, index) of saleBuildings.list"
                    :key="index">
                    <building-card
                      :sale="sBuilding.chain.auction.isOnAuction"
                      :info="sBuilding"
                      shadow
                      @choose="chooseBuilding">
                    </building-card>
                  </el-col>
                </el-row>
              </transition>
            </el-tab-pane>
          </el-tabs>
          <lordless-pagination
            v-if="pageDatas.total"
            class="ld-building-pagination"
            :scrollE="$el"
            :scrollPE="pageScrollPE"
            :total="pageDatas.total"
            :size="pageDatas.ps"
            background
            @currentChange="pageChange"/>
        </div>
      </transition>
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
import SkeletionBuilding from '@/components/skeletion/_mobile/building'

import LdSelect from '@/components/stories/select'
import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import BuildingCard from '@/components/reuse/_mobile/card/building'

import { historyState } from 'utils/tool'

import { getChainLdbs } from 'api'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-taverns',
  data: () => {
    return {

      loading: true,

      // 当前 tab 区域
      buildingTab: 'all',

      // 改变之前的 tab 区域
      currentTab: 'all',

      // ldb 弹窗
      detailModel: false,

      // 选中的建筑
      detailInfo: {},

      /**
       * all building options
       */

      // sort 列表选项
      sortItems: [
        {
          value: 'influence',
          label: 'Most influential'
        }, {
          value: 'popular',
          label: 'Most popular'
        }
      ],

      // sort model
      buildingSort: 'influence',

      // 用户全部的建筑
      buildings: {
        list: [],
        total: 0,
        pn: 1,
        ps: 9
      },

      /**
       * sort building options
       */

      // 用户出售的建筑
      saleBuildings: {
        list: [],
        total: 0,
        pn: 1,
        ps: 9
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    pageScrollPE () {
      return document.getElementById('user-main-content')
    },
    pageDatas () {
      if (this.buildingTab === 'all') {
        return { total: this.buildings.total, ps: this.buildings.ps }
      }
      return { total: this.saleBuildings.total, ps: this.saleBuildings.ps }
    }
  },
  components: {
    SkeletionBuilding,

    DetailDialog,
    BuildingCard,
    LdSelect
  },
  methods: {
    chooseTab () {
      if (this.currentTab === this.buildingTab) return
      this.currentTab = this.buildingTab

      if (this.buildingTab === 'all') this.getAllBuilding()
      else this.getSaleBuilding()
    },

    changeSort (e) {
      const params = {
        page: 1,
        offset: 10,
        sort: e
      }
      this.getAllBuilding(params)
    },

    async getAllBuilding ({ lord = this.userInfo._id, sort = this.buildingSort, pn = this.buildings.pn, ps = this.buildings.ps } = {}) {
      if (!lord) return
      this.loading = true
      const params = {
        pn,
        ps,
        sort,
        lord
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.buildings = res.data
      }
      this.loading = false
    },

    async getSaleBuilding ({ lord = this.userInfo._id, pn = this.saleBuildings.pn, ps = this.saleBuildings.ps } = {}) {
      if (!lord) return
      this.loading = true
      const params = {
        pn,
        ps,
        lord,
        isOnAuction: true
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.saleBuildings = res.data
      }
      this.loading = false
    },

    pageChange (e) {
      if (this.buildingTab === 'all') {
        this.getAllBuilding({ page: e })
      } else {
        this.getSaleBuilding({ page: e })
      }
    },

    chooseBuilding (item) {
      this.detailModel = true
      this.$nextTick(() => {
        this.detailInfo = item
        historyState(`/tavern/${item._id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose (info) {
      historyState(this.$route.path)
    }
  },
  watch: {
    userInfo (val) {
      if (this.buildingTab === 'all') {
        this.getAllBuilding()
      } else {
        this.getSaleBuilding()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getAllBuilding()
    })
  }
}
</script>

<style lang="scss" scoped>

  .user-building-box {
    margin-top: 35px;
    font-size: 16px;
    @include padding(-1, 30px, 1);
    @include viewport-unit(min-height, 100vh);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      position: static;
      overflow: initial;
    }
    /deep/ .el-tabs__item {
      font-size: 18px;
      color: #999;
      &.is-active {
        color: inherit;
      }
    }
  }

  .skeletion-building-item {
    margin-bottom: 50px;
  }

  .ld-building-pagination {
    position: absolute;
    left: 0;
    bottom: -100px;
  }

  .building-sort {
    margin-top: 30px;
  }
  .building-sort-select {
    margin-left: 10px;
    /deep/ .el-input__inner {
      width: 160px;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      color: #fff;
      background-color: #4586FC;
      border-radius: 20px;
      border: none;
    }
    /deep/ .el-input {
      .el-select__caret {
        font-weight: bolder;
        color: #fff;
      }
    }
  }

  // .user-building-tabs {
  //   position: relative;
  //   @include margin('top', 35px, 1);
  //   @include margin('bottom', 150px, 1);
  // }
  .user-no-sale-buildings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .building-item {
    @include margin('top', 30px, 1);
  }
</style>
