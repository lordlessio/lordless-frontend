<template>
  <div class="hops-planBase-detail-box">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-show="!web3Model || !connectModel"
      v-bind="scrollOpt"
      @history="$router.push(scrollOpt.historyPath)"/>

    <transition name="ld-hide-fade" mode="out-in">
      <plan-base-detail-skeletion v-if="!tokensBalanceInit || loading"/>
      <div v-else>
        <div class="ImpactFont d-flex f-align-center hops-planBase-header">
        <div class="planBase-header-helm">
          <p class="planBase-info-title">HELM</p>
          <p class="planBase-info-cnt">{{ helmValue }}</p>
        </div>
        <div class="v-flex planBase-header-term">
          <p class="relative planBase-info-title">{{ planType }}</p>
          <p class="planBase-info-cnt">{{ planLockDays }} DAY term deposits</p>
        </div>
      </div>
      <div class="hops-planBase-deposit">
        <p class="d-flex f-align-center planBase-deposit-amount">
          <span class="v-flex">Deposit amount</span>
          <span class="TTFontBolder planBase-deposit-all" @click.stop="depositModel = lessBalanceNumber">Deposit all</span>
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
        <div class="d-flex f-align-center planBase-deposit-tips-box">
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
              Reap <span>{{ depositModel * depositInfo.lessToHops }}</span> HOPS immediately.
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
      <ul class="hops-planBase-details">
        <li class="planBase-details-title">Details</li>
        <li class="d-flex f-align-center planBase-details-item"
          v-for="(item, index) of detailsInfo" :key="index">
          <span class="details-item-title">{{ item.title }}</span>
          <span v-if="item.question" class="inline-block line-height-0 details-item-question" @click.stop="glossaryModel = true">
            <svg>
              <use xlink:href="#icon-question"/>
            </svg>
          </span>
          <span class="v-flex text-right details-item-text">{{ item.text }}</span>
        </li>
      </ul>
      <div class="hops-planBase-btns">
        <lordless-btn
          class="full-width
          hops-planBase-btn"
          theme="blue-linear"
          :loading="btnLoading"
          :disabled="btnLoading || !isMoreThanMix || !depositModel || isInsufficientLess"
          @click="growHops">{{ depositInfo.open ? 'Plant now' : 'Closed' }}</lordless-btn>
      </div>
      </div>
    </transition>
    <lordless-plan-glossary-dialog v-model="glossaryModel" type="helm"/>
    <lordless-authorize
      ref="authorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/>
  </div>
</template>

<script>
import PlanBaseDetailSkeletion from '@/components/skeletion/_mobile/hops/planBaseDetail'

import { getPlanBaseDetail, saveGrowHopsPlan } from 'api'
import { weiByDecimals, dateFormat } from 'utils/tool'

import { mapState } from 'vuex'
import { metamaskMixins, checkTokensBalanceMixins, publicMixins } from '@/mixins'
export default {
  name: 'hops-planBase-detail-component',
  mixins: [ metamaskMixins, checkTokensBalanceMixins, publicMixins ],
  data: () => {
    return {
      rendered: false,
      btnLoading: false,
      loading: true,
      depositInfo: {},
      depositModel: '',
      tokenBets: [],
      lessBalance: 0,
      lessBalanceNumber: 0,
      glossaryModel: false
    }
  },
  computed: {
    ...mapState('contract', [
      'HOPSPlan'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('user', [
      'userInfo'
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

    helmValue () {
      const info = this.depositInfo
      if (!info._id) return {}
      return (info.lessToHops / (info.lockTime / 3600 / 24 / 30)).toFixed(1)
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
        1: 'BASIC',
        2: 'PLUS',
        3: 'PRO'
      }
      return _planTypes[this.depositInfo.level]
    },

    detailsInfo () {
      const info = this.depositInfo
      if (!info._id) return {}
      return [
        {
          title: 'Plan',
          text: this.planType
        },
        {
          title: 'HELM',
          text: this.helmValue,
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
  watch: {
    // depositModel (val) {
    //   if (val) {
    //   }
    // }
  },
  components: {
    PlanBaseDetailSkeletion
  },
  components: {
    PlanBaseDetailSkeletion
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    reset () {
      this.btnLoading = false
      this.loading = true
    },

    initPlanBase () {
      const { planBaseId } = this.$route.params
      // this.checkLessBalance()
      this.getPlanBaseDetailInfo(planBaseId)
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
          const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
          if (!authorize) return

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

    async doGrowHops (lessAmount = this.depositModel * 1e18, account = this.account, info = this.depositInfo, HOPSPlan = this.HOPSPlan, web3Opt = this.web3Opt) {
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

      this.metamaskChoose = true
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

          this.$nextTick(() => {
            this.$router.push('/owner/myPlans?refresh=true')
          })
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

    async getPlanBaseDetailInfo (planBaseId = this.$route.params.planBaseId) {
      this.loading = true
      try {
        const res = await getPlanBaseDetail({ planBaseId })
        if (res.code === 1000 && res.data) {
          this.depositInfo = res.data
          this.depositModel = weiByDecimals(res.data.minimumAmount)
        }
      } catch (err) {
        console.log('err', err.message)
      }
      this.loading = false
      if (!this.rendered) this.rendered = true
    }
  },
  deactivated () {
    this.reset()
  },
  activated () {
    if (!this.rendered) return
    this.$nextTick(() => this.initPlanBase())
  },
  beforeDestroy () {
    this.reset()
  },
  mounted () {
    this.$nextTick(() => this.initPlanBase())
  }
}
</script>

<style lang="scss" scoped>

  .hops-planBase-detail-box {
    // padding-top: 44px;
  }

  /**
   *  hops-planBase-header  -- begin
   */
  .hops-planBase-header {
    padding: 62px 24px 18px;
    color: #fff;
    background-color: #0079FF;
  }

  .planBase-info-title {
    font-size: 14px;
  }
  .planBase-info-cnt {
    font-size: 24px;
  }

  .planBase-header-helm {
    padding: 6px;
    width: 62px;
    height: 62px;
    background-color: #FF0079;
    border-radius: 5px;
    box-shadow: 0 0 10px 1px #FF0079;
    box-sizing: border-box;
  }

  .planBase-header-term {
    margin-left: 16px;
    .planBase-info-title {
      margin-bottom: 3px;
      padding-left: 10px;
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        width: 6px;
        height: 14px;
        background-color: #fff;
      }
    }
  }
  /**
   *  hops-planBase-header  -- end
   */


  /**
   *  hops-planBase-deposit  -- begin
   */
  .hops-planBase-deposit {
    padding: 20px 20px 0;
    color: #555;
    background-color: #fff;
  }
  .planBase-deposit-amount {

  }
  .planBase-deposit-all {
    color: #0079FF;
  }

  // planBase-deposit-input-box

  .planBase-deposit-input-box {
    padding: 10px 0 16px;
    font-size: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
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
    padding: 12px 0;
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

  /**
   *  hops-planBase-details  -- begin
   */
  .hops-planBase-details {
    margin-top: 20px;
    padding: 20px;
    background-color: #fff;
  }
  .planBase-details-item {
    font-size: 14px;
    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
  }
  .planBase-details-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #555;
  }
  .details-item-question {
    margin-top: -2px;
    margin-left: 6px;
    width: 14px;
    height: 14px;
    fill: #999;
  }
  .details-item-title {
    color: #999;
  }
  .details-item-text {

  }
  /**
   *  hops-planBase-details  -- end
   */

  .hops-planBase-btns {
    padding: 0 20px;
    margin-top: 20px;
  }
  .hops-planBase-btn {
    padding: 12px 0;
  }
</style>
