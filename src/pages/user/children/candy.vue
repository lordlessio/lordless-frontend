<template>
  <div class="d-flex user-candy-box">
    <div class="d-flex v-flex col-flex user-candy-container">
      <h1 class="d-flex f-align-baseline text-cap user-candy-title">
        <span class="v-flex">Candy</span>
        <el-tooltip class="item" effect="dark" content="Coming soon" placement="left">
          <span>
            <ld-btn
              class="d-flex f-align-center user-withdraw-btn"
              theme="deep-blue"
              disabled
              shadow
              inverse>
              <svg>
                <use xlink:href="#icon-withdraw"/>
              </svg>
              <span>Withdraw</span>
            </ld-btn>
          </span>
        </el-tooltip>
      </h1>
      <div
        v-if="!userAssets.length && !userRecords.total"
        class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
        <svg>
          <use xlink:href="#icon-no-candy"/>
        </svg>
        <p>You have no candy now.</p>
        <div class="d-flex f-auto-center TTFontBolder">
          <span>Apply a</span>
          <span class="inline-block">
            <ld-btn class="no-asset-btn TTFontBolder" theme="default" shadow @click="$router.push('/market')">Task</ld-btn>
          </span>
          <span>or buy a LDB in</span>
          <span class="inline-block">
            <ld-btn class="no-asset-btn TTFontBolder" theme="default" shadow @click="$router.push('/market')">Marketplace</ld-btn>
          </span>
        </div>
      </div>
      <div
        v-if="userAssets.length || userRecords.total"
        class="v-flex user-candy-tabs">
        <el-tabs
          v-model="candyTab"
          @tab-click="chooseTab">
          <el-tab-pane
            label="Balance"
            name="balance">
            <div class="d-flex f-align-center text-center candy-tabs-title">
              <el-col :span="5">Asset</el-col>
              <el-col :span="5">Quantity</el-col>
              <!-- <el-col :span="5">Valued by ETH(≈)</el-col> -->
              <el-col :span="6">Price(≈)</el-col>
              <el-col :span="6">Total(≈)</el-col>
            </div>
            <div
              class="d-flex f-align-center text-center candy-balance-item candy-list-item"
              v-for="(asset, index) of userAssets"
              :key="index">
              <el-col :span="5" class="d-flex f-auto-center candy-symbol">
                <span class="inline-block candy-coin-svg">
                  <!-- <svg>
                    <use xlink:href="#coin-eth"/>
                  </svg> -->
                  <img src="http://lordless.oss-cn-hongkong.aliyuncs.com/test/coin.svg"/>
                </span>
                <span class="text-upper">{{ asset.candy.symbol }}</span>
              </el-col>
              <el-col :span="5">
                <span>{{ asset.count | formatDecimal }}</span>
                <span class="text-upper"> {{ asset.candy.symbol }}</span>
              </el-col>
              <!-- <el-col :span="5">
                <span>{{ 1 / asset.candy.eth2TokenCount }}</span>
                <span class="text-upper"> ETH</span>
              </el-col> -->
              <el-col :span="6">
                <span>$</span>
                <span> {{ asset.candy.USD2TokenCount | formatDecimal }}</span>
              </el-col>
              <el-col :span="6">
                <span>$</span>
                <span> {{ asset.count * asset.candy.USD2TokenCount | formatDecimal }}</span>
              </el-col>
            </div>
          </el-tab-pane>
          <el-tab-pane
            class="d-flex candy-tab-box"
            :class="{ 'showAside': aside.show }"
            label="History"
            name="history">
            <div class="v-flex candy-rewards-box">
              <div class="d-flex f-align-center text-center candy-tabs-title">
                <el-col :span="4">Asset</el-col>
                <el-col :span="6">Type</el-col>
                <el-col :span="6">Date</el-col>
                <el-col :span="6">Quantity</el-col>
              </div>
              <div class="candy-reward-list">
                <div
                  class="d-flex f-align-center text-center text-ellipsis candy-reward-item  candy-list-item"
                  :class="{ 'choose': rewardModels[record._id], 'drop': parseInt(record.status) === 1 }"
                  v-for="(record, index) of userRecords.list"
                  :key="index"
                  @click="chooseReward($event, record)">
                  <el-col :span="4" class="d-flex f-auto-center candy-symbol">
                    <span class="inline-block candy-coin-svg">
                      <svg>
                        <use xlink:href="#coin-eth"/>
                      </svg>
                    </span>
                    <span class="text-upper">{{ record.reward.candy.symbol }}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>{{ record.lord ? 'LORD' : 'Task' }}</span>
                    <span class="text-cap"> Reward</span>
                  </el-col>
                  <el-col :span="6">
                    <span>{{ record.update_at | dateFormat }}</span>
                  </el-col>
                  <el-col :span="6" class="d-flex f-align-center candy-quantity">
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
            <div class="candy-reward-aside">
              <div v-if="aside.show && rewardLoading" class="reward-aside-skeletion">
                <h1></h1>
                <p></p>
                <div>
                  <p></p>
                  <p></p>
                </div>
                <div>
                  <p></p>
                  <p></p>
                </div>
                <div>
                  <p></p>
                  <p></p>
                </div>
                <div class="big">
                  <p></p>
                  <h2></h2>
                </div>
                <div class="big">
                  <p></p>
                  <p></p>
                </div>
                <div>
                  <p></p>
                  <p></p>
                </div>
                <div>
                  <p></p>
                  <div></div>
                </div>
              </div>
              <transition name="ld-hide-fade">
                <div v-if="!rewardLoading && aside.data && aside.show" class="reward-aside-container">
                  <h1>+{{ (aside.lord ? aside.data.lord.reward.count : aside.data.executor.reward.count) | formatDecimal }} <span class="text-upper">{{ aside.data.reward.candy.symbol }}</span></h1>
                  <ld-btn theme="green" inverse class="text-cap reward-aside-btn">{{ aside.lord ? 'LORD' : 'Task' }} Reward</ld-btn>
                  <ul class="candy-aside-ul candy--value">
                    <li>
                      <p>Valued by <span class="text-upper">ETH</span></p>
                      <p>0.000167 ETH</p>
                    </li>
                    <li>
                      <p>Valued by <span class="text-upper">USD</span></p>
                      <p>$ {{ (aside.lord ? aside.data.lord.reward.count : aside.data.executor.reward.count) / aside.data.reward.candy.USD2TokenCount | formatDecimal }}</p>
                    </li>
                    <li>
                      <p>Date</p>
                      <p>{{ aside.data.update_at | dateFormat }}</p>
                    </li>
                  </ul>
                  <ul class="candy-aside-ul candy-ldb-related">
                    <li>
                      <p>Related LDB</p>
                      <p class="aside-big-name">#{{ aside.data.ldb.info._id }}</p>
                    </li>
                    <li>
                      <p>Name</p>
                      <p>{{ aside.data.ldb.info.name.zh }}</p>
                    </li>
                    <li>
                      <p>Coordinate</p>
                      <p>{{ aside.data.ldb.info.chain.lng | transferCoords | sliceStr }}, {{ aside.data.ldb.info.chain.lat | transferCoords | sliceStr }}</p>
                    </li>
                    <li>
                      <p>LORD</p>
                      <p class="candy-aside-blockies">
                        <Blockies :seed="aside.data.ldb.lord" :scale="5" theme="light" radius="5px"></Blockies>
                      </p>
                    </li>
                  </ul>
                  <ul class="candy-aside-ul candy-task-related">
                    <li>
                      <p>Related Task</p>
                      <p class="aside-big-name">#{{ aside.data._id }}</p>
                    </li>
                    <li>
                      <p>Detail</p>
                      <p>{{ aside.data.ldbTaskType.name }}</p>
                    </li>
                    <li>
                      <p>Reward percentage</p>
                      <p>{{ (aside.lord ? aside.data.lord.reward.percentage : aside.data.executor.reward.percentage) * 100 }}%</p>
                    </li>
                    <li>
                      <p>Employee</p>
                      <p class="candy-aside-blockies">
                        <Blockies :seed="aside.lord ? aside.data.lord.info : aside.data.executor.info" :scale="5" theme="light" radius="5px"></Blockies>
                      </p>
                    </li>
                  </ul>
                </div>
              </transition>
            </div>
          </el-tab-pane>
        </el-tabs>
        <Pagination
          v-if="showPagination"
          class="ld-candy-pagination"
          :total="userRecords.total"
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

import { getUserAssets, getUserCandyHistory, getTaskById } from 'api'

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
      this.initAside()
      if (this.candyTab === 'balance') this.getAssets()
      else this.getRecords()
    },

    async chooseReward (evt, data) {
      const { _id } = data
      if (this.rewardModels[_id]) {
        this.initAside()
        return
      }
      this.rewardModels = {}
      this.rewardLoading = true
      const res = await getTaskById({ taskId: _id })
      if (res.code === 1000 && res.data) {
        this.$set(this.aside, 'data', res.data)
      }
      this.rewardLoading = false
      this.$set(this.rewardModels, _id, true)
      this.$set(this.aside, 'lord', !!data.lord)
      this.$set(this.aside, 'show', true)
    },

    async initAside () {
      this.rewardModels = {}
      this.$set(this.aside, 'show', false)
      this.$set(this.aside, 'data', null)
    },

    async getAssets () {
      if (this.candyTab !== 'balance') return
      const res = await getUserAssets()
      if (res.code === 1000) {
        this.userAssets = res.data
      }
    },

    async getRecords ({ address = this.userInfo.address, pn = 1, ps = 10 } = {}) {
      if (this.candyTab !== 'history') return
      const params = {
        pn,
        ps
      }
      const res = await getUserCandyHistory(params)
      if (res.code === 1000) {
        this.userRecords = res.data
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
    color: #bbb;
    @include margin('top', 25px, 1);
    @include margin('bottom', 10px, 1);
  }
  .candy-list-item {
    color: #999;
    .candy-symbol {
      color: #777;
    }
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
      @include margin('right', 3px, 1);
    }
  }

  // reward-aside-skeletion
  .reward-aside-skeletion {
    padding: 30px 20px 50px 40px;
    border-radius: 5px;
    background-color: $--skeletion-light;
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
      font-family: $--font-TTNormsMedium;
      font-weight: normal;
      font-size: 48px;
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
      .aside-big-name {
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
