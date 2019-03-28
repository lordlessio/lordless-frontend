<template>
  <div id="website-deposits-box" class="full-width website-deposits-box">
    <transition namd="ld-hide-fade" mode="out-in">
      <deposits-skeletion v-if="loading"/>
      <div v-else-if="!loading && !plans.total" class="d-flex f-auto-center text-center website-deposits-none">
        <div class="deposits-none-container">
          <span class="relative inline-block line-height-0 deposits-none-icon">
            <svg>
              <use xlink:href="#icon-human2"/>
            </svg>
          </span>
          <h3>You have no LESS deposit.</h3>
          <p>Deposit your LESS and reap HOPS immediately.</p>
          <lordless-btn theme="blue-linear" class="deposits-none-btn" @click="$router.push('/owner/hops')">Deposit LESS</lordless-btn>
        </div>
      </div>
      <div v-else>
        <div class="TTFontBolder website-deposits-header">
          <div class="d-flex f-align-center deposits-header-item">
            <span class="inline-block line-height-0 header-item-icon hops-icon">
              <svg>
                <use xlink:href="#icon-origin-hops"/>
              </svg>
            </span>
            <div class="v-flex header-item-cnt">
              <p>Cumulative income (HOPS)</p>
              <h3>{{ weiByDecimals(plans.depositsCandies.hopsCount).toLocaleString() }}</h3>
            </div>
          </div>
          <div class="d-flex f-align-center deposits-header-item">
            <span class="inline-block line-height-0 header-item-icon less-icon">
              <svg>
                <use xlink:href="#coin-less"/>
              </svg>
            </span>
            <div class="v-flex header-item-cnt">
              <p>Immature deposit (LESS)</p>
              <h3>{{ weiByDecimals(plans.depositsCandies.lessCount).toLocaleString() }}</h3>
            </div>
          </div>
        </div>
        <ul class="d-flex f-wrap f-align-start website-deposits-cnt">
          <li
            v-for="(plan, index) of plans.list" :key="index"
            class="deposits-cnt-item">
            <my-deposit-card :info="plan" @withdraw="withdrawLess($event, plan)"/>
          </li>
        </ul>
        <div class="deposits-pagination-box">
          <lordless-pagination
            :total="plans.total"
            :currentPage="plans.pn"
            background
            @currentChange="initDeposits"/>
        </div>
      </div>
    </transition>
    <lordless-authorize
      ref="authorize"
      blurs/>
  </div>
</template>

<script>
import DepositsSkeletion from '@/components/skeletion/_mobile/hops/deposits'

import MyDepositCard from '@/components/reuse/_mobile/card/plan/deposit'

import { weiByDecimals } from 'utils/tool'

import { getPlansByToken, withdrawLessPlan } from 'api'

import { metamaskMixins, publicMixins, initLoadingMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'website-owner-deposits-component',
  mixins: [ metamaskMixins, publicMixins, initLoadingMixins ],
  data: () => {
    return {
      rendered: false,
      plans: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0,
        depositsCandies: {},
        noMore: false
      }
    }
  },
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),

    ...mapState('contract', [
      'HOPSPlan',
      'GrowHopsPlus'
    ]),

    pageScrollPE () {
      return document.getElementById('website-deposits-box')
    }
  },
  components: {
    DepositsSkeletion,
    MyDepositCard
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    async withdrawLess (
      cb,
      info = this.info,
      account = this.account,
      web3Opt = this.web3Opt,
      HOPSPlan = this.HOPSPlan,
      GrowHopsPlus = this.GrowHopsPlus
    ) {
      const authorize = await this.$refs.authorize.checkoutAuthorize()
      if (!authorize) return

      this.metamaskChoose = true
      const GrowContract = info.planVersion === 2 ? GrowHopsPlus : HOPSPlan
      try {
        const withdrawLessParam = {
          name: 'withdraw',
          values: [ info.planId ]
        }
        const { gasPrice } = web3Opt
        // const gas = (await HOPSPlan.estimateGas(withdrawLessParam.name, withdrawLessParam.values)) || 139999
        const gas = (await GrowContract.estimateGas(withdrawLessParam.name, withdrawLessParam.values)) || 139999

        const params = {
          gas,
          gasPrice,
          // data: HOPSPlan[withdrawLessParam.name].getData(info.planId),
          data: GrowContract[withdrawLessParam.name].getData(info.planId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          // to: HOPSPlan.address,
          to: GrowContract.address,
          from: account
        }

        console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          await withdrawLessPlan({ tx, planId: info.planId })
          this.metamaskChoose = false
          cb && cb(tx)
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            cb && cb()
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

    async initDeposits (page = 1) {
      this.loading = true
      const { list = [], pn, ps = 10, total = 0, depositsCandies = {} } = (await this.getUserPlans({ pn: page })) || {}
      this.plans = {
        list,
        pn,
        ps,
        total,
        depositsCandies,
        noMore: total <= ps
      }
      this.loading = false
    },

    async getUserPlans ({ pn, ps = this.plans.ps } = {}) {
      try {
        const res = await getPlansByToken({ pn, ps })
        if (res.code === 1000 && res.data) {
          return res.data
        }
        return null
      } catch (err) {
        console.log('---- err', err)
        return null
      }
    }
  },
  async activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    await this.initDeposits()
  },
  mounted () {
    this.$nextTick(() => this.initDeposits())
  }
}
</script>

<style lang="scss" scoped>
  .website-deposits-box {
  }
  /**
   *  website-deposits-none  -- begin
   */
  .website-deposits-none {
    padding: 74px 30px 30px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 50px);
  }

  /**
   *  website-deposits-none  -- begin
   */
  .website-deposits-none {
    padding: 74px 30px 30px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 50px);
  }
  .deposits-none-container {
    margin: 0 auto;
    max-width: 300px;
    >h3 {
      margin-top: 30px;
      font-size: 20px;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
      color: #555;
    }
  }
  .deposits-none-icon {
    width: 100%;
    padding-top: 100%;
    >svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .deposits-none-btn {
    margin-top: 32px;
    padding: 12px 20px;
  }
  /**
   *  website-deposits-none  -- end
   */

  .website-deposits-header {
    padding: 24px 24px 0;
    background-color: #0079FF;
  }
  .deposits-header-item {
    padding: 16px 0 18px;
    color: #fff;
    &:not(:first-of-type) {
      border-top: 2px solid #2E91FF;
    }
  }
  .header-item-icon {
    padding: 9px;
    width: 36px;
    height: 36px;
    background-color: #fff;
    border-radius: 100%;
    box-sizing: border-box;
    fill: #0079FF;
    &.hops-icon {
      padding: 0;
    }
    &.less-icon {
      box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.3);
    }
  }
  .header-item-cnt {
    margin-left: 16px;
    >p {
      font-size: 14px;
    }
    >h3 {
      margin-top: 4px;
      font-size: 20px;
    }
  }

  .website-deposits-cnt {
    margin-top: 24px;
    margin-bottom: -24px;
    // padding: 0 20px 30px;
  }
  .deposits-cnt-item {
    margin-bottom: 24px;
    width: 50%;
    box-sizing: border-box;
    &:nth-of-type(2n) {
      padding-left: 15px;
    }
    &:nth-of-type(2n + 1) {
      padding-right: 15px;
    }
    // &:not(:first-of-type) {
    //   margin-top: 24px;
    // }
  }

  // deposits-pagination-box
  .deposits-pagination-box {
    margin-top: 50px;
  }
</style>
