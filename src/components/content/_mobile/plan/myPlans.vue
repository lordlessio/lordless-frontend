<template>
  <div id="mobile-myPlans-box" class="mobile-myPlans-box">
    <transition namd="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <my-plans-skeletion v-if="!tokensBalanceInit || loading"/>
      <div v-else>
        <div class="TTFontBolder mobile-myPlans-header">
          <div class="d-flex f-align-center myPlans-header-item">
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
          <div class="d-flex f-align-center myPlans-header-item">
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
        <ul class="mobile-myPlans-cnt">
          <li
            v-for="(plan, index) of plans.list" :key="index"
            class="myPlans-cnt-item">
            <my-plan-card :info="plan" @withdraw="withdrawLess($event, plan)"/>
          </li>
        </ul>
        <p v-if="plans.noMore" class="text-center myPlans-noMore-text">No more plans~</p>
      </div>
    </transition>
    <lordless-authorize
      ref="authorize"
      blurs/>
  </div>
</template>

<script>
import MyPlansSkeletion from '@/components/skeletion/_mobile/hops/myPlans'

import MyPlanCard from '@/components/reuse/_mobile/card/plan/myPlan'

import { getPlansByToken, withdrawLessPlan } from 'api'

import { checkTokensBalanceMixins, metamaskMixins, publicMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'mobile-owner-myPlans-component',
  mixins: [ checkTokensBalanceMixins, metamaskMixins, publicMixins ],
  data: () => {
    return {
      rendered: false,
      loading: true,
      plans: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0,
        noMore: false
      },
      lessBalance: 0,
      lessBalanceNumber: 0,
      hopsBalance: 0,
      hopsBalanceNumber: 0
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
    MyPlansSkeletion,
    MyPlanCard
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

    async initMyPlans () {
      this.loading = true
      const { list = [], pn = 1, ps = 10, total = 0 } = await this.getUserPlans({ pn: 1 })
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

    async getUserPlans ({ pn, ps = this.plans.ps }) {
      try {
        const res = await getPlansByToken({ pn, ps })
        if (res.code === 1000 && res.data) {
          return res.data
        }
      } catch (err) {
        console.log('---- err', err)
        return null
      }
    },

    // 获取更多 tasks
    async loadMoreTasks (cb) {
      const info = this.plans
      const pn = info.pn + 1
      const { list, ps, total } = await this.getUserPlans({ pn })

      let noMore = false
      if (list && list.length < ps) {
        noMore = true
      }
      this.$set(this, 'plans', Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total,
        noMore
      }))

      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

      console.log(' --- scroll')
      const box = document.getElementById('mobile-myPlans-box')
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
          this.loadMoreTasks(() => {
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
    const { refresh } = this.$route.query
    console.log('refresh', refresh)
    refresh && await this.initMyPlans()

    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(() => this.initMyPlans())
  }
}
</script>

<style lang="scss" scoped>
  .mobile-myPlans-box {

  }
  .mobile-myPlans-header {
    padding: 44px 24px 0;
    background-color: #0079FF;
  }
  .myPlans-header-item {
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

  .mobile-myPlans-cnt {
    margin-top: 24px;
    padding: 0 20px 30px;
  }
  .myPlans-cnt-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .myPlans-noMore-text {
    margin-bottom: 16px;
    font-size: 16px;
    color: #999;
  }
</style>
