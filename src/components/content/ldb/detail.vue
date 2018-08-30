<template>
  <div class="ldb-detail-main">
    <ldb-header-tool
      ref="ldbDetailHeader"
      :info="ldbInfo"
      :dialog="dialog"
      :isHome.sync="isHome"
      :tasks.sync="candyTasks"
      :loading="infoLoading"
      :owner="ldbInfo.lord._id === userInfo._id"
      :userInfo="userInfo"
      @setHome="setHome"
      @receive="receiveCandy">
    </ldb-header-tool>
    <section class="ldb-detail-content" :class="{ 'show': contentShow }">
      <div class="container md d-flex sm-col-flex">
        <div class="detail-cnt-left v-flex">
          <ldb-datas-tool
            :info.sync="ldbInfo"
            :loading="infoLoading"
            @enter="contentShow = true">
          </ldb-datas-tool>

          <tasks-now-tool
            :candies="ldbTasks | ldbGroupCandies"
            :tasks="ldbTasks | ldbGroupTasks"
            :ldbId="ldbInfo._id"
            :owner="ldbInfo.lord.address === userInfo.address"
            :loading="ldbTaskLoading"
            @receive="receiveTask">
          </tasks-now-tool>

          <records-tool
            :list="ldbRecords.list"
            :total="ldbRecords.total"
            :loading="recordsLoading"
            @more="getLdbRecords({ more: true })">
          </records-tool>

          <!-- <approved-tasks-tool
            :list="[1,2]"
            :loading="ldbTaskLoading">
          </approved-tasks-tool> -->

        </div>
        <div class="detail-cnt-right">

          <approved-tasks-tool
            ref="approvedTask"
            class="detail-approved-tasks"
            :ldbId="ldbInfo._id"
            :loading="ldbTaskLoading">
          </approved-tasks-tool>

          <ldb-sale-tool
            :info.sync="ldbInfo"
            :pendings="ldbPendings"
            :user="userInfo"
            :loading="infoLoading"
            @buy="buyHandle"
            @sale="saleHandle"
            @cancel="cancelSaleHandle">
          </ldb-sale-tool>
          <!-- <ldb-candy-tool :list="candyLimits" :loading="ldbTaskLoading"></ldb-candy-tool> -->

        </div>
      </div>
    </section>
    <Authorize
      ref="authorize"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </Authorize>

    <!-- <order-dialog
      v-model="orderModel"
      :ldbInfo="ldbInfo"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </order-dialog> -->

    <!-- <ldb-buy
      v-model="buyModel"
      :ldbInfo="ldbInfo"
      @pending="ldbBuyPending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </ldb-buy> -->

    <ldb-sell
      v-model="sellModel"
      :ldbInfo="ldbInfo"
      @pending="ldbSellPending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </ldb-sell>
  </div>
</template>

<script>
import LdbHeaderTool from './tool/ldbHeader'
import LdbDatasTool from './tool/ldbDatas'
import TasksNowTool from './tool/tasksNow'
import RecordsTool from './tool/records'
import ApprovedTasksTool from './tool/approvedTasks'
import LdbSaleTool from './tool/sale'
import LdbCandyTool from './tool/candy'

// import SketchFab from '@/components/sketchfab'

import Authorize from '@/components/reuse/dialog/authorize'
// import OrderDialog from '@/components/reuse/dialog/ldb/order'
// import LdbBuy from '@/components/reuse/dialog/ldb/buy'
import LdbSell from '@/components/reuse/dialog/ldb/sell'

import range from 'lodash/range'
import { getMessageByCode } from 'utils/tool'
import { contractMixins, dialogMixins, metamaskMixins } from '@/mixins'
import { setHome, getHome, receiveTask, getLdbById, getActivitysByTokenId, getUserPendingsByTokenId, getLdb2Round } from 'api'

import { actionTypes } from '@/store/types'
import { mapActions } from 'vuex'
export default {
  mixins: [ contractMixins, dialogMixins, metamaskMixins ],
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {

      contentShow: false,

      // ldbInfo loading 状态
      infoLoading: true,

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

      // 当前建筑交易记录
      ldbRecords: {
        pn: 1,
        ps: 3,
        list: [],
        total: 0
      },

      recordsLoading: true,

      ldbTasks: [],

      candyTasks: [],

      ldbTaskLoading: true,

      // candyLimits: [],

      candies: [],

      // dialog options ----

      // 购买弹窗状态
      // buyModel: false,

      // 订单弹窗状态
      // orderModel: false,

      // 挂单弹窗状态
      sellModel: false,

      // 当前用户在该建筑中的 pending 状态
      ldbPendings: {
        isBuying: false,
        isSelling: false,
        isCanceling: false
      },

      isHome: false
    }
  },
  computed: {

    web3Opt () {
      return this.$root.$children[0].web3Opt
    }
  },
  watch: {
    // TavernNFTs (val) {
    //   if (val) {
    //     this.checkLdbNFT(this.ldbInfo.chain.tokenId, val)
    //   }
    // },
    // NFTsCrowdsale (val) {
    //   if (val) {
    //     this.checkCrowdsale(this.ldbInfo.chain.tokenId, val)
    //   }
    // },
    account (val, oval) {
      if (!oval) return
      this.initContractStatus()
      if (val) {
        this.checkHome({ userId: val })
        this.getLdbTasks({ userId: val })
        // this.checkOwner(this.ldbInfo.chain.tokenId)
        this.getUserPendings()
      }
    }
  },
  components: {
    LdbHeaderTool,
    LdbDatasTool,
    TasksNowTool,
    RecordsTool,
    ApprovedTasksTool,
    LdbSaleTool,
    LdbCandyTool,

    Authorize,
    // OrderDialog,
    // LdbBuy,
    LdbSell
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_UPT_USER_AP,
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_SET_USER_HOME
    ]),

    async setHome (ldbInfo = this.ldbInfo) {
      const authorize = await this.$refs.authorize.checkoutAuthorize()
      if (!authorize) return
      const res = await setHome({ ldbId: ldbInfo._id })
      if (res.code === 1000) {
        this.$notify({
          type: 'success',
          title: 'Home 设置成功!',
          message: `成功设置 ${ldbInfo.name.zh} 为Home`,
          position: 'bottom-right',
          duration: 1500
        })
        this[actionTypes.USER_SET_USER_HOME]({ home: { ldb: ldbInfo }, update: true })
        this.isHome = true
      }
    },

    async checkHome ({ ldbId = this.ldbInfo._id, userId = this.userInfo.address } = {}) {
      const res = await getHome({ userId })
      if (res.code === 1000 && res.data) {
        console.log('----- ldbId', ldbId, res.data)
        if (res.data._id === ldbId) this.isHome = true
        else this.isHome = false
      } else this.isHome = false
    },
    /**
     * 获取 ldb 建筑详情
     * @param {String} id 建筑 _id
     */
    async getLdbInfo (id) {
      this.infoLoading = true
      const res = await getLdbById({ id })
      if (res.code === 1000) {
        this.checkHome({ ldbId: res.data._id })
        this.getLdbTasks({ ldbId: res.data._id })
        this.getLdbRecords({ ldbInfo: res.data })
        this.getUserPendings({ ldbInfo: res.data })
        this.ldbInfo = Object.assign({}, this.ldbInfo, res.data)
      } else {
        this.$notify.error({
          title: '建筑信息获取失败!',
          message: getMessageByCode(res),
          position: 'bottom-right',
          duration: 5000
        })
      }
      this.infoLoading = false

      this.$nextTick(() => this.$emit('initInfo', this.ldbInfo))
    },

    /**
     * 获取当前用户基于当前建筑的市场合约执行状态
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getUserPendings ({ ldbInfo = this.ldbInfo } = {}) {
      const res = await getUserPendingsByTokenId({ tokenId: ldbInfo.chain.tokenId })
      if (res.code === 1000) {
        // 获取合约 pending 状态 及 pending的合约信息
        const { pendings, txs } = res.data

        // 修改 ldbPendings
        this.ldbPendings = pendings

        const status = {
          PayByEth: 'isBuying',
          NewAuction: 'isSelling',
          CancelAuction: 'isCanceling'
        }

        // 如果有 pending 状态，轮询此合约信息
        if (txs.length) {
          txs.map(item => {
            const loop = () => {
              this.checkTxEvent({ tx: item.tx.transactionHash }, ({ err, data }) => {
                if (err) return
                if (data.isPending) return loop()

                // 合约信息更新成功，修改 ldbPendings
                this.$set(this.ldbPendings, status[item.market[0].action], false)
              })
            }
            loop()
          })
        }
      }
    },

    /**
     * 获取当前建筑的交易记录
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getLdbRecords ({ ldbInfo = this.ldbInfo, ldbRecords = this.ldbRecords, more = false }) {
      if (!more) this.recordsLoading = true
      const { pn, ps } = ldbRecords
      const params = {
        tokenId: ldbInfo.chain.tokenId,
        opt: {
          pn: more ? pn + 1 : pn,
          ps,
          type: 'records'
        }
      }
      const res = await getActivitysByTokenId(params)
      if (res.code === 1000 && res.data) {
        if (this.ldbRecords.total) {
          this.ldbRecords = Object.assign({}, this.ldbRecords, res.data, {
            list: this.ldbRecords.list
          })
        } else this.ldbRecords = res.data
      }
      this.recordsLoading = false
    },

    /**
     * 获取当前建筑任务情况
     */
    async getLdbTasks ({ ldbId = this.ldbInfo._id, userId = this.userInfo.address } = {}) {
      this.ldbTaskLoading = true
      const res = await getLdb2Round({ ldbId })
      if (res.code === 1000 && res.data) {
        this.ldbTasks = res.data
        this.getCandyByTasks(res.data)
      }
      this.ldbTaskLoading = false
    },

    /**
     * 根据当前建筑的任务数据，获取糖果数据
     */
    getCandyByTasks (tasks = this.ldbTasks) {
      // const candyLimits = []
      const candies = []
      for (const item of tasks) {
        // const { totalAp, limitPreRound, ldbTaskType } = item
        const { ldbTaskType } = item
        candies.push(ldbTaskType.candyType.symbol)
        // candyLimits.push({ totalAp, limitPreRound, apCost: ldbTaskType.apCost, symbol: ldbTaskType.candyType.symbol })
      }
      this.candies = Array.from(new Set(candies))

      // 过滤糖果任务
      const filterTasks = tasks.filter(item => item.ldbTaskType.taskType === 1)
      const candyTasks = filterTasks.map(item => {
        const countLeft = item.countLeft
        if (countLeft) return range(countLeft).map((round, index) => Object.assign({}, item, { tid: item._id + '_' + index }))
        return []
      })
      console.log('candyTasks', candyTasks)
      this.candyTasks = candyTasks
      // this.candyLimits = candyLimits
    },

    /**
     * 初始化组件状态
     */
    initStatus () {
      this.infoLoading = true
      this.ldbTaskLoading = true
      this.recordsLoading = true
    },

    /**
     * 初始化合约状态
     */
    initContractStatus () {
      // this.orderModel = false
      // this.buyModel = false
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
     * 购买建筑展开弹窗事件
     */
    async buyHandle ({ ldbInfo = this.ldbInfo, web3Opt = this.web3Opt, NFTsCrowdsale = this.NFTsCrowdsale } = {}) {
      try {
        // 检查市场权限
        const authorize = await this.$refs.authorize.checkoutAuthorize()

        const tokenId = ldbInfo.chain.tokenId
        if (!authorize || !tokenId) return

        // 根据 tokenId 获取建筑链上信息
        const ldb = await NFTsCrowdsale.methods('getAuction', [tokenId])
        console.log('buy => submitBuy --- getAuction:', ldb[2].toNumber(), tokenId)

        this.metamaskChoose = true

        const { gasPrice } = web3Opt

        // 传输的合约参数
        const payByEth = {
          name: 'payByEth',
          values: [ tokenId ]
        }

        // 估算 gas
        // const gas = await NFTsCrowdsale.payByEth.estimateGas(tokenId)
        const gas = (await NFTsCrowdsale.estimateGas(payByEth.name, payByEth.values)) || 600000

        // 根据链上信息购买建筑
        NFTsCrowdsale.methods(payByEth.name, payByEth.values.concat([{ gas, gasPrice, value: ldb[2] }]))
          .then(tx => {
            console.log('----- buyHandle tx', tx)
            // this.buyPending = true
            this.metamaskChoose = false

            // 修改 isBuying 状态
            this.$set(this.ldbPendings, 'isBuying', true)

            const loop = () => {
              // 轮询 tx 状态
              this.checkTxEvent({ tx, action: payByEth.name, tokenId }, ({ data, err }) => {
                if (err) return
                if (data.isPending) return loop()

                // 关闭 buy dialog
                // this.buyModel = false

                this.$set(this.ldbPendings, 'isBuying', false)

                // 购买完毕，改变 ldbInfo
                // 改变市场状态
                this.$set(this.ldbInfo.chain.auction, 'isOnAuction', false)

                // 改变领主信息
                if (this.userInfo.address && this.userInfo.address !== this.ldbInfo.lord.address) {
                  this.$set(this.ldbInfo, 'lord', this.userInfo)
                }

                this.$set(this.ldbRecords, 'list', [].concat(this.ldbRecords.list, data))
                this.$set(this.ldbRecords, 'total', this.ldbRecords.total + 1)

                this.$nextTick(() => {
                  // this.orderModel = true
                  // this.checkOwner(tokenId)
                })
              })
            }
            loop()
          })
          .catch((err) => {
            console.log('err', err)
            this.metamaskChoose = false
          })

        // this.buyModel = true
      } catch (err) {
        console.log('err', err)
      }
    },

    /**
     * 出售建筑
     */
    async saleHandle ({ ldbInfo = this.ldbInfo } = {}) {
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
    async cancelSaleHandle ({ ldbInfo = this.ldbInfo, NFTsCrowdsale = this.NFTsCrowdsale, web3Opt = this.web3Opt } = {}) {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize({ crowdsale: true })
        const tokenId = ldbInfo.chain.tokenId
        if (!authorize || !tokenId) return

        this.metamaskChoose = true

        this.$set(this.ldbPendings, 'isCanceling', true)
        // 传输的合约参数
        const cancelAuction = {
          name: 'cancelAuction',
          values: [ tokenId ]
        }

        // 估算 gas，不准
        // const gas = (await NFTsCrowdsale.estimateGas(cancelAuction.name, cancelAuction.values)) || 599999
        const gas = 599999

        const { gasPrice } = web3Opt

        // 执行合约
        NFTsCrowdsale.methods(cancelAuction.name, cancelAuction.values.concat([{ gas, gasPrice }]))
          .then(tx => {
            this.metamaskChoose = false
            console.log('unsell tx', tx)
            const loop = () => {
              this.checkTxEvent({ tx, action: cancelAuction.name, tokenId }, ({ err, data }) => {
                if (err) return
                if (data.isPending) return loop()

                this.$set(this.ldbPendings, 'isCanceling', false)

                // 改变市场状态
                this.$set(this.ldbInfo.chain.auction, 'isOnAuction', false)

                // this.checkOwner(tokenId)
              })
            }
            loop()
          })
          .catch((err) => {
            console.log('err', err)
            this.metamaskChoose = false
            this.$set(this.ldbPendings, 'isCanceling', false)
          })
      } catch (err) {
        console.log('err', err)
        this.$set(this.ldbPendings, 'isCanceling', false)
      }
    },

    /**
     * 购买建筑之后触发的合约 pending 状态
     */
    // async ldbBuyPending ({ tx, tokenId = this.ldbInfo.chain.tokenId, action } = {}) {
    //   // 修改 isBuying 状态
    //   this.$set(this.ldbPendings, 'isBuying', true)

    //   const loop = () => {
    //     // 轮询 tx 状态
    //     this.checkTxEvent({ tx, action, tokenId }, ({ data, err }) => {
    //       if (err) return
    //       if (data.isPending) return loop()

    //       // 关闭 buy dialog
    //       // this.buyModel = false

    //       this.$set(this.ldbPendings, 'isBuying', false)

    //       // 购买完毕，改变 ldbInfo
    //       // 改变市场状态
    //       this.$set(this.ldbInfo.chain.auction, 'isOnAuction', false)

    //       // 改变领主信息
    //       if (this.userInfo.address && this.userInfo.address !== this.ldbInfo.lord.address) {
    //         this.$set(this.ldbInfo, 'lord', this.userInfo)
    //       }

    //       this.$set(this.ldbRecords, 'list', [].concat(this.ldbRecords.list, data))
    //       this.$set(this.ldbRecords, 'total', this.ldbRecords.total + 1)

    //       this.$nextTick(() => {
    //         this.orderModel = true
    //         this.checkOwner(tokenId)
    //       })
    //     })
    //   }
    //   loop()
    // },

    /**
     * 挂售建筑之后触发的合约 pending 状态
     */
    async ldbSellPending ({ tx, tokenId = this.ldbInfo.chain.tokenId, price, action } = {}, { isPending = true } = {}) {
      this.$router.push('/owner/activity')
      // 修改 isSelling 状态
      // this.$set(this.ldbPendings, 'isSelling', true)

      // if (!isPending) {
      //   // 关闭 buy dialog
      //   this.sellModel = false
      //   this.$set(this.ldbPendings, 'isSelling', false)

      //   // 改变市场状态
      //   this.$set(this.ldbInfo.chain.auction, 'isOnAuction', true)
      //   this.$set(this.ldbInfo.chain.auction, 'price', price)

      //   this.$nextTick(() => {
      //     this.checkOwner(tokenId)
      //   })
      // }
    },
    /**
     * 领取糖果事件
     */
    async receiveCandy ({ _id, countLeft, ldbTaskType } = {}, cb) {
      if (!countLeft || !_id) return cb()

      // 检查登陆权限状态
      const authorize = await this.$refs.authorize.checkoutAuthorize()
      if (!authorize) return cb()

      const cbData = {}
      const res = await receiveTask({ roundId: _id, ldbId: this.ldbInfo._id })
      if (res.code === 1000) {
        cbData.data = res.data

        this.$notify({
          type: 'success',
          title: '糖果领取成功!',
          message: `成功领取 ${res.data.executor.reward.count.toFixed(4)} 个 ${ldbTaskType.candyType.symbol.toUpperCase()}`,
          position: 'bottom-right',
          duration: 1500
        })

        // 根据消耗的ap值，手动更新 userInfo 的ap值
        this[actionTypes.USER_UPT_USER_AP](res.data.apCost)

        // 根据返回的建筑经验，修改当前建筑经验
        this.$set(this.ldbInfo, 'activeness', this.ldbInfo.activeness + res.data.ldb.activeness)
        this.$set(this.ldbInfo, 'apLeft', this.ldbInfo.apLeft - res.data.apCost)
      } else {
        this.$notify.error({
          title: '糖果领取失败!',
          message: getMessageByCode(res),
          position: 'bottom-right',
          duration: 3500
        })
        cbData.errorMsg = res.errorMsg
        if (res.code === 2001) {
          await this[actionTypes.USER_SET_USER_BY_TOKEN]()
          this.$refs.ldbDetailHeader.getCandyTasks()
        } else if (res.code === 2011) {
          await this.getLdbTasks()
        }
      }
      return cb(cbData)
    },

    /**
     * 领取任务事件
     */
    async receiveTask ({ _id, countLeft } = {}, cb) {
      if (!countLeft) {
        this.$notify.error({
          title: '任务领取失败!',
          message: '超出任务领取上限',
          position: 'bottom-right',
          duration: 3500
        })
      }
      if (!countLeft || !_id) return cb()

      // 检查登陆权限状态
      const authorize = await this.$refs.authorize.checkoutAuthorize({ telegram: true })
      console.log('authorize', authorize)
      if (!authorize) return cb()

      const cbData = {}
      const res = await receiveTask({ roundId: _id, ldbId: this.ldbInfo._id })
      if (res.code === 1000 && res.data) {
        cbData.data = res.data

        // 根据消耗的ap值，手动更新 userInfo 的ap值
        this[actionTypes.USER_UPT_USER_AP](res.data.apCost)

        console.log('ldbInfo', this.ldbInfo)
        // 根据返回的建筑经验，修改当前建筑经验
        this.$set(this.ldbInfo, 'activeness', this.ldbInfo.activeness + res.data.ldb.activeness)
        this.$set(this.ldbInfo, 'apLeft', this.ldbInfo.apLeft - res.data.apCost)
      } else {
        this.$notify.error({
          title: '任务领取失败!',
          message: getMessageByCode(res),
          position: 'bottom-right',
          duration: 3500
        })
        cbData.errorMsg = res.errorMsg
      }
      return cb(cbData)
    },

    destory () {
      this.$refs.approvedTask.clearApproved()
      this.initStatus()
      this.initContractStatus()
      this.clearCInterval({ all: true })
    }
  },
  beforeDestroy () {
    this.destory()
  },
  mounted () {
    // if (!this.dialog) {
    //   window.screenTop = '80px'
    // }
    this.$nextTick(() => this.$emit('mounted'))
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ldb-detail-main {
    /deep/ .ldb-left-section {
    margin-top: 50px;
    >h3 {
      font-family: $--font-TTNormsMedium;
      font-weight: normal;
      >span {
        color: #999;
        font-size: 18px;
      }
    }
  }
  /deep/ .left-section-cnt {
      margin-top: 30px;
    }
  }

  /**
   *  ldb-detail-content  -- begin
   */
  .ldb-detail-content {
    position: relative;
    opacity: 0;
    transform: translateY(0);
    z-index: 2;
    transition: opacity .15s ease-in-out, transform .45s ease-in-out;
    &.show {
      opacity: 1;
      transform: translateY(-80px);
    }
  }

  /* detail-cnt-right */
  .detail-cnt-right {
    margin-left: 40px;
    width: 100%;
    max-width: 300px;
  }
  .detail-approved-tasks {
    margin-bottom: 60px;
  }
</style>
