<template>
  <div class="d-flex user-candy-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="d-flex f-align-baseline text-cap user-candy-title">
        <span class="v-flex">Candy</span>
        <el-tooltip class="item" effect="dark" content="Coming soon" placement="left">
          <span>
            <ld-btn
              class="d-flex f-align-center user-withdraw-btn"
              theme="info"
              disabled
              shadow
              inverse>
              <svg>
                <use xlink:href="/static/svg/user/candy.svg#icon-withdraw"/>
              </svg>
              <span>Withdraw</span>
            </ld-btn>
          </span>
        </el-tooltip>
      </h1>
      <div
        v-if="!userAssets.length && !userRecords.length"
        class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
        <svg>
          <use xlink:href="/static/svg/user/candy.svg#icon-no-candy"/>
        </svg>
        <p>You have no candy now.</p>
        <div class="d-flex f-auto-center TTFontBolder">
          <span>Apply a</span>
          <span class="inline-block">
            <ld-btn class="no-asset-btn TTFontBolder" theme="default" shadow>Task</ld-btn>
          </span>
          <span>or buy a LDB in</span>
          <span class="inline-block">
            <ld-btn class="no-asset-btn TTFontBolder" theme="default" shadow>Marketplace</ld-btn>
          </span>
        </div>
      </div>
      <div
        v-if="userAssets.length || userRecords.length"
        class="v-flex user-candy-tabs">
        <el-tabs
          v-model="candyTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Balance"
            name="balance">
            <div class="d-flex f-align-center text-center candy-tabs-title">
              <el-col :span="4">Asset</el-col>
              <el-col :span="4">Quantity</el-col>
              <el-col :span="5">Valued by ETH(≈)</el-col>
              <el-col :span="5">Price(≈)</el-col>
              <el-col :span="5">Total(≈)</el-col>
            </div>
            <div
              class="d-flex f-align-center text-center candy-balance-item"
              v-for="(asset, index) of userAssets"
              :key="index">
              <el-col :span="4" class="d-flex f-auto-center">
                <span class="inline-block candy-coin-svg">
                  <svg>
                    <use xlink:href="/static/svg/coin.svg#icon-ethereum"/>
                  </svg>
                </span>
                <span class="text-upper">{{ asset.candy.name }}</span>
              </el-col>
              <el-col :span="4">
                <span>{{ asset.count | formatDecimal }}</span>
                <span class="text-upper"> {{ asset.candy.name }}</span>
              </el-col>
              <el-col :span="5">
                <span>{{ 1 / asset.candy.eth2TokenCount }}</span>
                <span class="text-upper"> ETH</span>
              </el-col>
              <el-col :span="5">
                <span>$</span>
                <span> {{ 0.002 }}</span>
              </el-col>
              <el-col :span="5">
                <span>$</span>
                <span> {{ asset.count * 0.002 | formatDecimal }}</span>
              </el-col>
            </div>
          </el-tab-pane>
          <el-tab-pane
            class="d-flex candy-tab-box"
            :class="{ 'showAside': aside.show }"
            label="Transactions"
            name="transactions">
            <div class="v-flex candy-rewards-box">
              <div class="d-flex f-align-center text-center candy-tabs-title">
                <el-col :span="4">Asset</el-col>
                <el-col :span="6">Type</el-col>
                <el-col :span="6">Date</el-col>
                <el-col :span="6">Quantity</el-col>
              </div>
              <div class="candy-reward-list">
                <div
                  class="d-flex f-align-center text-center text-ellipsis candy-reward-item"
                  :class="{ 'choose': rewardModels[record._id], 'drop': parseInt(record.status) === 1 }"
                  v-for="(record, index) of userRecords"
                  :key="index"
                  @click="chooseReward($event, record)">
                  <el-col :span="4" class="d-flex f-auto-center">
                    <span class="inline-block candy-coin-svg">
                      <svg>
                        <use xlink:href="/static/svg/coin.svg#icon-ethereum"/>
                      </svg>
                    </span>
                    <span>{{ record.candy.name }}</span>
                  </el-col>
                  <el-col :span="6">
                    <span class="text-upper">{{ record.type }}</span>
                    <span class="text-cap"> Reward</span>
                  </el-col>
                  <el-col :span="6">
                    <span>{{ record.created_at | dateFormat }}</span>
                  </el-col>
                  <el-col :span="6" class="d-flex f-align-center candy-quantity">
                    <span class="line-height-0 candy-down-svg">
                      <svg>
                        <use :xlink:href="`/static/svg/icon.svg#${parseInt(record.status) === 1 ? 'icon-arrow-up' : 'icon-download'}`"/>
                      </svg>
                    </span>
                    <span>{{ record.count }}</span>
                  </el-col>
                </div>
              </div>
            </div>
            <div class="candy-reward-aside">
              <div class="reward-aside-container">
                <h1>+1.2 <span>ONOT</span></h1>
                <ld-btn theme="green" inverse class="text-cap reward-aside-btn">Task Reward</ld-btn>
                <ul class="candy-aside-ul candy--value">
                  <li>
                    <p>Valued by <span class="text-upper">ETH</span></p>
                    <p>0.000167 ETH</p>
                  </li>
                  <li>
                    <p>Valued by <span class="text-upper">USD</span></p>
                    <p>$ 0.000793</p>
                  </li>
                  <li>
                    <p>Date</p>
                    <p>{{ aside.data.date | dateFormat }}</p>
                  </li>
                </ul>
                <ul class="candy-aside-ul candy-ldb-related">
                  <li>
                    <p>Related LDB</p>
                    <h2>#87654</h2>
                  </li>
                  <li>
                    <p>Name</p>
                    <p>上海展览中心</p>
                  </li>
                  <li>
                    <p>Coordinate</p>
                    <p>121.451557, 31.225728</p>
                  </li>
                  <li>
                    <p>LORD</p>
                    <p class="candy-aside-blockies">
                      <Blockies :scale="5" radius="5px"></Blockies>
                    </p>
                  </li>
                </ul>
                <ul class="candy-aside-ul candy-task-related">
                  <li>
                    <p>Related Task</p>
                    <h2>#45687</h2>
                  </li>
                  <li>
                    <p>Detail</p>
                    <p>Follow the Twitter of @ONOT</p>
                  </li>
                  <li>
                    <p>Reward percentage</p>
                    <p>50%</p>
                  </li>
                  <li>
                    <p>Employee</p>
                    <p class="candy-aside-blockies">
                      <Blockies :scale="5" radius="5px"></Blockies>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <Pagination
          v-if="showPagination"
          class="ld-candy-pagination"
          :total="userRecordsTotal"
          background
          @currentChange="pageChange">
        </Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Blockies from '@/components/stories/blockies'
import LdBtn from '@/components/stories/button'
import Pagination from '@/components/stories/pagination'

import { getAssetsByAddress, getRecords } from 'api'

import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      // 当前 tab 区域
      candyTab: 'balance',

      // 改变之前的 tab 区域
      currentTab: 'balance',

      // 用户账户
      userAssets: [],

      // 用户交易记录
      userRecords: [],

      // 交易记录总数
      userRecordsTotal: 0,

      // 选中的交易记录
      rewardModels: {},

      // 交易记录侧边栏参数
      aside: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    showPagination () {
      return this.candyTab !== 'balance'
    }
  },
  components: {
    Blockies,
    LdBtn,
    Pagination
  },
  methods: {
    chooseTab (evt) {
      if (this.currentTab === this.candyTab) return
      this.currentTab = this.candyTab
      this.rewardModels = {}
      this.$set(this.aside, 'show', false)
      if (this.candyTab === 'balance') this.getAssets()
      else this.getRecords()
    },

    chooseReward (evt, data) {
      const { _id } = data
      if (this.rewardModels[_id]) {
        this.rewardModels = {}
        this.$set(this.aside, 'show', false)
        return
      }
      this.rewardModels = {}
      this.$set(this.rewardModels, _id, true)
      this.$set(this.aside, 'show', true)
      this.$set(this.aside, 'data', data)
    },

    async getAssets ({ address } = this.userInfo) {
      if (this.candyTab !== 'balance') return
      const res = await getAssetsByAddress(address)
      if (res.code === 1000) {
        this.userAssets = res.data
      }
    },

    async getRecords ({ address = this.userInfo.address, page = 1, offset = 10 } = {}) {
      if (this.candyTab !== 'transactions') return
      const params = {
        page,
        offset,
        user: address
      }
      const res = await getRecords(params)
      if (res.code === 1000) {
        this.userRecords = res.data.list
        this.userRecordsTotal = res.data.total
      }
    },

    pageChange (e) {
      this.getRecords({ page: e })
    }
  },
  watch: {
    userInfo (val) {
      if (this.candyTab === 'balance') {
        this.getAssets()
      } else {
        this.getRecords()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getAssets()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .user-candy-box {
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

  .user-candy-title {
    font-size: 36px;
    color: #999;
  }
  .user-withdraw-btn {
    padding: 10px 15px;
    font-size: 16px;
    >svg {
      margin-right: 5px;
      width: 25px;
      height: 25px;
    }
  }

  .ld-candy-pagination {
    position: absolute;
    left: 0;
    bottom: -70px;
  }

  .user-candy-tabs {
    position: relative;
    @include margin('top', 35px, 1);
    @include margin('bottom', 120px, 1);
  }

  .candy-tabs-title {
    color: #999;
    @include margin('top', 25px, 1);
    @include margin('bottom', 10px, 1);
  }

  .candy-balance-item {
    background-color: #fff;
    box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .1);
    border-radius: 5px;
    @include padding('top', 25px, 1);
    @include padding('bottom', 25px, 1);
    span {
      display: inline-block;
    }
    &:not(:first-of-type) {
      @include margin('top', 15px, 1);
    }
  }
  .candy-coin-svg {
    width: 25px;
    height: 25px;
    @include margin('right', 5px, 1);
  }
  .candy-down-svg {
    margin-right: 5px;
    margin-left: 35%;
    width: 20px;
    height: 20px;
  }
  .candy-reward-list {
    box-shadow: 0px 5px 20px 2px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  .candy-reward-item {
    background-color: #fff;
    cursor: pointer;
    @include padding('top', 25px, 1);
    @include padding('bottom', 25px, 1);
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
      @include margin('right', 3px, 1);
    }
  }

  // candy-reward-aside
  .candy-tab-box {
    &.showAside {
      .candy-reward-aside {
        padding-left: 30px;
        width: 350px;
        height: inherit;
        opacity: 1;
        visibility: visible;
      }
      .reward-aside-container {
        opacity: 1;
        visibility: visible;
        transition: all .3s .2s;
      }
    }
  }
  .candy-reward-aside {
    color: #fff;

    width: 0;
    height: 0;
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    transition: all .3s;
  }
  .reward-aside-container {
    padding: 30px 20px 50px 40px;
    border-radius: 5px;
    background-image: linear-gradient(45deg, rgba(22, 34, 42, 1), rgba(58, 96, 115, 1));

    opacity: 0;
    background-color: transparent;
    transition: all .3s;
    >h1 {
      font-size: 50px;
      >span {
        font-size: 28px;
      }
    }
  }
  .reward-aside-btn {
    padding: 4px 6px;
    font-size: 12px;
  }
  .candy-aside-ul {
    @include margin('top', 25px, 1);
    >li {
      font-size: 16px;
      @include margin('top', 10px, 1);
      >p {
        &:first-of-type {
          font-size: 14px;
        }
      }
      >h2 {
        font-size: 28px;
      }
    }
  }
  .candy-aside-blockies {
    width: 30px;
    height: 30px;
    @include margin('top', 6px, 1);
  }
</style>
