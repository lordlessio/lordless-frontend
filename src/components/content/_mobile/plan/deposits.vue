<template>
  <div id="mobile-deposits-box" class="mobile-deposits-box">
    <transition namd="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <deposits-skeletion v-if="!tokensBalanceInit || loading"/>
      <div v-else-if="!loading && !plans.total" class="d-flex f-auto-center text-center mobile-deposits-none">
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
        <div class="TTFontBolder mobile-deposits-header">
          <div class="d-flex f-align-center deposits-header-item">
            <span class="inline-block line-height-0 header-item-icon hops-icon">
              <svg>
                <use xlink:href="#icon-origin-hops"/>
              </svg>
            </span>
            <div class="v-flex header-item-cnt">
              <p>Cumulative income (HOPS)</p>
              <h3>{{ hopsBalanceNumber.toLocaleString() }}</h3>
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
              <h3>{{ lessBalanceNumber.toLocaleString() }}</h3>
            </div>
          </div>
        </div>
        <ul class="mobile-deposits-cnt">
          <li
            v-for="(plan, index) of plans.list" :key="index"
            class="deposits-cnt-item">
            <my-deposit-card :info="plan" @withdraw="withdrawLess($event, plan)"/>
          </li>
        </ul>
        <div class="text-center deposits-noMore-text">
          <p v-if="loadMoreLoading && !plans.noMore">
            <i class="el-icon-loading"></i>
          </p>
          <p v-else-if="plans.noMore">No more deposits~</p>
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

import { getPlansByToken, withdrawLessPlan } from 'api'

import { checkTokensBalanceMixins, metamaskMixins, publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-deposits-component',
  mixins: [ checkTokensBalanceMixins, metamaskMixins, publicMixins ],
  data: () => {
    return {
      rendered: false,
      loading: true,
      loadMoreLoading: false,
      plans: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0,
        noMore: false
      }
    }
  },
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),

    ...mapState('contract', [
      'HOPSPlan'
    ])
  },
  components: {
    DepositsSkeletion,
    MyDepositCard
  },
  methods: {
    afterEnter () {
      this.scrollListenerFunc()
    },

    async withdrawLess (cb, info = this.info, account = this.account, web3Opt = this.web3Opt, HOPSPlan = this.HOPSPlan) {
      const authorize = await this.$refs.authorize.checkoutAuthorize()
      if (!authorize) return

      this.metamaskChoose = true
      try {
        const withdrawLessParam = {
          name: 'withdraw',
          values: [ info.planId ]
        }
        const { gasPrice } = web3Opt
        const gas = (await HOPSPlan.estimateGas(withdrawLessParam.name, withdrawLessParam.values)) || 139999

        const params = {
          gas,
          gasPrice,
          data: HOPSPlan[withdrawLessParam.name].getData(info.planId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          to: HOPSPlan.address,
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

    async initDeposits () {
      this.loadMoreLoading = false
      this.loading = true
      const { list = [], pn = 1, ps = 10, total = 0 } = (await this.getUserPlans({ pn: 1 })) || {}
      this.plans = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      this.loading = false
      if (!this.rendered) this.rendered = true
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
    },

    // 获取更多 deposits
    async loadMoreDeposits (cb) {
      this.loadMoreLoading = true
      const info = this.plans
      const pn = info.pn + 1
      const { list = [], ps = info.ps, total = 0 } = (await this.getUserPlans({ pn })) || {}

      let noMore = false
      if (total <= ps) {
        noMore = true
      }
      this.$set(this, 'plans', Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total,
        noMore
      }))

      this.loadMoreLoading = false
      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

      console.log(' --- scroll')
      const box = document.getElementById('mobile-deposits-box')
      let bHeight = box ? box.offsetHeight : 0
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      const handleFunc = () => {
        if (bool || this.plans.noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreDeposits(() => {
            this.$nextTick(() => {
              bool = false
              bHeight = box.offsetHeight
            })
          })
        }
      }
      handleFunc()

      this.scrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.scrollHandle)
      })
    }
  },
  async activated () {
    if (!this.rendered) return
    await this.initDeposits()

    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(() => this.initDeposits())
  }
}
</script>

<style lang="scss" scoped>
  .mobile-deposits-box {
  }
  /**
   *  mobile-deposits-none  -- begin
   */
  .mobile-deposits-none {
    padding: 74px 30px 30px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 50px);
  }

  /**
   *  mobile-deposits-none  -- begin
   */
  .mobile-deposits-none {
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
   *  mobile-deposits-none  -- end
   */

  .mobile-deposits-header {
    padding: 44px 24px 0;
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

  .mobile-deposits-cnt {
    margin-top: 24px;
    padding: 0 20px 30px;
  }
  .deposits-cnt-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .deposits-noMore-text {
    margin-bottom: 16px;
    font-size: 16px;
    color: #999;
  }
</style>
