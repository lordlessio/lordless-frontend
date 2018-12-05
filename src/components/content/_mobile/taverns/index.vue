<template>
  <div class="mobile-market">
    <div id="mobile-market-container" class="d-flex col-flex relative mobile-market-container">
      <!-- <section id="mobile-market-header" class="text-center relative mobile-market-header">
        <h2>Marketplace</h2>
        <p class="TTFontBolder">Marketplace is an easy, convenient way to buy and sell your Tavern.</p>
      </section> -->
      <h2 class="mobile-taverns-title">Taverns</h2>
      <mobile-sort-bar
        :sortItems="sortItems"
        :total="ldbs.total"
        :scrollHeight="100"
        :topHeight="44"
        @sort="sortHandle"
        @order="orderHandle"/>
      <!-- <section id="market-sort-section" class="relative market-sort-section">
        <div id="mobile-market-sort" class="alone-layer lg-d-flex f-align-center relative mobile-market-sort">
          <div class="relative market-sort-container" :class="{ 'sort': sortOpen }">
            <div class="d-flex f-align-center market-sort-bar">
              <div class="alone-layer d-flex f-align-center mobile-sort-select" @click="toggleSort">
                <span class="inline-block market-sort-label">{{ sortItems[ldbSort] }}</span>
                <span class="inline-block market-sort-icon">
                  <i class="el-icon el-icon-caret-top"></i>
                </span>
              </div>
              <switch-input
                class="mobile-switch-input"
                v-model="ldbOrder"
                :items="orderItems"
                @change="orderChange"/>
              <p class="v-flex text-right mobile-market-total">Total {{ ldbs.total }}</p>
            </div>
            <ul class="market-sort-list">
              <li
                v-for="(sort, index) of Object.keys(sortItems)" :key="index"
                class="d-flex f-align-center f-justify-between mobile-sort-item"
                :class="{ 'active': sort === ldbSort }"
                @click="chooseSort(sort)">
                <span>{{ sortItems[sort] }}</span>
                <span class="inline-blick sort-active-svg">
                  <svg>
                    <use xlink:href="#icon-ok"/>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section> -->
      <section class="d-flex col-flex v-flex mobile-market-ldbs">
        <transition name="ld-hide-in-fade" mode="out-in">
          <ul v-if="ldbsLoading" class="v-flex d-flex f-wrap f-justify-between">
            <li
              class="v-flex skeletion-building-item"
              v-for="item of [1,2]" :key="item">
              <mobile-skeletion-building/>
            </li>
          </ul>
          <div
            v-else-if="!ldbs.total && !ldbsLoading"
            class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
            <svg>
              <use xlink:href="#icon-no-selling-ldb"/>
            </svg>
            <p>Market have no building now.</p>
            <div class="d-flex f-auto-center TTFontBolder">
              <span>See all Taverns in</span>
              <span class="inline-block">
                <lordless-btn
                  class="TTFontBolder no-asset-btn"
                  theme="default"
                  shadow
                  @click="$router.push('mapbox')">Map</lordless-btn>
              </span>
            </div>
          </div>
          <ul v-else class="v-flex d-flex f-wrap f-justify-between market-cnt-box">
            <li
              class="v-flex mobile-market-item"
              v-for="ldb of ldbs.list" :key="ldb._id">
              <mobile-building-card
                :sale="ldb.chain.auction.isOnAuction"
                :presale="ldb.chain.auction.isOnPreAuction"
                :info="ldb"
                @choose="openDetail"/>
            </li>
            <li v-if="ldbs.total <= ldbs.pn * ldbs.ps" class="text-center mobile-nomore-taverns">AH! no more Taverns~</li>
          </ul>
        </transition>
        <!-- <div class="market-pagination-box">
          <skeletion-pager v-if="ldbsLoading && !ldbs.total"/>
          <lordless-pagination
            v-if="ldbs.total"
            :scrollE="pageScrollE"
            :scrollOffset="150"
            class="market-pagination-pages"
            :total="ldbs.total"
            :currentPage="ldbs.pn"
            :size="ldbs.ps"
            background
            @currentChange="pageChange"/>
        </div> -->
      </section>
    </div>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
// import { hasClass, removeClass, addClass } from 'utils/tool'

import MobileSortBar from '@/components/reuse/_mobile/sortBar'
// import SwitchInput from '@/components/stories/switchInput'
import MobileBuildingCard from '@/components/reuse/_mobile/card/building'

import MobileSkeletionBuilding from '@/components/skeletion/_mobile/building'
import SkeletionPager from '@/components/skeletion/pagination'

// import { scrollTo } from 'utils/tool'

import { layoutMixins } from '@/mixins'

// import throttle from 'lodash/throttle'

export default {
  name: 'lordless-taverns',
  mixins: [layoutMixins],
  data: () => {
    return {
      marketScrollHandle: null,
      // ldb 建筑列表
      ldbs: {
        pn: 1,
        ps: 20,
        list: [],
        total: 0
      },

      // loading options
      ldbsLoading: true,

      // sort model
      // sortOpen: false,

      ldbSort: 'popular',

      // sort 列表选项
      sortItems: {
        popular: 'Popularity',
        influence: 'Influential',
        price: 'Price'
      },

      // order model
      ldbOrder: 'desc'

      // orderItems: [
      //   {
      //     value: 'desc',
      //     label: 'High to Low'
      //   }, {
      //     value: 'asc',
      //     label: 'Low to High'
      //   }
      // ]

    }
  },
  computed: {
    // isHistory () {
    //   return window.history.length > 1
    // },
    // scrollHeight () {
    //   const dom = document.getElementById('mobile-market-header')
    //   console.log('scrollHeight', dom)
    //   return dom ? dom.offsetHeight : 0
    // },
    isMobile () {
      return this.$root.$children[0].isMobile
    },
    pageScrollE () {
      return document.getElementById('mobile-market-container')
    }
  },
  // watch: {
  //   sortOpen (val) {
  //     if (val) {
  //       this.prohibitScroll()
  //     } else {
  //       this.freeScroll()
  //     }
  //   }
  // },
  components: {
    MobileSortBar,
    // SwitchInput,
    MobileBuildingCard,

    // SkeletionList,
    MobileSkeletionBuilding,
    SkeletionPager
  },
  methods: {

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$emit('openDetail', info)
    },

    /**
     * 改变列表信息
     */
    changeLdbs (info, list = this.ldbs.list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i]._id === info._id) {
          list[i] = info
          break
        }
      }
      this.$set(this.ldbs, 'list', list)
      this.$forceUpdate()
    },

    /**
     * 获取 ldb 列表信息
     */
    async getLdbs ({ pn = this.ldbs.pn, ps = this.ldbs.ps, sort = this.ldbSort, order = this.ldbOrder } = {}) {
      this.ldbsLoading = true
      const params = {
        pn, ps, sort, order
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.ldbs = res.data
      }
      this.ldbsLoading = false
    },

    sortHandle (sort) {
      this.ldbSort = sort
      this.getLdbs({ sort })
    },

    orderHandle (order) {
      this.ldbOrder = order
      this.getLdbs({ order })
    },

    // toggleSort () {
    //   this.sortOpen = !this.sortOpen
    // },

    // chooseSort (value) {
    //   if (this.ldbSort === value) return

    //   scrollTo(100)

    //   this.ldbSort = value
    //   this.toggleSort()
    //   this.getLdbs({ sort: value })
    // },

    /**
     * order 改变触发事件
     */
    // orderChange (order) {
    //   if (this.sortOpen) {
    //     this.toggleSort()
    //   }
    //   scrollTo(100)
    //   this.getLdbs({ order })
    // },

    /**
     * 页码改变触发事件
     */
    pageChange (page) {
      this.getLdbs({ pn: page })

      const path = `${this.$route.path}?page=${page}`
      this.$emit('path', path)
    }

    /**
     * market 滚动监听
     */
    // marketScrollListener () {
    //   let navHeight = 0
    //   let _navHeight = 0

    //   const h = document.getElementsByClassName('mobile-market-header')[0].offsetHeight
    //   const pdom = document.getElementById('market-sort-section')
    //   const sdom = document.getElementById('mobile-market-sort')
    //   const isMobile = this.isMobile
    //   const func = () => {
    //     // 因为 mobile navbar 高度固定，所以第一次取到之后就可以保存到变量
    //     if (isMobile && !navHeight) {
    //       if (_navHeight) navHeight = _navHeight
    //       else {
    //         const mobileNavbar = document.getElementById('mobile-nav-bar')
    //         if (mobileNavbar) navHeight = mobileNavbar.offsetHeight
    //       }
    //       _navHeight = navHeight
    //     }
    //     const y = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    //     const bool = hasClass('fixed', sdom)
    //     if (y <= h && bool) {
    //       navHeight = 0
    //       sdom.style.top = '0px'

    //       removeClass('fixed', sdom)
    //       pdom.appendChild(sdom)
    //     } else if (y > h && !bool) {
    //       addClass('fixed', sdom)
    //       document.body.appendChild(sdom)

    //       sdom.style.top = navHeight + 'px'
    //     }
    //   }

    //   func()

    //   this.marketScrollHandle = func
    //   this.$nextTick(() => document.addEventListener('scroll', this.marketScrollHandle))
    // },
    // destroyMarket () {
    //   const pdom = document.getElementById('market-sort-section')
    //   const sdom = document.getElementById('mobile-market-sort')
    //   this.sortOpen = false
    //   if (pdom && !pdom.firstChild) {
    //     pdom.appendChild(sdom)
    //   }
    //   document.removeEventListener('scroll', this.marketScrollHandle)
    // }
  },
  mounted () {
    // scrollTo(0)
    this.$nextTick(() => {
      const pn = parseInt(this.$route.query.page || 1)
      this.getLdbs({ pn })
    })
  }
}
</script>

<style lang="scss" scoped>

  .mobile-market {
    padding-bottom: 35px;
    // background-color: #f8f8f8;
  }
  .mobile-market-container {
    // margin: 0 -20px;
    // padding: 0;
    // max-width: 768px;
    // @include viewport-unit(min-height, 100vh, 80px);
  }
  .mobile-taverns-title {
    padding: 20px 20px 0;
    font-size: 24px;
    line-height: 1;
  }

  /**
   *  mobile-market-header --- begin
   */
  // .mobile-market-header {
  //   padding: 55px 0;
  //   background-image: linear-gradient(to right, #1613B0, #7D72F0);
  //   color: #fff;
  //   >h2 {
  //     font-size: 36px;
  //   }
  //   >p {
  //     margin: 25px auto 0;
  //     max-width: 310px;
  //     font-size: 16px;
  //   }
  // }
  // .market-back-svg {
  //   position: absolute;
  //   left: 15px;
  //   top: 15px;
  //   width: 15px;
  //   height: 15px;
  //   fill: #fff;
  // }

  /**
   *  mobile-market-header --- end
   */

  /**
   *  market-sort-section --- begin
   */
  .market-sort-section {
    height: 60px;
    z-index: 9;
  }
  .mobile-market-sort {
    z-index: 1;
    &.fixed {
      position: fixed;
      // position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background-color: #f8f8f8;
      box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
      z-index: 9;
      .market-sort-bar {
        padding: 8px 20px;
      }
    }
  }
  .market-sort-container {
    .mobile-switch-input {
      background-color: transparent;
      border-radius: 0;
      color: #555;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      @include viewport-unit(height, 100vh);
      background-color: rgba(0, 0, 0, .25);
      opacity: 0;
      z-index: -1;
      visibility: hidden;
      transition: all .15s;
    }
    &.sort {
      &::before {
        opacity: 1;
        visibility: visible;
        z-index: 0;
      }
      .mobile-sort-select {
        color: $--text-blue-color;
      }
      .market-sort-icon {
        transform: rotate(180deg);
      }
      .market-sort-list {
        height: 162px;
        visibility: visible;
        transition: all .15s ease-in-out, visibility 0s 0s;
      }
    }
  }
  .mobile-sort-select {
    transition: color .15s;
    &.open {
      color: $--text-blue-color;
      .market-sort-icon {
        transform: rotate(180deg);
      }
    }
  }
  .market-sort-icon {
    transition: transform .15s;
  }

  .market-sort-label {
    width: 80px;
    overflow: hidden;
  }

  .market-sort-bar {
    position: relative;
    padding: 13px 20px;
    background-color: #f8f8f8;
    box-sizing: border-box;
    z-index: 2;
    transition: all .35s;
  }
  .mobile-market-total {
    color: #999;
  }

  .market-sort-list {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 3;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    transition: all .15s ease-in-out, visibility 0s .15s;
  }
  .sort-active-svg {
    width: 16px;
    height: 16px;
    fill: $--text-blue-color;
    opacity: 0;
    visibility: hidden;
  }
  .mobile-sort-item {
    padding: 16px 20px;
    font-size: 16px;
    &.active {
      color: $--text-blue-color;
      .sort-active-svg {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  /**
   *  market-sort-section --- end
   */

  /*
   * skeletion style -- begin
   */
  .skeletion-building-item {
    max-width: 160px;
    margin-bottom: 30px;
  }
  /*
   * skeletion style -- end
   */

  /**
   *  mobile-market-ldbs --- begin
   */
  .mobile-market-ldbs {
    position: relative;
    padding: 24px 20px 0;
    &::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 20px;
      width: calc(100% - 40px);
      height: 1px;
      background-color: #ddd;
    }
  }
  .mobile-market-item {
    max-width: 160px;
    margin-bottom: 18px;
    // padding-left: 10px;
    // padding-right: 10px;
    color: #fff;
    cursor: pointer;
  }
  .mobile-nomore-taverns {
    width: 100%;
    color: #999;
  }
  /**
   *  mobile-market-ldbs --- end
   */

  /*
   * market-pagination-box     --begin
   */
  // .market-pagination-box {
  //   margin-top: 25px;
  //   margin-bottom: 35px;
  // }
  // .market-pagination-switch {
  //   font-size: 18px;
  //   >span {
  //     margin-left: 30px;
  //     display: inline-block;
  //     cursor: pointer;
  //   }
  // }
  /*
   * market-pagination-box     --end
   */
</style>
