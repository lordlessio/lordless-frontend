<template>
  <div class="ldb-detail-main">
    <ldb-header-tool
      :info="ldbInfo"
      :dialog="dialog"
      :loading="infoLoading">
    </ldb-header-tool>
    <section class="ldb-detail-content">
      <div class="container md d-flex sm-col-flex">
        <div class="detail-cnt-left v-flex">
          <ldb-datas-tool
            :info="ldbInfo"
            :loading="infoLoading">
          </ldb-datas-tool>

          <tasks-now-tool
            :candies="ldbTasks | ldbGroupCandies"
            :tasks="ldbTasks | ldbGroupTasks"
            :ldbId="ldbInfo._id"
            :loading="ldbTaskLoading">
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
          <ldb-sale-tool
            :info="ldbInfo"
            :pendings="ldbPendings"
            :contractStatus="contractStatus"
            :user="userInfo"
            :loading="infoLoading"
            @buy="buyHandle"
            @sale="saleHandle"
            @cancel="cancelSaleHandle">
          </ldb-sale-tool>

          <approved-tasks-tool
            :ldbId="ldbInfo._id"
            :loading="ldbTaskLoading">
          </approved-tasks-tool>
          <!-- <ldb-candy-tool :list="candyLimits" :loading="ldbTaskLoading"></ldb-candy-tool> -->

        </div>
      </div>
    </section>
    <Authorize
      ref="authorize"
      @pending="authorizePending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </Authorize>

    <order-dialog
      v-model="orderModel"
      :ldbInfo="ldbInfo"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </order-dialog>

    <ldb-buy
      v-model="buyModel"
      :ldbInfo="ldbInfo"
      @pending="ldbBuyPending"
      @blurs="dialogSetBlurs($event, dialog ? 1 : 0)">
    </ldb-buy>

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
import OrderDialog from '@/components/reuse/dialog/ldb/order'
import LdbBuy from '@/components/reuse/dialog/ldb/buy'
import LdbSell from '@/components/reuse/dialog/ldb/sell'

import { contractMixins, dialogMixins } from '@/mixins'
import { getLdbById, getActivitysByTokenId, getUserPendingsByTokenId, getLdb2Round } from 'api'
export default {
  mixins: [ contractMixins, dialogMixins ],
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {

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

      ldbTaskLoading: true,

      // candyLimits: [],

      candies: [],

      // dialog options ----

      // 购买弹窗状态
      buyModel: false,

      // 订单弹窗状态
      orderModel: false,

      // 挂单弹窗状态
      sellModel: false,

      // 当前用户在该建筑中的 pending 状态
      ldbPendings: {
        isBuying: false,
        isSelling: false,
        isCanceling: false
      }
    }
  },
  computed: {

    web3Opt () {
      return this.$root.$children[0].web3Opt
    }
  },
  watch: {
    LDBNFTs (val) {
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
        this.checkOwner(this.ldbInfo.chain.tokenId)
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
      this.infoLoading = true
      const res = await getLdbById({ id, pula: 'ldbIcon' })
      if (res.code === 1000) {
        this.getLdbTasks({ ldbId: res.data._id })
        this.getLdbRecords({ ldbInfo: res.data })
        this.getUserPendings({ ldbInfo: res.data })
        this.ldbInfo = Object.assign({}, this.ldbInfo, res.data)
      } else this.errorMsg = res.errorMsg || '未知错误'
      this.infoLoading = false

      this.$nextTick(() => this.$emit('initInfo', this.ldbInfo))
    },

    /**
     * 获取当前用户基于当前建筑的市场合约执行状态
     * @param {Object} ldbInfo 当前建筑对象
     */
    async getUserPendings ({ ldbInfo = this.ldbIntfo } = {}) {
      if (!this.account) return
      const res = await getUserPendingsByTokenId({ tokenId: ldbInfo.chain.tokenId })
      if (res.code === 1000) {
        // 获取合约 pending 状态 及 pending的合约信息
        const { pendings, txs } = res.data

        // 修改 ldbPendings
        this.ldbPendings = pendings

        const status = {
          PayByEthSuccess: 'isBuying',
          NewAuction: 'isSelling',
          CancelAuction: 'isCanceling'
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
            list: [].concat(this.ldbRecords.list, res.data.list)
          })
        } else this.ldbRecords = res.data
      }
      this.recordsLoading = false
    },

    /**
     * 获取当前建筑任务情况
     */
    async getLdbTasks ({ ldbId = this.ldbInfo._id, userId = this.userInfo.address }) {
      this.ldbTaskLoading = true
      const res = await getLdb2Round({ ldbId, userId })
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
      // this.candyLimits = candyLimits
    },

    /**
     * 初始化组件状态
     */
    initStatus () {
      this.infoLoading = false
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
     * 购买建筑展开弹窗事件
     */
    async buyHandle ({ ldbInfo = this.ldbInfo } = {}) {
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
      this.checkTxEvent({ tx, action, tokenId }, ({ data, err }) => {
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
        }

        this.$set(this.ldbRecords, 'list', [].concat(this.ldbRecords.list, data))
        this.$set(this.ldbRecords, 'total', this.ldbRecords.total + 1)

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
    }
  },
  mounted () {
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
    transform: translateY(-80px);
    z-index: 2;
  }

  /* detail-cnt-right */
  .detail-cnt-right {
    margin-left: 40px;
    width: 100%;
    max-width: 300px;
  }
</style>
