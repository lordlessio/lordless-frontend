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
              <li class="TTFontBolder d-flex f-align-center bounty-candies-item cost" :class="{ 'is-green': chestStatus === 'unopened' && enoughHops, 'is-red': chestStatus === 'unopened' && !enoughHops }">
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
                class="bounty-candies-item chest-tx-item tx" :class="{ 'is-red': item.status === -1 }">
                <a v-if="item.tx" class="d-flex f-align-center" :href="`${ETHERSCANURL}/tx/${item.tx}`" target="_blank">
                  <span>{{ item.status === 0 ? 'Wrapping' : 'Wrap on' }}</span>
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
                class="bounty-candies-item chest-tx-item tx" :class="{ 'is-red': item.status === -1 }">
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
            :theme="enoughHops ? 'blue-linear' : 'red-linear'"
            :loading="btnLoading"
            :disabled="isChecking || isDisabled || btnLoading || chestStatus === 'unlocking'"
            @click="openPackage">
            <span v-if="enoughHops">Unlock the Bounty Chest</span>
            <span v-else>Deposit LESS to reap HOPS</span>
          </lordless-btn>
        </div>
      </div>
    </transition>
    <lordless-authorize
      ref="authorize"
      blurs
      tokenAllowanceType="bounty"
      :tokenBets="tokenBets"/>
  </div>
</template>

<script>
import BountyDetailSkeletion from '@/components/skeletion/_mobile/bounty/detail'

import { getBountyDetail, openBounty } from 'api'
import { weiByDecimals } from 'utils/tool'

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
      isChecking: false,
      isDisabled: false
    }
  },
  computed: {
    ...mapState('contract', [
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

    scrollOpt () {
      return {
        text: `#${this.chestDetail.bountyId || '?'} Chest detail`,
        match: /^\/owner\/chest\//,
        history: true,
        historyPath: '/owner/bounty/chests'
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
      return openBountyTx.filter(item => !!item.tx)
    },

    openseaLink () {
      const info = this.chestDetail
      return info.bountyId ? `https://opensea.io/assets/0xb9250c9581e4594b7c6914897823ad18d6b78e96/${info.bountyId}` : 'https://opensea.io/assets/lordless:bounty'
    },

    tokenBets () {
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
        }
      ]
    }
  },
  watch: {
    playInit (val) {
      val && this.initBountyChestStatus()
    }
  },
  components: {
    BountyDetailSkeletion
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    afterEnter () {
      this.initChestDetailBtnBox()
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
      await this.getChestInfo()
      if (!this.rendered) this.rendered = true
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
          this.$router.push('/owner/bounty/chests')
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
      console.log('come in bountychest')
      if (!info || !Bounty) return false

      console.log('come in bountychest ---- 2')

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
        const tokenEnough = tokenBalance >= (item.count * Math.pow(10, item.candy.decimals))
        console.log('tokenBalance', tokenBalance, tokenEnough)
        if (!tokenEnough) {
          isDisabled = true
        }
        return item
      }))

      this.isChecking = false
      this.isDisabled = isDisabled
      return isDisabled
    },

    async openPackage () {
      try {
        if (!this.enoughHops) {
          this.$router.push('/owner/hops')
          return
        }
        const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
        console.log('openPackage', authorize)
        if (!authorize) return
        this.btnLoading = true
        console.log('openBounty', authorize, openBounty)
        this.doOpenPackage()
      } catch (err) {
        this.btnLoading = false
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },
    async doOpenPackage (account = this.account, info = this.chestDetail, web3Opt = this.web3Opt, Bounty = this.Bounty) {
      this.btnLoading = true

      const isDisabled = await this.initBountyChestStatus()
      if (isDisabled) {
        this.btnLoading = false
        this.$notify.info({
          title: 'Info!',
          message: 'Waiting for withdraw open...',
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
        // const gas = (await growHopsParam.estimateGas(growHopsParam.name, growHopsParam.values)) || 139999
        const gas = 299999

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
    }
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
  }
</style>
