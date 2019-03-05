<template>
  <div class="mobile-hops-box">
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
          <!-- <div class="d-flex f-align-center hops-wallet-box">
            <div class="v-flex">
              <p>LESS(Wallet)</p>
              <h3>{{ lessBalanceNumber > 10000 ? formatNumber(lessBalanceNumber) : lessBalanceNumber.toLocaleString() }}</h3>
            </div>
            <div class="v-flex">
              <p>Purchase</p>
              <h3>
                <a class="d-flex f-align-center hops-wallet-purchase" href="https://ddex.io/trade/LESS-WETH" target="_blank">
                  <img src="//lordless-sh.oss-cn-shanghai.aliyuncs.com/exchanges/icon/DDEX.svg"/>
                  <span>DDEX</span>
                </a>
              </h3>
            </div>
          </div> -->
          <div class="hops-boosts-box">
            <!-- 目前只有 referee boost,所以 tavernkeep 暂时不显示 -->
            <ul>
              <li v-for="(boost, index) of planBoostsList"
                :key="index"
              class="TTFontBolder d-flex f-align-center hops-boost-item" :class="{ 'is-none': boost.none }" @click.stop="boost.routePath ? $router.push(boost.routePath) : null">
                <span class="inline-block line-height-0 hops-boost-icon">
                  <svg>
                    <use :xlink:href="boost.icon"/>
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
              <li class="TTFontBolder d-flex f-align-center hops-boost-item hops-boost-total-item" :class="{ 'total-none': !userTotalBoost }">
                <span class="inline-block line-height-0 hops-boost-icon">
                  <svg>
                    <use xlink:href="#icon-rocket"/>
                  </svg>
                </span>
                <span class="v-flex boost-item-text boost-total-text">Total</span>
                <span class="inline-block line-height-0 boost-total-number">+ {{ userTotalBoost * 100 }}%</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="hops-planting-box">
          <!-- <h2 class="d-flex f-align-center hops-planting-title">
            <span>LESS Term Deposits</span>
            <span class="inline-block line-height-0 hops-term-question" @click.stop="glossaryModel = true">
              <svg>
                <use xlink:href="#icon-question"/>
              </svg>
            </span>
          </h2>
          <p class="hops-planting-desc">Deposit your LESS and reap HOPS immediately.</p>
          <p class="hops-planting-held"><span class="TTFontBolder">HELD</span> = HOPS earned on every LESS per deposit</p> -->

          <ul class="hops-planting-list">
            <li class="hops-planting-item" v-for="(planBase, index) of planBases" :key="index">
              <hops-plant
                :info="planBase"
                :lessBalance="lessBalance"
                :boost="userTotalBoost"
                :isActive="activePlan._id === planBase._id"
                @choosePlan="choosePlan"/>
            </li>
          </ul>

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
        <lordless-fixed :bottom="50" :zIndex="101" v-if="activePlan._id">
          <div class="deposit-boost-btns">
            <div v-if="needLessNumber > 0" class="d-flex f-align-center deposit-insufficient-boost">
              <div class="v-flex d-flex col-flex f-justify-center insufficient-fixed-left">
                <p>Reach the minimum needs</p>
                <h3>{{ needLessNumber.toLocaleString() }} LESS</h3>
              </div>
              <lordless-btn
                theme="purple-linear"
                :radius="0"
                class="boost-insufficient-btn">
                <a href="https://ddex.io/trade/LESS-WETH" target="_blank">Purchase</a>
                </lordless-btn>
            </div>
            <div v-else-if="isRefereeBoost" class="deposit-has-boost">
              <lordless-btn
                theme="purple-linear"
                :radius="0"
                class="v-flex boost-fixed-btn"
                @click="depositPlan"
                >Deposit LESS</lordless-btn>
            </div>
            <div v-else class="d-flex f-align-center deposit-none-boost">
              <lordless-btn
                theme="red-linear"
                :radius="0"
                class="v-flex boost-fixed-btn"
                @click="$router.push(`/owner/referee?refer=${$route.fullPath}`)"
                >Get a boost</lordless-btn>
              <lordless-btn
                theme="purple-linear"
                :radius="0"
                class="v-flex boost-fixed-btn"
                @click="depositPlan"
                >No thanks, Go ahead</lordless-btn>
            </div>
          </div>
        </lordless-fixed>
      </div>
    </transition>
    <lordless-plan-glossary-dialog v-model="glossaryModel" type="deposit"/>
    <!-- <lordless-authorize
      ref="authorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/> -->
  </div>
</template>

<script>
import MobileHopsSkeletion from '@/components/skeletion/_mobile/hops'
import HopsPlant from '@/components/reuse/_mobile/card/plan/plant'

import { getPlanBases } from 'api'
import { formatNumber, weiByDecimals } from 'utils/tool'

import { checkTokensBalanceMixins, publicMixins, initLoadingMixins, planBoostsMixins } from '@/mixins'
export default {
  name: 'lordless-hops-component',
  mixins: [ checkTokensBalanceMixins, publicMixins, initLoadingMixins, planBoostsMixins ],
  props: {
    // account: {
    //   type: String,
    //   default: ''
    // }
  },
  data: () => {
    return {
      rendered: false,
      activePlan: {},
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
      glossaryModel: false
    }
  },
  computed: {
    needLessNumber () {
      const activePlan = this.activePlan
      return weiByDecimals(activePlan.minimumAmount) - this.lessBalanceNumber
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
      this.activePlan = planBase
      // this.tokenBets = [
      //   {
      //     candy: planBase.lessCandy,
      //     count: planBase.minimumAmount
      //   }
      // ]

      // this.$nextTick(async () => {
      //   const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
      //   console.log('choosePlan', planBase, authorize)
      //   if (!authorize) return
      //   this.$router.push(`/owner/planBase/${planBase._id}`)
      // })
      // this.$router.push(`/owner/planBase/${planBase._id}`)
    },

    depositPlan (activePlan = this.activePlan) {
      this.$router.push(`/owner/planBase/${activePlan._id}`)
    },

    initMethod () {
      this.getPlanBasesMethod()
    },
    async getPlanBasesMethod () {
      this.loading = true
      try {
        const res = await getPlanBases()
        if (res.code === 1000 && res.data) {
          this.planBases = res.data
          this.activePlan = res.data[0]
        }
      } catch (err) {
        console.log('0---- err', err.message)
      }
      console.log('--------------- getPlanBasesMethod')
      this.loading = false
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
    margin: 0 -20px;
    padding: 66px 20px 0;
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
    margin-top: 22px;
    padding-bottom: 24px;
  }
  .hops-planting-item {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }

  // plant-asked-box
  .plant-asked-box {
    margin-top: 24px;
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
</style>
