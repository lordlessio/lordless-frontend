<template>
  <div class="TTFontBold user-info-box">
    <div class="user-info-container">
      <div class="user-info-section">
        <h2 class="info-cnt-title">Info Card</h2>
        <div class="d-flex f-align-center sm-col-flex user-info-header">
          <div class="user-avatar">
            <blockies
              :scale="18"
              radius="20px"
              :seed="user.address"></blockies>
          </div>
          <div class="v-flex d-flex lg-f-align-end sm-col-reverse-flex info-header-cnt">
            <div class="v-flex header-cnt-text">
              <h2 class="d-flex f-align-center">
                <span class="header-crown-svg">
                  <svg>
                    <use xlink:href="#icon-crown-l5"/>
                  </svg>
                </span>
                <span>{{ user.nickName }}</span>
                <span>
                  <ld-btn
                    class="TTFontBold user-Authorize-btn"
                    :theme="isCrowdsaleApproved ? 'green' : 'red'"
                    inverse
                    @click="userAuthorize">
                    {{ isCrowdsaleApproved ? 'Authorized' : 'Unauthorized' }}
                  </ld-btn>
                </span>
              </h2>
              <p class="d-flex f-align-center">
                <span id="user-address" class="text-ellipsis">
                  {{ user.address }}
                </span>
                <el-tooltip class="item" effect="dark" :content="clipBool ? 'Copied!' : 'Copy to clipboard'" placement="bottom-start">
                  <span
                    id="copy-address"
                    class="inline-block line-height-1 paste-icon"
                    data-clipboard-target="#user-address"
                    @mouseleave="clipLeave">
                    <svg>
                      <use xlink:href="/static/svg/icon.svg#icon-paste"/>
                    </svg>
                  </span>
                </el-tooltip>
              </p>
              <p class="user-eamil">{{ user.email }}</p>
            </div>
            <div class="lg-text-right header-cnt-balance sm-hidden">
              <p>ETH Balance in wallet</p>
              <p class="eth-balance">{{ balance }} ETH</p>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex f-align-center sm-col-flex user-info-section info-cnt-one">
        <div class="v-flex info-item-container info-prestige-section">
          <h2 class="info-cnt-title">Prestige Value</h2>
          <div class="d-flex f-align-center info-cnt-box info-prestige-box">
            <div class="v-flex exp-progress-box">
              <div class="d-flex f-align-end exp-progress-top">
                <span class="v-flex text-left">EXP</span>
                <span class="exp-text-progress">
                  <span class="exp-current">20</span>
                  <span>&nbsp;/&nbsp;</span>
                  <span>1200</span>
                </span>
              </div>
              <div class="exp-progress">
                <ld-progress
                  shadow
                  :current="200"
                  :max="1200"
                  :gradient="progressOpts.exp.gradient">
                </ld-progress>
              </div>
              <p class="exp-tip-text">You still need to earn 1200 to level up.</p>
            </div>
            <div class="exp-recived-box sm-hidden">
              <span
                class="exp-recived-item"
                v-for="(n, index) of [1,2,3,4]"
                :key="n"
                :style="`filter: grayscale(${index * 20}%) sepia(${index * 20}%);z-index: ${-n}`">
                +{{n}}
              </span>
            </div>
          </div>
        </div>
        <div class="v-flex info-item-container info-home-section">
          <h2 class="info-cnt-title">Home</h2>
          <div class="d-flex f-align-center info-cnt-box info-home-box">
            <div class="info-home-poster">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-help"/>
              </svg>
              <!-- <ld-img></ld-img> -->
            </div>
            <div class="v-flex info-home-cnt">
              <div class="info-home-unknow" v-if="false">
                <p>You have no home now.</p>
                <p>Set a home you will be located there when you login.</p>
                <ld-btn class="user-info-btn" theme="info" inverse shadow>View map now</ld-btn>
              </div>
              <div class="info-home-know" v-if="true">
                <h2>上海和平饭店</h2>
                <p class="text-ellipsis">上海黄浦区外滩南京东路20号</p>
                <div class="d-flex f-align-baseline TTFontBold info-home-status">
                  <p class="v-flex">0.3 ETH remaining</p>
                  <ld-btn class="user-info-btn" theme="info" inverse shadow>Go</ld-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item-container user-info-section info-task-section">
        <h2 class="info-cnt-title">Task</h2>
        <div class="d-flex f-align-center sm-col-flex text-center">
          <div class="info-cnt-box info-card-cnt task-candy-box" style="z-index: 3;">
            <h2 class="card-cnt-title">Candy claiming count</h2>
            <div class="task-candy-cnt">
              <p class="card-cnt-tip">10 times left</p>
              <div class="inline-block card-cnt-box task-candy-progress">
                <ld-progress
                  circle
                  :current="1"
                  :max="10"
                  :width="140"
                  :circleWidth="progressOpts.candy.circleWidth"
                  :color="progressOpts.candy.color">
                </ld-progress>
              </div>
            </div>
          </div>
          <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-current-box" style="z-index: 2;">
            <h2 class="card-cnt-title">Current task</h2>
            <div class="v-flex d-flex col-flex task-current-unknow" v-if="false">
              <p class="card-cnt-tip">Task in progress</p>
              <div class="v-flex d-flex f-auto-center card-cnt-box">
                <p>You have no tasks</p>
              </div>
            </div>
            <div class="v-flex d-flex col-flex task-current-know" v-if="true">
              <p class="card-cnt-tip">A task from LDB <a href="#">#88888</a> in progress</p>
              <div class="v-flex d-flex col-flex f-justify-center task-current-cnt">
                <p>Join the telegram of LORDLESS</p>
                <ul class="d-flex task-current-data">
                  <li class="v-flex task-current-symbol">
                    <h3>Symbol</h3>
                    <p>LESS</p>
                  </li>
                  <li class="v-flex task-current-reward">
                    <h3>Reward</h3>
                    <p>0.02</p>
                  </li>
                  <li class="v-flex task-current-due">
                    <h3>Due</h3>
                    <p>10 min</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-completed-box" style="z-index: 1;">
            <h2 class="card-cnt-title">Completed tasks</h2>
            <div class="v-flex d-flex col-flex task-completed-unknow" v-if="false">
              <p class="card-cnt-tip">Recent rewarded tasks</p>
              <div class="v-flex d-flex f-auto-center card-cnt-box">
                <p>You have no tasks completed</p>
              </div>
            </div>
            <div class="v-flex d-flex col-flex task-completed-know" v-if="true">
              <p class="card-cnt-tip">Recent rewarded tasks</p>
              <ul class="v-flex d-flex col-flex f-justify-center text-left task-completed-cnt">
                <li class="d-flex f-justify-around task-completed-item">
                  <span class="v-flex text-ellipsis">Join the telegram of LORDLESS</span>
                  <span class="task-completed-reward">+0.001 LESS</span>
                </li>
                <li class="d-flex f-justify-around task-completed-item">
                  <span class="v-flex text-ellipsis">Follow the twitter of Nabulas</span>
                  <span class="task-completed-reward">+0.001 NAS</span>
                </li>
                <li class="d-flex f-justify-around task-completed-item">
                  <span class="v-flex text-ellipsis">Follow the Facebook of IOST</span>
                  <span class="task-completed-reward">+0.09 IOST</span>
                </li>
                <li class="d-flex f-justify-around task-completed-item">
                  <span class="v-flex text-ellipsis">Join the telegram of Omisgo</span>
                  <span class="task-completed-reward">+1.3 OMG</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item-container user-info-section info-assets-section">
        <h2 class="info-cnt-title">Assets</h2>
        <div class="d-flex f-align-center sm-col-flex text-center">
          <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-estimated-box" style="z-index: 3;">
            <h2 class="card-cnt-title">Estimated Value</h2>
            <div class="v-flex d-flex col-flex assets-estimated-cnt">
              <p class="card-cnt-tip">Valued by ETH</p>
              <div class="v-flex d-flex col-flex f-auto-center card-cnt-box estimated-cnt-box">
                <h1 class="TTFontBlack">0 ETH</h1>
                <p>$ 0</p>
              </div>
            </div>
          </div>
          <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-earnings-box" style="z-index: 2;">
            <h2 class="card-cnt-title">LDB earnings</h2>
            <div class="v-flex d-flex col-flex assets-earnings-unknow" v-if="false">
              <p class="card-cnt-tip">Rewards from LDB</p>
              <div class="v-flex d-flex col-flex f-justify-center card-cnt-box">
                <p>You have no transactions</p>
                <ld-btn class="user-info-btn" theme="info" inverse shadow>Buy a LDB</ld-btn>
              </div>
            </div>
            <div class="v-flex d-flex col-flex assets-earnings-know" v-if="true">
              <p class="card-cnt-tip">Rewards from LDB</p>
              <div class="v-flex d-flex col-flex f-justify-center assets-earnings-list">
                <ul class="text-left">
                  <li class="d-flex f-align-center earnings-list-item">
                    <div class="v-flex d-flex f-align-center text-ellipsis">
                      <span>Reward from</span>
                      <blockies
                        class="inline-block line-height-0 mar-l1"
                        :scale="3"
                        radius="3px"
                        :seed="user.address"></blockies>
                    </div>
                    <span class="earnings-item-reward">+0.001LESS</span>
                  </li>
                  <li class="d-flex f-align-center earnings-list-item">
                    <div class="v-flex d-flex f-align-center text-ellipsis">
                      <span>Reward from</span>
                      <blockies
                        class="inline-block line-height-0 mar-l1"
                        :scale="3"
                        radius="3px"
                        :seed="user.address"></blockies>
                    </div>
                    <span class="earnings-item-reward">+0.001LESS</span>
                  </li>
                  <li class="d-flex f-align-center earnings-list-item">
                    <div class="v-flex d-flex f-align-center text-ellipsis">
                      <span>Reward from</span>
                      <blockies
                        class="inline-block line-height-0 mar-l1"
                        :scale="3"
                        radius="3px"
                        :seed="user.address"></blockies>
                    </div>
                    <span class="earnings-item-reward">+0.001LESS</span>
                  </li>
                  <li class="d-flex f-align-center earnings-list-item">
                    <div class="v-flex d-flex f-align-center text-ellipsis">
                      <span>Reward from</span>
                      <blockies
                        class="inline-block line-height-0 mar-l1"
                        :scale="3"
                        radius="3px"
                        :seed="user.address"></blockies>
                    </div>
                    <span class="earnings-item-reward">+0.001LESS</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-recent-box" style="z-index: 1;">
            <h2 class="card-cnt-title">Recent transactions</h2>
            <div class="v-flex d-flex col-flex assets-recent-unknow" v-if="false">
              <p class="card-cnt-tip">Rewards from LDB</p>
              <div class="v-flex d-flex f-auto-center col-flex card-cnt-box">
                <p>You have no transactions</p>
                <ld-btn class="user-info-btn" theme="info" inverse shadow>Marketplace</ld-btn>
              </div>
            </div>
            <div class="v-flex d-flex col-flex assets-recent-know" v-if="true">
              <p class="card-cnt-tip">Rewards from LDB</p>
              <div class="v-flex d-flex col-flex f-justify-center assets-recent-list">
                <ul class="text-left">
                  <li class="d-flex f-align-center recent-list-item">
                    <p class="v-flex text-ellipsis">
                      Bought
                      <a href="#"> #8989 </a>
                      for
                      <span> 0.1 ETH</span>
                    </p>
                    <span class="recent-item-reward">1 min ago</span>
                  </li>
                  <li class="d-flex f-align-center recent-list-item">
                    <p class="v-flex text-ellipsis">
                      Bought
                      <a href="#"> #8989 </a>
                      for
                      <span> 0.1 ETH</span>
                    </p>
                    <span class="recent-item-reward">1 min ago</span>
                  </li>
                  <li class="d-flex f-align-center recent-list-item">
                    <p class="v-flex text-ellipsis">
                      Bought
                      <a href="#"> #8989 </a>
                      for
                      <span> 0.1 ETH</span>
                    </p>
                    <span class="recent-item-reward">1 min ago</span>
                  </li>
                  <li class="d-flex f-align-center recent-list-item">
                    <p class="v-flex text-ellipsis">
                      Bought
                      <a href="#"> #8989 </a>
                      for
                      <span> 0.1 ETH</span>
                    </p>
                    <span class="recent-item-reward">1 min ago</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),

    user () {
      return this.userInfo
    },

    balance () {
      return this.$root.$children[0].web3Opt.balance
    },

    isCrowdsaleApproved () {
      return this.$root.$children[0].isCrowdsaleApproved
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
      this.$refs.authorize.checkoutAuthorize()
    },

    authorizePending ({ tx } = {}) {
      const finishTx = async (err) => {
        if (err) {
          console.log('err', err)
          return
        }
        const bool = await this[actionTypes.CONTRACT_CHECK_CROWDSALE](this.userInfo.address)
        if (!bool) {
          // 轮询 tx 状态
          this.checkTxEvent(tx, finishTx)
        }
      }
      this.checkTxEvent(tx, finishTx)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initClipboard()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .user-info-btn {
    padding: 8px 15px;
    font-size: 16px;
    font-family: $--font-TTNormsBold;
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
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, .1);
    @include padding-around(20px, 25px, 20px, 25px);
    @include width(100%, 1, -2);
  }
  .exp-progress-box {

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
    color: #5961F9;
    border: 3px solid #5961F9;
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
    width: 90px;
    height: 90px;
    border-radius: 100%;
    box-sizing: border-box;
    box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
    @include padding(-1, 22px, 1);
    svg {
      width: 100%;
      height: 100%;
      fill: #BDB9FD;
    }
  }
  .info-home-unknow {
    color: #999999;
    font-size: 14px;
  }

  .info-home-know {
    >h2 {
      font-size: 20px;
    }
    >p {
      font-size: 14px;
    }
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
    font-size: 20px;
    font-weight: normal;
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

  .info-task-section {
    // .info-cnt-box {
    //   height: 250px;
    // }
  }
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
      font-size: 16px;
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
  }

  .task-completed-know {

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
  .info-assets-section {

  }
  .estimated-cnt-box {
    color: #4E47D3;
    >h1 {
      font-size: 48px;
    }
    >p {
      font-size: 20px;
      @include margin('top', 15px, 1);
    }
  }
  .assets-earnings-know {

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
  }
  .recent-item-reward {
    display: inline-block;
    font-family: $--font-TTNormsMedium;
    color: #4E47D3;
    text-align: right;
    @include width(120px, 1.2);
  }
</style>
