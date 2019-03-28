<template>
  <div class="d-flex user-bc-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="d-flex f-align-baseline text-cap owner-children-title">
        <span class="v-flex">BC</span>
        <lordless-btn
          class="d-flex f-align-center user-withdraw-btn"
          theme="blue"
          shadow
          inverse
          @click="$router.push('/owner/bounty/package')">
          <svg>
            <use xlink:href="#icon-bounty-chests"/>
          </svg>
          <span>BountyChest</span>
        </lordless-btn>
      </h1>
      <div
        class="user-tabs-box">
        <el-tabs
          v-model="bcTab"
          @tab-click="switchTab">
          <el-tab-pane
            label="Balance"
            name="balance">
          </el-tab-pane>
          <el-tab-pane
            class="candy-tab-box"
            :class="{ 'cursor-no-drop': !userAssets.total }"
            :disabled="!userAssets.total"
            label="History"
            name="history">
          </el-tab-pane>
          <el-tab-pane
            class="candy-tab-box"
            label="BountyChests"
            name="bountyChests">
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="bcCurrentInfo.select" class="owner-children-sort-box bounty-chests-sort">
        <span>Filter by</span>
        <lordless-select
          class="owner-children-select bc-sort-select"
          v-model="bountyChestSort"
          :items="sortItems"
          @change="filterBountyChests"/>
      </div>
      <div class="v-flex d-flex">
        <transition name="ld-hide-fade" mode="out-in">
          <div v-if="loading" class="v-flex user-candy-skeletion skeletion-breath">
            <p></p>
            <div class="d-flex f-justify-around" v-for="item of [1,2]" :key="item">
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>
          <div
            v-else-if="!bcCurrentInfo.total && !loading"
            class="v-flex d-flex col-flex f-auto-center text-center no-asset-box absolute">
            <svg>
              <use :xlink:href="emptyInfo.icon"/>
            </svg>
            <p>{{ emptyInfo.desc }}</p>
            <div v-if="emptyInfo.chests">
              <lordless-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/owner/bountyPackage')">Bounty Package</lordless-btn>
            </div>
            <div
              v-else
              class="d-flex sm-col-flex f-auto-center TTFontBolder">
              <span>Apply a</span>
              <span class="inline-block sm-mar-t1">
                <lordless-btn class="no-asset-btn TTFontBolder" theme="default" shadow @click="$router.push('/taverns')">Task</lordless-btn>
              </span>
              <span class="sm-mar-t3">or buy a Tavern in</span>
              <span class="inline-block sm-mar-t1 sm-mar-b3">
                <lordless-btn class="no-asset-btn TTFontBolder" theme="default" shadow @click="$router.push('/taverns')">Taverns</lordless-btn>
              </span>
            </div>
          </div>
          <div v-else class="v-flex">
            <div v-if="bcTab === 'balance'" class="relative">
              <div class="d-flex f-align-center text-center candy-tabs-title">
                <el-col :span="5" :xs="8">Asset</el-col>
                <el-col :span="5" :xs="8">Quantity</el-col>
                <!-- <el-col :span="5">Valued by ETH(≈)</el-col> -->
                <el-col :span="6" :xs="0" class="sm-hidden">Price(≈)</el-col>
                <el-col :span="6" :xs="8">Total(≈)</el-col>
              </div>
              <div
                class="d-flex f-align-center text-center candy-balance-item candy-list-item"
                v-for="(asset, index) of bcCurrentInfo.list"
                :key="index">
                <el-col :span="5" :xs="8" class="d-flex f-auto-center candy-symbol">
                  <p class="d-flex f-align-end">
                    <span class="inline-block candy-coin-svg">
                      <svg>
                        <use :xlink:href="`#coin-${asset.candy.symbol.toLocaleLowerCase()}`"/>
                      </svg>
                    </span>
                    <span class="text-upper">{{ asset.candy.symbol }}</span>
                  </p>
                </el-col>
                <el-col :span="5" :xs="8">
                  <span>{{ asset.count | formatDecimal }}</span>
                  <span class="text-upper"> {{ asset.candy.symbol }}</span>
                </el-col>
                <el-col :span="6" :xs="0" class="sm-hidden">
                  <span>$</span>
                  <span> {{ 1 / asset.candy.USD2TokenCount | formatDecimal }}</span>
                </el-col>
                <el-col :span="6" :xs="8">
                  <span>$</span>
                  <span> {{ asset.count / asset.candy.USD2TokenCount | formatDecimal }}</span>
                </el-col>
              </div>
            </div>
            <div v-else-if="bcTab === 'history'" class="v-flex d-flex relative candy-rewards-box">
              <div class="v-flex">
                <div class="d-flex f-align-center text-center candy-tabs-title">
                  <el-col :span="aside.show ? 8 : 4" :xs="8">Asset</el-col>
                  <el-col :span="aside.show ? 8 : 6" :xs="8">Type</el-col>
                  <el-col v-if="!aside.show" :span="6" :xs="0">Date</el-col>
                  <el-col :span="aside.show ? 8 : 6" :xs="8">Quantity</el-col>
                </div>
                <div class="candy-reward-list">
                  <div
                    class="d-flex f-align-center text-center text-ellipsis candy-reward-item  candy-list-item"
                    :class="{ 'choose': rewardModels[record._id], 'drop': parseInt(record.status) === 1 }"
                    v-for="(record, index) of userRecords.list"
                    :key="index"
                    @click="chooseReward($event, record)">
                    <el-col :span="aside.show ? 8 : 4" :xs="8" class="d-flex f-auto-center candy-symbol">
                      <p class="d-flex f-align-end">
                        <span class="inline-block candy-coin-svg">
                          <svg>
                            <use :xlink:href="`#coin-${record.reward.candy.symbol.toLocaleLowerCase()}`"/>
                          </svg>
                        </span>
                        <span class="text-upper">{{ record.reward.candy.symbol }}</span>
                      </p>
                    </el-col>
                    <el-col :span="aside.show ? 8 : 6" :xs="8">
                      <span>{{ record.lord ? 'LORD' : 'Task' }}</span>
                      <span class="text-cap"> Reward</span>
                    </el-col>
                    <el-col v-if="!aside.show" :span="6" :xs="0">
                      <span>{{ record.update_at | dateFormat }}</span>
                    </el-col>
                    <el-col :span="aside.show ? 8 : 6" :xs="8" class="d-flex f-align-center candy-quantity">
                      <span class="line-height-0 candy-down-svg">
                        <svg>
                          <use xlink:href="#icon-download"/>
                        </svg>
                      </span>
                      <span class="TTFontBolder">+{{ record.lord ? record.lord.reward.count : record.executor.reward.count | formatDecimal }}</span>
                    </el-col>
                  </div>
                </div>
              </div>
              <candy-aside
                :loading="rewardLoading"
                :aside="aside"
                @close="initAside"/>
            </div>
            <div v-else class="v-flex relative candy-rewards-box">
              <ul class="d-flex f-wrap f-justify-between bounty-chests-cnt-box">
                <li v-for="(item, index) of bountyChests.list" :key="index"
                  class="bounty-chest-item">
                  <bounty-chest-card
                    class="cursor-pointer bounty-chest-card"
                    :info="item"
                    outer
                    @choose="chooseBountyChest"/>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <lordless-slider
        ref="bountySlideDialog"
        :visible.sync="bountyDetailModel"
        :showClose="false">
        <bounty-chest-detail
          isWebsite
          dialog
          :bountyId="bountyDetailId"/>
      </lordless-slider>
      <div
        v-if="bcCurrentInfo.pagination && bcCurrentInfo.total"
        class="owner-children-pagination">
        <lordless-pagination
          :scrollE="$el"
          :scrollPE="pageScrollPE"
          :total="bcCurrentInfo.total"
          :currentPage="bcCurrentInfo.pn"
          background
          @currentChange="pageChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import BountyChestDetail from '@/components/content/_mobile/bounty/detail'
import CandyAside from '@/components/reuse/owner/candy/aside.vue'
import BountyChestCard from '@/components/reuse/_mobile/card/bounty/chest'
import { getUserAssets, getUserCandyHistory, getTaskById, getBountiesByUser } from 'api'

import { mapState } from 'vuex'
import { publicMixins } from '@/mixins'
export default {
  name: 'website',
  mixins: [ publicMixins ],
  data: () => {
    return {
      loading: true,

      // 当前 tab 区域
      bcTab: 'balance',

      // 改变之前的 tab 区域
      currentTab: 'balance',

      candyLoading: true,

      // 用户账户信息
      userAssets: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0
      },

      // 用户交易记录信息
      userRecords: {
        pn: 1,
        ps: 10,
        list: [],
        total: 0
      },

      // 选中的交易记录
      rewardModels: {},

      rewardLoading: false,

      // 交易记录侧边栏参数
      aside: {
        show: false,
        data: null,
        lord: true
      },

      // bountyChests options
      bountyChests: {
        list: [],
        pn: 1,
        ps: 9,
        total: 0
      },
      bountyChestSort: 'all',
      sortItems: [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Wrapping',
          value: 'wrapping'
        },
        {
          label: 'Unopened',
          value: 'unopened'
        },
        {
          label: 'Opened',
          value: 'opened'
        },
        {
          label: 'Failed',
          value: 'failed'
        }
      ],

      // bounty detail slider options
      bountyDetailModel: false,
      bountyDetailId: null
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    showPagination () {
      return this.bcTab !== 'balance' && this.userRecords.total && !this.candyLoading
    },
    emptyInfo () {
      const _bcTab = this.bcTab
      const obj = {
        balance: {
          icon: '#icon-no-candy',
          desc: 'You have no candy now.'
        },
        history: {
          icon: '#icon-no-candy',
          desc: 'You have no candy now.'
        },
        bountyChests: {
          icon: '#icon-bounty-empty',
          desc: 'No related chests.',
          chests: true
        }
      }
      return obj[_bcTab]
    },
    bcCurrentInfo () {
      const _bcTab = this.bcTab
      const obj = {
        balance: {

        },
        history: {
          pagination: true
        },
        bountyChests: {
          select: true,
          pagination: true
        }
      }
      const datas = {
        balance: this.userAssets,
        history: this.userRecords,
        bountyChests: this.bountyChests
      }
      return Object.assign({}, obj[_bcTab], datas[_bcTab])
    },
    bcPaginationTotal () {
      const _bcTab = this.bcTab
      const obj = {
        history: this.userRecords.total,
        bountyChests: this.bountyChests.total
      }
      return obj[_bcTab]
    },
    pageScrollPE () {
      return document.getElementById('user-main-content')
    }
  },
  watch: {
    userInfo (val) {
      this.bcMethod()
    },
    currentTab (val) {
      if (val) {
        this.bcMethod()
      }
    }
  },
  components: {
    BountyChestDetail,
    CandyAside,
    BountyChestCard
  },
  methods: {

    chooseBountyChest (info) {
      this.bountyDetailId = info._id
      this.bountyDetailModel = true
      console.log('chooseBountyChest', info)
    },

    async bcMethod () {
      this.loading = true
      const _bcTab = this.bcTab
      const obj = {
        balance: this.getAssets,
        history: this.getRecords,
        bountyChests: this.getBountyChests
      }
      await obj[_bcTab](...arguments)
      this.loading = false
      return null
    },

    /**
     * 切换 tab
     */
    switchTab (evt) {
      if (this.currentTab === this.bcTab) return
      this.currentTab = this.bcTab
      this.initAside()
      // if (this.bcTab === 'balance') this.getAssets()
      // else if (this.bcTab === 'history') this.getRecords()
      // else this.getBountyChests()
    },

    /**
     * 查看糖果历史详情事件
     */
    async chooseReward (evt, data = {}) {
      const { _id } = data
      if (this.rewardModels[_id]) {
        this.initAside()
        return
      }
      this.rewardModels = {}
      this.rewardLoading = true
      this.$set(this.rewardModels, _id, true)
      this.$set(this.aside, 'show', true)
      const res = await getTaskById({ taskId: _id })
      if (res.code === 1000 && res.data) {
        this.$set(this.aside, 'data', res.data)
      }
      this.rewardLoading = false
      this.$set(this.aside, 'lord', !!data.lord)
    },

    /**
     * 初始化 candy aside
     */
    async initAside () {
      this.rewardModels = {}
      this.$set(this.aside, 'show', false)
      this.$set(this.aside, 'data', null)
    },

    /**
     * 按条件获取bounty chests
     */
    async filterBountyChests (type) {
      this.getBountyChests(type)
    },

    /**
     * 获取bounty chests
     */
    async getBountyChests ({ type = this.bountyChestSort, pn = this.bountyChests.pn, ps = this.bountyChests.ps } = {}) {
      this.loading = true
      try {
        const res = await getBountiesByUser({ pn, ps, type })
        if (res.code === 1000 && res.data) {
          this.bountyChests = res.data
        }
      } catch (err) {
      }
      this.loading = false
    },

    /**
     * 获取用户糖果账户
     */
    async getAssets () {
      if (this.bcTab !== 'balance') return
      this.candyLoading = true
      const res = await getUserAssets()
      if (res.code === 1000 && res.data) {
        this.userAssets = res.data
      }
      this.candyLoading = false
    },

    /**
     * 获取用户糖果获取历史
     */
    async getRecords ({ address = this.userInfo.address, pn = 1, ps = 10 } = {}) {
      if (this.bcTab !== 'history') return
      this.candyLoading = true
      const params = {
        pn,
        ps
      }
      const res = await getUserCandyHistory(params)
      if (res.code === 1000) {
        this.userRecords = res.data
      }
      this.candyLoading = false
    },

    pageChange (pn) {
      this.bcMethod({ pn })
      this.initAside()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bcMethod()
    })
  }
}
</script>

<style lang="scss" scoped>
  .user-bc-box {
    font-size: 16px;
    // @include padding(-1, 30px, 1);
    padding: 30px 30px 50px;
  }

  .user-withdraw-btn {
    padding: 10px 15px;
    font-size: 16px;
    >svg {
      margin-right: 8px;
      width: 22px;
      height: 22px;
    }
  }

  // user-candy-skeletion
  .user-candy-skeletion {
    // position: absolute;
    // width: 100%;
    // left: 0;
    // top: 70px;
    margin-top: 35px;
    >p {
      height: 25px;
      background-color: $--skeletion-light;
    }
    >div {
      margin-top: 15px;
      padding: 20px;
      background-color: $--skeletion-light;
      border-radius: 5px;
      >p {
        width: 150px;
        height: 25px;
        background-color: $--skeletion-dark;
      }
    }
  }

  .ld-candy-pagination {
    // position: absolute;
    // left: 0;
    // bottom: -70px;
    // margin-top: 50px;
    // margin-bottom: 50px;
  }

  // .user-candy-tabs {
  //   position: relative;
  //   @include margin('top', 35px, 1);
  //   @include margin('bottom', 120px, 1);
  // }

  .candy-tabs-title {
    margin-top: 25px;
    margin-bottom: 10;
    color:#bbb;
  }
  .candy-list-item {
    color: #999;
    .candy-symbol {
      color: #777;
      >p {
        margin-left: 15%;
        width: 90px;
      }
    }
  }

  .candy-balance-item {
    padding-top: 25px;
    padding-bottom: 25px;
    background-color: #fff;
    box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .1);
    border-radius: 5px;
    span {
      display: inline-block;
    }
    &:not(:first-of-type) {
      margin-top: 15px;
    }
  }
  .candy-coin-svg {
    margin-right: 10px;
    width: 24px;
    height: 24px;
  }
  .candy-down-svg {
    margin-right: 5px;
    margin-left: 35%;
    width: 20px;
    height: 20px;
  }
  .candy-reward-list {
    margin-top: 10px;
    box-shadow: 0px 5px 20px 2px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .candy-reward-item {
    padding-top: 25px;
    padding-bottom: 25px;
    background-color: #fff;
    cursor: pointer;
    @include padding('right', 10px, 1, -2);
    span {
      display: inline-block;
    }
    &:first-of-type {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    &:last-of-type {
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
    }
    &:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, .1);
    }
    &.choose {
      color: #fff;
      fill: #fff;
      background-image: linear-gradient(45deg, rgba(22, 34, 42, 1), rgba(58, 96, 115, 1));
      .candy-quantity {
        color: #fff;
        fill: #fff;
      }
      .candy-symbol {
        color: #fff;
      }

      // background-image: linear-gradient(45deg, #16222A, #3A6073);
    }
    &.drop {
      .candy-quantity {
        color: $--text-red-color;
        fill: $--text-red-color;
      }
    }
  }
  .candy-quantity {
    color: #4586FC;
    fill: #4586FC;
    .candy-down-svg {
      margin-right: 3px;
    }
  }

  // reward-aside-skeletion
  .reward-aside-skeletion {
    margin-left: 30px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px 20px 50px 40px;
    background-color: $--skeletion-light;
  }
  .aside-skeletion-container {
    border-radius: 5px;
    >h1 {
      width: 80px;
      height: 50px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 6px;
      width: 60px;
      height: 25px;
      border-radius: 5px;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-top: 10px;
      &.big {
        margin-top: 25px;
      }
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 120px;
          height: 20px;
        }
        &:nth-of-type(2) {
          margin-top: 6px;
          width: 120px;
          height: 25px;
        }
      }
      >h2 {
        margin-top: 10px;
        height: 30px;
        background-color: $--skeletion-dark;
      }
      >div {
        width: 30px;
        height: 30px;
        border-radius: 5px;
        background-color: $--skeletion-dark;
      }
    }
  }

  /**
   *  bounty-chests-sort  -- begin
   */
  // .bounty-chests-sort {
  //   margin-top: 30px;
  // }
  .bounty-chests-cnt-box {

  }
  // .bc-sort-select {
  //   margin-left: 12px;
  // }
  .bounty-chest-item {
    margin-top: 20px;
    width: 300px;
  }
  .bounty-chest-card {
    background-color: #fff;
  }
  /**
   *  bounty-chests-sort  -- end
   */
</style>
