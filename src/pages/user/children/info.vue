<template>
  <div class="user-info-box">
    <div class="user-info-container">
      <div class="user-info-section">
        <h2 class="info-cnt-title">Info Card</h2>
        <div v-if="overviewLoading" class="d-flex f-align-center info-header-skeletion">
          <div class="v-flex d-flex f-align-center">
            <p></p>
            <div class="v-flex">
              <p></p>
              <p></p>
            </div>
          </div>
          <div class="d-flex col-flex f-align-end text-right">
            <p></p>
            <p></p>
          </div>
        </div>
        <transition name="ld-hide-in-fade">
          <div v-show="!overviewLoading" class="d-flex f-align-center sm-col-flex user-info-header">
            <div class="user-avatar">
              <blockies
                theme="light"
                :scale="18"
                radius="20px"
                :seed="userInfo.address"></blockies>
            </div>
            <div class="v-flex d-flex lg-f-align-end sm-col-reverse-flex info-header-cnt">
              <div class="v-flex header-cnt-text">
                <h2 class="d-flex f-align-center">
                  <span class="header-crown-svg">
                    <svg>
                      <use xlink:href="#icon-crown-l5"/>
                    </svg>
                  </span>
                  <span v-if="userInfo.nickName">{{ userInfo.nickName }}</span>
                  <span v-else>{{ userInfo._id | splitAddress({ before: 4, end: 4 }) }}</span>
                  <span>
                    <ld-btn
                      class="user-Authorize-btn"
                      :theme="isCrowdsaleApproved ? 'green' : 'red'"
                      inverse
                      @click="userAuthorize">
                      {{ isCrowdsaleApproved ? 'Authorized' : 'Unauthorized' }}
                    </ld-btn>
                  </span>
                </h2>
                <p class="d-flex f-align-center">
                  <span id="user-address" class="text-ellipsis">
                    {{ userInfo.address }}
                  </span>
                  <el-tooltip class="item" effect="dark" :content="clipBool ? 'Copied!' : 'Copy to clipboard'" placement="bottom-start">
                    <span
                      id="copy-address"
                      class="inline-block line-height-1 paste-icon"
                      data-clipboard-target="#user-address"
                      @mouseleave="clipLeave">
                      <svg>
                        <use xlink:href="#icon-paste"/>
                      </svg>
                    </span>
                  </el-tooltip>
                </p>
                <p class="user-eamil">{{ userInfo.email }}</p>
              </div>
              <div class="lg-text-right header-cnt-balance sm-hidden">
                <p>ETH Balance in wallet</p>
                <p class="eth-balance">{{ balance | weiToEth }} ETH</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="d-flex f-align-center sm-col-flex user-info-section info-cnt-one">
        <div class="v-flex info-item-container info-prestige-section">
          <h2 class="info-cnt-title">Prestige Value</h2>
          <div v-if="overviewLoading" class="d-flex f-align-center info-prestige-skeletion">
            <div class="v-flex prestige-level-skeletion">
              <p></p>
              <p></p>
              <p></p>
            </div>
            <div class="d-flex row-flex prestige-ac-skeletion">
              <p></p>
              <p></p>
            </div>
          </div>
          <transition name="ld-hide-in-fade">
            <div v-show="!overviewLoading" class="d-flex f-align-center info-cnt-box info-prestige-box">
              <div class="v-flex exp-progress-box">
                <div class="d-flex f-align-end exp-progress-top">
                  <span class="v-flex text-left">LEVEL {{ userInfo.level }}</span>
                  <span class="exp-text-progress">
                    <span class="exp-current">{{ userInfo.activeness }}</span>
                    <span>&nbsp;/&nbsp;</span>
                    <span>{{ nextActiveness }}</span>
                  </span>
                </div>
                <div class="exp-progress">
                  <ld-progress
                    shadow
                    :current="userInfo.activeness"
                    :max="nextActiveness"
                    :gradient="progressOpts.exp.gradient">
                  </ld-progress>
                </div>
                <p class="exp-tip-text">You still need to earn {{ nextActiveness - userInfo.activeness }} to level up.</p>
              </div>
              <div class="exp-recived-box sm-hidden">
                <span
                  class="exp-recived-item"
                  v-for="(item, index) of overviews.activeness.list.slice(0, overviews.ps)"
                  :key="index"
                  :style="`color: rgba(78, 71, 211, ${1 - 0.25 * index});border-color: rgba(78, 71, 211, ${1 - 0.25 * index});z-index: ${-index};`">
                  +{{ item.activeness }}
                </span>
              </div>
            </div>
          </transition>
        </div>
        <div class="v-flex info-item-container info-home-section">
          <h2 class="info-cnt-title">Home</h2>
          <div v-if="overviewLoading" class="d-flex f-align-center info-home-skeletion">
            <p></p>
            <div class="v-flex">
              <p></p>
              <p></p>
              <p></p>
            </div>
          </div>
          <transition name="ld-hide-in-fade">
            <div v-show="!overviewLoading" class="d-flex f-align-center info-cnt-box info-home-box">
              <div class="info-home-poster">
                <svg v-if="!overviews.home">
                  <use xlink:href="#icon-help"/>
                </svg>
                <img v-else :src="`/static/img/ldb/ldb-level-${overviews.home.ldb.chain.popularity}.png`"/>
              </div>
              <div class="v-flex info-home-cnt">
                <div class="info-home-unknow" v-if="!overviews.home">
                  <p>You have no home now.</p>
                  <p>Set a home you will be located there when you login.</p>
                  <ld-btn class="user-info-btn" theme="blue" inverse shadow @click="$router.push('/lbs')">View map now</ld-btn>
                </div>
                <div class="info-home-know" v-if="overviews.home">
                  <p class="info-ldb-name">{{ overviews.home.ldb.name.zh }}</p>
                  <p class="text-ellipsis info-ldb-influence">{{ overviews.home.ldb.chain.influence }} influence</p>
                  <div class="d-flex f-align-baseline info-home-status">
                    <p class="v-flex">{{ overviews.home.ldb.apLeft }} AP remaining</p>
                    <ld-btn class="user-info-btn" theme="blue" inverse shadow @click="$router.push(`/ldb/${overviews.home.ldb._id}`)">Go</ld-btn>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="ld-hide-in-fade">
        <div v-show="!overviewLoading" class="info-item-container user-info-section info-task-section">
          <h2 class="info-cnt-title">Task</h2>
          <div class="d-flex f-align-center sm-col-flex text-center">
            <div class="info-cnt-box info-card-cnt task-candy-box" style="z-index: 3;">
              <p class="card-cnt-title">Action point</p>
              <!-- <div class="info-ap-skeletion" v-if="overviewLoading">
                <p></p>
                <p></p>
              </div> -->
              <div class="task-candy-cnt">
                <p class="card-cnt-tip">{{ userInfo.ap }} Points left</p>
                <div class="inline-block card-cnt-box task-candy-progress">
                  <ld-progress
                    circle
                    :current="userInfo.ap"
                    :max="50"
                    :width="140"
                    :circleWidth="progressOpts.candy.circleWidth"
                    :color="progressOpts.candy.color">
                  </ld-progress>
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-current-box" style="z-index: 2;">
              <p class="card-cnt-title">Current task</p>
              <!-- <div class="info-current-skeletion" v-if="overviewLoading">
                <p></p>
                <p></p>
                <div class="d-flex">
                  <div class="v-flex">
                    <p></p>
                    <p></p>
                  </div>
                  <div class="v-flex">
                    <p></p>
                    <p></p>
                  </div>
                  <div class="v-flex">
                    <p></p>
                    <p></p>
                  </div>
                </div>
              </div> -->
              <div v-if="!overviews.currentTask" class="v-flex d-flex col-flex task-current-unknow">
                <p class="card-cnt-tip">Task in progress</p>
                <div class="v-flex d-flex f-auto-center card-cnt-box">
                  <p>You have no tasks</p>
                </div>
              </div>
              <div v-if="overviews.currentTask" class="v-flex d-flex col-flex task-current-know">
                <p class="card-cnt-tip">A task from LDB <a href="#">#{{ overviews.currentTask.ldb.info.chain.tokenId }}</a> in progress</p>
                <div class="v-flex d-flex col-flex task-current-cnt">
                  <p>{{ overviews.currentTask.ldbTaskType.name }}</p>
                  <ul class="d-flex task-current-data">
                    <li class="v-flex task-current-symbol">
                      <h3>Symbol</h3>
                      <p class="text-upper">{{ overviews.currentTask.reward.candy.symbol }}</p>
                    </li>
                    <li class="v-flex task-current-reward">
                      <h3>Reward</h3>
                      <p>{{ overviews.currentTask.executor.reward.count | formatDecimal }}</p>
                    </li>
                    <li class="v-flex task-current-due">
                      <h3>Due</h3>
                      <p v-if="overviews.currentTask.roundId && new Date(overviews.currentTask.roundId.endAt) - new Date() >= 0">
                        <countdown class="task-status-time" :time="new Date(overviews.currentTask.roundId.endAt) - new Date()" :interval="3000" tag="p">
                          <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                          <template slot-scope="props">{{ props | formatDue }}</template>
                        </countdown>
                      </p>
                      <p v-else>Over Due</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-completed-box" style="z-index: 1;">
              <p class="card-cnt-title">Completed tasks</p>
              <!-- <div class="info-list-skeletion" v-if="overviewLoading">
                <p></p>
                <p></p>
                <p></p>
              </div> -->
              <div v-if="!overviews.completeTasks.total" class="v-flex d-flex col-flex f-justify-center task-completed-unknow">
                <p class="card-cnt-tip">Recent rewarded tasks</p>
                <div class="v-flex d-flex f-auto-center card-cnt-box">
                  <p>You have no tasks completed</p>
                </div>
              </div>
              <div v-if="overviews.completeTasks.total" class="v-flex d-flex col-flex task-completed-know">
                <p class="card-cnt-tip">Recent rewarded tasks</p>
                <ul class="v-flex d-flex col-flex text-left task-completed-cnt">
                  <li
                    v-for="item of overviews.completeTasks.list.slice(0, overviews.ps)"
                    :key="item._id"
                    class="d-flex f-justify-around task-completed-item">
                    <span class="v-flex text-ellipsis">{{ item.ldbTaskType.name }}</span>
                    <span class="task-completed-reward">+{{ item.executor.reward.count | sliceStr({ end: 6 }) }} <span>{{ item.reward.candy.symbol }}</span></span>
                  </li>
                  <li
                    v-if="overviews.completeTasks.total >= overviews.ps"
                    class="info-more">
                    <router-link class="d-flex f-align-baseline" to="/owner/tasks">
                      <span>More </span>
                      <span data-type="icon">
                        <i class="el-icon-d-arrow-right"></i>
                      </span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="ld-hide-in-fade">
        <div v-show="!overviewLoading" class="info-item-container user-info-section info-assets-section">
          <h2 class="info-cnt-title">Assets</h2>
          <div class="d-flex f-align-center sm-col-flex text-center">
            <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-estimated-box" style="z-index: 3;">
              <p class="card-cnt-title">Estimated Value</p>
              <!-- <div v-if="overviewLoading" class="info-estimated-skeletion">
                <p></p>
                <p></p>
                <p></p>
              </div> -->
              <div class="v-flex d-flex col-flex assets-estimated-cnt">
                <p class="card-cnt-tip">Valued by USD</p>
                <div class="v-flex d-flex col-flex f-auto-center card-cnt-box estimated-cnt-box">
                  <h1 class="TTFontBlack">${{ overviews.estimated || 0 | formatDecimal }}</h1>
                  <!-- <p class="">USD</p> -->
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-earnings-box" style="z-index: 2;">
              <p class="card-cnt-title">LDB earnings</p>
              <!-- <div class="info-list-skeletion" v-if="overviewLoading">
                <p></p>
                <p></p>
                <p></p>
              </div> -->
              <div v-if="!overviews.ldbEarnings.total" class="v-flex d-flex col-flex assets-earnings-unknow">
                <p class="card-cnt-tip">Rewards from LDB</p>
                <div class="v-flex d-flex col-flex f-auto-center card-cnt-box">
                  <p>You have no transactions</p>
                  <ld-btn class="user-info-btn" theme="blue" inverse shadow>Buy a LDB</ld-btn>
                </div>
              </div>
              <div v-if="overviews.ldbEarnings.total" class="v-flex d-flex col-flex assets-earnings-know">
                <p class="card-cnt-tip">Rewards from LDB</p>
                <div class="v-flex d-flex col-flex assets-earnings-list">
                  <ul class="text-left">
                    <li
                      v-for="item of overviews.ldbEarnings.list.slice(0, overviews.ps)"
                      :key="item._id"
                      class="d-flex f-align-center earnings-list-item">
                      <div class="v-flex d-flex f-align-center text-ellipsis">
                        <span>Reward from</span>
                        <blockies
                          class="inline-block line-height-0 mar-l1"
                          :scale="3"
                          radius="3px"
                          jump
                          :seed="item.executor.info"></blockies>
                      </div>
                      <span class="earnings-item-reward">+{{ item.lord.reward.count | sliceStr({ end: 6 }) }} <span>{{ item.reward.candy.symbol }}</span></span>
                    </li>
                    <li
                      v-if="overviews.ldbEarnings.total >= overviews.ps"
                      class="info-more">
                      <router-link class="d-flex f-align-baseline" to="/owner/candy">
                        <span>More </span>
                        <span data-type="icon">
                          <i class="el-icon-d-arrow-right"></i>
                        </span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-recent-box" style="z-index: 1;">
              <p class="card-cnt-title">Recent transactions</p>
              <!-- <div class="info-list-skeletion" v-if="recentLoading">
                <p></p>
                <p></p>
                <p></p>
              </div> -->
              <div v-if="!recentData.total" class="v-flex d-flex col-flex assets-recent-unknow">
                <p class="card-cnt-tip">Rewards from LDB</p>
                <div class="v-flex d-flex f-auto-center col-flex card-cnt-box">
                  <p>You have no transactions</p>
                  <ld-btn class="user-info-btn" theme="blue" inverse shadow>Marketplace</ld-btn>
                </div>
              </div>
              <div v-if="recentData.total" class="v-flex d-flex col-flex assets-recent-know">
                <p class="card-cnt-tip">Rewards from LDB</p>
                <div class="v-flex d-flex col-flex assets-recent-list">
                  <ul class="text-left">
                    <li
                      class="d-flex recent-list-item"
                      v-for="(recent, index) of recentData.list.slice(0, overviews.ps)"
                      :key="index">
                      <p class="v-flex text-ellipsis">
                        Bought
                        <a :href="`${ETHERSCANURL}/${recent.tx.transactionHash}`" target="_blank"> #{{ recent.market[0].tokenId }} </a>
                        for
                        <span> {{ recent.market[0].price | weiToEth }} ETH</span>
                      </p>
                      <span class="recent-item-date">{{ recent.created_at | timeFormat }}</span>
                    </li>
                    <li
                      v-if="recentData.total >= recentData.ps"
                      class="info-more">
                      <router-link class="d-flex f-align-baseline" to="/owner/activity">
                        <span>More </span>
                        <span data-type="icon">
                          <i class="el-icon-d-arrow-right"></i>
                        </span>
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <Authorize
      ref="authorize"
      :address="userInfo.address"
      @pending="authorizePending"
      @blurs="dialogSetBlurs">
    </Authorize>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

import Authorize from '@/components/reuse/dialog/authorize'

import LdProgress from '@/components/stories/progress'
import Blockies from '@/components/stories/blockies'
import LdImg from '@/components/stories/image'
import LdBtn from '@/components/stories/button'

import { contractMixins, dialogMixins } from '@/mixins'

import { getActivitysByUser, getUserOverview } from 'api'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [ contractMixins, dialogMixins ],
  data: () => {
    return {
      clipBool: false,
      progressOpts: {
        exp: {
          gradient: {
            direction: 'to bottom',
            start: '#EE9AE5',
            end: '#5961F9'
          }
        },
        candy: {
          circleWidth: 15,
          color: '#5961F9'
        }
      },

      // userExps data
      expData: {
        ps: 4,
        list: [],
        total: 0
      },

      // recent transactions data
      recentLoading: true,

      recentData: {
        ps: 4,
        list: [],
        total: 0
      },

      overviewLoading: true,

      overviews: {
        pn: 1,
        ps: 4,
        ldbEarnings: {
          list: [],
          total: 0
        },
        completeTasks: {
          list: [],
          total: 0
        },
        activeness: {
          list: [],
          total: 0
        },
        home: null,
        currentTask: null
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),

    balance () {
      return this.$root.$children[0].web3Opt.balance
    },

    isCrowdsaleApproved () {
      return this.$root.$children[0].isCrowdsaleApproved
    },

    currentActiveness () {
      const level = this.userInfo.level
      return Math.ceil(Math.pow(level * 108, 2) / Math.pow(108, 2) * 10)
    },

    nextActiveness () {
      const level = this.userInfo.level
      return Math.ceil(Math.pow(level * 108, 2) / Math.pow(108, 2) * 10)
    },

    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  },
  watch: {
    account (val) {
      console.log('---------- user info account', val)
      if (val) this.initInfo()
    }
  },
  watch: {
    account (val) {
      console.log('---------- user info account', val)
      if (val) this.initInfo()
    }
  },
  components: {
    Authorize,

    LdProgress,
    Blockies,
    LdImg,
    LdBtn
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_CHECK_CROWDSALE
    ]),
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN
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

    userAuthorize () {
      this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
    },

    authorizePending ({ tx } = {}) {
      const finishTx = async ({ err }) => {
        if (err) return
        const bool = await this[actionTypes.CONTRACT_CHECK_CROWDSALE](this.userInfo.address)
        if (!bool) {
          // 轮询 tx 状态
          this.checkTxEvent({ tx }, finishTx)
        }
      }
      this.checkTxEvent({ tx }, finishTx)
    },

    initInfo () {
      this.getUserTransactions()
      this.getUserOverview()
    },

    // 获取用户 overview 信息
    async getUserOverview () {
      this.overviewLoading = true
      const { pn, ps } = this.overviews
      const res = await getUserOverview({ pn, ps })
      if (res.code === 1000) {
        this.overviews = Object.assign({}, this.overviews, res.data)
      }
      this.overviewLoading = false
    },

    // 获取用户交易记录
    async getUserTransactions ({ user = this.account, ps = this.recentData.ps } = {}) {
      const params = {
        user,
        opt: {
          type: 'buy',
          ps
        }
      }
      this.recentLoading = true
      const res = await getActivitysByUser(params)
      if (res.code === 1000) {
        this.recentData = Object.assign({}, this.recentData, res.data)
      }
      this.recentLoading = false
    }
  },
  async mounted () {
    await this[actionTypes.USER_SET_USER_BY_TOKEN]()
    this.$nextTick(() => {
      this.initClipboard()
      this.initInfo()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // info-header-skeletion
  .info-header-skeletion {
    padding: 25px;
    background-color: $--skeletion-light;
    p {
      background-color: $--skeletion-dark;
    }
    >div {
      &:nth-of-type(1) {
        >p {
          width: 108px;
          height: 108px;
          border-radius: 10px;
        }
        >div {
          margin-left: 25px;
          >p {
            &:nth-of-type(1) {
              width: 100px;
              height: 30px;
            }
            &:nth-of-type(2) {
              margin-top: 10px;
              width: 80%;
              height: 25px;
            }
          }
        }
      }
      &:nth-of-type(2) {
        >p {
          &:nth-of-type(1) {
            width: 180px;
            height: 25px;
          }
          &:nth-of-type(2) {
            margin-top: 15px;
            width: 100px;
            height: 35px;
          }
        }
      }
    }
  }

  // info-prestige-skeletion
  .info-prestige-skeletion {
    padding: 20px 25px;
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .prestige-level-skeletion {
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        height: 22px;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        margin-bottom: 10px;
        height: 25px;
        border-radius: 5px;
      }
      &:nth-of-type(3) {
        width: 80%;
        height: 18px;
      }
    }
  }
  .prestige-ac-skeletion {
    margin-left: 25px;
    >p {
      width: 40px;
      height: 40px;
      background-color: $--skeletion-dark;
      border-radius: 100%;
      &:not(:first-of-type) {
        margin-left: -6px;
      }
    }
  }

  // info-home-skeletion
  .info-home-skeletion {
    padding: 20px 25px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    >p {
      width: 90px;
      height: 90px;
      border-radius: 100%;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-left: 15px;
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 150px;
          height: 25px;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          width: 100px;
          height: 18px;
        }
        &:nth-of-type(3) {
          margin-top: 20px;
          width: 200px;
          height: 25px;
        }
      }
    }
  }

  // info-ap-skeletion
  // .info-ap-skeletion {
  //   >p {
  //     &:nth-of-type(1) {
  //       margin-top: 15px;
  //       height: 18px;
  //       background-color: $--skeletion-light;
  //     }
  //     &:nth-of-type(2) {
  //       margin-top: 15px;
  //       width: 140px;
  //       padding-top: 140px;
  //       border-radius: 100%;
  //       border: 10px solid $--skeletion-light;
  //       box-sizing: border-box;
  //     }
  //   }
  // }

  // // info-current-skeletion
  // .info-current-skeletion {
  //   p {
  //     background-color: $--skeletion-light;
  //   }
  //   >p {
  //     &:nth-of-type(1) {
  //       margin: 15px auto 0;
  //       width: 80px;
  //       height: 18px;
  //     }
  //     &:nth-of-type(2) {
  //       margin: 15px auto 0;
  //       width: 150px;
  //       height: 20px;
  //     }
  //   }
  //   >div {
  //     margin-top: 30px;
  //     >div {
  //       padding: 0 20px;
  //       >p {
  //         &:nth-of-type(1) {
  //           margin: 0 auto;
  //           width: 50px;
  //           height: 20px;
  //         }
  //         &:nth-of-type(2) {
  //           margin-top: 15px;
  //           height: 30px;
  //         }
  //       }
  //     }
  //   }
  // }

  // // info-estimated-skeletion
  // .info-estimated-skeletion {
  //   >p {
  //     background-color: $--skeletion-light;
  //     &:nth-of-type(1) {
  //       margin: 15px auto 0;
  //       width: 100px;
  //       height: 18px;
  //     }
  //     &:nth-of-type(2) {
  //       margin: 35px auto 0;
  //       width: 180px;
  //       height: 45px;
  //     }
  //     &:nth-of-type(3) {
  //       margin: 25px auto 0;
  //       width: 80px;
  //       height: 20px;
  //     }
  //   }
  // }

  // // info-list-skeletion
  // .info-list-skeletion {
  //   >p {
  //     background-color: $--skeletion-light;
  //     &:nth-of-type(1) {
  //       margin: 15px auto 0;
  //       width: 100px;
  //       height: 18px;
  //     }
  //     &:nth-of-type(2) {
  //       height: 22px;
  //       margin-top: 30px;
  //     }
  //     &:nth-of-type(3) {
  //       margin-top: 15px;
  //       height: 22px;
  //     }
  //   }
  // }

  .user-info-btn {
    padding: 8px 15px;
    font-size: 16px;
    @include margin('top', 15px, 1);
  }

  .user-info-box {
    @include padding(-1, 30px, 1);
  }
  .user-info-container {
    @include padding('bottom', 35px, 1);
  }
  .user-info-header {
    color: #fff;
    background-image: linear-gradient(45deg, $--gradient-blue-color, $--gradient-pink-color);
    @include padding(-1, 25px, 1);
  }
  .info-header-cnt {
    width: 100%;
    @include margin('left', 25px, -1);
    @include margin('top', 20px, 1, -2);
  }
  .user-Authorize-btn {
    padding: 4px 6px;
    font-size: 14px;
    @include margin('left', 6px, 1);
  }
  .header-cnt-text {
    >h2 {
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
    width: 20px;
    height: 20px;
    stroke: #fff;
    fill: none;
    cursor: pointer;
    @include margin('left', 8px, 1);
  }
  .user-eamil {
    color: #BDB9FD;
  }

  .header-cnt-balance {
    font-size: 20px;
  }
  .eth-balance {
    color: $--text-yellow-color;
    font-size: 24px;
  }


  .info-prestige-section {
    @include width(100%, 1, -2);
    @include margin('right', 15px, -2);
  }
  .info-home-section {
    @include margin('left', 15px, -2);
  }
  .info-prestige-box, .info-home-box {
    @include height(135px, -2);
  }

  .user-info-section {
    @include margin('bottom', 20px, -2);
    &:not(:first-of-type) {
      @include margin('top', 25px, -2);
    }
  }
  .info-item-container {
    @include margin('top', 35px, 1, -2);
    // @include width(100vw, 1, -2);
  }
  .info-cnt-title {
    font-size: 20px;
    color: #BBBBBB;
    @include margin('bottom', 15px, 1);
  }
  .info-cnt-box {
    padding: 20px 25px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, .1);
    @include width(100%, 1, -2);
  }
  .exp-progress-top {
    font-size: 20px;
  }
  .exp-current {
    color: #5961F9;
  }
  .exp-text-progress {
    color: #999999;
    font-size: 18px;
  }
  .exp-progress {
    height: 27px;
    border-radius: 5px;
    overflow: hidden;
    @include margin('top', 6px, 1);
    @include margin('bottom', 6px, 1);
  }
  .exp-tip-text {
    color: #999999;
    font-size: 14px;
  }
  .exp-recived-box {
    position: relative;
    z-index: 1;
    @include margin('left', 20px, 1);
  }
  .exp-recived-item {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: rgb(78, 71, 211);
    border: 3px solid rgb(78, 71, 211);
    border-radius: 100%;
    background-color: #fff;
    white-space: nowrap;
    box-sizing: border-box;
    &:not(:first-of-type) {
      margin-left: -10px;
    }
  }

  // info-home-cnt

  .info-home-cnt {
    margin-left: 20px;
  }
  .info-home-poster {
    position: relative;
    padding: 22px;
    width: 90px;
    height: 90px;
    border-radius: 100%;
    box-sizing: border-box;
    box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
    // @include padding(-1, 22px, 1);
    svg {
      width: 100%;
      height: 100%;
      fill: #BDB9FD;
    }
    >img {
      position: absolute;
      left: -10%;
      top: -5%;
      width: 120%;
    }
  }
  .info-home-unknow {
    color: #999999;
    font-size: 14px;
  }

  .info-ldb-name {
    font-size: 20px;
    font-weight: 500;
  }
  .info-ldb-influence {
    margin-top: 6px;
    font-size: 16px;
    color: #999999;
  }

  .info-home-status {
    color: #4E47D3;
    @include fontSize(20px, 1.2);
  }

  // info-card-cnt

  .info-card-cnt {
    position: relative;
    height: 250px;
    font-family: $--font-TTNormsRegular;
    &:not(:first-of-type) {
      @include margin('top', 20px, 1, -2);
      @include margin('left', -8px, -2);
      @include padding('left', 33px, -2);
    }
  }
  .card-cnt-title {
    font-family: $--font-TTNormsMedium;
    font-size: 20px;
  }
  .card-cnt-tip {
    font-size: 14px;
    color: #999;
    @include padding('top', 5px, 1);
    @include padding('bottom', 10px, 1);
  }
  .card-cnt-box {
    color: #999;
  }

  // user-task-box

  .task-candy-progress {
    width: 140px;
    height: 140px;
    color: #999999;
  }

  .task-current-know {
    >p {
      >a {
        color: #4E47D3;
      }
    }
  }
  .task-current-cnt {
    >p {
      margin-top: 15px;
      font-size: 18px;
    }
  }
  .task-current-data {
    width: 100%;
    @include margin('top', 30px, 1);
    >li {
      >h3 {
        color: #999;
        font-size: 16px;
      }
      >p {
       font-size: 20px;
       @include margin('top', 10px, 1);
      }
    }
  }
  .task-current-reward {
    color: #4E47D3;
  }
  .task-current-due {
    color: #EB8785;
    >p {
      min-width: 110px;
    }
  }

  .task-completed-cnt {
    color: #999;
  }
  .task-completed-item {
    @include margin('top', 10px, 1);
    >span {
      display: inline-block;
      max-width: 220px;
    }
  }
  .task-completed-reward {
    font-family: $--font-TTNormsMedium;
    color: #4E47D3;
    text-align: right;
    @include width(120px, 1.2);
  }

  // info-assets-section

  .estimated-cnt-box {
    color: #4E47D3;
    >h1 {
      font-size: 48px;
    }
    >p {
      font-size: 24px;
      @include margin('top', 15px, 1);
    }
  }

  .earnings-list-item {
    color: #999;
    @include margin('top', 10px, 1);
    span {
      display: inline-block;
      max-width: 150px;
    }
  }
  .earnings-item-reward {
    font-family: $--font-TTNormsMedium;
    color: #4E47D3;
    text-align: right;
    @include width(120px, 1.2);
  }

  .assets-recent-know {

  }
  .assets-recent-list {

  }
  .recent-list-item {
    font-size: 16px;
    color: #999;
    @include margin('top', 10px, 1);
    a, span {
      color: #4E47D3;
    }
    >p {
      max-width: 190px;
    }
    .recent-item-date {
      color: #bbb;
    }
  }
  .recent-item-date {
    display: inline-block;
    font-family: $--font-TTNormsMedium;
    text-align: right;
    @include width(120px, 1.2);
  }
  .info-more {
    transform: translateY(5px);
    >a {
      font-size: 14px;
      color: #4E47D3;
      >[data-type="icon"] {
        margin-left: 3px;
        font-size: 12px;
      }
    }
  }
</style>
