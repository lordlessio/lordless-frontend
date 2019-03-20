<template>
  <div class="d-flex user-building-box">
    <div class="v-flex d-flex col-flex user-candy-container">
      <h1 class="text-cap owner-children-title">Taverns</h1>
      <div
        class="user-tabs-box">
        <el-tabs
          v-model="buildingTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="All"
            name="all"/>
        </el-tabs>
      </div>
      <div class="owner-children-sort-box" v-if="loading || buildings.total">
        <span>Sort by</span>
        <ld-select
          class="owner-children-select building-sort-select"
          v-model="buildingSort"
          :items="sortItems"
          @change="changeSort"/>
      </div>
      <transition name="ld-hide-fade" mode="out-in">
        <el-row v-if="loading" class="mar-t3" :gutter="30">
          <el-col
            v-for="item of [1,2,3]" :key="item"
            :xs="24" :sm="8">
            <skeletion-building class="skeletion-building-item"/>
          </el-col>
        </el-row>
        <div
          v-else-if="!buildings.total && !loading"
          class="v-flex d-flex col-flex f-auto-center text-center no-asset-box">
          <svg>
            <use xlink:href="#icon-no-ldb"/>
          </svg>
          <p>You have no Tavern now.</p>
          <div class="d-flex f-auto-center TTFontBolder">
            <span>Try to buy a Tavern in</span>
            <span class="inline-block">
              <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/taverns')">Taverns</lordless-btn>
            </span>
          </div>
        </div>
        <div v-else>
          <el-row :gutter="30" class="user-buildings-cnt">
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
                @choose="chooseBuilding"/>
            </el-col>
          </el-row>
        </div>
      </transition>
      <div
        v-if="pageDatas.total"
        class="owner-children-pagination">
        <lordless-pagination
          :scrollE="$el"
          :scrollPE="pageScrollPE"
          :total="pageDatas.total"
          :size="pageDatas.ps"
          :currentPage="pageDatas.pn"
          background
          @currentChange="pageChange"/>
      </div>
      <!-- <el-tab-pane
        label="For sale"
        name="sale">
        <el-row class="mar-t3" :gutter="30" v-if="loading">
          <el-col
            v-for="item of [1,2]" :key="item"
            :xs="24" :sm="8">
            <skeletion-building class="skeletion-building-item"></skeletion-building>
          </el-col>
        </el-row>
        <transition name="ld-hide-in-fade">
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
        </transition>
        <transition name="ld-hide-in-fade">
          <el-row v-show="saleBuildings.total && !loading" :gutter="20" class="user-buildings-cnt">
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
      </el-tab-pane> -->
      <detail-dialog
        v-model="detailModel"
        theme="light"
        :ldbId="detailInfo._id"
        @close="dialogClose"/>
    </div>
  </div>
</template>

<script>
import SkeletionBuilding from '@/components/skeletion/building'

import LdSelect from '@/components/stories/select'
import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import BuildingCard from '@/components/reuse/card/building'

import { historyState } from 'utils/tool'

import { getChainLdbs } from 'api'
import { mapState } from 'vuex'
export default {
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
      }

      /**
       * sort building options
       */

      // 用户出售的建筑
      // saleBuildings: {
      //   list: [],
      //   total: 0,
      //   pn: 1,
      //   ps: 9
      // }
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
      const _buildingTab = this.buildingTab
      const obj = {
        all: this.buildings
        // sale: { total: this.saleBuildings.total, ps: this.saleBuildings.ps }
      }
      return obj[_buildingTab]
    }
  },
  watch: {
    userInfo (val) {
      this.tavernsMethod()
    }
  },
  components: {
    SkeletionBuilding,

    DetailDialog,
    BuildingCard,
    LdSelect
  },
  methods: {
    tavernsMethod () {
      const _buildingTab = this.buildingTab
      const obj = {
        all: this.getAllBuilding
        // sale: this.getSaleBuilding
      }
      return obj[_buildingTab](...arguments)
    },

    chooseTab () {
      if (this.currentTab === this.buildingTab) return
      this.currentTab = this.buildingTab

      this.tavernsMethod()
    },

    changeSort (e) {
      this.getAllBuilding({ sort: e })
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

    // async getSaleBuilding ({ lord = this.userInfo._id, pn = this.saleBuildings.pn, ps = this.saleBuildings.ps } = {}) {
    //   if (!lord) return
    //   this.loading = true
    //   const params = {
    //     pn,
    //     ps,
    //     lord,
    //     isOnAuction: true
    //   }
    //   const res = await getChainLdbs(params)
    //   if (res.code === 1000 && res.data) {
    //     this.saleBuildings = res.data
    //   }
    //   this.loading = false
    // },

    pageChange (e) {
      this.tavernsMethod({ page: e })
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
  mounted () {
    this.$nextTick(() => {
      this.tavernsMethod()
    })
  }
}
</script>

<style lang="scss" scoped>

  .user-building-box {
    // padding: 30px;
    font-size: 16px;
  }

  .skeletion-building-item {
    margin-bottom: 50px;
  }

  // .ld-building-pagination {
  //   margin-top: 50px;
  //   margin-bottom: 50px;
  //   // position: absolute;
  //   // left: 30px;
  //   // bottom: 0;
  //   // bottom: -100px;
  // }

  // .building-sort {
  //   margin-top: 30px;
  // }
  .building-sort-select {
    // margin-left: 10px;
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
    @include margin('top', 60px, 1);
  }
</style>
