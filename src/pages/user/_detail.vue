<template>
  <div class="d-flex col-flex ld-user-box">
    <div class="ld-user-header">
      <div class="container md">
        <div class="d-flex f-align-center">
          <div class="user-header-avatar">
            <blockies
              :scale="18"
              radius="20px"
              :seed="user.address"></blockies>
          </div>
          <div class="v-flex sm-col-reverse-flex user-header-cnt">
            <h2 class="d-flex f-align-center">
              <span class="header-crown-svg">
                <svg>
                  <use xlink:href="#icon-crown-red"/>
                </svg>
              </span>
              <span v-if="user.nickName">{{ user.nickName }}</span>
              <span v-else>{{ user.address | splitAddress({ before: 5, end: 2 }) }}</span>
            </h2>
            <p class="d-flex f-align-center">
              <span id="detail-user-address" class="text-ellipsis">
                {{ user.address | splitAddress }}
              </span>
              <el-tooltip class="item" effect="dark" :content="clipBool ? 'Copied!' : 'Copy to clipboard'" placement="bottom-start">
                <span
                  id="copy-address"
                  class="inline-block line-height-1 paste-icon"
                  :data-clipboard-text="user.address"
                  @mouseleave="clipLeave">
                  <svg>
                    <use xlink:href="#icon-paste"/>
                  </svg>
                </span>
              </el-tooltip>
            </p>
            <div class="TTFontBolder user-level">
              Level <span>{{ user.level }}</span>
            </div>
            <!-- <div class="user-total-candy">
              <p>Total earned candy</p>
              <p>0.003 ETH</p>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="v-flex d-flex ld-user-content">
      <div class="v-flex d-flex container md">
        <div class="v-flex user-building-tabs" :class="{ 'margin': userLdbs.total }">
          <el-tabs
            v-model="ldbTab"
            @tab-click="chooseTab">
            <el-tab-pane
              label="All"
              name="all">
              <div
                v-if="!userLdbs.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-buildings">
                <svg>
                  <use xlink:href="#icon-no-ldb"/>
                </svg>
                <p>This have nothing on Tavern now.</p>
              </div>
              <div class="d-flex f-align-center building-sort">
                <div class="v-flex">{{ userLdbs.total }} Taverns</div>
                <div>
                  <span>Sort by</span>
                  <ld-select
                    class="building-sort-select"
                    v-model="ldbSort"
                    :items="sortItems"
                    @change="sortChange">
                  </ld-select>
                  <div class="order-switch-input">
                    <switch-input
                      v-model="ldbOrder"
                      :items="orderItems"
                      @change="orderChange">
                    </switch-input>
                  </div>
                </div>
              </div>
              <el-row :gutter="40" class="user-buildings-cnt">
                <el-col
                  :xs="24" :sm="8"
                  class="building-item"
                  v-for="(ldb, index) of userLdbs.list"
                  :key="index">
                  <building-card
                    :sale="ldb.chain.auction.isOnAuction"
                    :presale="ldb.chain.auction.isOnPreAuction"
                    :info="ldb"
                    @choose="chooseLdb">
                  </building-card>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane
              label="On sale"
              name="sale">
              <div
                v-if="!userLdbs.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-buildings">
                <svg>
                  <use xlink:href="#icon-no-selling-ldb"/>
                </svg>
                <p>There have nothing on sale now.</p>
              </div>
              <div class="d-flex f-align-center building-sort">
                <div class="v-flex">{{ userLdbs.total }} Taverns</div>
                <div>
                  <span>Sort by</span>
                  <ld-select
                    class="building-sort-select"
                    v-model="ldbSort"
                    :items="sortItems"
                    @change="sortChange">
                  </ld-select>
                  <div class="order-switch-input">
                    <switch-input
                      v-model="ldbOrder"
                      :items="orderItems"
                      @change="orderChange">
                    </switch-input>
                  </div>
                </div>
              </div>
              <el-row :gutter="40" class="user-buildings-cnt">
                <el-col
                  :xs="24" :sm="8"
                  class="building-item"
                  v-for="(ldb, index) of userLdbs.list"
                  :key="index">
                  <building-card
                    :sale="ldb.chain.auction.isOnAuction"
                    :info="ldb"
                    @choose="chooseLdb">
                  </building-card>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <Pagination
            v-if="userLdbs.total"
            class="ld-building-pagination"
            :total="userLdbs.total"
            :size="userLdbs.ps"
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
import { getUserByAddress, getChainLdbs } from 'api'

import { historyState } from 'utils/tool'

import Clipboard from 'clipboard'

import LdSelect from '@/components/stories/select'
import SwitchInput from '@/components/stories/switchInput'
import Pagination from '@/components/stories/pagination'
import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import BuildingCard from '@/components/reuse/card/building'
import Blockies from '@/components/stories/blockies'
export default {
  data: () => {
    return {
      loading: false,
      user: {},
      clipBool: false,
      userLdbs: {
        pn: 1,
        ps: 9,
        list: [],
        total: 0
      },
      ldbTab: 'all',

      // sort model
      ldbSort: 'influence',

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

      detailModel: false,

      // 选中的建筑
      detailInfo: {}
    }
  },
  components: {
    DetailDialog,
    BuildingCard,
    Blockies,
    Pagination,
    SwitchInput,
    LdSelect
  },
  methods: {

    init ({ address } = {}) {
      this.loading = true
      this.getUserInfo({ address })
    },
    async getUserInfo ({ address = this.user.address } = {}) {
      const res = await getUserByAddress(address)
      this.loading = false
      if (res.code === 1000 && res.data) {
        this.user = res.data
        this.getUserLdbs({ address: res.data.address })
      } else {
        this.$router.push('/')
      }
      if (!res.data) console.log('用户不存在')
    },
    async getUserLdbs ({ address = this.user.address, isOnAuction = this.ldbTab === 'all' ? undefined : true, sort = this.ldbSort, order = this.ldbOrder, pn = this.userLdbs.pn, ps = this.userLdbs.ps } = {}) {
      const params = {
        user: address,
        isOnAuction,
        pn,
        ps,
        sort,
        order
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.userLdbs = res.data
      }
    },

    pageChange (pn) {
      this.getUserLdbs({ pn })
    },
    // 初始化 黏贴板
    initClipboard () {
      const clip = new Clipboard('#copy-address')
      clip.on('success', (e) => {
        this.clipBool = true
        e.clearSelection()
      })
    },
    clipLeave () {
      this.clipBool = false
    },

    chooseTab () {
      this.ldbSort = 'influence'
      this.ldbOrder = 'desc'
      console.log('----- user', this.user)
      this.$nextTick(() => {
        this.getUserLdbs()
      })
    },

    chooseLdb (item) {
      this.detailModel = true
      this.$nextTick(() => {
        this.detailInfo = item
        historyState(`/tavern/${item._id}`)
      })
    },

    sortChange (sort) {
      this.getUserLdbs({ sort })
    },

    orderChange (order) {
      this.getUserLdbs({ order })
    },

    dialogClose (info, list = this.userLdbs.list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id === info._id) {
          list[i] = info
          break
        }
      }
      this.$set(this.userLdbs, 'list', list)
    }
  },
  mounted () {
    document.documentElement.scrollTop = 0
    const { address } = this.$route.params
    this.$nextTick(() => {
      this.init({ address: address.toLowerCase() })
      this.initClipboard()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ld-user-box {
    padding-top: 130px;
    @include viewport-unit('min-height', 100vh, 80px);
  }
  .user-header-cnt {
    color: #999;
    @include margin('left', 40px, -1);
    >h2 {
      color: #555;
      font-size: 18px;
    }
    >p {
      font-size: 16px;
      line-height: 1.6;
    }
  }
  .header-crown-svg {
    margin-right: 6px;
    width: 30px;
    height: 30px;
  }
  .paste-icon {
    width: 18px;
    height: 18px;
    stroke: #999;
    fill: none;
    cursor: pointer;
    @include margin('left', 8px, 1);
  }
  .user-level {
    margin-top: 10px;
    font-size: 20px;
    color: #555;
    // >span {
    //   font-size: 20px;
    // }
  }
  .user-total-candy {
    margin-top: 10px;
  }

  /**
   *  ld-user-content  -- begin
   */
  .ld-user-content {
    @include margin('top', 65px, 1);
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

  .user-building-tabs {
    position: relative;
    &.margin {
      @include margin('bottom', 100px, 1);
    }
  }
  .user-no-sale-buildings {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .building-item {
    @include margin('bottom', 60px, 1);
    >.ld-building-card {
      box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
    }
  }
  .building-sort {
    margin-top: 35px;
    margin-bottom: 35px;
    color: #999;
  }
  .building-sort-select {
    margin-left: 20px;
  }
  .order-switch-input {
    display: inline-block;
    margin-left: 20px;
  }

  .ld-building-pagination {
    position: absolute;
    left: 0;
    bottom: -50px;
  }
  /**
   *  ld-user-content  -- end
   */
</style>
