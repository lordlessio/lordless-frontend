<template>
  <div class="ldb-detail-main" :class="theme">
    <!-- <ld-loading :loading="loading"></ld-loading> -->
    <div class="detail-header">

      <!-- detail header 骨架 -->
      <skeletion-box v-model="detailLoading" absolute></skeletion-box>

      <!-- sketch fab -->
      <transition name="ld-hide-in-fade">
        <sketch-fab v-if="!detailLoading" :poster="ldbInfo.ldbIcon.source.detail | reldbIcon('detail')" class="detail-fab"/>
      </transition>
    </div>

    <!-- detail cnt 骨架 -->
    <skeletion-detail-cnt v-if="detailLoading"></skeletion-detail-cnt>
    <transition name="ld-hide-in-fade">
      <div v-if="!detailLoading" class="detail-cnt-box">
        <div class="container">
          <div class="cnt-item cnt-header">
            <el-row justify="end" align="bottom">
              <el-col :md="12" :sm="24">
                <h1 class="d-flex lg-row-flex sm-col-flex f-align-baseline ldb-name">
                  <span>{{ ldbInfo.name.zh }}</span>
                  <span class="lg-mar-l1 TTFontNormal ldb-category">{{ ldbInfo.origin.category[0] }}</span>
                  <!-- <span class="ldb-category" v-for="(category, index) of ldbInfo.origin.category.split(',')" :key="index">{{ category }}</span> -->
                </h1>
                <div class="ldb-msg">
                  <p class="TTFontNormal d-flex f-align-center">
                    <span class="line-height-1">
                      <i class="el-icon-location-outline"></i>
                    </span>
                    <span class="inline-block ldb-location">{{ ldbInfo.chain.lng | transferCoords | sliceStr}}, {{ ldbInfo.chain.lat | transferCoords | sliceStr }}</span>
                    <!-- <span class="inline-block"> · {{ ldbInfo.address }}</span> -->
                    <!-- <span class="inline-block ldb-address">{{ ldbInfo.address }}</span> -->
                  </p>
                  <!-- <p v-if="ldbInfo.category">
                    <span class="inline-block ldb-category" v-for="(category, index) of ldbInfo.category.split(',')" :key="index">{{ category }}</span>
                  </p> -->
                </div>
              </el-col>
              <el-col :md="12" :sm="24" class="sm-hidden">
                <div class="d-flex f-align-center">
                  <div class="user-info v-flex">
                    <div v-if="ldbInfo.lord">
                      <p class="lord-name">
                        {{ ldbInfo.lord.nickName || 'LORDLESS' }}
                      </p>
                      <p class="TTFontNormal lord-address">{{ ldbInfo.lord.address | splitAddress({ symbol: '******' }) }}</p>
                    </div>
                  </div>
                  <div class="user-avatar">
                    <lordless-blockies
                      ref="lordBlockies"
                      jump
                      :scale="9"
                      radius='8px'
                      :fontSize="'24px'"
                      :seed="ldbInfo.lord.address">
                    </lordless-blockies>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="TTFontNormal cnt-item ldb-desc">{{ ldbInfo.desc.zh }}</div>
          <div class="cnt-item cnt-features">
            <div class="d-flex sm-col-flex features-container">
              <div class="d-inline-flex lg-col-flex sm-row-flex sm-f-align-center features-price features-item">
                <p>Price</p>
                <div class="ldb-price text-nowrap">
                  <span>{{ ldbInfo.chain.auction.price | weiToEth }}</span>
                  <span>ETH</span>
                </div>
              </div>
              <div class="inline-block features-time features-item">
                <p>Time Left</p>
                <div>
                  <p class="TTFontBolder">Expires in 30 days</p>
                </div>
              </div>
              <div class="v-flex lg-text-right sm-text-left features-btn features-item">
                <ld-button
                  v-if="showSell"
                  theme="deep-blue"
                  :disabled="ldbPendings.isSelling"
                  shadow
                  contract
                  @click="sell">{{ ldbPendings.isSelling ? 'Selling' : 'Sell'}}</ld-button>

                <ld-button
                  v-if="showUnSell"
                  theme="deep-blue"
                  :disabled="ldbPendings.isCanceling"
                  shadow
                  contract
                  @click="unsell">{{ ldbPendings.isCanceling ? 'Un Selling' : 'Un Sell'}}</ld-button>

                <ld-button
                  v-if="showBuy"
                  theme="purple"
                  :disabled="ldbPendings.isBuying"
                  shadow
                  contract
                  @click="buy">
                  <span v-if="!userInfo.address">Sign to Do</span>
                  <span v-if="userInfo.address">{{ ldbPendings.isBuying ? 'Buying' : 'Buy' }}</span>
                </ld-button>
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
                      <use xlink:href="#icon-telegram"/>
                    </svg>
                  </span>
                  <span>关注 EOS Telegram</span>
                </ld-button>
                <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                  <span class="line-height-1">
                    <svg>
                      <use xlink:href="#icon-telegram"/>
                    </svg>
                  </span>
                  <span>关注 EOS Telegram</span>
                </ld-button>
              </div>
              <div>
                <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                  <span class="line-height-1">
                    <svg>
                      <use xlink:href="#icon-medium"/>
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
                  <el-col :span="5">
                    奖励 Candy
                  </el-col>
                  <el-col :span="5">
                    WHEN
                  </el-col>
                  <el-col :span="7">
                    FROM
                  </el-col>
                  <el-col :span="7">
                    TO
                  </el-col>
                </el-row>
                <el-row class="history-cnt-box">
                  <el-row class="history-item history-cnt">
                    <el-col :span="5" class="color-pink">
                      <span>20 </span>
                      <span class="text-upper">EOS</span>
                    </el-col>
                    <el-col :span="5">
                      <span>1000</span>
                      <span class="text-cap">exp</span>
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
                      <span>关注</span>
                      <span class="text-upper">Eos</span>
                      <span class="text-cap">Telegram</span>
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
                      4 months ago
                    </el-col>
                  </el-row>
                  <el-row class="history-item history-cnt">
                    <el-col :span="5" class="color-pink">
                      <span>5 </span>
                      <span class="text-upper">NAS</span>
                    </el-col>
                    <el-col :span="5">
                      <span>500</span>
                      <span class="text-cap">exp</span>
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
                      <span>关注</span>
                      <span class="text-upper">Nebulas</span>
                      <span class="text-cap">Twitter</span>
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
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
                  <el-col :span="5">
                    PRICE
                  </el-col>
                  <el-col :span="5">
                    WHEN
                  </el-col>
                  <el-col :span="7">
                    FROM
                  </el-col>
                  <el-col :span="7">
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
                    <el-col :span="5" class="color-pink">
                      <span>{{ record.market[0].price | weiToEth }}</span>
                      <span class="text-upper">ETH</span>
                    </el-col>
                    <el-col :span="5">
                      {{ record.created_at | timeFormat }}
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
                      {{ record.market[0].seller | splitAddress({ before: 10 }) }}
                    </el-col>
                    <el-col :span="7" class="sm-text-ellipsis">
                      {{ record.market[0].buyer | splitAddress({ before: 10 }) }}
                    </el-col>
                  </el-row>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <lordless-authorize
      ref="authorize"
      @pending="authorizePending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)"/>

    <order-dialog
      v-model="orderModel"
      :ldbInfo="ldbInfo"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)"/>

    <ldb-buy
      v-model="buyModel"
      :ldbInfo="ldbInfo"
      @pending="ldbBuyPending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)"/>

    <ldb-sell
      v-model="sellModel"
      :ldbInfo="ldbInfo"
      @pending="ldbSellPending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)"/>
  </div>
</template>

<script>
import skeletionDetailCnt from '@/components/skeletion/detail_cnt'
import skeletionBox from '@/components/skeletion/box'

import ImgBox from '@/components/stories/image'
import UserAvatar from '@/components/reuse/userAvatar'
import LdButton from '@/components/stories/button'
import LdLoading from '@/components/stories/loading'
import Blockies from '@/components/stories/blockies'

import SketchFab from '@/components/reuse/sketchfab'

// import Authorize from '@/components/reuse/dialog/authorize'
import OrderDialog from '@/components/reuse/dialog/ldb/order'
import LdbBuy from '@/components/reuse/dialog/ldb/buy'
import LdbSell from '@/components/reuse/dialog/ldb/sell'

import { contractMixins, dialogMixins } from '@/mixins'
import { getLdbById, getActivitysByTokenId, getUserPendingsByTokenId } from 'api'

export default {
  mixins: [ contractMixins, dialogMixins ],
  props: {

    // ldb 建筑id
    // ldbId: String,

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
        chain: {
          lng: '',
          lat: '',
          auction: {}
        },
        ldbIcon: {
          source: {}
        }
      },

      recordsLoading: false,

      // dialog options ----

      // 购买弹窗状态
      buyModel: false,

      // 订单弹窗状态
      orderModel: false,

      // 挂单弹窗状态
      sellModel: false,

      // contract options ----

      // 合约pending状态
      contractPending: false,

      // 合约轮询查询定时器
      ldbTxInterval: null,

      // 当前用户在该建筑中的 pending 状态
      ldbPendings: {
        isBuying: false,
        isSelling: false,
        isCanceling: false
      }
    }
  },
  computed: {

    showSell () {
      // const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return !this.showSign && this.isOwner && !ldbInfo.chain.auction.isOnAuction
    },

    showUnSell () {
      // const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return !this.showSign && this.isOwner && ldbInfo.chain.auction.isOnAuction
    },

    showBuy () {
      // const { init, isSell } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return ldbInfo.chain.auction.isOnAuction
    },

    showSign () {
      return !this.userInfo.address
    },

    isOwner () {
      // contract mixin 合约检查状态
      const { init, ldbNFTOwner, crowdsaleOwner } = this.contractStatus
      const ldbInfo = this.ldbInfo
      return (!this.showSign && ldbInfo.lord.address === this.userInfo.address) && (ldbNFTOwner || crowdsaleOwner) && init
      // return (!this.showSign && ldbInfo.lord.address === this.userInfo.address) && (ldbNFTOwner || crowdsaleOwner)
    },

    web3Opt () {
      return this.$root.$children[0].web3Opt
    }
  },
  components: {
    skeletionDetailCnt,
    skeletionBox,

    ImgBox,
    LdButton,
    SketchFab,
    LdLoading,
    Blockies,

    UserAvatar,
    // Authorize,
    OrderDialog,

    LdbBuy,
    LdbSell
  },
  methods: {

    /**
     * 获取 ldb 建筑详情
     * @param {String} id 建筑 _id
     */
    async getLdbInfo (id) {
      console.log('dialog', this.dialog)
      this.detailLoading = true
      const res = await getLdbById({ id, pula: 'ldbIcon' })
      if (res.code === 1000) {
        this.getLdbRecords(res.data)
        this.getUserPendings(res.data)
        this.ldbInfo = Object.assign({}, this.ldbInfo, res.data)
      } else this.errorMsg = res.errorMsg || '未知错误'
      this.detailLoading = false

      this.$nextTick(() => this.$emit('initInfo', this.ldbInfo))
    },

    /**
     * 获取当前用户基于当前建筑的市场合约执行状态
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getUserPendings (ldbInfo = this.ldbInfo) {
      if (!this.account) return
      const res = await getUserPendingsByTokenId({ tokenId: ldbInfo.chain.tokenId })
      if (res.code === 1000) {
        // 获取合约 pending 状态 及 pending的合约信息
        const { pendings, txs } = res.data

        // 修改 ldbPendings
        this.ldbPendings = pendings

        const status = {
          payByEth: 'isBuying',
          newAuction: 'isSelling',
          cancelAuction: 'isCanceling'
        }

        // 如果有 pending 状态，轮询此合约信息
        if (txs.length) {
          txs.map(item => {
            this.checkTxEvent({ tx: item.tx.transactionHash }, () => {
              // 合约信息更新成功，修改 ldbPendings
              this.$set(this.ldbPendings, status[item.market[0].action], false)
            })
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
        tokenId: ldbInfo.chain.tokenId,
        opt: {
          pn: 1,
          ps: 10,
          type: 'records'
        }
      }
      const res = await getActivitysByTokenId(params)
      if (res.code === 1000) {
        this.ldbRecords = res.data.list
      } else {
        this.errorMsg = res.errorMsg
      }
      this.recordsLoading = false
    },

    /**
     * 初始化组件状态
     */
    initStatus () {
      this.detailLoading = false
      this.recordsLoading = false
      this.errorMsg = null
    },

    /**
     * 初始化合约状态
     */
    initContractStatus () {
      this.orderModel = false
      this.buyModel = false
      this.sellModel = false
      this.ldbPendings = {
        isBuying: false,
        isSelling: false,
        isUnSelling: false
      }
    },

    /**
     * 初始化组件
     */
    init (ldbId) {
      this.getLdbInfo(ldbId)
    },

    /**
     * 改变 ldbInfo 值
     */
    changeInfo () {

    },

    /**
     * 购买建筑
     */
    // async buy ({ ldbInfo = this.ldbInfo, NFTsCrowdsale = this.NFTsCrowdsale, web3Opt = this.web3Opt } = {}) {
    //   // 检查市场权限
    //   const authorize = await this.$refs.authorize.checkoutAuthorize()
    //   const tokenId = ldbInfo.chain.tokenId

    //   if (!tokenId || !authorize) return

    //   console.log('buy => submitBuy --- ldbInfo:', ldbInfo)

    //   // 根据 tokenId 获取建筑链上信息
    //   const ldb = await NFTsCrowdsale.methods('getAuction', [tokenId])
    //   console.log('buy => submitBuy --- getAuction:', ldb[2].toNumber(), tokenId)

    //   this.metamaskChoose = true

    //   const { gasPrice } = web3Opt

    //   // 传输的合约参数
    //   const payByEth = {
    //     name: 'payByEth',
    //     values: [ tokenId ]
    //   }

    //   // 估算 gas
    //   // const gas = await NFTsCrowdsale.payByEth.estimateGas(tokenId)
    //   const gas = (await NFTsCrowdsale.estimateGas(payByEth.name, payByEth.values)) || 300000

    //   // 根据链上信息购买建筑
    //   NFTsCrowdsale.methods(payByEth.name, payByEth.values.concat([{ gas, gasPrice, value: ldb[2] }]))
    //     .then(tx => {
    //       console.log('-----tex', tx)
    //       this.buyPending = true
    //       this.metamaskChoose = false
    //       this.$emit('pending', tx)
    //     })
    //     .catch((err) => {
    //       console.log('err', err)
    //       this.metamaskChoose = false
    //     })
    // },

    /**
     * 购买建筑展开弹窗事件
     */
    async buy ({ ldbInfo = this.ldbInfo } = {}) {
      try {
        // 检查市场权限
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        console.log('authorize', authorize, ldbInfo.chain.tokenId)

        const tokenId = ldbInfo.chain.tokenId
        if (!authorize || !tokenId) return

        this.buyModel = true
      } catch (err) {
        console.log('err', err)
      }
    },

    /**
     * 出售建筑
     */
    async sell ({ ldbInfo = this.ldbInfo } = {}) {
      try {
        // 检查市场权限
        const authorize = await this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
        console.log('sell --- authorize', authorize)

        const tokenId = ldbInfo.chain.tokenId
        if (!authorize || !tokenId) return

        this.sellModel = true
      } catch (err) {
        console.log('err', err)
      }
    },

    /**
     * 取消挂售
     */
    async unsell ({ ldbInfo = this.ldbInfo, NFTsCrowdsale = this.NFTsCrowdsale, web3Opt = this.web3Opt } = {}) {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
        const tokenId = ldbInfo.chain.tokenId
        if (!authorize || !tokenId) return

        this.$set(this.ldbPendings, 'isCanceling', true)
        // 传输的合约参数
        const cancelAuction = {
          name: 'cancelAuction',
          values: [ tokenId ]
        }

        // 估算 gas,不准
        // const gas = (await NFTsCrowdsale.estimateGas(cancelAuction.name, cancelAuction.values)) || 599999
        const gas = 599999

        const { gasPrice } = web3Opt

        // 执行合约
        NFTsCrowdsale.methods(cancelAuction.name, cancelAuction.values.concat([{ gas, gasPrice }]))
          .then(tx => {
            console.log('unsell tx', tx)
            this.checkTxEvent({ tx, action: cancelAuction.name, tokenId }, () => {
              this.$set(this.ldbPendings, 'isCanceling', false)

              // 改变市场状态
              this.$set(this.ldbInfo.chain.auction, 'isOnAuction', false)

              this.checkOwner(tokenId)
            })
          })
          .catch((err) => {
            console.log('err', err)
            this.$set(this.ldbPendings, 'isCanceling', false)
          })
      } catch (err) {
        console.log('err', err)
        this.$set(this.ldbPendings, 'isCanceling', false)
      }
    },

    /**
     * 授权市场权限的合约 pending 状态
     */
    async authorizePending ({ tx }) {
      this.checkCrowdsaleEvent({ address: this.userInfo.address }, () => {
        this.$refs.authorize.checkoutAuthorize()
      })
    },

    /**
     * 购买建筑之后触发的合约 pending 状态
     */
    async ldbBuyPending ({ tx, tokenId = this.ldbInfo.chain.tokenId, action } = {}) {
      // 修改 isBuying 状态
      this.$set(this.ldbPendings, 'isBuying', true)

      // 轮询 tx 状态
      this.checkTxEvent({ tx, action, tokenId }, ({ err }) => {
        // 关闭 buy dialog
        this.buyModel = false
        if (err) {
          this.errorMsg = err
          console.log('err', err)
          return
        }
        this.$set(this.ldbPendings, 'isBuying', false)

        // 购买完毕，改变 ldbInfo
        // 改变市场状态
        this.$set(this.ldbInfo.chain.auction, 'isOnAuction', false)

        // 改变领主信息
        if (this.userInfo.address && this.userInfo.address !== this.ldbInfo.lord.address) {
          this.$set(this.ldbInfo, 'lord', this.userInfo)
          // this.$nextTick(() => {
          //   this.$refs.lordBlockies.reset()
          // })
        }

        this.$nextTick(() => {
          this.orderModel = true
          this.checkOwner(tokenId)
        })
      })
    },

    /**
     * 挂售建筑之后触发的合约 pending 状态
     */
    async ldbSellPending ({ tx, tokenId = this.ldbInfo.chain.tokenId, action } = {}) {
      // 修改 isSelling 状态
      this.$set(this.ldbPendings, 'isSelling', true)

      // 轮询 tx 状态
      this.checkTxEvent({ tx, action, tokenId }, ({ err }) => {
        // 关闭 buy dialog
        this.sellModel = false
        if (err) {
          this.errorMsg = err
          console.log('err', err)
          return
        }
        this.$set(this.ldbPendings, 'isSelling', false)

        // 改变市场状态
        this.$set(this.ldbInfo.chain.auction, 'isOnAuction', true)

        this.$nextTick(() => {
          this.checkOwner(tokenId)
        })
      })
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
    // ldbId (val) {
    //   if (val) this.getLdbInfo(val)
    // },
    TavernNFTs (val) {
      if (val) {
        this.checkLdbNFT(this.ldbInfo.chain.tokenId, val)
      }
    },
    NFTsCrowdsale (val) {
      if (val) {
        this.checkCrowdsale(this.ldbInfo.chain.tokenId, val)
      }
    },
    account (val) {
      this.initContractStatus()
      if (val) {
        console.log('---------account', val)
        this.checkOwner(this.ldbInfo.chain.tokenId)
        this.getUserPendings()
      }
    }
  },
  mounted () {
    this.$nextTick(() => this.$emit('mounted'))
  }
}
</script>

<style lang="scss" scoped>
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
    width: 100%;
    // height: inherit;
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
    @include fontSize(24px, 1.2);
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
