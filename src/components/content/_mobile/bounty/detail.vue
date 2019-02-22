<template>
  <div class="chest-detail-box">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-show="!web3Model || !connectModel"
      v-bind="scrollOpt"
      @history="$router.push(scrollOpt.historyPath)"/>
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <bounty-detail-skeletion v-if="loading"/>
      <div v-else>
        <div class="d-flex f-align-center chest-detail-header">
          <span class="inline-block line-height-0 chest-detail-box-icon">
            <svg>
              <use :xlink:href="`#icon-bounty-${chestGifts[chestStatus]}`"/>
            </svg>
          </span>
          <div class="chest-header-right">
            <p class="d-flex f-align-center">
              <span class="TTFontBolder relative text-upper chest-header-status">{{ chestStatus }}</span>
              <span></span>
              Bounty Chest
            </p>
            <h1>#{{ chestDetail.bountyId || '?' }}</h1>
          </div>
        </div>
        <div ref="chest-detail-cnt" class="chest-detail-cnt">
          <div v-if="!isOwner" class="chest-detail-candies-info chest-detail-owner">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-heart"/>
                </svg>
              </span>
              <span>OWNER</span>
            </h3>
            <div class="chest-owner-card">
              <a class="d-flex f-align-center" :href="openseaLink" target="_blank">
                <lordless-blockies :seed="chestDetail.user" :scale="7"/>
                <p class="v-flex text-break chest-owner-address">{{ chestDetail.user }}</p>
                <!-- <span class="inline-block line-height-0 chest-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span> -->
              </a>
            </div>
          </div>
          <div class="chest-detail-candies-info chest-detail-bounties">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-diamond"/>
                </svg>
              </span>
              <span>BOUNTIES</span>
            </h3>
            <ul class="chest-detail-candies-box">
              <li v-for="(item, index) of chestDetail.info" :key="`bounties_${index}`"
                class="d-flex f-align-center bounty-candies-item bounty">
                <span class="inline-block line-height-0 bounty-candy-icon">
                  <svg>
                    <use :xlink:href="`#coin-${item.candy.symbol.toLocaleLowerCase()}`"/>
                  </svg>
                </span>
                <span class="bounty-candy-symbol">{{ item.candy.symbol }}</span>
                <span class="v-flex text-right">x {{ item.count | formatMoneyNumber }}</span>
              </li>
            </ul>
          </div>
          <div class="chest-detail-candies-info chest-detail-cost">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-key"/>
                </svg>
              </span>
              <span>UNLOCKING COST</span>
            </h3>
            <p v-if="account" class="chest-hops-available">Available: {{ hopsBalanceNumber || 0 | formatMoneyNumber }} HOPS</p>
            <ul class="chest-detail-candies-box">
              <li class="TTFontBolder d-flex f-align-center bounty-candies-item cost" :class="{ 'is-green': chestStatus === 'unopened' && enoughHops && tokensBalanceInit, 'is-red': chestStatus === 'unopened' && !enoughHops && tokensBalanceInit }">
                <span class="inline-block line-height-0 bounty-candy-icon">
                  <svg>
                    <use xlink:href="#icon-origin-hops"/>
                  </svg>
                </span>
                <span class="bounty-candy-symbol">HOPS</span>
                <span class="v-flex text-right need-hops-amount">x {{ weiByDecimals(chestDetail.needHopsAmount).toLocaleString() }}</span>
              </li>
            </ul>
          </div>
          <div class="chest-detail-candies-info chest-txs-cost">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-box"/>
                </svg>
              </span>
              <span>TRANSACTIONS</span>
            </h3>
            <ul class="chest-detail-candies-box">
              <li v-for="(item, index) of packageBountyTxs" :key="`packageBounty_${index}`"
                class="bounty-candies-item chest-tx-item tx">
                <a v-if="item.tx" class="d-flex f-align-center" :href="`${ETHERSCANURL}/tx/${item.tx}`" target="_blank">
                  <span>{{ item.status === 0 ? 'Wrapping ...' : 'Wrap on' }}</span>
                  <span class="v-flex text-right">{{ (item.status === 0 ? item.startAt : item.finishAt) * 1000 | dateFormat('HH:mm MMM DD YYYY') }}</span>
                  <span class="inline-block line-height-0 chest-arrow-icon">
                    <svg>
                      <use xlink:href="#icon-arrow-line-right"/>
                    </svg>
                  </span>
                </a>
                <div v-else class="d-flex f-auto-center chest-waiting-btn">
                  Waiting for Wrap
                  <span class="inline-block line-height-0 chest-loading-icon">
                    <i class="el-icon-loading"></i>
                  </span>
                </div>
              </li>
              <li v-for="(item, index) of openBountyTxs" :key="`openBountyTxs_${index}`"
                class="bounty-candies-item chest-tx-item tx">
                <a class="d-flex f-align-center" :href="`${ETHERSCANURL}/tx/${item.tx}`" target="_blank">
                  <span>{{ item.status === 0 ? 'Unlock it' : 'Unlock on' }}</span>
                  <span class="v-flex text-right">{{ (item.status === 1 ? item.finishAt : item.startAt) * 1000 | dateFormat('HH:mm MMM DD YYYY') }}</span>
                  <span class="inline-block line-height-0 chest-arrow-icon">
                    <svg>
                      <use xlink:href="#icon-arrow-line-right"/>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div ref="chest-detail-btn-box" class="chest-detail-btn-box">
          <lordless-btn
            v-if="!isOwner"
            class="full-width chest-detail-btn"
            theme="blue-linear">
            <a class="full-width inline-block" :href="openseaLink" target="_blank">View on OpenSea</a>
          </lordless-btn>
          <lordless-btn
            v-else-if="chestStatus === 'unopened' || chestStatus === 'unlocking'"
            class="full-width chest-detail-btn"
            theme="blue-linear"
            :loading="isChecking || btnLoading || !tokensBalanceInit"
            :disabled="isChecking || !tokensBalanceInit || (enoughHops && (isDisabled || btnLoading || chestStatus === 'unlocking'))"
            @click="unlockBountyMethod">
            Unlock the Bounty Chest
          </lordless-btn>
        </div>
      </div>
    </transition>

    <lordless-popup-dialog
      :visible.sync="bountyPopupModel"
      @open="checkPendingTx"
      @opened="bountyPopupOpened"
      @closed="txPendingLoading = false">
      <div class="chest-detail-popup-box">
        <div class="TTFontBolder relative text-center chest-popup-header">
          {{ enoughHops ? 'Payment': 'HOPS insufficient' }}
          <span
            @click.stop="bountyPopupModel = false"
            class="TTFontBolder inline-block line-height-1 chest-popup-close">
            <i class="el-icon-close"></i>
          </span>
        </div>
        <div v-if="txPendingLoading" class="chest-popup-pending-box">
          <div class="d-flex f-auto-center chest-tx-pending-icon">
            <span class="inline-block line-height-0">
              <svg>
                <use xlink:href="#icon-large-loading"/>
              </svg>
            </span>
          </div>
          <lordless-btn theme="default" class="chest-popup-btn chest-popup-pending-btn" disabled>Transaction pending</lordless-btn>
        </div>
        <div v-else-if="enoughHops" class="chest-payment-popup-cnt">
          <div class="text-center chest-payment-header">
            <p>HOPS</p>
            <h1>{{ weiByDecimals(chestDetail.needHopsAmount).toLocaleString() }}</h1>
          </div>
          <ul class="payment-cnt-desc">
            <li class="d-flex f-align-center payment-cnt-item">
              <span>Item</span>
              <span class="v-flex text-right payment-item-text">Unlock Bounty Chest</span>
            </li>
            <li class="d-flex f-align-center payment-cnt-item">
              <span>Method</span>
              <span class="v-flex text-right payment-item-text">Wallet</span>
            </li>
          </ul>
          <lordless-btn
            class="chest-popup-btn"
            theme="blue-linear"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="paymentBounty">Pay now</lordless-btn>
        </div>
        <div v-else class="chest-deposit-popup-cnt">
          <div class="deposit-popup-header">
            <p class="deposit-popup-need">
              <span class="TTFontBolder">{{ weiByDecimals(chestDetail.needHopsAmount - hopsBalance).toLocaleString() }}</span> more HOPS needed.
            </p>
            <p class="deposit-popup-desc">Choose an option to calculate the minimum amount of LESS to deposit at least. <span @click.stop="$router.push('/owner/hops')">Click here to deposit more</span>.</p>
          </div>
          <ul ref="deposit-popup-slider" class="text-nowrap deposit-popup-slider">
            <li v-for="(item, index) of planBases" :key="index" class="inline-block deposit-slider-item" :data-active="item._id === activePlanBase._id">
              <hops-plant :info="item" :isActive="item._id === activePlanBase._id" :lessBalance="-1" small @choosePlan="choosePlan($event, index)"/>
            </li>
          </ul>
          <div class="deposit-popup-balance" :class="{ 'is-failed': !enoughDepositLess }">
            <h2>≈ {{ activePlanBase._id ? weiByDecimals(depositLessAmount).toLocaleString() : '???' }} <span>LESS</span></h2>
            <p v-if="enoughDepositLess">LESS balance in wallet sufficient.</p>
            <p v-else-if="!activePlanBase._id" class="deposit-choose-plan">Choose a deposit plan.</p>
            <p v-else>LESS insufficient. Still need <span class="TTFontBolder text-underline">{{ weiByDecimals(depositLessAmount - lessBalance + 1e16).toLocaleString() }}</span>.</p>
          </div>
          <lordless-btn
            class="chest-popup-btn"
            theme="blue-linear"
            :loading="btnLoading"
            :disabled="btnLoading"
            @click="depositLESS">
            <span v-if="enoughDepositLess && activePlanBase._id">Deposit now</span>
            <a v-else href="https://ddex.io/trade/LESS-WETH" target="_blank">Purchase on DDEX</a>
          </lordless-btn>
        </div>
      </div>
    </lordless-popup-dialog>

    <lordless-authorize
      ref="unlockBountyAuthorize"
      blurs
      tokenAllowanceType="bounty"
      :tokenBets="unlockBountyTokenBets"/>

    <lordless-authorize
      ref="depositAuthorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="depositTokenBets"/>
  </div>
</template>

<script>
import BountyDetailSkeletion from '@/components/skeletion/_mobile/bounty/detail'

import HopsPlant from '@/components/reuse/_mobile/card/plan/plant'

import { getBountyDetail, openBounty, getPlanBases, saveGrowHopsPlan } from 'api'
import { weiByDecimals } from 'utils/tool'
import { scrollToLeft } from 'utils/tool/animate'
import Decimal from 'decimal.js-light'

import { metamaskMixins, checkTokensBalanceMixins, publicMixins } from '@/mixins'

import { mapState } from 'vuex'
export default {
  name: 'bounty-chest-detail-component',
  mixins: [ metamaskMixins, checkTokensBalanceMixins, publicMixins ],
  data: () => {
    return {
      rendered: false,
      loading: true,
      btnLoading: false,
      chestDetail: {},
      chestStatus: 'wrapping',
      chestGifts: {
        wrapping: 'gift-wrapping',
        failed: 'gift-failed',
        opened: 'gift-opened',
        unlocking: 'gift',
        unopened: 'gift'
      },
      isChecking: true,
      isDisabled: false,

      // payment dialog
      bountyPopupModel: false,
      planBases: [],
      activePlanBase: {},
      txPendingLoading: false,
      bountyChestPendingTx: null
    }
  },
  computed: {
    ...mapState('contract', [
      'HOPSPlan',
      'Bounty',
      'tokensContract',
      'tokensContractInit'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('candy', [
      'candySymbols'
    ]),

    web3Loading () {
      return this.web3Opt.loading
    },
    web3Model () {
      const { loading, isConnected } = this.web3Opt
      return this.isMobile && !loading && !isConnected
    },

    connectModel () {
      return !this.userInfo.default && !this.userInfo._id
    },

    playInit () {
      const { loading, isConnected } = this.web3Opt
      return !loading && isConnected && !!this.chestDetail._id && !!this.Bounty && this.tokensContractInit
    },

    isOwner () {
      const info = this.chestDetail
      if (!info._id) return false
      return this.account && info.user.toLocaleLowerCase() === this.account.toLocaleLowerCase()
    },

    enoughHops () {
      const _hopsBalance = this.hopsBalance
      const _needHopsAmount = this.chestDetail.needHopsAmount
      console.log('----- _hopsBalance', _hopsBalance, _needHopsAmount)
      return _needHopsAmount && _hopsBalance >= _needHopsAmount
    },

    // 选择 plant 计算需要的 less 数量
    depositLessAmount () {
      const { _id, minimumAmount, lessToHops } = this.activePlanBase || {}
      const _hopsBalance = this.hopsBalance
      const _needHopsAmount = this.chestDetail.needHopsAmount
      if (!_id || _hopsBalance === undefined) return 0
      // const _lessBalance = this.lessBalance

      // 计算公式: (_needHopsAmount - _hopsBalance) / lessToHops
      let amount = new Decimal(_needHopsAmount).sub(_hopsBalance).div(lessToHops).toNumber()
      // let amount = (_needHopsAmount - _hopsBalance) / lessToHops
      if (amount < minimumAmount) {
        amount = minimumAmount
      }
      console.log('----- depositLessAmount', amount, 'minimum', minimumAmount, 'balance')

      return amount
    },

    // less balance 是否足够
    enoughDepositLess () {
      return this.lessBalance >= this.depositLessAmount && this.lessBalance >= this.activePlanBase.minimumAmount
    },

    isCouldUnlock () {
      return this.isChecking || this.enoughHops || !this.tokensBalanceInit
    },

    scrollOpt () {
      return {
        text: `#${this.chestDetail.bountyId || '?'} Chest detail`,
        match: /^\/owner\/chest\//,
        history: true,
        historyPath: '/owner/bc?type=chests'
      }
    },

    packageBountyTxs () {
      const info = this.chestDetail
      if (!info._id) return []
      const packageBountyTx = info.packageBountyTx
      return packageBountyTx
    },

    openBountyTxs () {
      const info = this.chestDetail
      if (!info._id) return []
      const openBountyTx = info.openBountyTx
      return (openBountyTx.filter(item => !!item.tx) || []).slice(0, 1)
    },

    openseaLink () {
      const info = this.chestDetail
      return info.bountyId ? `https://opensea.io/assets/0xb9250c9581e4594b7c6914897823ad18d6b78e96/${info.bountyId}` : 'https://opensea.io/assets/lordless:bounty'
    },

    unlockBountyTokenBets () {
      const candySymbols = this.candySymbols.list
      // let count = this.chestDetail.needHopsAmount
      if (!candySymbols || !this.chestDetail._id) return []
      let candy
      for (const item of candySymbols) {
        if (item.symbol === 'HOPS') {
          candy = JSON.parse(JSON.stringify(item))
          break
        }
      }
      return [
        {
          candy,
          count: this.chestDetail.needHopsAmount
        },
        {
          type: 'erc721',
          contract: 'BountyNFT'
        }
      ]
    },

    depositTokenBets () {
      const _info = this.activePlanBase
      return [
        {
          candy: _info.lessCandy,
          count: _info.minimumAmount
        }
      ]
    }
  },
  watch: {
    playInit (val) {
      console.log('----- playInit', val)
      if (val) {
        this.initBountyChestStatus()
        this.initBetterPlanBase()
      }
    }
  },
  components: {
    BountyDetailSkeletion,
    HopsPlant
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    afterEnter () {
      this.initChestDetailBtnBox()
    },

    bountyPopupOpened () {
      this.scrollToActiveBase()
    },

    scrollToActiveBase () {
      const sliderBox = this.$refs['deposit-popup-slider']
      const items = document.querySelectorAll('.deposit-popup-slider .deposit-slider-item')
      if (!sliderBox || !items.length) return
      // let _scrollLeft = 0
      for (const item of items) {
        const _active = item.getAttribute('data-active')
        // console.log(' scrollToActiveBase item', item, item.offsetLeft, _scrollLeft, item.getAttribute('data-active'))
        if (_active) {
          // _scrollLeft = item.offsetLeft
          scrollToLeft(sliderBox, { before: 0, end: item.offsetLeft - item.offsetWidth / 2, duration: 150, ltype: 'linear' })
          // sliderBox.scrollLeft = item.offsetLeft - item.offsetWidth / 2
          break
        }
      }
    },

    // 初始化最佳种植计划
    initBetterPlanBase () {
      const planBases = JSON.parse(JSON.stringify(this.planBases))
      const _hopsBalance = this.hopsBalance || 0
      const betterBase = (planBases.map(item => {
        const { _id, minimumAmount, lessToHops } = item || {}
        if (!_id) return item

        // 计算公式: (this.chestDetail.needHopsAmount - this.hopsBalance) / lessToHops
        let _amount = new Decimal(this.chestDetail.needHopsAmount).sub(_hopsBalance).div(lessToHops).toNumber()
        // let amount = (this.chestDetail.needHopsAmount - this.hopsBalance) / lessToHops
        if (_amount < minimumAmount) {
          _amount = minimumAmount
        }
        return Object.assign({}, item, {
          _amount
        })
      }).sort((a, b) => a._amount - b._amount))[0]
      this.activePlanBase = betterBase
      console.log('------------ -betterBase', betterBase)
    },

    initChestStatus (info = this.chestDetail) {
      let _status = 'wrapping'
      if (!info._id) return
      switch (true) {
        case info.packageBountyTx[0].status === 0:
          _status = 'wrapping'
          break
        case info.packageBountyTx[0].status !== 1:
          _status = 'failed'
          break
        case info.packageBountyTx[0].status === 1 && info.openBountyTx[0] && info.openBountyTx[0].status === 1:
          _status = 'opened'
          break
        case info.packageBountyTx[0].status === 1 && info.openBountyTx[0] && info.openBountyTx[0].status === 0:
          _status = 'unlocking'
          break
        case info.packageBountyTx[0].status === 1 && (!info.openBountyTx[0] || info.openBountyTx[0].status !== 0):
          _status = 'unopened'
          break
        default:
          _status = 'wrapping'
          break
      }
      this.chestStatus = _status
    },

    async initBountyChestDetail () {
      this.getPlanBasesInfo()
      await this.getChestInfo()
      if (!this.rendered) this.rendered = true
    },

    async choosePlan (info, index) {
      console.log('----- index', info, index)
      this.activePlanBase = info
    },

    async getPlanBasesInfo () {
      try {
        const res = await getPlanBases()
        if (res.code === 1000 && res.data) {
          this.planBases = res.data
        }
      } catch (err) {
        console.log('0---- err', err.message)
      }
    },

    async getChestInfo (bountyId = this.$route.params.bountyId) {
      this.loading = true
      try {
        const res = await getBountyDetail({ bountyId })
        if (res.code === 1000 && res.data) {
          this.chestDetail = res.data
          this.initChestStatus(res.data)
          console.log('-0000-------- before status')
          this.initBountyChestStatus(res.data)
        } else if (!res.data) {
          this.$router.push('/owner/bc?type=chests')
        }
      } catch (err) {
        console.log('----- get chest info err', err.message)
      }
      this.loading = false
    },

    // 初始化 chest 按钮
    initChestDetailBtnBox () {
      const box = this.$refs['chest-detail-btn-box']
      const parent = this.$refs['chest-detail-cnt']
      if (!box || !parent) return
      document.body.appendChild(box)
      this.$once('hook:beforeDestroy', () => {
        parent.appendChild(box)
      })
      this.$once('hook:deactivated', () => {
        parent.appendChild(box)
      })
    },

    async initBountyChestStatus ({ bountyId, info } = this.chestDetail, Bounty = this.Bounty, { web3js } = this.web3Opt, tokensContract = this.tokensContract) {
      if (!info || !Bounty) return false

      this.isChecking = true
      let isDisabled = false

      const contractAddress = Bounty.address
      // // 获取活动的开启状态，如果 luckyblockBase 为true，代表活动关闭
      // const luckyblockBase = await Bounty.methods('getLuckyblockBase', [ luckyblockId ])
      // console.log('luckyblockBase', luckyblockBase)

      await Promise.all(info.map(async item => {
        if (isDisabled) return
        const candy = item.candy.address
        if (!tokensContract[candy]) return
        // console.log('--- tokensContract', candy, tokensContract[candy].methods)
        const tokenBalance = (await tokensContract[candy].methods('balanceOf', [ contractAddress ])).toNumber() || 0

        // 判断 token 是否充足
        const tokenEnough = tokenBalance >= (parseFloat(item.count) * Math.pow(10, parseInt(item.candy.decimals)))
        console.log('tokenBalance', tokenBalance, item.count * Math.pow(10, item.candy.decimals), tokenEnough)
        if (!tokenEnough) {
          isDisabled = true
        }
        return item
      }))

      this.isChecking = false
      this.isDisabled = isDisabled
      return isDisabled
    },

    // unlock bounty 触发
    async unlockBountyMethod () {
      try {
        if (!this.isCouldUnlock) {
          this.bountyPopupModel = !this.bountyPopupModel
          return
        }
        const authorize = await this.$refs.unlockBountyAuthorize.checkoutAuthorize({ tokenAllowance: true })
        console.log('unlockBountyMethod', authorize)
        if (!authorize) return
        console.log('openBounty', authorize, openBounty)
        this.bountyPopupModel = !this.bountyPopupModel
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },

    // 支付 hops 打开 bounty
    async paymentBounty (account = this.account, info = this.chestDetail, web3Opt = this.web3Opt, Bounty = this.Bounty) {
      this.btnLoading = true

      const isDisabled = await this.initBountyChestStatus()
      if (isDisabled) {
        this.btnLoading = false
        this.$notify.error({
          title: 'Error!',
          message: 'Unknow error!',
          position: 'bottom-right',
          duration: 3500
        })
        return
      }

      const { balance } = (await this.setTokensBalance()).hops || {}

      // 如果查询出来的 less余额 小于 需要种植的 less余额 lessAmount
      if (balance < info.needHopsAmount) {
        this.btnLoading = false
        this.$notify.error({
          title: 'Error!',
          message: 'Insufficient HOPS Balance',
          position: 'bottom-right',
          duration: 3500
        })
        return
      }

      this.metamaskChoose = true
      // const bountyId = info.bountyId
      try {
        const openBountyParam = {
          name: 'openBounty',
          values: [ info.bountyId ]
        }
        const { gasPrice } = web3Opt
        const gas = (await Bounty.estimateGas(openBountyParam.name, openBountyParam.values)) || 500000
        console.log('--- gas', gas)
        // const gas = 299999

        const params = {
          gas,
          gasPrice,
          data: Bounty[openBountyParam.name].getData(info.bountyId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          to: Bounty.address,
          from: account
        }

        // console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          // console.log('tx', tx)

          const res = await openBounty({ tx, bountyId: info._id })
          if (res.code === 1000 && res.data) {
            const openBountyTx = [{
              tx,
              startAt: Math.ceil(new Date().getTime() / 1000),
              status: 0
            }]
            this.$set(this.chestDetail, 'openBountyTx', openBountyTx)
            this.$nextTick(() => this.initChestStatus())
          } else {
            this.$notify.error({
              title: 'Error!',
              message: res.errorMsg || 'unknow error!',
              position: 'bottom-right',
              duration: 3500
            })
          }
          this.metamaskChoose = false
          this.btnLoading = false

          this.txPendingLoading = true
          console.log('------------ deposit less tx', tx)
          this.loopCheckTx(tx)
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.btnLoading = false
          })
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },

    async depositLESS () {
      if (!this.enoughDepositLess || !this.activePlanBase._id) return
      try {
        const authorize = await this.$refs.depositAuthorize.checkoutAuthorize({ tokenAllowance: true })
        if (!authorize) return
        this.doDepositLESS()
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },

    // 种植 less
    async doDepositLESS (lessAmount = this.depositLessAmount, account = this.account, info = this.activePlanBase, HOPSPlan = this.HOPSPlan, web3Opt = this.web3Opt) {
      if (!info._id) return
      this.btnLoading = true

      const { balance } = (await this.setTokensBalance()).less || {}

      // 如果查询出来的 less余额 小于 需要种植的 less余额 lessAmount
      if (balance < lessAmount) {
        this.btnLoading = false
        this.$notify.error({
          title: 'Error!',
          message: 'Insufficient LESS Balance',
          position: 'bottom-right',
          duration: 3500
        })
        return
      }
      lessAmount = new Decimal(lessAmount).toFixed(0)

      this.metamaskChoose = true
      console.log('------- do deposit less', lessAmount, info.planBaseId)
      try {
        const growHopsParam = {
          name: 'growHops',
          values: [ info.planBaseId, lessAmount ]
        }
        const { gasPrice } = web3Opt
        // const gas = (await growHopsParam.estimateGas(growHopsParam.name, growHopsParam.values)) || 139999
        const gas = 299999

        const params = {
          gas,
          gasPrice,
          data: HOPSPlan[growHopsParam.name].getData(info.planBaseId, lessAmount),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          to: HOPSPlan.address,
          from: account
        }

        // console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          // console.log('tx', tx)

          await saveGrowHopsPlan({ tx, lessAmount, planBase: info._id })
          this.metamaskChoose = false
          this.btnLoading = false

          this.txPendingLoading = true
          this.loopCheckTx(tx)
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.btnLoading = false
          })
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },

    checkPendingTx (tx = this.bountyChestPendingTx) {
      if (tx) {
        this.txPendingLoading = true
      }
    },

    async loopCheckTx (tx = this.bountyChestPendingTx, web3js = this.web3Opt.web3js) {
      if (!tx) return

      this.bountyChestPendingTx = tx

      console.log(' ====== come in loop_CheckbountyChestPendingTx')

      let timeout = null
      const loopFunc = () => {
        // 创建新定时器实例
        timeout = setTimeout(async () => {
          let bool = false
          web3js.eth.getTransactionReceipt(tx, async (err, res) => {
            console.log('-------- check tx', err, res, !!res)
            if (err) {
              bool = false
              return
            }
            bool = !!res
            console.log('bountyChestPendingTx', tx, bool)
            clearTimeout(timeout)
            timeout = null

            if (bool) {
              await this.setTokensBalance()
              this.bountyChestPendingTx = null
              this.bountyPopupModel = false
            } else {
              return loopFunc()
            }
          })
        }, 5000)
      }
      this.$once('hook:beforeDestroy', () => {
        timeout && clearTimeout(timeout)
      })
      this.$once('hook:deactivated', () => {
        timeout && clearTimeout(timeout)
      })
      return loopFunc()
    }
  },
  deactivated () {
    this.activePlanBase = {}
    this.txPendingLoading = false
    this.bountyChestPendingTx = null
  },
  async activated () {
    if (!this.rendered) return
    await this.initBountyChestDetail()
    this.$nextTick(() => this.initChestDetailBtnBox())
  },
  mounted () {
    this.$nextTick(() => this.initBountyChestDetail())
  }
}
</script>

<style lang="scss" scoped>
  .chest-detail-box {
    padding-bottom: 50px;
  }
  /**
   *  chest-detail-header  -- begin
   */
  .chest-detail-header {
    padding: 68px 24px 24px;
    background-color: #0079FF;
  }
  .chest-detail-box-icon {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.5));
  }
  .chest-header-right {
    margin-left: 18px;
    color: #fff;
    >p {
      font-size: 14px;
    }
    >h1 {
      font-size: 36px;
    }
  }
  .chest-header-status {
    padding-right: 18px;
    box-sizing: border-box;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 6px;
      width: 5px;
      height: 5px;
      border-radius: 100%;
      background-color: #fff;
      transform: translateY(-50%);
    }
  }
  /**
   *  chest-detail-header  -- end
   */

  /**
   *  chest-detail-cnt  -- begin
   */
  .chest-detail-cnt {
    padding: 24px;
  }
  /**
   *  chest-detail-cnt  -- end
   */

  .chest-detail-candies-info {
    >h3 {
      font-size: 16px;
    }
    .package-info-icon {
      margin-right: 6px;
      width: 20px;
      height: 20px;
    }
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .chest-hops-available {
    margin-left: 24px;
    font-size: 14px;
    color: #777;
  }

  // chest-detail-owner
  .chest-detail-owner {

  }
  .chest-owner-card {
    margin-top: 18px;
    padding: 18px;
    border-radius: 5px;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }
  .chest-owner-address {
    margin-left: 12px;
    font-size: 14px;
    color: #777;
  }

  // chest-detail-bounties
  .chest-detail-bounties {
    // margin-top: 32px;
  }

  // chest-detail-cost
  .chest-detail-cost {
    // margin-top: 40px;
  }
  .bounty-candies-item {
    margin-top: 18px;
    padding: 18px;
    font-size: 16px;
    color: #555;
    background-color: #fff;
    border-radius: 5px;
    transition: all .3s;
    &.bounty {
      box-shadow: 0 0 8px 0 rgba(0, 121, 255, 0.45);
      .bounty-candy-icon {
        width: 20px;
        height: 20px;
      }
    }
    &.cost {
      color: #005736;
      box-shadow: 0 0 8px 0 rgba(0, 193, 167, 1);
      .bounty-candy-icon {
        width: 24px;
        height: 24px;
      }
    }
    &.tx {
      color: #555;
      box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
      .bounty-candy-icon {
        width: 24px;
        height: 24px;
      }
    }
    &.is-green {
      color: #fff;
      background-color: #00C1A7;
    }
    &.is-red {
      box-shadow: 0 0 8px 0 rgba(245, 81, 95, 0.7);
      .need-hops-amount {
        color: #F5515F;
      }
    }
  }
  .bounty-candy-symbol {
    margin-left: 10px;
  }
  .bounty-candy-icon {
    fill: #0079FF;
  }
  .chest-tx-item {

  }
  .chest-arrow-icon {
    margin-left: 8px;
    width: 14px;
    height: 14px;
    fill: #0079FF;
  }
  .chest-waiting-btn {
    color: #777;
  }
  .chest-loading-icon {
    margin-left: 12px;
    font-size: 16px;
  }

  .chest-detail-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .chest-detail-btn {
    padding: 16px 0;
    border-radius: 0;
    transition: all .3s;
  }

  /**
   *  chest-detail-popup-box  -- begin
   */
  .chest-detail-popup-box {
    background-color: #fff;
  }
  .chest-popup-header {
    padding: 14px 0;
    font-size: 16px;
    color: #555;
    border-bottom: 1px solid #ddd;
  }
  .chest-popup-close {
    position: absolute;
    top: 50%;
    right: 18px;
    font-size: 22px;
    color: #bbb;
    transform: translateY(-50%);
    >i {
      font-weight: bolder;
    }
  }
  .chest-popup-btn {
    padding: 15px 0;
    width: 100%;
    border-radius: 0;
  }

  // chest-popup-pending-box
  .chest-popup-pending-box {

  }
  @keyframes pendingRotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .chest-tx-pending-icon {
    padding: 42px 0;
    animation: pendingRotate 1s linear infinite;
    >span {
      width: 84px;
      height: 84px;
      fill: #0079FF;
    }
  }
  .chest-popup-pending-btn {
    color: #fff;
    background-color: #000 !important;
  }

  // chest-payment-popup-cnt
  .chest-payment-popup-cnt {

  }
  .chest-payment-header {
    padding: 36px 0;
    >p {
      font-size: 14px;
      color: #777;
    }
    >h1 {
      font-size: 36px;
      color: #0B2A48;
    }
  }
  .payment-cnt-desc {
    margin-bottom: 36px;
    padding: 0 20px;
  }
  .payment-cnt-item {
    padding: 12px 0;
    font-size: 16px;
    color: #777;
    border-bottom: 1px solid #ddd;
  }
  .payment-item-text {
    color: #0B2A48;
  }

  // chest-deposit-popup-cnt
  .chest-deposit-popup-cnt {

  }
  .deposit-popup-header {
    padding: 24px 20px 0;
    color: #777;
  }
  .deposit-popup-need {
    >span {
      color: #555;
    }
  }
  .deposit-popup-desc {
    margin-top: 8px;
    >span {
      color: #0079FF;
    }
  }
  .deposit-popup-slider {
    padding: 18px 20px 30px;
    @include overflow();
  }
  .deposit-slider-item {
    width: 192px;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
    // >p {
    //   font-size: 14px;
    //   color: #777;
    // }
    // .deposit-slider-held {
    //   // margin-top: 2px;
    //   font-size: 24px;
    //   color: #0079FF;
    // }
    &:not(:first-of-type) {
      margin-left: 12px;
    }
  }
  .deposit-popup-balance {
    margin-bottom: 25px;
    padding: 0 20px;
    >h2 {
      padding-top: 12px;
      font-size: 24px;
      color: #0B2A48;
      border-top: 1px solid #ddd;
      >span {
        font-size: 16px;
      }
    }
    >p {
      margin-top: 6px;
      font-size: 16px;
      color: #777;
    }
    .deposit-choose-plan {
      color: #0B2A48;
    }
    &.is-failed {
      >h2 {
        color: #999;
      }
      >p {
        color: #F5515F;
      }
      .deposit-choose-plan {
        color: #0B2A48;
      }
    }
  }
  /**
   *  chest-detail-popup-box  -- end
   */
</style>
