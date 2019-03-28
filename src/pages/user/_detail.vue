<template>
  <div class="d-flex col-flex ld-detail-user-box">
    <div class="ld-user-header">
      <div class="container md">
        <info-header
          :loading="!user"
          :user="user"
          :lord="overviews.tavernCount">
        </info-header>
        <!-- <div class="d-flex f-align-center">
          <div class="user-header-avatar">
            <lordless-blockies
              :scale="18"
              radius="20px"
              :seed="user.address"></lordless-blockies>
          </div>
          <div class="v-flex sm-col-reverse-flex user-header-cnt">
            <h2 class="d-flex f-align-center">
              <span class="header-crown-svg">
                <svg>
                  <use xlink:href="#icon-crown-red"/>
                </svg>
              </span>
              <span v-if="user.nickName">{{ user.nickName | sliceStr }}</span>
              <span v-else>{{ user.address | splitAddress({ before: 5, end: 2 }) }}</span>
              <span class="TTFontBolder user-level">Level {{ user.level }}</span>
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
            <p v-if="user.tags && user.tags.length" class="d-flex f-wrap f-align-center user-types">
              <span class="inline-block" v-for="(tag, index) of user.tags.slice(0, 20)" :key="index">{{ tag }}</span>
            </p>
          </div>
        </div> -->
      </div>
    </div>
    <div class="v-flex d-flex ld-user-content">
      <div class="v-flex container md">
        <div class="d-flex f-align-center sm-col-flex user-info-section info-cnt-one">
          <info-prestige
            class="v-flex"
            :loading="overviewLoading"
            :user="user"
            :overviews="overviews"/>
          <info-home
            class="v-flex"
            :loading="homeLoading"
            :home="userHome"/>
        </div>
        <info-task
          :loading="overviewLoading"
          :user="user"
          :overviews="overviews"
          @timeDown="getUserOverview"/>
        <!-- <info-assets
          :loading="overviewLoading"
          :user="user"
          :overviews="overviews"
          simple/> -->
        <!-- <div class="v-flex user-building-tabs" :class="{ 'margin': taverns.total }">
          <el-tabs
            v-model="ldbTab"
            @tab-click="chooseTab">
            <el-tab-pane
              label="All"
              name="all">
              <div
                v-if="!taverns.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-buildings">
                <svg>
                  <use xlink:href="#icon-no-ldb"/>
                </svg>
                <p>This have nothing on Tavern now.</p>
              </div>
              <div class="d-flex f-align-center building-sort">
                <div class="v-flex">{{ taverns.total }} Taverns</div>
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
                  v-for="(ldb, index) of taverns.list"
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
                v-if="!taverns.total && !loading"
                class="d-flex v-flex col-flex f-auto-center text-center no-asset-box user-no-sale-buildings">
                <svg>
                  <use xlink:href="#icon-no-selling-ldb"/>
                </svg>
                <p>There have nothing on sale now.</p>
              </div>
              <div class="d-flex f-align-center building-sort">
                <div class="v-flex">{{ taverns.total }} Taverns</div>
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
                  v-for="(ldb, index) of taverns.list"
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
            v-if="taverns.total"
            class="ld-building-pagination"
            :total="taverns.total"
            :size="taverns.ps"
            background
            @currentChange="pageChange">
          </Pagination>
        </div> -->
      </div>
    </div>
    <!-- <detail-dialog
      v-model="detailModel"
      theme="light"
      :ldbId="detailInfo._id"
      @close="dialogClose">
    </detail-dialog> -->
  </div>
</template>

<script>
import { getUserByAddress, getUserOverview } from 'api'
import { scrollTo } from 'utils/tool'

// import { historyState } from 'utils/tool'

import Clipboard from 'clipboard'

// import LdSelect from '@/components/stories/select'
// import SwitchInput from '@/components/stories/switchInput'
// import Pagination from '@/components/stories/pagination'
// import DetailDialog from '@/components/reuse/dialog/ldb/detail'
// import BuildingCard from '@/components/reuse/card/building'

import InfoHeader from '@/components/reuse/card/user/header'
import InfoPrestige from '@/components/reuse/card/user/prestige'
import InfoHome from '@/components/reuse/card/user/home'
import InfoTask from '@/components/reuse/card/user/task'
// import InfoAssets from '@/components/reuse/card/user/assets'
import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  data: () => {
    return {
      // loading: true,
      user: null,
      clipBool: false,

      homeLoading: true,

      overviewLoading: true,
      overviews: {
        pn: 1,
        ps: 4,
        completeTasks: {
          list: [],
          total: 0
        },
        activeness: {
          list: [],
          total: 0
        },
        lord: 0,
        currentTask: null
      }

      /**
       * taverns options
       */
      // taverns: {
      //   pn: 1,
      //   ps: 9,
      //   list: [],
      //   total: 0
      // },
      // ldbTab: 'all',

      // // sort model
      // ldbSort: 'influence',

      // // sort 列表选项
      // sortItems: [
      //   {
      //     value: 'influence',
      //     label: 'Most influential'
      //   }, {
      //     value: 'popular',
      //     label: 'Most popular'
      //   }
      // ],

      // // order model
      // ldbOrder: 'desc',

      // orderItems: [
      //   {
      //     value: 'desc',
      //     label: 'High to Low'
      //   }, {
      //     value: 'asc',
      //     label: 'Low to High'
      //   }
      // ],

      // detailModel: false,

      // // 选中的建筑
      // detailInfo: {}
    }
  },
  computed: {
    ...mapState('user', [
      'userHome'
    ])
  },
  components: {
    // DetailDialog,
    // BuildingCard,
    // Pagination,

    // SwitchInput,
    // LdSelect,

    InfoHeader,
    InfoPrestige,
    InfoHome,
    InfoTask
    // InfoAssets
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_HOME
    ]),

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

    init ({ address } = {}) {
      // this.loading = true
      this.getUserInfo({ address })
    },
    async getUserInfo ({ address = this.user.address } = {}) {
      const res = await getUserByAddress(address)
      this.loading = false
      if (res.code === 1000 && res.data) {
        this.user = res.data
        // this.getUserTaverns({ address: res.data._id })
        this.getUserHome({ user: res.data._id })
        this.getUserOverview({ user: res.data._id })
      } else {
        this.$router.push('/')
      }
      if (!res.data) console.log('用户不存在')
    },

    // 获取用户 home
    async getUserHome ({ user } = {}) {
      this.homeLoading = true
      await this[actionTypes.USER_SET_USER_HOME]()
      // if (res.code === 1000 && res.data) {
      //   this.userHome = res.data
      // }
      this.homeLoading = false
    },

    // 获取用户 overview 信息
    async getUserOverview ({ user } = {}) {
      this.overviewLoading = true
      const { pn, ps } = this.overviews
      const res = await getUserOverview({ user, pn, ps })
      if (res.code === 1000) {
        this.overviews = Object.assign({}, this.overviews, res.data)
      }
      this.overviewLoading = false
    }

    // async getUserTaverns ({ lord = this.user.address, isOnAuction = this.ldbTab === 'all' ? undefined : true, sort = this.ldbSort, order = this.ldbOrder, pn = this.taverns.pn, ps = this.taverns.ps } = {}) {
    //   const params = {
    //     lord,
    //     isOnAuction,
    //     pn,
    //     ps,
    //     sort,
    //     order
    //   }
    //   const res = await getChainLdbs(params)
    //   if (res.code === 1000 && res.data) {
    //     this.taverns = res.data
    //   }
    // },

    // pageChange (pn) {
    //   this.getUserTaverns({ pn })
    // },

    // chooseTab () {
    //   this.ldbSort = 'influence'
    //   this.ldbOrder = 'desc'
    //   console.log('----- user', this.user)
    //   this.$nextTick(() => {
    //     this.getUserTaverns()
    //   })
    // },

    // chooseLdb (item) {
    //   this.detailModel = true
    //   this.$nextTick(() => {
    //     this.detailInfo = item
    //     historyState(`/tavern/${item._id}`)
    //   })
    // },

    // sortChange (sort) {
    //   this.getUserTaverns({ sort })
    // },

    // orderChange (order) {
    //   this.getUserTaverns({ order })
    // },

    // dialogClose (info, list = this.taverns.list) {
    //   historyState(this.$route.path)
    //   for (let i = 0; i < list.length; i++) {
    //     if (list[i]._id === info._id) {
    //       list[i] = info
    //       break
    //     }
    //   }
    //   this.$set(this.taverns, 'list', list)
    //   this.$forceUpdate()
    // }
  },
  mounted () {
    scrollTo(0)
    const { address } = this.$route.params
    this.$nextTick(() => {
      this.init({ address: address.toLowerCase() })
      this.initClipboard()
    })
  }
}
</script>

<style lang="scss">

  @import '@/assets/stylus/reuse/single/user_detail.scss';

  .ld-detail-user-box {
    padding-top: 130px;
    padding-bottom: 50px;
    background-color: #f4f4f4;
    @include viewport-unit('min-height', 100vh);
  }
  // .user-header-cnt {
  //   color: #999;
  //   @include margin('left', 40px, -1);
  //   >h2 {
  //     color: #555;
  //     font-size: 18px;
  //   }
  //   >p {
  //     font-size: 16px;
  //     line-height: 1.6;
  //   }
  // }
  // .header-crown-svg {
  //   margin-right: 6px;
  //   width: 30px;
  //   height: 30px;
  // }
  // .paste-icon {
  //   width: 18px;
  //   height: 18px;
  //   stroke: #999;
  //   fill: none;
  //   cursor: pointer;
  //   @include margin('left', 8px, 1);
  // }
  // .user-level {
  //   // margin-top: 10px;
  //   margin-left: 15px;
  //   font-size: 18px;
  //   color: #999;
  //   // >span {
  //   //   font-size: 20px;
  //   // }
  // }
  // .user-types {
  //   margin-top: 4px;
  //   max-height: 62px;
  //   overflow: hidden;
  //   >span {
  //     margin-top: 6px;
  //     margin-right: 10px;
  //     font-size: 12px;
  //     padding: 3px 8px;
  //     border-radius: 20px;
  //     // border: 1px solid #BDB9FD;
  //     color: #fff;
  //     background-color: #bbb;
  //     box-sizing: border-box;
  //   }
  // }
  // .user-total-candy {
  //   margin-top: 10px;
  // }

  /**
   *  ld-user-content  -- begin
   */
  // .ld-user-content {
  //   @include margin('top', 65px, 1);
  //   /deep/ .el-tabs__header {
  //     margin: 0;
  //   }
  //   /deep/ .el-tabs__content {
  //     position: static;
  //     overflow: initial;
  //   }
  //   /deep/ .el-tabs__item {
  //     font-size: 18px;
  //     color: #999;
  //     &.is-active {
  //       color: inherit;
  //     }
  //   }
  // }

  // .user-building-tabs {
  //   position: relative;
  //   &.margin {
  //     @include margin('bottom', 100px, 1);
  //   }
  // }
  // .user-no-sale-buildings {
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
  // .building-item {
  //   @include margin('bottom', 60px, 1);
  //   >.ld-building-card {
  //     box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .1);
  //   }
  // }
  // .building-sort {
  //   margin-top: 35px;
  //   margin-bottom: 35px;
  //   color: #999;
  // }
  // .building-sort-select {
  //   margin-left: 20px;
  // }
  // .order-switch-input {
  //   display: inline-block;
  //   margin-left: 20px;
  // }

  // .ld-building-pagination {
  //   position: absolute;
  //   left: 0;
  //   bottom: -50px;
  // }
  /**
   *  ld-user-content  -- end
   */
</style>
