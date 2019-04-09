<template>
  <section class="mobile-home-box">
    <transition name="ld-hide-fade" mode="out-in">
      <home-skeletion v-if="loading"/>
      <div v-else>
        <div class="mobile-hunterTask-section">
          <h2 class="home-section-title">Bounty Hunter tasks</h2>
          <div class="home-section-cnt hunterTask-cnt-box" @click.stop="$router.push(`/owner/hunterTasks?refer=${$route.path}`)">
            <div class="d-flex f-align-center hunterTask-cnt-container">
              <div class="v-flex hunterTask-cnt-left">
                <p class="ImpactFont hunterTask-cnt-title">Do tasks. Earn LESS.</p>
                <ul class="d-flex f-align-center hunterTask-icon-box">
                  <li v-for="(item, index) of hunterTaskIcons" :key="index" class="hunterTask-icon-item">
                    <span class="inline-block line-height-0 hunterTask-item-icon">
                      <svg>
                        <use :xlink:href="item.icon"/>
                      </svg>
                    </span>
                  </li>
                </ul>
              </div>
              <span class="inline-block line-height-0 hunterTask-go-icon">
                <svg>
                  <use xlink:href="#icon-hunter-task-go"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div class="mobile-home-section" v-if="popularTavern">
          <h2 class="d-flex f-align-center home-section-title">
            <span class="v-flex">Popular Tavern</span>
            <span class="d-flex f-align-center home-section-viewmore" @click.stop="$router.push('/taverns')">
              <span class="inline-block line-height-0">View more</span>
              <span class="inline-block line-height-0 home-view-more-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </span>
          </h2>
          <div class="home-section-cnt">
            <div class="d-flex f-align-center popular-tavern-container">
              <div
                class="d-flex full-width"
                @click.stop="$router.push(`/tavern/${popularTavern._id}?refer=${$route.path}`)">
                <div class="popular-tavern-poster">
                  <lordless-tavern-poster
                    :src="popularTavern.ldbIcon ? popularTavern.ldbIcon.source.preview : ''"
                    :popularity="popularTavern.chain.popularity"
                    shadow
                    showPopularity
                    isSmall/>
                </div>
                <div class="v-flex d-flex col-flex f-justify-between popular-tavern-info">
                  <div>
                    <h3 class="d-flex f-align-center popular-tavern-title">
                      <span class="text-nowrap text-ellipsis popular-tavern-name">{{ popularTavern.name.zh }}</span>
                    </h3>
                    <div class="d-flex f-align-center popular-tavern-desc">
                      <p class="popular-tavern-level">Level {{ popularTavern.chain.level }}</p>
                      <p class="popular-tavern-recruits">Recruits {{ popularTavern.apLeft }}</p>
                    </div>
                  </div>
                  <div class="apleft-progress-box">
                    <p class="d-flex f-align-center apleft-progress-tip">
                      <span>AP</span>
                      <span class="v-flex text-right">{{ popularTavern.apLeft }}</span>
                    </p>
                    <div class="apleft-progress-bar">
                      <lordless-progress
                        :current="popularTavern.apLeft"
                        :max="popularTavern.ap"
                        :underColor="apProgress.underColor"
                        :gradient="apProgress.gradient"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mobile-home-section" v-if="recommendDepositTerm">
          <h2 class="d-flex f-align-center home-section-title">
            <span class="v-flex">LESS Term Deposit</span>
            <span class="d-flex f-align-center home-section-viewmore" @click.stop="$router.push('/owner/hops?type=recommend')">
              <span class="inline-block line-height-0">View more</span>
              <span class="inline-block line-height-0 home-view-more-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </span>
          </h2>
          <div class="home-section-cnt">
            <plan-deposit-card
              :info="recommendDepositTerm"
              :lessBalance="-1"
              :boost="userTotalBoost"
              @choosePlan="choosePlan"/>
          </div>
        </div>
        <div class="mobile-home-section" v-if="recommendLuckyBlock">
          <h2 class="d-flex f-align-center home-section-title">
            <span class="v-flex">Lucky Blocks</span>
            <span class="d-flex f-align-center home-section-viewmore" @click.stop="$router.push('/lb?type=luckyblocks')">
              <span class="inline-block line-height-0">View more</span>
              <span class="inline-block line-height-0 home-view-more-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </span>
          </h2>
          <div class="home-section-cnt">
            <figure>
              <figcaption class="line-height-1">
                <img class="full-width" :src="ossOrigin + recommendLuckyBlock.banners[0]"/>
              </figcaption>
              <lucky-block-card :info="recommendLuckyBlock"/>
            </figure>
          </div>
        </div>
        <div class="mobile-home-section">
          <h2 class="home-section-title">Guidelines</h2>
          <ul class="home-section-cnt guideline-cnt-box">
            <li v-for="(item, index) of guidelines" :key="index" class="guideline-item">
              <a :href="item.link" target="_blank" class="d-flex f-align-start">
                <p class="d-flex f-auto-center guideline-icon-box">
                  <span class="inline-block line-height-0 guideline-item-icon">
                    <svg>
                      <use :xlink:href="item.icon"/>
                    </svg>
                  </span>
                </p>
                <div class="v-flex guideline-item-right">
                  <h2 class="text-break guideline-item-title">{{ item.title }}</h2>
                  <p class="guideline-item-date">Last updated: {{ item.date | dateFormat('MMM DD,YYYY') }}</p>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import HomeSkeletion from '@/components/skeletion/_mobile/home'

import PlanDepositCard from '@/components/reuse/_mobile/card/plan/plant'
import LuckyBlockCard from '@/components/reuse/card/promotion/lucky'

import { getLdbById, getPlanBases, getLuckyblocks } from 'api'
import { initLoadingMixins, promotionsMixins, planBoostsMixins } from '@/mixins'
export default {
  name: 'mobile-home-page',
  mixins: [ initLoadingMixins, promotionsMixins, planBoostsMixins ],
  data: () => {
    return {
      rendered: false,
      apProgress: {
        underColor: '#ddd',
        gradient: {
          direction: 'to right',
          start: '#4586FC',
          end: '#4586FC'
        }
      },
      popularTavern: null,
      recommendDepositTerm: null,
      recommendLuckyBlock: null,
      guidelines: [
        {
          icon: '#icon-color-letter',
          title: 'LORDLESS Referral Program Guidelines',
          date: 1553644800000,
          link: 'https://medium.com/lordless/lordless-referral-program-guidelines-a7c1c63058d8'
        },
        {
          icon: '#icon-color-bank',
          title: 'LORDLESS LESS Term Deposit Guidelines',
          date: 1553644800000,
          link: 'https://medium.com/lordless/less-term-deposit-2453c3ae2a5c'
        },
        {
          icon: '#icon-bounty-gift',
          title: 'LORDLESS Bounty Chest Guidelines',
          date: 1553644800000,
          link: 'https://medium.com/lordless/lordless-withdraw-guide-efcf9dc2cf67'
        }
      ],

      // hunterTask options
      hunterTaskTypes: [],
      userHunterTasks: [],
      hunterTaskIcons: [
        {
          icon: '#icon-hunter-task-badge'
        },
        {
          icon: '#icon-hunter-task-sword'
        },
        {
          icon: '#icon-hunter-task-email'
        },
        {
          icon: '#icon-hunter-task-like'
        }
      ]
    }
  },
  computed: {
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  components: {
    HomeSkeletion,

    PlanDepositCard,
    LuckyBlockCard
  },
  methods: {

    choosePlan (plant) {
      this.$router.push(`/owner/planBase/${plant._id}?refer=${this.$route.path}`)
    },

    async getPopularTavern () {
      try {
        const res = await getLdbById({ id: 0 })
        if (res.code === 1000 && res.data) {
          this.popularTavern = res.data
        }
      } catch (err) {}
    },

    async getRecommendTermDeposit () {
      try {
        const res = await getPlanBases({ version: 2, recommend: true })
        if (res.code === 1000 && res.data) {
          this.recommendDepositTerm = res.data[0]
        }
      } catch (err) {}
    },

    async getRecommendLuckyBlock () {
      try {
        const res = await getLuckyblocks({ recommend: true })
        if (res.code === 1000 && res.data) {
          this.recommendLuckyBlock = res.data[0]
        }
      } catch (err) {}
    },

    async initHome () {
      this.loading = true
      await Promise.all([ this.getPopularTavern(), this.getRecommendTermDeposit(), this.getRecommendLuckyBlock() ])
      this.$nextTick(() => {
        this.loading = false
        this.rendered = true
      })
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initHome()
  },
  mounted () {
    this.$nextTick(() => this.initHome())
  }
}
</script>

<style lang="scss" scoped>
  .mobile-home-box {
    padding: 20px;
  }

  .mobile-home-section {
    &:not(:first-of-type) {
      margin-top: 28px;
    }
  }
  .home-section-title {
    font-size: 18px;
    color: $--main-color;
  }
  .home-section-viewmore {
    font-family: $--font-TTNormsMedium;
    font-weight: initial;
    font-size: 14px;
    color: #777;
  }
  .home-view-more-icon {
    margin-left: 6px;
    width: 12px;
    height: 12px;
    fill: #999;
  }
  .home-section-cnt {
    margin-top: 12px;
    box-shadow: 0 0 8px 3px rgba(0, 0, 0, .1);
    border-radius: 5px;
    overflow: hidden;
  }

  /**
   *  hunterTask-cnt-box  -- begin
   */
  .hunterTask-cnt-box {
    border-radius: 64px;
    box-shadow: 0px 0px 12px 0px rgb(0, 121, 255);
  }
  .hunterTask-cnt-container {
    padding: 10px 30px;
    padding-right: 10px;
    background-image: linear-gradient(-225deg, rgb(18, 75, 220) 0%, rgb(0, 121, 255) 100%);
  }
  .hunterTask-cnt-left {

  }
  .hunterTask-cnt-title {
    font-size: 20px;
    color: #fff;
  }
  .hunterTask-icon-box {
    margin-top: 5px;
  }
  .hunterTask-icon-item {
    &:not(:first-of-type) {
      margin-left: 8px;
    }
  }
  .hunterTask-item-icon {
    width: 24px;
    height: 24px;
  }
  .hunterTask-go-icon {
    width: 64px;
    height: 64px;
  }
  /**
   *  hunterTask-cnt-box  -- end
   */

  /**
   *  popular-tavern-box  -- begin
   */

  .popular-tavern-container {
    padding: 16px 32px 16px 16px;
    background-color: #fff;
  }

  .popular-tavern-box {
    margin-top: 24px;
  }
  .popular-tavern-poster {
    width: 96px;
    height: 96px;
    &.none {
      padding: 10px;
      fill: #BDB9FD;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .25);
    }
  }
  // .popular-tavern-name {
  //   max-width: 130px;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  // }
  .popular-tavern-info {
    margin-left: 18px;
    @include viewport-unit(width, 100vw, 220px);
  }
  .user-info-btn {
    display: inline-block;
    padding: 8px 15px;
    font-size: 14px;
    @include margin('top', 15px, 1);
  }
  .popular-tavern-title {
    font-size: 16px;
    color: #777;
  }
  .popular-tavern-name {

  }
  .popular-tavern-desc {
    margin-top: 4px;
    font-size: 14px;
    color: #777;
  }
  .popular-tavern-recruits {
    margin-left: 16px;
  }

  .apleft-progress-tip {
    margin-bottom: 2px;
    font-size: 14px;
    color: #999;
  }

  .apleft-progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 5px;
    overflow: hidden;
  }

  /**
   *  popular-tavern-box  -- end
   */

  // guideline-cnt-box
  .guideline-cnt-box {
    padding: 20px;
    background-color: #fff;
  }
  .guideline-item {
    &:not(:first-of-type) {
      margin-top: 22px;
    }
  }
  .guideline-icon-box {
    width: 44px;
    height: 44px;
    background-image: linear-gradient(-225deg, #124bdc 0%, #0079ff 100%);
    border-radius: 5px;
  }
  .guideline-item-icon {
    width: 20px;
    height: 20px;
  }

  .guideline-item-right {
    margin-left: 12px;
  }
  .guideline-item-title {
    font-size: 16px;
  }
  .guideline-item-date {
    margin-top: 6px;
    font-size: 14px;
    color: #777;
  }
</style>
