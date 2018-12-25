<template>
  <div class="lordless-project-box">
    <transition name="ld-hide-fade" mode="out-in">
      <project-skeletion v-if="loading"/>
      <div v-else>
        <mobile-ad-space class="home-ad-space"/>

        <mobile-nav-bar
          ref="mobile-nav-bar"
          v-bind="scrollOpt"
          :text="navbarText"
          @history="tCloseHandle"/>
        <section class="ld-project-section project-section-candy">
          <div class="project-candy-info">
            <p class="d-flex f-align-center candy-info-symbol">
              <span class="inline-block line-height-0 project-symbol-img">
                <lordless-candy-icon
                  linear
                  :url="projectInfo.iconUrl"
                  :symbol="projectInfo.symbol"/>
              </span>
              <!-- <span v-if="projectInfo.iconUrl && projectInfo.symbol === 'BITE'" class="inline-block line-height-0 project-symbol-img">
                <img class="full-width" :alt="`${projectInfo.symbol} icon`" :src="ossOrigin + projectInfo.iconUrl"/>
              </span>
              <span v-else class="inline-block line-height-0 candy-symbol-icon">
                <svg v-if="projectInfo.symbol">
                  <use :xlink:href="`#coin-${projectInfo.symbol.toLocaleLowerCase()}`"/>
                </svg>
              </span> -->
              <span class="TTFontBolder inline-block text-upper">
                <span class="inline-block">{{ projectInfo.name }}</span>
                <span class="inline-block">({{ projectInfo.symbol }})</span>
              </span>
            </p>
            <div v-if="airdropInfo">
              <p class="TTFontBolder candy-claimed-info">
                <span v-if="claimed === -1">???</span>
                <span v-else-if="!projectInfo.USD2TokenCount"> {{ claimed }} tokens</span>
                <span v-else>{{ claimed / projectInfo.USD2TokenCount | formatNumber | formatDecimal({ len: 2 }) }} US dollars</span>
                <span class="TTFontBold candy-claimed-been">has been claimed.</span>
              </p>
              <div class="project-candy-carousel">
                <el-carousel trigger="click" height="128px" :interval="5000" arrow="never" :indicator-position="projectInfo.airdrop.banners.length <= 1 ? 'none' : ''" :loop="projectInfo.airdrop.banners.length > 1">
                  <el-carousel-item v-for="(banner, index) of projectInfo.airdrop.banners" :key="index">
                    <div class="project-airdrop-banner" :style="`background-image: url(${ossOrigin + banner})`"></div>
                  </el-carousel-item>
                </el-carousel>
              </div>
              <promotion-claim
                class="project-promotion-info"
                :info="airdropInfo"
                :claimed.sync="claimed"/>
            </div>
          </div>
        </section>
        <section class="ld-project-section project-section-intro">
          <h3>Intro</h3>
          <div class="project-intro-cnt">
            <div class="project-intro-item">
              <p class="intro-item-title">Slogan</p>
              <p class="TTFontNormal intro-item-desc">{{ projectInfo.slogan }}</p>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">About {{ projectInfo.name }}</p>
              <p class="TTFontNormal intro-item-desc">{{ projectInfo.desc }}</p>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">Market</p>
              <ul class="intro-market-ul">
                <li v-if="projectInfo.market.price && projectInfo.symbol.toLocaleLowerCase() !== 'less'" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-market-price"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Price</span>
                    <span>$ {{ projectInfo.market.price | formatDecimal }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.marketCap" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-analysis"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Market cap</span>
                    <span>$ {{ projectInfo.market.marketCap || projectInfo.market.price * projectInfo.market.circulatingSupply | formatNumber }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.volume" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-volume"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Volume (24h)</span>
                    <span>$ {{ projectInfo.market.volume | formatDecimal | formatNumber }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.issueDate" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-date"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Issue date</span>
                    <span>{{ projectInfo.market.issueDate | dateFormat('MMM. DD YYYY') }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.issuePrice" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-issue-price"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Issue price</span>
                    <span>$ {{ projectInfo.market.issuePrice | formatDecimal }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.totalSupply" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-total-supply"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Total supply</span>
                    <span>{{ projectInfo.market.totalSupply | formatNumber }}</span>
                  </p>
                </li>
                <li v-if="projectInfo.market.circulatingSupply" class="d-flex f-align-center intro-market-item">
                  <span class="inlin-block market-item-icon">
                    <svg>
                      <use xlink:href="#icon-circulating-supply"/>
                    </svg>
                  </span>
                  <p class="v-flex d-flex f-justify-between market-item-right">
                    <span>Circulating supply</span>
                    <span>{{ projectInfo.market.circulatingSupply | formatNumber }}</span>
                  </p>
                </li>
              </ul>
            </div>
            <div class="project-intro-item" v-if="projectInfo.exchanges.length">
              <p class="intro-item-title">Exchanges</p>
              <ul class="d-flex flex-wrap project-intro-exchanges">
                <li v-for="(item, index) in  projectInfo.exchanges" :key="index"
                  class="text-center project-exchange-item">
                  <a class="inline-block" :href="exchangesLink(item)" target="_blank">
                    <p class="project-exchange-img" :style="`background-image: url(${ossOrigin + item.icon})`"></p>
                    <p>{{ item.name }}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section v-if="projectInfo.socialeLinks && projectInfo.socialeLinks.length" class="ld-project-section project-section-resource">
          <h3>Resource</h3>
          <div class="project-resource-cnt">
            <ul class="resource-cnt-ul">
              <li
                v-for="sociale of projectInfo.socialeLinks"
                :key="sociale._id"
                class="d-flex f-align-center resource-cnt-item">
                <span class="inline-block line-height-0 resource-item-icon">
                  <svg>
                    <use :xlink:href="`#icon-${sociale.name.toLocaleLowerCase()}`"/>
                  </svg>
                </span>
                <a :href="sociale.link" target="_blank" class="v-flex d-flex f-justify-between resource-item-right">
                  <span class="text-cap">{{ sociale.name }}</span>
                  <span class="inline-block inline-height-0 resource-item-arrow">
                    <svg>
                      <use xlink:href="#icon-arrow-line-right"/>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section class="ld-project-section project-seciton-terms">
          <p class="project-terms-title">Disclaimer</p>
          <p class="TTFontNormal">This content is being provided to you for informational purposes only. The content has been prepared by third parties not affiliated with LORDLESS or any of its affiliates and LORDLESS is not responsible for its content. This content and any information contained therein, does not constitute a recommendation for trading or trading-related actions, financial product or instrument referenced in the content. Be sure to let us know if you have questions.</p>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'
import ProjectSkeletion from '@/components/skeletion/_mobile/project/detail'

import { getCandyDetail } from 'api'

// import { mapState } from 'vuex'
// import { mutationTypes } from '@/store/types'
// import { mapMutations } from 'vuex'
export default {
  name: 'lordless-project-detail',
  data: () => {
    return {
      rendered: false,
      loading: true,
      claimed: 0,
      prevPath: null,
      projectInfo: {
        coinmarketcap: {},
        market: {},
        exchanges: []
      },
      scrollOpt: {
        show: true,
        history: true,
        scroll: false
      }
    }
  },
  computed: {
    navbarText () {
      const projectInfo = this.projectInfo
      if (!projectInfo) return 'Project'
      return `${projectInfo.symbol}(project)`
    },
    airdropInfo () {
      const { airdrop } = this.projectInfo
      if (!airdrop) return null
      return Object.assign({}, airdrop, {
        project: this.projectInfo
      })
    },
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  components: {
    PromotionClaim,
    ProjectSkeletion
  },
  methods: {
    // ...mapMutations('layout', [
    //   mutationTypes.LAYOUT_SET_POP_DIRECTION
    // ]),
    tCloseHandle () {
      // this[mutationTypes.LAYOUT_SET_POP_DIRECTION]('_reverse')
      sessionStorage.setItem('lordless_direction', '_reverse')

      const refer = this.$route.query.refer || '/home'
      this.$nextTick(() => this.$router.push(`${decodeURIComponent(refer)}`))
      // if (history.length) {
      //   history.go(-1)
      // } else {
      //   this.$router.push('/market')
      // }
    },
    exchangesLink ({ name, website }) {
      if (name === 'DDEX' && this.projectInfo.symbol === 'LESS') return 'https://ddex.io/trade/LESS-WETH'
      return website
    },
    initPage () {
      this.prevPath = this.$route.path

      const { projectId } = this.$route.params
      projectId && this.initProject(projectId)
      if (!this.rendered) this.rendered = true
    },
    async initProject (projectId) {
      this.loading = true
      try {
        const res = await getCandyDetail(projectId)
        if (res.code === 1000 && res.data) {
          this.projectInfo = res.data
        } else {
          this.$router.push('/')
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  deactivated () {
    this.loading = true
  },
  activated () {
    if (!this.rendered || this.$route.path === this.prevPath) {
      this.loading = false
      return
    }
    this.initPage()
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
  .lordless-project-box {
    padding-top: 44px;
    @include viewport-unit(width, 100vw);
    @include viewport-unit(min-height, 100vh);
  }
  .ld-project-section {
    // padding: 20px;
    padding: 0 20px;
    >h3 {
      margin-bottom: 8px;
      font-size: 18px;
      color: #0B2A48;
    }
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  /**
   *  project-section-candy   -- begin
   */
  .project-section-candy {
    padding: 20px;
    background-color: #fff;
  }
  .project-candy-info {

  }
  .candy-info-symbol {
    font-size: 18px;
    color: #777;
  }
  .project-symbol-img {
    margin-right: 10px;
    width: 28px;
    height: 28px;
  }
  // .candy-symbol-icon {
  //   margin-right: 6px;
  //   padding: 6px;
  //   width: 28px;
  //   height: 28px;
  //   border-radius: 100%;
  //   background-image: linear-gradient(-45deg, #00C0EB 0%, #0079FF 100%);
  //   fill: #fff;
  //   box-sizing: border-box;
  // }
  .candy-claimed-info {
    margin-top: 10px;
    font-size: 24px;
    color: #0B2A48;
    .candy-claimed-been {
      font-size: 18px;
    }
  }

  .project-candy-carousel {
    margin-top: 10px;
    height: 128px;
    background-color: #ddd;
    border-radius: 5px;
    overflow: hidden;
    /deep/ {
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
      }
    }
  }
  .project-airdrop-banner {
    height: 100%;
    @include bg-size();
  }

  .project-promotion-info {
    margin-top: 24px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }
  /**
   *  project-section-candy   -- end
   */

  /**
   *  project-section-intro   -- begin
   */
  .project-section-intro {

  }
  .project-intro-cnt {
    margin-left: -20px;
    margin-right: -20px;
    padding: 20px;
    background-color: #fff;
  }
  .project-intro-item {
    font-size: 14px;
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
  .intro-item-title {
    color: #0B2A48;
  }
  .intro-item-desc {
    color: #777;
  }

  .intro-market-ul {
    margin-right: -20px
  }
  .intro-market-item {

  }
  .market-item-icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    fill: #0079FF;
  }
  .market-item-right {
    padding-right: 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    >span {
      &:nth-of-type(2) {
        color: #0B2A48;
      }
    }
  }

  .project-intro-exchanges {
    margin-top: 16px;
  }
  .project-exchange-item {
    width: 20%;
    font-size: 14px;
    color: #777;
    >a {
      color: inherit;
    }
  }
  .project-exchange-img {
    display: inline-block;
    width: 36px;
    height: 36px;
    @include bg-size();
  }
  /**
   *  project-section-intro   -- end
   */


  /**
   *  project-section-resource   -- begin
   */
  .project-section-resource {

  }
  .project-resource-cnt {
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
    background-color: #fff;
  }
  .resource-cnt-ul {
    margin-right: -20px;
  }
  .resource-cnt-item {
    &:not(:first-of-type) {
      .resource-item-right {
        border-top: 1px solid #ddd;
      }
    }
  }
  .resource-item-icon {
    margin-right: 12px;
    width: 20px;
    height: 20px;
    fill: #0079FF;
  }
  .resource-item-right {
    padding-right: 20px;
    height: 50px;
    line-height: 50px;
    color: #555;
    box-sizing: border-box;
  }
  .resource-item-arrow {
    width: 14px;
    height: 14px;
    fill: #bbb;
  }
  /**
   *  project-section-resource   -- end
   */

  /**
   *  project-seciton-terms   -- begin
   */
  .project-seciton-terms {
    padding: 0 20px 20px;
    font-size: 14px;
    color: #bbb;
  }
  .project-terms-title {
    margin-bottom: 2px;
    color: #999;
  }
  /**
   *  project-seciton-terms   -- end
   */
</style>
