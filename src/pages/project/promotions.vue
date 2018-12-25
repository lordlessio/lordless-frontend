<template>
  <transition name="ld-hide-in-fade" mode="out-in">
    <promotions-skeletion v-if="loading || !Object.keys(candyClaimed).length"/>
    <div v-else class="project-promotions-box">
      <section class="promotions-section">
        <h2>Promotions</h2>
        <div class="home-promotions-tips">
          <p class="d-flex f-align-center">
            <span>Follow</span>
            <a class="d-inline-flex f-align-center home-promotions-twitter-link" target="_blank" href="https://twitter.com/LordLessIo">
              <span class="inline-block line-height-0 promotions-twitter-icon">
                <svg>
                  <use xlink:href="#icon-twitter"/>
                </svg>
              </span>
              <span>@LordLessIo</span>
            </a>
            <span>to make you never miss any promotions in LORDLESS.</span>
          </p>
        </div>

        <!-- <div class="home-promotions-item home-promotions-windfall">
          <div class="home-promotions-title">
            <p class="TTFontBolder">Windfall</p>
          </div>
          <ul class="d-flex f-wrap f-align-center promotions-list">
            <li class="promotions-item"
              v-for="(item, index) of promotions" :key="index">
              <figure>
                <figcaption
                  :style="`background-image: url(${ossOrigin + item.banners[0]})`"
                  @click.stop="$router.push(`/project/${item.project._id}`)"/>
                <promotion-lucky
                  class="promotion-item-info"
                  :info="item"/>
              </figure>
            </li>
          </ul>
        </div> -->

        <div class="home-promotions-item home-promotions-windfall">
          <!-- <div class="home-promotions-title">
            <p class="TTFontBolder">Lucky Blocks</p>
          </div> -->
          <ul class="d-flex f-wrap f-align-center promotions-list">
            <li class="promotions-item"
              v-for="(item, index) of promotions" :key="index">
              <figure>
                <figcaption
                  :style="`background-image: url(${ossOrigin + item.banners[0]})`"
                  @click.stop="$router.push(`/project/${item.project._id}`)"/>
                <promotion-claim
                  class="promotion-item-info"
                  :info="item"/>
              </figure>
            </li>
          </ul>
        </div>
      </section>
      <section class="promotions-section candies-section">
        <h2>Candies</h2>
        <ul class="TTFontBolder d-flex col-flex candies-list">
          <li class="d-flex candies-list-item candies-list-thead">
            <p class="candies-item-index">#</p>
            <p class="v-flex candies-item-name">NAME</p>
            <p class="candies-item-value">PRICE</p>
            <p class="candies-item-value">CLAIMED</p>
            <p class="candies-item-value">VALUE IN USD</p>
          </li>
          <li class="d-flex f-align-center candies-list-item"
            v-for="(candy, index) of Object.values(candyClaimed)"
            :key="index"
            @click.stop="$router.push(`/project/${candy._id}`)">
            <p class="candies-item-index">{{ index + 1 }}</p>
            <p class="v-flex d-inline-flex f-align-center candies-item-name">
              <span class="inline-block candies-symbol-icon">
                <svg>
                  <use :xlink:href="`#coin-${candy.symbol.toLocaleLowerCase()}`"/>
                </svg>
              </span>
              <span class="inline-block">{{ candy.name }}</span>
              <span class="inline-block candies-symbol-text">{{ candy.symbol }}</span>
            </p>
            <p class="candies-item-value">$ {{ 1 / candy.USD2TokenCount | formatDecimal({ len: 4 }) }}</p>
            <p class="candies-item-value">{{ candy.count | formatNumber | formatDecimal({ len: 2 }) }}</p>
            <p class="candies-item-value">$ {{ candy.count / candy.USD2TokenCount | formatNumber | formatDecimal({ len: 2 }) }}</p>
          </li>
        </ul>
      </section>
    </div>
  </transition>
</template>

<script>
import { promotionsMixins } from '@/mixins'
import PromotionsBreadcrumb from '@/components/reuse/promotions/breadcrumb'
import PromotionClaim from '@/components/reuse/_mobile/card/promotion/claim'
// import PromotionLucky from '@/components/reuse/_mobile/card/promotion/lucky'

import PromotionsSkeletion from '@/components/skeletion/project/promotions'
export default {
  name: 'lordless-project-promotions',
  mixins: [ promotionsMixins ],
  components: {
    PromotionsBreadcrumb,
    PromotionClaim,
    // PromotionLucky,

    PromotionsSkeletion
  }
}
</script>

<style lang="scss" scoped>
  .project-promotions-box {
    padding-bottom: 50px;
  }
  .promotions-section {
    margin-top: 48px;
    >h2 {
      margin-bottom: 24px;
      font-size: 24px;
      color: #777;
    }
  }
  .home-promotions-tips {
    margin-top: 10px;
    padding-bottom: 24px;
    font-size: 16px;
    color: #777;
    box-sizing: border-box;
  }
  .home-promotions-twitter-link {
    margin: 0 6px;
    color: #0079FF;
    text-decoration: underline;
    fill: #0079FF;
  }
  .promotions-twitter-icon {
    margin-right: 2px;
    width: 18px;
    height: 18px;
  }

  .home-promotions-item {
    &:not(:last-of-type) {
      margin-bottom: 36px;
    }
  }
  .home-promotions-title {
    margin-bottom: 12px;
    font-size: 18px;
    color: #0B2A48;
  }

  .promotions-list {
    margin: -30px -12px 0;
  }
  .promotions-item {
    margin: 30px 12px 0;
    width: 348px;
    box-shadow: 0 0 10px 3px rgba(222, 222, 222, 1);
    border-radius: 5px;
    overflow: hidden;
    transition: all .35s;
    // &:not(:first-of-type) {
    //   margin-left: 24px;
    // }
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 6px rgba(222, 222, 222, 1);
    }
    figcaption {
      width: 100%;
      height: 135px;
      @include bg-size();
    }
  }
  .promotion-item-info {
    padding: 20px;
    cursor: default;
  }

  /**
   *  candies-section  --  begin
   */
  .candies-section {

  }
  .candies-list {
    // padding: 0 20px;
    font-size: 16px;
    border-radius: 5px;
    background-color: #fff;
    color: #555;
    box-shadow: 0 0 10px 3px rgba(222, 222, 222, 1);
  }
  .candies-list-item {
    position: relative;
    padding: 24px 20px;
    &:not(:last-of-type) {
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 20px;
        width: calc(100% - 40px);
        height: 1px;
        background-color: #ddd;
        transition: all .35s;
      }
    }
    &:not(:first-of-type) {
      transition: all .35s;
      &:hover {
        padding: 24px 10px;
        background-color: #f9f9f9;
        cursor: pointer;
      }
    }
  }
  .candies-list-thead {
    color: #999;
  }
  .candies-item-index {
    padding: 0 30px;
    color: #999;
    text-align: center;
  }
  .candies-item-value {
    width: 180px;
  }
  .candies-item-name {
    padding-left: 20px;
  }
  .candies-symbol-icon {
    margin-right: 12px;
    padding: 8px;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    box-sizing: border-box;
    background-color: #0079FF;
    fill: #fff;
  }
  .candies-symbol-text {
    margin-left: 12px;
    color: #999;
  }
  /**
   *  candies-section  --  end
   */
</style>
