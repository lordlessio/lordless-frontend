<template>
  <section class="mobile-home-box">
    <transition name="ld-hide-fade" mode="out-in">
      <home-skeletion v-if="loading"/>

      <div v-else>
        <div class="mobile-home-promotions">
          <h2 class="mobile-home-title">Promotions</h2>
          <ul class="mobile-home-ul home-promotions-ul">
            <li
              v-for="(item, index) of airdrops"
              :key="index"
              class="home-info-item home-promotions-item"
              @click.stop="$router.push(`/project/${item.project._id}`)">
              <figure>
                <figcaption :style="`background-image: url(${ossOrigin + item.poster || item.banners[0]})`"></figcaption>
                <promotion-claim
                  class="promotion-item-info"
                  :info="item"/>
              </figure>
            </li>
          </ul>
        </div>
        <div class="mobile-home-candies">
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
                <span class="TTFontBolder candies-claimed-num">{{ candy.count | formatNumber | formatDecimal({ len: 2 }) }}<span>&nbsp;($ {{ candy.count / candy.USD2TokenCount | formatNumber | formatDecimal({ len: 2 }) }})</span>&nbsp;&nbsp;</span>
                has been claimed
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'

import HomeSkeletion from '@/components/skeletion/_mobile/home'

import { getAirdrops } from 'api'

import { loopCandyClamied } from 'utils/loop'

import { mapState } from 'vuex'
export default {
  name: 'mobile-home-page',
  data: () => {
    return {
      loading: true,
      airdrops: [],
      promotions: []
    }
  },
  computed: {
    ...mapState('candy', [
      'candyClaimed'
    ]),
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  },
  components: {
    PromotionClaim,
    HomeSkeletion
  },
  methods: {
    async getAirdrops () {
      this.loading = true
      try {
        const res = await getAirdrops()
        if (res.code === 1000 && res.data) {
          this.airdrops = res.data
        }
      } catch (err) {
        this.loading = false
      }
      this.loading = false
    }
  },
  mounted () {
    this.getAirdrops()
    loopCandyClamied()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-home-box {
    padding: 20px 20px 50px;
  }
  .mobile-home-title {
    font-size: 24px;
    color: #555;
  }
  .mobile-home-ul {
    margin-top: 10px;
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
  .home-promotions-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
    figcaption {
      width: 100%;
      height: 340px;
      @include bg-size();
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
