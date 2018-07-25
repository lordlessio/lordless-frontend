<template>
  <div class="TTFontBold ldb-detail-main" :class="theme">
    <!-- <ld-loading :loading="loading"></ld-loading> -->
    <div class="detail-header">

      <!-- detail header 骨架 -->
      <skeletion-box v-model="detailLoading" absolute></skeletion-box>

      <!-- sketch fab -->
      <sketch-fab v-if="!detailLoading" :poster="ldbInfo.ldbIcon.sourceUrl" class="detail-fab"/>
    </div>

    <!-- detail cnt 骨架 -->
    <skeletion-detail-cnt v-if="detailLoading"></skeletion-detail-cnt>
    <div v-if="!detailLoading" class="detail-cnt-box">
      <div class="container">
        <div class="cnt-item cnt-header">
          <el-row justify="end" align="bottom">
            <el-col :md="12" :sm="24">
              <h1 class="d-flex row-flex f-align-baseline ldb-name">
                <span>{{ ldbInfo.name.zh }}</span>
                <span class="mar-l1 TTFontNormal ldb-category">{{ ldbInfo.origin.category[0] }}</span>
                <!-- <span class="ldb-category" v-for="(category, index) of ldbInfo.origin.category.split(',')" :key="index">{{ category }}</span> -->
              </h1>
            </el-col>
            <el-col :md="12" :sm="24">
              <div class="d-flex f-align-center">
                <div class="user-info v-flex">
                  <div v-if="userInfo.address">
                    <p class="lord-name">
                      {{ ldbInfo.lord.nickName || 'LORDLESS' }}
                    </p>
                    <p class="TTFontNormal lord-address">{{ ldbInfo.lord.address | splitAddress({ symbol: '******' }) }}</p>
                  </div>
                </div>
                <div class="user-avatar">
                  <user-avatar
                    shadow
                    :scale="9"
                    radius='8px'
                    :fontSize="'24px'"
                    :showText="false"></user-avatar>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="ldb-msg">
            <p class="TTFontNormal">
              <span>
                <i class="el-icon-location-outline"></i>
              </span>
              <span class="inline-block ldb-location">{{ ldbInfo.chainSystem.lng | sliceStr}}, {{ ldbInfo.chainSystem.lat | sliceStr }}</span>
              <!-- <span class="inline-block"> · {{ ldbInfo.address }}</span> -->
              <!-- <span class="inline-block ldb-address">{{ ldbInfo.address }}</span> -->
            </p>
            <!-- <p v-if="ldbInfo.category">
              <span class="inline-block ldb-category" v-for="(category, index) of ldbInfo.category.split(',')" :key="index">{{ category }}</span>
            </p> -->
          </div>
        </div>
        <div class="TTFontNormal cnt-item ldb-desc">{{ ldbInfo.desc.zh }}</div>
        <div class="cnt-item cnt-features">
          <div class="d-flex sm-col-flex features-container">
            <div class="d-inline-flex md-col-flex sm-row-flex sm-f-align-center features-price features-item">
              <p>Price</p>
              <div class="ldb-price text-nowrap">
                <span>{{ ldbInfo.chainSystem.value }}</span>
                <span>ETH</span>
              </div>
            </div>
            <div class="inline-block features-time features-item">
              <p>Time Left</p>
              <div>
                <p class="TTFontBolder">Expires in 30 days</p>
              </div>
            </div>
            <div class="v-flex md-text-right sm-text-left features-btn features-item">
              <!-- <ld-button theme="default" @click="pushChain" v-if="unOnChain">push chain</ld-button> -->
              <div v-if="showSell">
                <ld-button theme="info" :disabled="contractPending || ldbPendings.selling" shadow :contract="true" @click="sell">Sell</ld-button>
                <!-- <div class="inline-block sell-input">
                  <input class="lordless-input" v-model="sellModel" placeholder="ETH"/>
                </div> -->
              </div>
              <!-- <ld-button theme="info" :disabled="contractPending" shadow contract @click="unsell" v-if="showUnSell">Un Sell</ld-button> -->
              <ld-button theme="purple" :disabled="contractPending || ldbPendings.buying" shadow contract @click="buy" v-if="showBuy"><span v-if="!userInfo.address">Sign to {{ this.isOwner ? 'Sell' : 'Buy' }}</span><span v-if="userInfo.address">Buy</span></ld-button>
            </div>
          </div>
        </div>
        <div class="cnt-item large-margin cnt-tasks">
          <h2>任务</h2>
          <div class="tasks-box">
            <div class="d-flex sm-col-flex">
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </ld-button>
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </ld-button>
            </div>
            <div>
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-medium"/>
                  </svg>
                </span>
                <span>关注 EOS Medium</span>
              </ld-button>
            </div>
          </div>
        </div>
        <div class="cnt-item middle-margin cnt-candy">
          <h3>已完成</h3>
          <div class="history-box">
            <div class="history-container text-nowrap">
              <el-row class="history-item history-header finish">
                <el-col :span="6">
                  奖励 Candy
                </el-col>
                <el-col :span="6">
                  WHEN
                </el-col>
                <el-col :span="6">
                  FROM
                </el-col>
                <el-col :span="6">
                  TO
                </el-col>
              </el-row>
              <el-row class="history-cnt-box">
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>20 </span>
                    <span class="text-upper">EOS</span>
                  </el-col>
                  <el-col :span="6">
                    <span>1000</span>
                    <span class="text-cap">exp</span>
                  </el-col>
                  <el-col :span="6">
                    <span>关注</span>
                    <span class="text-upper">Eos</span>
                    <span class="text-cap">Telegram</span>
                  </el-col>
                  <el-col :span="6">
                    4 months ago
                  </el-col>
                </el-row>
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>5 </span>
                    <span class="text-upper">NAS</span>
                  </el-col>
                  <el-col :span="6">
                    <span>500</span>
                    <span class="text-cap">exp</span>
                  </el-col>
                  <el-col :span="6" class="text-nowrap">
                    <span>关注</span>
                    <span class="text-upper">Nebulas</span>
                    <span class="text-cap">Twitter</span>
                  </el-col>
                  <el-col :span="6">
                    1 hours ago
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
        <div class="cnt-item large-margin cnt-history">
          <h2>交易历史</h2>
          <div class="history-box">
            <div class="history-container text-nowrap">
              <el-row class="history-item history-header deal">
                <el-col :span="6">
                  PRICE
                </el-col>
                <el-col :span="6">
                  WHEN
                </el-col>
                <el-col :span="6">
                  FROM
                </el-col>
                <el-col :span="6">
                  TO
                </el-col>
              </el-row>
              <el-row class="history-cnt-box">
                <el-row
                  v-if="!recordsLoading && !ldbRecords.length"
                  class="text-center history-no-records">
                  <p>暂无交易哦</p>
                </el-row>
                <el-row
                    v-if="ldbRecords.length"
                    v-for="record of ldbRecords"
                    :key="record._id"
                    class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>{{ record.request.value }}</span>
                    <span class="text-upper">ETH</span>
                  </el-col>
                  <el-col :span="6">
                    {{ record.created_at | dateFormat }}
                  </el-col>
                  <el-col :span="6">
                    {{ record.request.from | splitAddress }}
                  </el-col>
                  <el-col :span="6">
                    {{ record.request.to | splitAddress }}
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Authorize
      ref="authorize"
      :address="userInfo.address"
      @pending="authorizePending"
      @blurs="setBlurs"></Authorize>

    <order-dialog
      v-model="orderModel"
      :ldbInfo="ldbInfo"
      @blurs="setBlurs"></order-dialog>

    <ldb-buy
      v-model="buyModel"
      :ldbInfo="ldbInfo"
      @pending="ldbBuyPending"
      @blurs="setBlurs"></ldb-buy>
  </div>
</template>

<script>
import skeletionDetailCnt from '@/components/skeletion/detail_cnt'
import skeletionBox from '@/components/skeletion/box'

import ImgBox from '@/components/stories/image'
import UserAvatar from '@/components/reuse/userAvatar'
import LdButton from '@/components/stories/button'
import LdLoading from '@/components/stories/loading'

import SketchFab from '@/components/sketchfab'
import Authorize from '@/components/reuse/authorize'

import OrderDialog from '@/components/reuse/ldb/order'
import LdbBuy from '@/components/reuse/ldb/buy'

import { contractMixins } from '@/mixins'
import { getLdbById, getTxsByTokenId, getTxStatus } from 'api'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  mixins: [contractMixins],
  props: {

    // ldb 建筑id
    ldbId: String,

    // 主题
    theme: {
      type: String,
      default: 'light'
    },

    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {

      // 错误信息
      errorMsg: null,

      // 页面 loading 状态
      detailLoading: true,

      // 当前建筑交易记录
      ldbRecords: [],

      // ldb 建筑信息
      ldbInfo: {
        lord: {},
        name: {},
        desc: {},
        origin: {
          category: []
        },
        chainSystem: {
          lng: '',
          lat: ''
        },
        levelSystem: {},
        ldbIcon: {}
      },

      recordsLoading: false,

      // dialog options ----

      // 购买弹窗状态
      buyModel: false,

      // 订单状态
      orderModel: true,

      // contract options ----

      // 合约pending状态
      contractPending: false,

      // 合约轮询查询定时器
      ldbTxInterval: null,

      // 当前用户在该建筑中的 pending 状态
      ldbPendings: {
        buying: false,
        selling: false,
        unselling: false
      }
    }
  },
  computed: {
    // ...mapState('user', [
    //   'userInfo'
    // ]),
    // ...mapState('contract', [
    //   'ldbNFTContract',
    //   'ldbNFTCrowdsaleContract'
    // ]),
    // account () {
    //   return this.userInfo.address || this.$root.$children[0].web3Opt.address
    // },

    showSell () {
      const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return init && !this.showSign && this.isOwner && !isSell && ldbInfo.ocs === 2
    },

    showUnSell () {
      const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return init && !this.showSign && this.isOwner && isSell && ldbInfo.ocs === 2
    },

    showBuy () {
      const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return init && (this.showSign || (isSell && ldbInfo.ocs === 2))
    },

    showSign () {
      return !this.userInfo.address
    },

    isOwner () {
      return this.contractStatus.ldbNFTOwner || this.contractStatus.crowdsaleOwner
    },

    web3js () {
      return this.$root.$children[0].web3Opt.web3js
    }
  },
  components: {
    skeletionDetailCnt,
    skeletionBox,

    ImgBox,
    LdButton,
    SketchFab,
    LdLoading,

    UserAvatar,
    Authorize,
    OrderDialog,

    LdbBuy
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_BLURS
    ]),

    // dialog setBlurs 监听
    setBlurs (val) {
      const blursNum = (val ? 1 : 0) + (this.dialog ? 1 : 0)
      this[mutationTypes.LAYOUT_SET_BLURS](blursNum)
    },

    /**
     * 获取 ldb 建筑详情
     * @param {String} id 建筑 _id
     */
    async getLdbInfo (id) {
      this.detailLoading = true
      const res = await getLdbById({ id, pula: 'ldbIcon' })
      if (res.code === 1000) {
        this.getLdbRecords(res.data)
        this.ldbInfo = Object.assign({}, this.ldbInfo, res.data)
      } else this.errorMsg = res.errorMsg || '未知错误'
      this.detailLoading = false

      this.$nextTick(() => this.$emit('initInfo', this.ldbInfo))
    },

    /**
     * 获取当前用户基于当前建筑的市场合约执行状态
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getUserLastPending (ldbInfo = this.ldbInfo) {
      if (!this.account) return
      const params = {
        from: this.account,
        tokenId: ldbInfo.tokenId,
        offset: 1
      }
      const res = await getTxStatus(params)
      if (res.code === 1000) {
        // 获取合约 pending 状态
        const status = res.data.status

        // 获取 pending 合约信息
        const info = res.data.info

        // 修改 ldbPendings
        this.ldbPendings = status

        const keys = Object.keys(status)

        // 判断是否有 pending 状态的合约
        const pending = !!keys.filter(key => status[key]).length

        // 如果有 pending 状态，轮询此合约信息
        if (pending) {
          this.checkTxEvent(info.transactionHash, () => {
            // 合约信息更新成功，修改 ldbPendings
            const ldbPendings = this.ldbPendings
            keys.map(key => {
              ldbPendings[key] = false
            })
            this.ldbPendings = ldbPendings
          })
        }
      }
    },

    /**
     * 获取当前建筑的交易记录
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getLdbRecords (ldbInfo = this.ldbInfo) {
      this.recordsLoading = true
      const params = {
        tokenId: ldbInfo.tokenId
      }
      const res = await getTxsByTokenId(params)
      if (res.code === 1000) {
        this.ldbRecords = res.data.list
      } else {
        this.errorMsg = res.errorMsg
      }
      this.recordsLoading = false
    },

    /**
     * 初始化组件
     */
    init () {
      this.getLdbInfo(this.ldbId)
    },

    /**
     * 初始化组件状态
     */
    initStatus () {
      this.detailLoading = false
      this.errorMsg = null
    },

    /**
     * 初始化合约状态
     */
    initContractStatus () {
      this.contractPending = false
      // this.orderModel = false
      this.ldbPendings = {
        isBuying: false,
        isSelling: false,
        isUnSelling: false
      }
    },

    /**
     * 购买建筑
     */
    async buy () {
      try {
        // 检查市场权限
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        console.log('authorize', authorize)

        const tokenId = this.ldbInfo.tokenId
        if (!authorize || !tokenId) return

        this.buyModel = true

        // const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
        // window.ldbNFTCrowdsaleContract = ldbNFTCrowdsaleContract

        // // 根据 tokenId 获取建筑链上信息
        // const ldb = await ldbNFTCrowdsaleContract.getAuction(tokenId)
        // const { address } = this.$root.$children[0].web3Opt
        // console.log('ldb', address, ldb[1].toNumber(), address, tokenId)

        // this.contractPending = true

        // // 根据链上信息购买建筑
        // ldbNFTCrowdsaleContract.payByEth(tokenId, {
        //   from: address,
        //   value: ldb[1]
        // })
        //   .then(data => {
        //     this.checkTxEvent(data.tx, () => {
        //       this.contractPending = false
        //       this.orderModel = true

        //       this.ldbInfo.chainSystem.sellStatus = 0

        //       this.checkOwner()
        //     })
        //   })
        //   .catch(() => {
        //     this.contractPending = false
        //   })
      } catch (err) {
        console.log('err', err)
        this.contractPending = false
      }
    },

    /**
     * 授权市场权限的合约 pending 状态
     */
    async authorizePending ({ tx } = {}) {
      console.log('----- tx', tx)

      const finishTx = async (err) => {
        if (err) {
          this.errorMsg = err
          console.log('err', err)
          return
        }
        const bool = await this.$refs.authorize.checkoutAuthorize()
        if (!bool) {
          // 轮询 tx 状态
          this.checkTxEvent(tx, finishTx)
        }
      }
      this.checkTxEvent(tx, finishTx)
    },

    /**
     * 购买建筑之后触发的合约 pending 状态
     */
    async ldbBuyPending ({ tx } = {}) {
      // const tokenId = this.ldbInfo.tokenId
      // this.contractPending = true

      // 修改 isBuying 状态
      this.$set(this.ldbPendings, 'isBuying', true)

      // 轮询 tx 状态
      // this.checkTxEvent(tx, (err) => {
      //   // 关闭 buy dialog
      //   this.buyModel = false
      //   this.contractPending = false
      //   if (err) {
      //     this.errorMsg = err
      //     console.log('err', err)
      //     return
      //   }
      //   this.$set(this.ldbPendings, 'isBuying', false)
      //   this.checkOwner(tokenId)
      //   this.$nextTick(() => {
      //     this.orderModel = true
      //   })
      // })
    },

    /**
     * 出售建筑
     */
    async sell () {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        const tokenId = this.ldbInfo.tokenId
        console.log('authorize', authorize)
        if (!authorize || !tokenId) return
        // const buildingContract = this.buildingContract
        // const building = await buildingContract.building(tokenId)
        // console.log('building', building)
        const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
        const { web3js } = this.$root.$children[0].web3Opt
        const { value } = this.ldbInfo.chainSystem
        console.log('--- sell value', value, tokenId)

        this.contractPending = true
        ldbNFTCrowdsaleContract.newAuction(web3js.toWei(value), tokenId, Math.floor(new Date().getTime() / 1000) + 3600)
          .then(data => {
            this.checkTxEvent(data.tx, () => {
              this.contractPending = false

              this.ldbInfo.chainSystem.sellStatus = 1

              this.checkOwner(tokenId)
            })
          })
          .catch(() => {
            this.contractPending = false
          })
        console.log('ldbNFTCrowdsaleContract', ldbNFTCrowdsaleContract)
      } catch (err) {
        console.log('err', err)
        this.contractPending = false
      }
    },

    async unsell () {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        const tokenId = this.ldbInfo.tokenId
        if (!authorize || !tokenId) return
        const buildingContract = this.buildingContract
        const building = await buildingContract.building(tokenId)
        console.log('building', building)
        const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract

        this.contractPending = true
        ldbNFTCrowdsaleContract.cancelAution(tokenId)
          .then(data => {
            console.log('unsell tx', data)
            this.checkTxEvent(data.tx, () => {
              this.ldbInfo.chainSystem.sellStatus = 0
              this.contractPending = false

              this.checkOwner(tokenId)
            })
          })
          .catch(() => {
            this.contractPending = false
          })
        console.log('ldbNFTCrowdsaleContract', ldbNFTCrowdsaleContract)
      } catch (err) {
        console.log('err', err)
        this.contractPending = false
      }
    },

    /**
     * 传入小数，返回对应位数的字符串小数
     */
    getFullCoord (coord = '', bit = 14) {
      // 直接 toFixed 会造成小数改变,所以需要分解之后
      let [ int, decimal ] = coord.toString().split('.')
      decimal = parseFloat(`0.${decimal}`).toFixed(bit).slice(2)
      return parseInt(int + decimal)
    }

  },
  watch: {
    ldbId (val) {
      if (val) this.getLdbInfo(val)
    },
    ldbNFTContract (val) {
      if (val) {
        this.checkLdbNFT(this.ldbInfo.tokenId, val)
      }
    },
    ldbNFTCrowdsaleContract (val) {
      if (val) {
        this.checkCrowdsale(this.ldbInfo.tokenId, val)
      }
    },
    account (val) {
      this.initContractStatus()
      if (val) {
        console.log('---------account', val)
        this.checkOwner(this.ldbInfo.tokenId)
        this.getUserLastPending()
      }
    }
  },
  mounted () {
    this.$nextTick(() => this.$emit('mounted'))
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  @mixin detail-theme($theme: 'light') {
    @if $theme == 'light' {
      background-color: #f4f4f4;
      .ldb-price {
        color: $--secondary-color;
      }
      .history-header {
        color: #fff;
        background-color: $--main-color;
      }
      .history-cnt-box {
        color: $--text-main-color;
        background-color: #fff;
      }
    }
    @if $theme == 'dark' {
      color: #E6E8EC;
      background-color: #101010;
      .lord-name {
        color: #fff;
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
      }
    }
    @if $theme == 'gray' {
      color: #E6E8EC;
      background-color: #2b2b2b;
      .lord-name {
        color: #E6E8EC;
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
      }
    }
    @if $theme == 'default' {
      color: #E6E8EC;
      background-color: $--default-bg-color;
      .lord-name {
        color: #E6E8EC;
      }
      .lord-address {
        color: #d6d6d6;
      }
      .detail-cnt-box {
        background-image: linear-gradient(top, #240864, #4D33A7);
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
      }
    }
  }
  .ldb-detail-main {
    width: inherit;
    height: inherit;
    overflow: hidden;
    &.dark {
      @include detail-theme('dark');
    }
    &.gray {
      @include detail-theme('gray');
    }
    &.light {
      @include detail-theme('light');
    }
    &.default {
      @include detail-theme('default');
    }
  }

  .detail-header {
    height: calc((100vh / 3 * 2) + 50px);
    min-height: 300px;
    position: relative;
    // &::before, &::after {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   width: 50%;
    //   height: 100%;
    //   z-index: 0;
    // }
    // &::before {
    //   left: 0;
    //   @include bg-img-class('~/static/img/test/fandian-left.png', repeat-x, contain);
    // }
    // &::after {
    //   right: 0;
    //   @include bg-img-class('~/static/img/test/fandian-right.png', repeat-x, contain);
    // }
    // >div {
    //   position: relative;
    //   z-index: 1;
    // }
  }
  // .detail-fab {
  //   width: 100%;
  // }

  .detail-cnt-box {
    @include padding('top', 80px, 1.25);
    @include padding('bottom', 100px, 1.25);
    @include fontSize(16px, 1);
    .container {
      max-width: 1000px;
    }
  }

  .cnt-item {
    &:not(:first-of-type) {
      @include margin('top', 40px, 1);
    }
    &.large-margin {
      @include margin('top', 100px, 1);
    }
    &.middle-margin {
      @include margin('top', 60px, 1);
    }
    >h2 {
      @include margin('bottom', 25px, 1);
      @include fontSize(38px, 1);
    }
    >h3 {
      @include margin('bottom', 20px, 1);
      @include fontSize(28px, 1);
    }
  }
  .ldb-name {
    @include fontSize(54px, 1.75);
  }
  .ldb-category {
    color: #373737;
    background-color: #EEC75E;
    border-radius: 3px;
    @include padding(-1, 5px, 1);
    @include fontSize(14px, 1);
    &:not(:last-of-type) {
      @include margin('right', 10px, 1);
    }
  }
  .user-info {
    text-align: right;
  }

  .lord-name {
    @include margin('bottom', 5px, 1);
    @include fontSize(24px, 1);
    @include TTFontBolder()
  }
  .lord-address {
    @include fontSize(16px, 1);
  }
  .user-avatar {
    @include margin('left', 15px, 1);
    >svg {
      fill: #fff;
      width: 56px;
      height: 56px;
    }
  }

  .ldb-msg {
    @include margin('top', 10px, 1);
    @include fontSize(24px, 1);
  }

  .ldb-desc {
    line-height: 1.6;
    @include fontSize(18px, 1);
  }

  // cnt-features
  .cnt-features {

  }
  .features-item {
    min-width: 150px;
    font-weight: 500;
    >p {
      line-height: 200%;
      @include fontSize(24px, 1);
    }
    >div {
      @include fontSize(26px, 1);
    }
    &:not(:first-of-type) {
      @include margin('top', 30px, 1, -1);
      @include margin('left', 30px, -2);
    }
  }
  // .sell-input {
  //   width: 80px;
  //   height: 40px;
  // }
  .features-btn {
    // text-align: right;
    button {
      border-radius: 25px;
      @include TTFontBolder();
      @include margin-around(0, 0, 0, 15px, 1);
      @include padding-around(12px, 25px, 12px, 25px, 1);
      @include fontSize(24px, 1);
    }
  }
  .ldb-price {
    color: #EE4CF1;
    @include TTFontBolder()
  }

  .cnt-tasks {
  }
  .tasks-box {
    >div {
      &:not(:first-of-type) {
        @include margin('top', 40px, 1.3);
      }
    }
    .ldb-task-btn {
      &:not(:first-of-type) {
        @include margin('left', 40px, -1);
        @include margin('top', 40px, 1.3, -1);
      }
    }
  }
  .ldb-task-btn {
    font-weight: 500;
    border-radius: 8px;
    @include margin(-1, 0, -1, -1);
    @include padding-around(15px, 40px, 15px, 30px, 1);
    @include fontSize(24px, 1);
    svg {
      width: 30px;
      height: 30px;
    }
    >span {
      @include margin('left', 15px, 1);
    }
  }

  // history box
  .history-box {
    font-weight: 500;
    border-radius: 8px;
    overflow: auto;
    @include fontSize(20px, 1);
  }
  .history-container {
    width: 100%;
    min-width: 600px;
  }
  .history-item {
    // height: 50px;
    // line-height: 50px;
    text-indent: 45px;
    overflow: hidden;
    @include padding('top', 20px, 1);
    @include padding('bottom', 20px, 1);
  }
  .history-header {
    color: #715CB7;
    background-color: #270F72;
  }
  .history-cnt-box {
    padding: 15px 0;
    background-color: #31187F;
    color: #fff;
    @include padding('top', 15px, 1);
    @include padding('bottom', 15px, 1);
  }
  .history-no-records {
    @include padding('top', 50px, 1);
    @include padding('bottom', 50px, 1);
  }
  .history-cnt {

  }

  @media screen and (max-width: 768px) {
    .detail-header {
      height: calc((100vh / 2) + 50px);
      min-height: 350px;
    }
    .features-item {
      &:not(:first-of-type) {
        margin-top: 30px;
      }
    }
    .tasks-box {
      >div {
        &:not(:first-of-type) {
          margin-top: 30px;
        }
      }
      .ldb-task-btn {
        &:not(:first-of-type) {
          margin-left: 0;
          margin-top: 15px;
        }
      }
    }
  }
</style>
