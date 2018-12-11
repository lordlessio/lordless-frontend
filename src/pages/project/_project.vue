<template>
  <transition name="ld-hide-in-fade" mode="out-in">
    <project-info-skeletion class="v-flex" v-if="topLoading || projectLoading"/>
    <div v-else class="lordless-project-box">
      <promotions-breadcrumb :info="projectInfo"/>
      <div class="d-flex md-col-flex">
        <div class="md-order-1 v-flex project-main-info">
          <div class="TTFontBolder d-flex f-align-center project-symbol-title">
            <span class="inline-block project-symbol-icon">
              <svg>
                <use :xlink:href="`#coin-${projectInfo.symbol.toLocaleLowerCase()}`"/>
              </svg>
            </span>
            <p class="project-symbol-name">
              <span>{{ projectInfo.name }}</span>
              <span class="project-symbol-text">({{ projectInfo.symbol }})</span>
            </p>
          </div>
          <p v-if="ownerAirdrops" class="TTFontBolder project-claimed-text">
            <span v-if="claimed === -1">???</span>
            <span v-else>{{ claimed / projectInfo.USD2TokenCount | formatNumber | formatDecimal({ len: 2 }) }}</span>
            US dollars has been claimed.
          </p>
          <div class="project-intro-box">
            <div class="project-intro-item">
              <p class="intro-item-title">Slogan</p>
              <p class="intro-item-desc">{{ projectInfo.slogan }}</p>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">About {{ projectInfo.name }}</p>
              <p class="intro-item-desc">{{ projectInfo.desc }}</p>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">Market</p>
              <ul class="d-flex f-wrap project-intro-markets">
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">$ {{ projectInfo.market.price | formatDecimal }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-market-price"/>
                      </svg>
                    </span>
                    <span>Price</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">$ {{ projectInfo.market.marketCap || projectInfo.market.price * projectInfo.market.circulatingSupply | formatNumber }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-analysis"/>
                      </svg>
                    </span>
                    <span>Market cap</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">$ {{ projectInfo.market.volume | formatDecimal | formatNumber }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-volume"/>
                      </svg>
                    </span>
                    <span>Volume (24h)</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">{{ projectInfo.market.issueDate | dateFormat('MMM. DD YYYY') }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-date"/>
                      </svg>
                    </span>
                    <span>Issue date</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">$ {{ projectInfo.market.issuePrice | formatDecimal }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-issue-price"/>
                      </svg>
                    </span>
                    <span>Issue price</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">{{ projectInfo.market.totalSupply | formatNumber }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-total-supply"/>
                      </svg>
                    </span>
                    <span>Total supply</span>
                  </p>
                </li>
                <li class="text-center text-nowrap project-market-item">
                  <p class="TTFontBolder project-market-top">{{ projectInfo.market.circulatingSupply | formatNumber }}</p>
                  <p class="d-flex f-auto-center project-market-bottom">
                    <span class="inline-block line-height-0 market-bottom-icon">
                      <svg>
                        <use xlink:href="#icon-circulating-supply"/>
                      </svg>
                    </span>
                    <span>Circulating supply</span>
                  </p>
                </li>
              </ul>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">Resource</p>
              <ul class="d-flex flex-wrap project-intro-resources">
                <li
                  v-for="sociale of projectInfo.socialeLinks"
                  :key="sociale._id"
                  class="text-center resource-cnt-item">
                  <a :href="sociale.link" target="_blank" class="v-flex d-flex col-flex f-auto-center resource-item-right">
                    <span class="inline-block line-height-0 resource-item-icon">
                      <svg>
                        <use :xlink:href="`#icon-${sociale.name.toLocaleLowerCase()}`"/>
                      </svg>
                    </span>
                    <span class="text-cap">{{ sociale.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="project-intro-item">
              <p class="intro-item-title">Exchanges</p>
              <div>
                <ul class="d-flex flex-wrap project-intro-exchanges">
                  <li v-for="(item, index) in  projectInfo.exchanges" :key="index"
                    class="text-center text-nowrap project-exchange-item">
                    <a class="inline-block" :href="exchangesLink(item)" target="_blank">
                      <p class="project-exchange-img" :style="`background-image: url(${ossOrigin + item.icon})`"></p>
                      <p>{{ item.name }}</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="project-detail-promotions-box">
          <div class="project-promotions-contaienr">
            <p class="TTFontBolder project-promotions-title">{{ ownerAirdrops ? 'Related promotion' : (topPromotions ? 'Top promotion' : 'No promotion') }}</p>
            <div v-if="airdrops">
              <div v-for="(airdrop, index) of airdrops" :key="index">
                <div class="project-candy-carousel">
                  <el-carousel trigger="click" height="128px" :interval="5000" arrow="never" :indicator-position="airdrop.banners.length <= 1 ? 'none' : ''" :loop="airdrop.banners.length > 1">
                    <el-carousel-item v-for="(banner, index) of airdrop.banners" :key="index">
                      <div class="project-airdrop-banner" :style="`background-image: url(${ossOrigin + banner})`"></div>
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <promotion-claim
                  class="project-promotion-info"
                  :info="airdrop"
                  :claimed.sync="claimed"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="project-disclaimer-box">
        <p class="intro-item-title">Disclaimer</p>
        <p class="intro-item-desc">This content is being provided to you for informational purposes only. The content has been prepared by third parties not affiliated with LORDLESS or any of its affiliates and LORDLESS is not responsible for its content. This content and any information contained therein, does not constitute a recommendation for trading or trading-related actions, financial product or instrument referenced in the content. Be sure to let us know if you have questions.</p>
      </div>
    </div>
  </transition>
</template>

<script>
import PromotionsBreadcrumb from '@/components/reuse/promotions/breadcrumb'
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'

import ProjectInfoSkeletion from '@/components/skeletion/project'

import { getAirdrops, getCandyDetail } from 'api'
export default {
  name: 'lordless-project-page',
  data: () => {
    return {
      projectLoading: true,
      rendered: false,
      claimed: 0,

      topLoading: false,
      topPromotions: null,
      projectInfo: {
        coinmarketcap: {},
        market: {}
      }
    }
  },
  computed: {
    ownerAirdrops () {
      const { airdrop } = this.projectInfo
      if (!airdrop) return null
      const arr = []
      arr.push(Object.assign({}, airdrop, {
        project: this.projectInfo
      }))
      return arr
    },
    airdrops () {
      if (this.ownerAirdrops) return this.ownerAirdrops
      return this.topPromotions
    },
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  components: {
    PromotionsBreadcrumb,
    PromotionClaim,

    ProjectInfoSkeletion
  },
  methods: {
    exchangesLink ({ name, website }) {
      if (name === 'DDEX' && this.projectInfo.symbol === 'LESS') return 'https://ddex.io/trade/LESS-WETH'
      return website
    },
    initPage () {
      const { projectId } = this.$route.params
      projectId && this.initProject(projectId)
      if (!this.rendered) this.rendered = true
    },
    async initProject (projectId) {
      this.projectLoading = true
      try {
        const res = await getCandyDetail(projectId)
        if (res.code === 1000 && res.data) {
          this.projectInfo = res.data
          if (!res.data.airdrop) this.getTopPromotion()
        } else if (res.code === 1000 && !res.data) {
          this.$router.push('/project/promotions')
        }
      } catch (err) {
        this.projectLoading = false
      }
      this.projectLoading = false
    },
    async getTopPromotion () {
      this.topLoading = true
      const res = await getAirdrops({ top: true })
      if (res.code === 1000 && res.data) {
        this.topPromotions = res.data
      }
      this.topLoading = false
    }
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
  .lordless-project-box {

  }
  // .lordless-project-container {
  //   max-width: 1100px;
  //   padding: 20px;
  // }
  /**
   *  project-main-info -- begin
   */
  .project-main-info {
    padding: 24px 18px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 10px 0 #dedede;
  }
  .project-symbol-title {
    margin-bottom: 20px;
  }
  .project-symbol-icon {
    padding: 8px;
    width: 36px;
    height: 36px;
    line-height: 0;
    background-color: #0079FF;
    fill: #fff;
    box-sizing: border-box;
    border-radius: 100%;
    overflow: hidden;
  }
  .project-symbol-name {
    margin-left: 14px;
    font-size: 24px;
    color: #0B2A48;
  }
  .project-symbol-text {
    font-size: 18px;
    color: #777;
  }

  .project-claimed-text {
    padding-top: 15px;
    margin-bottom: 20px;
    font-size: 20px;
    color: #0B2A48;
  }

  // project-intro-box
  .project-intro-box {
    padding-top: 20px;
    padding-bottom: 40px;
    border-top: 1px solid #ddd;
  }
  .project-intro-item {
    font-size: 16px;
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
  .intro-item-title {
    color: #555555;
    @include TTFontBolder();
  }
  .intro-item-desc {
    margin-top: 2px;
    color: #999;
    @include TTFontNormal();
  }

  // project-intro-markets
  .project-intro-markets {

  }
  .project-market-item {
    margin-right: 12px;
    margin-top: 12px;
    width: 25%;
    max-width: 158px;
    border-radius: 5px;
    overflow: hidden;
    &:nth-of-type(4n + 4) {
      margin-right: 0;
    }
  }
  .project-market-top {
    height: 60px;
    line-height: 60px;
    font-size: 20px;
    color: #0B2A48;
    border: 1px solid #ddd;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .project-market-bottom {
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    color: #fff;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
  }
  .market-bottom-icon {
    margin-right: 6px;
    width: 14px;
    height: 14px;
  }

  // project-intro-resources
  .project-intro-resources {
    margin-top: 30px;
    padding-bottom: 20px;
  }
  .resource-cnt-item {
    width: 80px;
    font-size: 12px;
    color: #999;
    a {
      color: inherit;
    }
  }
  .resource-item-icon {
    margin-bottom: 6px;
    width: 30px;
    height: 30px;
    fill: #0079FF;
  }

  // project-intro-exchanges
  .project-intro-exchanges {
    margin-top: 30px;
  }
  .project-exchange-item {
    width: 80px;
    font-size: 12px;
    color: #999;
    >a {
      color: inherit;
    }
  }
  .project-exchange-img {
    margin-bottom: 4px;
    display: inline-block;
    width: 36px;
    height: 36px;
    @include bg-size();
  }
  /**
   *  project-main-info -- end
   */

  /**
   *  project-detail-promotions-box -- begin
   */
  .project-detail-promotions-box {
    margin-left: 20px;
    width: 376px;
  }
  .project-promotions-title {
    padding-bottom: 16px;
    font-size: 16px;
    color: #555;
    border-bottom: 1px solid #ddd;
  }
  .project-promotions-contaienr {
    padding: 20px 18px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 10px 0 #dedede;
  }
  .project-candy-carousel {
    margin-top: 24px;
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
    padding-top: 24px;
  }

  /**
   *  project-detail-promotions-box -- end
   */

  .project-disclaimer-box {
    padding-top: 36px;
    padding-bottom: 36px;
    .intro-item-title {
      color: #777;
    }
    .intro-item-desc {
      font-size: 14px;
      color: #bbb;
      @include TTFontBold();
    }
  }

  @media (max-width: 992px) {
    .project-detail-promotions-box {
      margin-bottom: 30px;
      margin-left: 0;
    }
  }
</style>
