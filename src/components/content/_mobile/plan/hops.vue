<template>
  <div class="mobile-hops-box">
    <transition name="ld-hide-fade" mode="out-in">
      <mobile-hops-skeletion v-if="!tokensBalanceInit || loading"/>
      <div v-else class="mobile-hops-container">
        <div class="mobile-hops-header">
          <div class="d-flex f-align-center hops-user-box">
            <lordless-blockies theme="light" :scale="7" :seed="account"/>
            <p class="v-flex text-break hops-user-account">{{ account }}</p>
          </div>
          <div class="d-flex f-align-center hops-wallet-box">
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
          </div>
        </div>
        <div class="hops-planting-box">
          <h2 class="d-flex f-align-center hops-planting-title">
            <span>LESS Term Deposits</span>
            <span class="inline-block line-height-0 hops-term-question" @click.stop="glossaryModel = true">
              <svg>
                <use xlink:href="#icon-question"/>
              </svg>
            </span>
          </h2>
          <p class="hops-planting-desc">Deposit your LESS and reap HOPS immediately.</p>
          <p class="hops-planting-held"><span class="TTFontBolder">HELD</span> = HOPS earned on every LESS per deposit</p>

          <ul class="hops-planting-list">
            <li class="hops-planting-item" v-for="(planBase, index) of planBases" :key="index">
              <hops-plant
                :info="planBase"
                :level="index"
                :lessBalance="lessBalance"
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
      </div>
    </transition>
    <lordless-plan-glossary-dialog v-model="glossaryModel" type="deposit"/>
    <lordless-authorize
      ref="authorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/>
  </div>
</template>

<script>
import MobileHopsSkeletion from '@/components/skeletion/_mobile/hops'
import HopsPlant from '@/components/reuse/_mobile/card/plan/plant'

import { getPlanBases } from 'api'
import { formatNumber } from 'utils/tool'

import { checkTokensBalanceMixins, publicMixins } from '@/mixins'
export default {
  name: 'lordless-hops-component',
  mixins: [ checkTokensBalanceMixins, publicMixins ],
  props: {
    // account: {
    //   type: String,
    //   default: ''
    // }
  },
  data: () => {
    return {
      loading: true,
      planBases: [],
      tokenBets: [],
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
  components: {
    HopsPlant,
    MobileHopsSkeletion
  },
  methods: {
    formatNumber () {
      return formatNumber(...arguments)
    },

    async choosePlan (planBase) {
      this.tokenBets = [
        {
          candy: planBase.lessCandy,
          count: planBase.minimumAmount
        }
      ]

      this.$nextTick(async () => {
        const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
        console.log('choosePlan', planBase, authorize)
        if (!authorize) return
        this.$router.push(`/owner/planBase/${planBase._id}`)
      })
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
        }
      } catch (err) {
        console.log('0---- err', err.message)
      }
      this.loading = false
    }
  },
  mounted () {
    this.$nextTick(() => this.initMethod())
  }
}
</script>

<style lang="scss" scoped>
  .mobile-hops-box {

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
  .hops-user-box {
    color: #fff;
  }
  .hops-user-account {
    margin-left: 18px;
    font-size: 16px;
  }
  .hops-wallet-box {
    padding: 24px 36px;
    font-size: 16px;
    color: #555;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .15);
    transform: translateY(20px);
    h3 {
      margin-top: 4px;
      font-size: 24px;
      color: #0B2A48;
    }
  }
  .hops-wallet-purchase {
    >img {
      margin-right: 6px;
      width: 26px;
    }
  }
  /**
   *  mobile-hops-header -- end
   */

  /**
   *  hops-planting-box -- begin
   */
  .hops-planting-box {
    padding-top: 48px;
    padding-bottom: 24px;
  }
  .hops-planting-title {
    font-size: 24px;
  }
  .hops-term-question {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    fill: #999;
  }
  .hops-planting-desc {
    margin-top: 10px;
    font-size: 16px;
    color: #777;
  }
  .hops-planting-held {
    margin-top: 4px;
    font-size: 14px;
    color: #777;
    >span {
      color: #0B2A48;
    }
  }

  .hops-planting-list {
    margin-top: 20px;
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
</style>
