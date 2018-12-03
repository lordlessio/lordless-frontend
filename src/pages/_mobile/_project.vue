<template>
  <div class="lordless-project-box">
    <section class="ld-project-section project-section-candy">
      <div class="project-candy-info">
        <p class="d-flex f-align-center candy-info-symbol">
          <span class="inline-block line-height-0 candy-symbol-icon">
            <svg v-if="projectInfo.symbol">
              <use :xlink:href="`#coin-${projectInfo.symbol.toLocaleLowerCase()}`"/>
            </svg>
          </span>
          <span class="TTFontBolder inline-block text-upper">
            {{ projectInfo.coinmarketcap.name }}({{ projectInfo.symbol }})
          </span>
        </p>
        <p class="TTFontBolder candy-claimed-info">
          {{ claimed / projectInfo.USD2TokenCount | formatNumber | formatDecimal }} US dollars
          <span class="TTFontBold">has been claimed.</span>
        </p>
        <div class="project-candy-carousel">
          <el-carousel trigger="click" height="128px" :interval="5000" arrow="never">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3>{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>
        <promotion-claim
          v-if="airdropInfo"
          class="project-promotion-info"
          :info="airdropInfo"
          :claimed.sync="claimed"/>
      </div>
    </section>
    <section class="ld-project-section project-section-intro">
      <h3>Intro</h3>
      <div class="project-intro-cnt">
        <div class="project-intro-item">
          <p class="intro-item-title">Slogan</p>
          <p class="TTFontNormal intro-item-desc">Powering decentralized exchange for everything.</p>
        </div>
        <div class="project-intro-item">
          <p class="intro-item-title">About {{ projectInfo.coinmarketcap.symbol }}</p>
          <p class="TTFontNormal intro-item-desc">ZRX is an Ethereum token that is used to power the 0x protocol. The protocol itself is designed to allow Ethereum tokens to be traded at a low cost directly from your wallet.</p>
        </div>
        <div class="project-intro-item">
          <p class="intro-item-title">Market</p>
          <ul class="intro-market-ul">
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Price</span>
                <span>$ {{ projectInfo.market.price | formatDecimal }}</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Market cap</span>
                <span>$ {{ projectInfo.market.marketCap | formatNumber }}</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Volume (24h)</span>
                <span>$ {{ projectInfo.market.volume | formatDecimal | formatNumber }}</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Issue date</span>
                <span>{{ new Date() | dateFormat('MMM. DD YYYY') }}</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Issue price</span>
                <span>$ 0.048</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Total supply</span>
                <span>{{ projectInfo.market.totalSupply | formatNumber }}</span>
              </p>
            </li>
            <li class="d-flex f-align-center intro-market-item">
              <span class="inlin-block market-item-icon">
                <svg>
                  <use xlink:href="#coin-less"/>
                </svg>
              </span>
              <p class="v-flex d-flex f-justify-between market-item-right">
                <span>Circulating supply</span>
                <span>{{ projectInfo.market.circulatingSupply | formatNumber }}</span>
              </p>
            </li>
          </ul>
        </div>
        <div class="project-intro-item">
          <p class="intro-item-title">Exchanges</p>
          <p class="TTFontNormal intro-item-desc">ZRX is an Ethereum token that is used to power the 0x protocol. The protocol itself is designed to allow Ethereum tokens to be traded at a low cost directly from your wallet.</p>
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
      <p class="TTFontNormal">This content is being provided to you for informational purposes only. The content has been prepared by third parties not affiliated with Coinbase Inc or any of its affiliates and Coinbase is not responsible for its content. This content and any information contained therein, does not constitute a recommendation by Coinbase to buy, sell or hold any
security, financial product or instrument referenced in the content.</p>
    </section>
  </div>
</template>

<script>
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'

import { getCandyDetail } from 'api'
export default {
  name: 'lordless-project-detail',
  data: () => {
    return {
      loading: true,
      claimed: 0,
      projectInfo: {
        coinmarketcap: {},
        market: {}
      }
    }
  },
  computed: {
    airdropInfo () {
      const { airdrop } = this.projectInfo
      if (!airdrop) return null
      return Object.assign({}, airdrop, {
        project: this.projectInfo
      })
    }
  },
  components: {
    PromotionClaim
  },
  methods: {
    initPage () {
      const { projectId } = this.$route.params
      projectId && this.initProject(projectId)
    },
    async initProject (projectId) {
      this.loading = true
      try {
        const res = await getCandyDetail(projectId)
        if (res.code === 1000 && res.data) {
          this.projectInfo = res.data
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  activated () {
    this.initPage()
  },
  mounted () {
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
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
  .candy-symbol-icon {
    margin-right: 6px;
    padding: 6px;
    width: 28px;
    height: 28px;
    border-radius: 100%;
    background-image: linear-gradient(-45deg, #00C0EB 0%, #0079FF 100%);
    fill: #fff;
    box-sizing: border-box;
  }
  .candy-claimed-info {
    margin-top: 10px;
    font-size: 24px;
    color: #0B2A48;
    >span {
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
    color: #555;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
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
