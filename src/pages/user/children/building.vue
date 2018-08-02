<template>
  <div class="d-flex TTFontBold user-building-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="text-cap user-building-title">LDB</h1>
      <div
        v-if="!buildings.length && !saleBuildings.length"
        class="d-flex v-flex col-flex f-auto-center text-center building-no-asset">
        <svg>
          <use xlink:href="/static/svg/icon.svg#icon-dropbox"/>
        </svg>
        <p>You have no building now.</p>
        <div class="d-flex f-auto-center TTFontBolder">
          <span>Try to buy a LDB in</span>
          <span class="inline-block">
            <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow>Marketplace</ld-btn>
          </span>
        </div>
      </div>
      <div
        v-if="buildings.length || saleBuildings.length"
        class="v-flex user-candy-tabs">
        <el-tabs
          v-model="buildingTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="All"
            name="all">
            <div class="building-sort">
              <span>Sort by</span>
              <el-select
                class="building-sort-select"
                popper-class="building-sort-options"
                v-model="buildingSort"
                @change="changeSort">
                <el-option
                  v-for="sort in sortItems"
                  :key="sort.value"
                  :label="sort.label"
                  :value="sort.value">
                </el-option>
              </el-select>
            </div>
            <el-row :gutter="20" class="user-buildings-cnt">
              <el-col
                :xs="24" :sm="12" :lg="8"
                class="building-item"
                v-for="(building, index) of buildings"
                :key="index">
                <building-card
                  :sale="building.chainSystem.sellStatus !== 0"
                  :ldbInfo="building"
                  @choose="chooseBuilding">
                </building-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane
            label="For sale"
            name="sale">
            <el-row :gutter="20" class="user-buildings-cnt">
              <el-col
                :xs="24" :sm="12" :lg="8"
                class="building-item"
                v-for="(building, index) of saleBuildings"
                :key="index">
                <building-card
                  :sale="building.chainSystem.sellStatus !== 0"
                  :ldbInfo="building"
                  @choose="chooseBuilding">
                </building-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <Pagination
          class="ld-building-pagination"
          :total="pageTotal"
          background
          @currentChange="pageChange">
        </Pagination>
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
import DetailDialog from '@/components/reuse/ldb/detailDialog'
import BuildingCard from '@/components/reuse/ldb/building'
import Pagination from '@/components/stories/pagination'
import LdBtn from '@/components/stories/button'

import { historyState } from 'utils/tool'

import { getChainLdbs } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

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
          label: 'Influence'
        }, {
          value: 'newest',
          label: 'Newest'
        }
      ],

      // sort model
      buildingSort: 'influence',

      // 用户全部的建筑
      buildings: [],
      // 建筑总数
      bTotal: 0,

      /**
       * sort building options
       */

      // 用户出售的建筑
      saleBuildings: [],
      // sale 建筑总数
      saleBTotal: 0
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    pageTotal () {
      if (this.buildingTab === 'all') {
        return this.bTotal
      }
      return this.saleBTotal
    }
  },
  components: {
    DetailDialog,
    BuildingCard,
    Pagination,
    LdBtn
  },
  methods: {
    chooseTab () {
      if (this.currentTab === this.buildingTab) return
      this.currentTab = this.buildingTab

      this.loading = true
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

    async getAllBuilding ({ address = this.userInfo.address, sort = this.buildingSort, page = 1, offset = 10 } = {}) {
      const params = {
        page,
        offset,
        sort,
        user: address
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.buildings = list
        this.bTotal = total
      }
      this.loading = false
    },

    async getSaleBuilding ({ address = this.userInfo.address, page = 1, offset = 10 } = {}) {
      const params = {
        page,
        offset,
        user: address,
        sellStatus: 1
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.saleBuildings = [].concat(list, list)
        this.saleBTotal = total
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
        historyState(`/ldb/${item._id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
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
  @import '@/assets/stylus/mixin/index.scss';
  .user-building-box {
    font-size: 16px;
    @include padding(-1, 30px, 1);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
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

  .user-building-title {
    font-size: 36px;
    color: #999;
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
      width: 120px;
      height: 34px;
      line-height: 34px;
      font-size: 16px;
      color: #fff;
      background-color: #4586FC;
      border-radius: 20px;
      border: none;
    }
  }

  /**
   *  building-no-asset  --- begin
   */

  .building-no-asset {
    color: #777777;
    fill: #777777;
    font-size: 16px;
    >svg {
      width: 180px;
      height: 180px;
    }
    >p {
      margin-top: 15px;
      color: #bbb;
      font-size: 24px;
    }
    >div {
      margin-top: 25px;
    }
  }
  .no-asset-btn {
    margin: 0 15px;
    padding: 10px 16px;
    font-size: 16px;
    color: #4E47D3;
    border-radius: 5px;
  }

  /**
   *  building-no-asset  --- end
   */

   .user-candy-tabs {
    position: relative;
    @include margin('top', 35px, 1);
    @include margin('bottom', 150px, 1);
  }
  .building-item {
    @include margin('top', 60px, 1);
  }
</style>
