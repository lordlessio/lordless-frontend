<template>
  <section class="mobile-home-box">
    <transition name="ld-hide-fade" mode="out-in">
      <home-skeletion v-if="loading"/>

      <div v-else>
        <mobile-ad-space class="home-ad-space"/>
        <div class="mobile-home-promotions">
          <h2 class="mobile-home-title">Promotions</h2>
          <div class="home-promotions-tips">
            <p>Follow our Twitter to make you never miss any promotions in LORDLESS.</p>
            <lordless-btn class="promotions-twitter-btn" theme="red-linear" shadow>
              <a class="d-flex f-align-center" target="_blank" href="https://twitter.com/LordLessIo">
                <span class="inline-block line-height-0 promotions-twitter-icon">
                  <svg>
                    <use xlink:href="#icon-twitter"/>
                  </svg>
                </span>
                <span>Follow right now</span>
              </a>
            </lordless-btn>
          </div>
          <ul class="mobile-home-ul home-promotions-ul">
            <li
              v-for="(item, index) of promotions"
              :key="index"
              class="home-info-item home-promotions-item"
              @click.stop="$router.push(`/project/${item.project._id}`)">
              <figure>
                <figcaption>
                  <img :alt="`promotions_${item.project.symbol}`" class="full-width" :src="ossOrigin + item.banners[0]"/>
                </figcaption>
                <promotion-claim
                  class="promotion-item-info"
                  :info="item"/>
              </figure>
            </li>
          </ul>
        </div>
        <!-- <div class="mobile-home-candies">
          <h2 class="mobile-home-title">Candies</h2>
          <ul class="mobile-home-ul home-candies-ul">
            <li
              v-for="(candy, index) of Object.values(candyClaimed)" :key="index"
              class="home-info-item home-candies-item"
              @click.stop="$router.push(`/project/${candy._id}`)">
              <div class="d-flex f-align-center candies-symbol-box">
                <p class="line-height-0 home-candy-icon candies-symbol-coin">
                  <svg>
                    <use :xlink:href="`#coin-${candy.symbol.toLocaleLowerCase()}`"/>
                  </svg>
                </p>
                <p class="v-flex">{{ candy.coinmarketcap.name || candy.symbol }}<span class="text-upper">&nbsp;({{ candy.symbol }})</span></p>
              </div>
              <div class="d-flex f-align-center candies-claimed-box">
                <span class="TTFontBolder candies-claimed-num">{{ (candy.count + (promotionClaimeds[candy.symbol.toLocaleLowerCase()] || 0)) | formatNumber | formatDecimal({ len: 2 }) }}<span>&nbsp;($ {{ (candy.count + (promotionClaimeds[candy.symbol.toLocaleLowerCase()] || 0)) / candy.USD2TokenCount | formatNumber | formatDecimal({ len: 2 }) }})</span>&nbsp;&nbsp;</span>
                has been claimed
              </div>
            </li>
          </ul>
        </div> -->
      </div>
    </transition>
  </section>
</template>

<script>
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'

import HomeSkeletion from '@/components/skeletion/_mobile/home'

import { getAirdrops } from 'api'

// import { loopCandyClamied } from 'utils/loop'

// import { mapState } from 'vuex'
export default {
  name: 'mobile-home-page',
  data: () => {
    return {
      loading: true,
      promotions: []
      // promotionClaimeds: {}
    }
  },
  computed: {
    // ...mapState('candy', [
    //   'candyClaimed'
    // ]),
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  components: {
    PromotionClaim,
    HomeSkeletion
  },
  methods: {
    async getAirdropsHandle () {
      this.loading = true
      console.log('---- come in airdrop')
      try {
        const res = await getAirdrops()
        if (res.code === 1000 && res.data) {
          this.promotions = res.data
        }
        console.log('---- come in airdrop 2')
        this.loading = false
      } catch (err) {
        this.loading = false
      }
    }
  },
  mounted () {
    this.getAirdropsHandle()
    // loopCandyClamied()
  }
}
</script>

<style lang="scss" scoped>
  .home-ad-space {
    margin: -20px -20px 0;
  }

  .mobile-home-box {
    padding: 20px 20px 50px;
  }
  .mobile-home-title {
    font-size: 24px;
    color: #555;
  }
  .home-promotions-tips {
    margin-top: 10px;
    padding-bottom: 24px;
    font-size: 16px;
    color: #777;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
  }
  .promotions-twitter-btn {
    margin-top: 10px;
    padding: 0 20px;
    height: 46px;
    line-height: 46px;
  }
  .promotions-twitter-icon {
    margin-right: 6px;
    width: 22px;
    height: 22px;
  }
  .mobile-home-ul {
    margin-top: 24px;
  }
  .home-info-item {
    box-shadow: 0 0 10px 3px rgba(222, 222, 222, 1);
    border-radius: 5px;
    overflow: hidden;
  }
  .home-candy-icon {
    margin-right: 6px;
    padding: 6px;
    width: 29px;
    height: 29px;
    border-radius: 100%;
    box-sizing: border-box;
    background-image: linear-gradient(-45deg, #00C0EB 0%, #0079FF 100%);
    fill: #fff;
  }

  /**
   *  mobile-home-promotions  -- begin
   */
  .mobile-home-promotions {
    padding-top: 16px;
  }
  .home-promotions-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
    figcaption {
      width: 100%;
      // height: 128px;
      // @include bg-size();
    }
  }

  /**
   *  mobile-home-promotions  -- end
   */

  /**
   *  mobile-home-candies  -- begin
   */
  .mobile-home-candies {
    margin-top: 40px;
  }
  .home-candies-item {
    padding: 20px;
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
  .candies-symbol-box {
    font-size: 18px;
    color: #777;
  }
  .candies-symbol-coin {
  }
  .candies-claimed-box {
    margin-top: 10px;
    font-size: 16px;
    color: #999;
  }
  .candies-claimed-num {
    font-size: 20px;
    color: #0079FF;
    >span {
      font-size: 16px;
    }
  }
  .promotion-item-info {
    padding: 20px;
  }
  /**
   *  mobile-home-candies  -- end
   */
</style>
