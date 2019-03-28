<template>
  <div class="v-flex mobile-hops-box">
    <transition name="ld-hide-fade" mode="out-in">
      <mobile-hops-skeletion v-if="!tokensBalanceInit || loading"/>
      <div v-else class="mobile-hops-container">
        <div class="mobile-hops-header">
          <!-- <div class="d-flex f-align-center hops-user-box">
            <lordless-blockies theme="light" :scale="7" :seed="account"/>
            <p class="v-flex text-break hops-user-account">{{ account }}</p>
          </div> -->
          <div class="user-wallet-box">
            <h2>
              {{ lessBalanceNumber.toLocaleString() }}
              <span>LESS(Wallet)</span>
            </h2>
            <p>HELD = HOPS earned per LESS on a deposit</p>
          </div>
          <div class="hops-boosts-box">
            <!-- 目前只有 referee boost,所以 tavernkeep 暂时不显示 -->
            <ul class="hops-boosts-ul">
              <li v-for="(boost, index) of planBoostsList"
                :key="index"
              class="TTFontBolder d-flex f-align-center hops-boost-item" :class="{ 'is-none': boost.none }" @click.stop="boost.routePath ? $router.push(boost.routePath) : null">
                <span class="inline-block line-height-0 hops-boost-icon">
                  <svg>
                    <use :xlink:href="boost.number ? boost.icon : boost.grayIcon"/>
                  </svg>
                </span>
                <span class="v-flex boost-item-text">{{ boost.text }}</span>
                <span class="inline-block line-height-0 boost-number-text">+ {{ boost.number }}%</span>
                <span class="inline-block line-height-0 boost-arrow-right">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </li>
              <li class="TTFontBolder d-flex f-align-center hops-boost-item hops-boost-total-item" :class="{ 'total-none': !boostNumber }">
                <span class="inline-block line-height-0 hops-boost-icon">
                  <svg>
                    <use xlink:href="#icon-rocket"/>
                  </svg>
                </span>
                <span class="v-flex boost-item-text boost-total-text">Total</span>
                <span class="inline-block line-height-0 boost-total-number">+ {{ boostNumber * 100 }}%</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="hops-planting-box">
          <div class="hops-section-item">
            <h3>Plants</h3>
            <ul class="d-flex f-wrap f-align-center hops-planting-list">
              <li class="hops-planting-item" v-for="(planBase, index) of planBases" :key="index">
                <hops-plant
                  :info="planBase"
                  :lessBalance="lessBalance"
                  :boost="boostNumber"
                  :isActive="depositInfo._id === planBase._id"
                  @choosePlan="choosePlan"/>
              </li>
            </ul>
          </div>

          <div class="hops-section-item">
            <h3>Deposit</h3>
            <div class="d-flex f-align-center hops-planBase-deposit">
              <div class="v-flex hops-planBase-item hops-planBase-left">
                <p class="d-flex f-align-center planBase-deposit-amount">
                  <span class="v-flex">Deposit amount</span>
                  <span class="TTFontBolder color-blue planBase-deposit-all" @click.stop="depositAll">Deposit all</span>
                </p>
                <div class="TTFontBolder d-flex f-align-center planBase-deposit-input-box">
                  <span>LESS</span>
                  <input
                    ref="depositInput"
                    v-model="depositModel"
                    type="number"
                    class="v-flex lordless-input planBase-deposit-input"
                    :class="{ 'is-error': !loading && (isInsufficientLess || !isMoreThanMix) }"
                    :placeholder="`${lessBalanceNumber.toLocaleString()} available`"/>
                </div>
              </div>
              <div class="v-flex d-flex f-align-center hops-planBase-item planBase-deposit-tips-box">
                <span class="inline-block line-height-0 deposit-tips-icon">
                  <svg v-if="!isInsufficientLess">
                    <use xlink:href="#coin-hops"/>
                  </svg>
                  <a v-else class="full-width inline-block line-height-0" href="https://ddex.io/trade/LESS-WETH" target="_blank">
                    <img class="full-width" src="//lordless-sh.oss-cn-shanghai.aliyuncs.com/exchanges/icon/DDEX.svg"/>
                  </a>
                </span>
                <div class="v-flex d-flex f-align-center deposit-tips-desc">
                  <p v-if="!depositModel">Input deposit amount to show how many HOPS  you can reap.</p>
                  <p v-else-if="!isMoreThanMix">The minimum amount of the PRO plan is {{ depositInfo.minimumAmount | weiByDecimals }} LESS.</p>
                  <p v-else-if="!isInsufficientLess">
                    Reap <span>{{ depositModel * depositInfo.lessToHops * (1 + boostNumber) }}</span> HOPS immediately.
                  </p>
                  <p v-else>
                    Your balance of LESS is insufficient. Purchase some more on
                    <a class="text-underline" href="https://ddex.io/trade/LESS-WETH" target="_blank">
                      DDEX.
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="depositInfo._id" class="deposit-boost-btns">
            <div v-if="needLessNumber > 0" class="d-flex f-align-center deposit-insufficient-boost">
              <div class="v-flex d-flex col-flex f-justify-center insufficient-fixed-left">
                <p>Reach the minimum needs</p>
                <h3>{{ needLessNumber.toLocaleString() }} LESS</h3>
              </div>
              <lordless-btn
                theme="purple-linear"
                class="boost-insufficient-btn">
                <a href="https://ddex.io/trade/LESS-WETH" target="_blank">Purchase</a>
                </lordless-btn>
            </div>
            <div v-else-if="isRefereeBoost" class="deposit-has-boost">
              <lordless-btn
                theme="purple-linear"
                class="v-flex boost-fixed-btn"
                :loading="btnLoading"
                :disabled="!isRequireDeposit || btnLoading"
                @click="growHops"
                >Deposit LESS</lordless-btn>
            </div>
            <div v-else class="d-flex f-align-center deposit-none-boost">
              <lordless-btn
                theme="red-linear"
                class="v-flex boost-fixed-btn"
                @click="$router.push(`/owner/referee?refer=${$route.fullPath}`)"
                >Get a boost</lordless-btn>
              <lordless-btn
                theme="purple-linear"
                class="v-flex mar-l2 boost-fixed-btn"
                :loading="btnLoading"
                :disabled="!isRequireDeposit || btnLoading"
                @click="growHops"
                >No thanks, Go ahead</lordless-btn>
            </div>
          </div>

          <div class="plant-asked-box">
            <p class="TTFontBolder text-center plant-asked-title">FREQUENTLY ASKED QUESTIONS</p>
            <ul class="plant-asked-questions">
              <li
                class="asked-questions-item"
                v-for="(item, index) of askedQuestions" :key="index">
                <h3 class="asked-questions-title">{{ item.title }}</h3>
                <p class="TTFontNormal asked-questions-desc">{{ item.desc }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
    <lordless-plan-glossary-dialog v-model="glossaryModel" type="deposit"/>

    <lordless-authorize
      ref="plantAuthorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/>
    <lordless-authorize
      ref="growplusAuthorize"
      blurs
      tokenAllowanceType="growplus"
      :tokenBets="tokenBets"/>
    <!-- <lordless-authorize
      ref="authorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/> -->
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import MobileHopsSkeletion from '@/components/skeletion/_mobile/hops'
import HopsPlant from '@/components/reuse/_mobile/card/plan/plant'

import { getPlanBases, saveGrowHopsPlan } from 'api'
import { formatNumber, weiByDecimals, dateFormat } from 'utils/tool'

import { mapState } from 'vuex'

import { metamaskMixins, checkTokensBalanceMixins, publicMixins, initLoadingMixins, planBoostsMixins } from '@/mixins'
export default {
  name: 'lordless-hops-component',
  mixins: [ metamaskMixins, checkTokensBalanceMixins, publicMixins, initLoadingMixins, planBoostsMixins ],
  props: {
    // account: {
    //   type: String,
    //   default: ''
    // }
  },
  data: () => {
    return {
      rendered: false,
      depositInfo: {},
      planBases: [],
      // tokenBets: [],
      askedQuestions: [
        {
          title: 'What’s a HOPS?',
          desc: "HOPS is LORDLESS's fungible, ERC20 cryptocurrency token. HOPS will be mined when you make a LESS Term Deposit. HOPS is burned, or spent, in opening bounty chest and many other scenarios. So HOPS is mined and burned in real time."
        },
        {
          title: 'What’s a Planting plan?',
          desc: 'A LESS term deposit is a LESS investment held at LORDLESS. Your LESS is invested for an agreed rate of interest over a fixed amount of time, or term. In contrast to traditional term deposit in the bank, LORDLESS would pay the HOPS as advance interest.'
        },
        {
          title: 'What’s the meaning of HELD?',
          desc: 'HELD is acronym for "HELD = HOPS earned on every LESS per deposit". For example, 10 HELD means that 1 LESS can earn 10 HOPS per deposit. You can make more HOPS if you choose a LESS Term deposit with higher HELD.'
        }
      ],
      glossaryModel: false,

      btnLoading: false,
      depositModel: '',
      tokenBets: []
    }
  },
  computed: {
    ...mapState('contract', [
      'HOPSPlan',
      'GrowHopsPlus'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('user', [
      'userInfo'
    ]),

    boostNumber () {
      return this.depositInfo.version === 2 ? this.userTotalBoost : 0
    },

    needLessNumber () {
      const depositInfo = this.depositInfo
      return weiByDecimals(depositInfo.minimumAmount) - this.lessBalanceNumber
    },

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

    scrollOpt () {
      return {
        text: `${this.planLockDays} day term deposit`,
        match: /^\/owner\/planBase/,
        history: true,
        historyPath: '/owner/hops'
      }
    },

    isMoreThanMix () {
      return this.depositModel >= weiByDecimals(this.depositInfo.minimumAmount)
    },

    isInsufficientLess () {
      return this.depositModel > this.lessBalanceNumber
    },

    isRequireDeposit () {
      return !this.isInsufficientLess && this.isMoreThanMix && this.depositModel
    },

    oldHeldValue () {
      const info = this.depositInfo
      if (!info._id) return 0
      return info.lessToHops.toFixed(1).toString()
    },

    heldValue () {
      const info = this.depositInfo
      if (!info._id) return 0
      const _boostNumber = this.boostNumber
      const _heldValue = (new Decimal(info.lessToHops).mul(1 + _boostNumber)).toString()
      return _heldValue.split('.')[1] ? _heldValue : _heldValue + '.0'
    },

    planLockDays () {
      const info = this.depositInfo
      if (!info._id) return {}
      return info.lockTime / 3600 / 24
    },

    planType () {
      const info = this.depositInfo
      if (!info._id) return {}
      const _planTypes = {
        0: 'QUICK',
        1: 'BASIC',
        2: 'PLUS',
        3: 'PRO'
      }
      return _planTypes[this.depositInfo.level]
    },

    detailsInfo () {
      const info = this.depositInfo
      if (!info._id) return []
      return [
        {
          title: 'Plan',
          text: this.planType
        },
        {
          title: 'HELD',
          text: this.heldValue,
          question: true
        },
        {
          title: 'Deposit Period',
          text: `${this.planLockDays} day`
        },
        {
          title: 'Deposit on',
          text: dateFormat(new Date(), 'MMM. DD YYYY')
        },
        {
          title: 'Mature on',
          text: dateFormat(new Date(new Date().getTime() + info.lockTime * 1000), 'MMM. DD YYYY')
        }
      ]
    }
  },
  components: {
    HopsPlant,
    MobileHopsSkeletion
  },
  methods: {
    formatNumber () {
      return formatNumber(...arguments)
    },

    async choosePlan (planBase) {
      this.depositInfo = planBase
    },

    initMethod () {
      this.getPlanBasesMethod()
    },
    async getPlanBasesMethod () {
      this.loading = true
      try {
        const res = await getPlanBases({ version: 2 })
        if (res.code === 1000 && res.data) {
          this.planBases = res.data
          this.depositInfo = res.data[1]
        }
      } catch (err) {
        console.log('0---- err', err.message)
      }
      console.log('--------------- getPlanBasesMethod')
      this.loading = false
    },

    depositAll () {
      const _number = new Decimal(this.lessBalance).div(1e18).toString()
      const _numberSplits = _number.split('.')
      this.depositModel = _numberSplits[0] + '.' + (_numberSplits[1] ? _numberSplits[1].slice(0, 4) : 0)
    },

    reset () {
      this.btnLoading = false
    },

    async growHops (info = this.depositInfo) {
      this.btnLoading = true

      const _depositModel = this.depositModel * 1e18
      this.tokenBets = [
        {
          candy: info.lessCandy,
          count: _depositModel
        }
      ]
      this.$nextTick(async () => {
        try {
          const authorize = info.version === 2 ? this.$refs.growplusAuthorize : this.$refs.plantAuthorize
          if (!authorize) return
          const bool = await authorize.checkoutAuthorize({ tokenAllowance: true })
          if (!bool) {
            this.btnLoading = false
            return
          }

          this.doGrowHops(_depositModel)
        } catch (err) {
          this.btnLoading = false
          this.$notify.error({
            title: 'Error!',
            message: err.message || 'unknow error',
            position: 'bottom-right',
            duration: 3500
          })
        }
      })
    },

    async doGrowHops (
      lessAmount = this.depositModel * 1e18,
      account = this.account,
      info = this.depositInfo,
      HOPSPlan = this.HOPSPlan,
      GrowHopsPlus = this.GrowHopsPlus,
      web3Opt = this.web3Opt
    ) {
      if (!this.isRequireDeposit) return
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

      const GrowContract = info.version === 2 ? GrowHopsPlus : HOPSPlan

      this.metamaskChoose = true
      try {
        const growHopsParam = {
          name: 'growHops',
          values: [ info.planBaseId, lessAmount ]
        }
        const { gasPrice } = web3Opt
        const gas = (await GrowContract.estimateGas(growHopsParam.name, growHopsParam.values)) || 299999
        // const gas = 299999

        const params = {
          gas,
          gasPrice,
          // data: HOPSPlan[growHopsParam.name].getData(info.planBaseId, lessAmount),
          data: GrowContract[growHopsParam.name].getData(info.planBaseId, lessAmount),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          // to: HOPSPlan.address,
          to: GrowContract.address,
          from: account
        }

        // console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          // console.log('tx', tx)

          await saveGrowHopsPlan({ tx, lessAmount, planBase: info._id })
          this.metamaskChoose = false
          this.btnLoading = false

          this.$nextTick(() => this.$emit('deposit'))
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
  activated () {
    console.log('--------  activated', this.rendered)
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initMethod()
  },
  mounted () {
    this.$nextTick(() => this.initMethod())
  }
}
</script>

<style lang="scss" scoped>
  .mobile-hops-box {
    padding-bottom: 50px;
  }
  .mobile-hops-container {
    padding: 0 20px;
  }

  /**
   *  mobile-hops-header -- begin
   */
  .mobile-hops-header {
    margin: 0 -20px 0;
    padding: 24px 24px 0;
    background-color: #0079FF;
  }
  // .hops-user-box {
  //   color: #fff;
  // }
  // .hops-user-account {
  //   margin-left: 18px;
  //   font-size: 16px;
  // }
  .user-wallet-box {
    color: #fff;
    >h2 {
      font-size: 24px;
      >span {
        font-size: 16px;
      }
    }
    >p {
      margin-top: 6px;
      font-size: 12px;
    }
  }
  .hops-boosts-box {
    margin-top: -40px;
    padding: 18px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .15);
    transform: translateY(65px);
  }
  .hops-boost-item {
    padding-bottom: 18px;
    font-size: 16px;
    &.is-none {
      .boost-number-text {
        display: none;
      }
      .boost-arrow-right {
        display: inline-block;
      }
      .boost-item-text {
        color: $--main-blue-color;
      }
    }
  }
  .hops-boost-total-item {
    padding-top: 18px;
    padding-bottom: 0;
    border-top: 1px solid #ddd;
    &.total-none {
      .boost-total-number {
        color: $--main-red-color;
      }
    }
  }
  .boost-total-number {
    color: $--main-blue-color;
  }
  .boost-item-text {
    margin-left: 12px;
    color: #777;
  }
  .boost-total-text {
    color: $--main-color;
  }
  .boost-arrow-right {
    display: none;
    fill: #777;
    width: 14px;
    height: 14px;
  }
  .hops-boost-icon {
    width: 24px;
    height: 24px;
  }
  // .hops-wallet-box {
  //   padding: 24px 36px;
  //   font-size: 16px;
  //   color: #555;
  //   background-color: #fff;
  //   border-radius: 5px;
  //   box-shadow: 0 0 10px 0 rgba(0, 0, 0, .15);
  //   transform: translateY(20px);
  //   h3 {
  //     margin-top: 4px;
  //     font-size: 24px;
  //     color: #0B2A48;
  //   }
  // }
  // .hops-wallet-purchase {
  //   >img {
  //     margin-right: 6px;
  //     width: 26px;
  //   }
  // }
  /**
   *  mobile-hops-header -- end
   */

  /**
   *  hops-planting-box -- begin
   */
  .hops-planting-box {
    padding-top: 65px;
    padding-bottom: 24px;
  }
  .hops-section-item {
    margin-top: 36px;
    >h3 {
      margin-bottom: 10px;
      font-size: 20px;
    }
  }
  // .hops-planting-title {
  //   font-size: 24px;
  // }
  // .hops-term-question {
  //   margin-left: 8px;
  //   width: 16px;
  //   height: 16px;
  //   fill: #999;
  // }
  // .hops-planting-desc {
  //   margin-top: 10px;
  //   font-size: 16px;
  //   color: #777;
  // }
  // .hops-planting-held {
  //   margin-top: 4px;
  //   font-size: 14px;
  //   color: #777;
  //   >span {
  //     color: #0B2A48;
  //   }
  // }

  .hops-planting-list {
    margin-bottom: -20px;
    // margin-top: 36px;
    // padding-bottom: 24px;
  }
  .hops-planting-item {
    margin-bottom: 24px;
    width: 50%;
    &:nth-of-type(2n) {
      padding-left: 10px;
    }
    &:nth-of-type(2n + 1) {
      padding-right: 10px;
    }
    box-sizing: border-box;
    &:not(:first-of-type) {
      // margin-top: 16px;
    }
  }

  // plant-asked-box
  .plant-asked-box {
    margin-top: 80px;
  }
  .plant-asked-title {
    font-size: 16px;
    color: #999;
  }
  .plant-asked-questions {
    margin-top: 36px;
  }
  .asked-questions-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .asked-questions-title {
    font-size: 18px;
  }
  .asked-questions-desc {
    margin-top: 12px;
    font-size: 16px;
    color: #999;
  }
  /**
   *  hops-planting-box -- end
   */

  /**
   *  deposit-boost-btns  -- begin
   */
  .deposit-boost-btns {
    margin-top: 30px;
  }
  .deposit-has-boost {
  }
  .deposit-none-boost {

  }
  .boost-fixed-btn {
    width: 100%;
    height: 50px;
  }
  .deposit-insufficient-boost {
    background-color: #fff;
  }
  .insufficient-fixed-left {
    padding-left: 18px;
    padding-right: 18px;
    height: 50px;
    font-size: 14px;
    color: #777;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    >h3 {
      font-size: 16px;
      color: $--main-blue-color;
    }
  }
  .boost-insufficient-btn {
    padding: 0 30px;
    height: 50px;
  }
  /**
   *  deposit-boost-btns  -- end
   */

   /**
   *  hops-planBase-deposit  -- begin
   */
  .hops-planBase-deposit {
    // padding: 20px 20px 0;
    color: #555;
    // background-color: #fff;
  }
  .hops-planBase-item {
    padding: 20px;
    height: 100px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .15);
  }
  .hops-planBase-left {
  }
  .planBase-deposit-amount {

  }
  .planBase-deposit-all {
    // color: #0079FF;
  }

  // planBase-deposit-input-box

  .planBase-deposit-input-box {
    padding: 10px 0 16px;
    font-size: 20px;
    box-sizing: border-box;
    // border-bottom: 1px solid #ddd;
  }
  .planBase-deposit-input {
    padding-left: 6px;
    color: #0B2A48;
    &::placeholder {
      color: #bbb;
    }
    &.is-error {
      color: #F5515F;
    }
  }


  // planBase-deposit-tips-box

  .planBase-deposit-tips-box {
    margin-left: 20px;
    // max-width: 400px;
    box-sizing: border-box;
  }
  .deposit-tips-icon {
    width: 24px;
    height: 24px;
    fill: #0079FF;
  }
  .deposit-tips-desc {
    margin-left: 12px;
    min-height: 44px;
    font-size: 16px;
    color: #555;
  }

  /**
   *  hops-planBase-deposit  -- end
   */
</style>
