<template>
  <div class="d-flex user-building-box">
    <div class="d-flex v-flex col-flex container user-candy-container">
      <!-- <h1 class="text-cap owner-children-title">Taverns</h1> -->
      <transition name="ld-hide-in-fade">
        <div
          v-if="!ownerTaverns.total && !loading"
          class="v-flex d-flex col-flex f-auto-center text-center no-taverns-box">
          <svg>
            <use xlink:href="#icon-sitdown-human"/>
          </svg>
          <h3>You have no Taverns.</h3>
          <div>
            <p class="no-taverns-text">Try to purchase a Tavern and be a Tavernkeep to earn more candies.</p>
            <lordless-btn
              class="trading-opensea-btn"
              theme="blue-linear"
              shadow>
              <a class="d-inline-flex f-align-center" href="https://opensea.io/assets/lordless" target="_blank">
                Buy Tavern on OpenSea
              </a>
            </lordless-btn>
          </div>
        </div>
        <div
          v-else
          class="v-flex relative onwer-children-cnt user-building-tabs">
          <ul>
            <li v-for="tavern of ownerTaverns.list" :key="tavern.id"
              class="d-flex full-width mobile-user-card owner-taverns-item"
              @click.stop="openTavern(tavern)">
              <div class="owner-taverposter">
                <lordless-tavern-poster
                  :src="tavern.ldbIcon ? tavern.ldbIcon.source.preview : ''"
                  :popularity="tavern.chain.popularity"
                  shadow
                  showPopularity
                  isSmall/>
              </div>
              <div class="v-flex d-flex col-flex f-justify-between owner-taverinfo">
                <p class="d-flex f-align-center owner-tavertitle">
                  <span class="text-nowrap owner-tavername">{{ tavern.name.zh }}</span>
                </p>
                <div>
                  <p class="owner-taverlevel">Level {{ tavern.chain.level }}</p>
                </div>
              </div>
              <div class="d-flex f-auto-center owner-taverjump">
                <svg>
                  <use xlink:href="#icon-arrow-circle"/>
                </svg>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import SkeletionBuilding from '@/components/skeletion/_mobile/building'

import BuildingCard from '@/components/reuse/_mobile/card/building'

import { getChainLdbs } from 'api'
import { mapState } from 'vuex'

import { activatedMixins, publicMixins } from '@/mixins'
export default {
  name: 'mobile-owner-taverns',
  mixins: [ activatedMixins, publicMixins ],
  data: () => {
    return {

      loading: true,

      /**
       * all building options
       */

      // 用户全部的建筑
      ownerTaverns: {
        list: [],
        total: 0,
        pn: 1,
        ps: 20
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  watch: {
    account (val) {
      this.getOwnerTaverns()
    }
  },
  components: {
    SkeletionBuilding,

    BuildingCard
  },
  methods: {

    openTavern (tavern) {
      this.$router.push(`/tavern/${tavern.id}?refer=${encodeURIComponent(this.$route.path)}`)
    },

    async getOwnerTaverns ({ lord = this.userInfo._id, pn = this.ownerTaverns.pn, ps = this.ownerTaverns.ps } = {}) {
      if (!lord) return
      this.loading = true
      const params = {
        pn,
        ps,
        lord
      }
      const res = await getChainLdbs(params)
      if (res.code === 1000 && res.data) {
        this.ownerTaverns = res.data
      }
      this.loading = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getOwnerTaverns()
    })
  }
}
</script>

<style lang="scss" scoped>

  .user-building-box {
    padding-top: 44px;
    // margin-top: 35px;
    font-size: 16px;
    // @include padding(-1, 30px, 1);
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 50px);
  }
  .user-candy-container {
    padding-top: 25px;
  }

  .skeletion-building-item {
    margin-bottom: 50px;
  }

  /**
   *  no-taverns-box  -- begin
   */
  .no-taverns-box {
    >svg {
      width: 300px;
      height: 300px;
    }
    >h3 {
      margin-top: 32px;
      font-size: 20px;
      color: #0B2A48;
    }
  }
  .no-taverns-text {
    margin-top: 12px;
    width: 300px;
    font-size: 16px;
  }
  .trading-opensea-btn {
    margin-top: 30px;
    height: 46px;
    line-height: 46px;
    >a {
      padding: 0 20px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
  /**
   *  no-taverns-box  -- end
   */

  .owner-taverns-item {
    padding: 16px;
    background-color: #fff;
    border-radius: 5px;
    box-sizing: border-box;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
  .owner-taverposter {
    width: 72px;
    height: 72px;
    &.none {
      padding: 10px;
      fill: #BDB9FD;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, .25);
    }
  }
  .owner-tavermark {
    margin-right: 5px;
    padding: 2px 6px;
    font-size: 12px;
    color: #fff;
    background-color: #4586FC;
    border-radius: 5px;
  }
  .owner-tavername {
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .owner-taverinfo {
    margin-left: 18px;
  }
  .user-info-btn {
    display: inline-block;
    padding: 8px 15px;
    font-size: 14px;
    @include margin('top', 15px, 1);
  }
  .owner-tavertitle {
    font-size: 16px;
    color: #777;
  }
  .owner-taverlevel {
    font-size: 14px;
    color: #777;
  }
  .owner-taverleftap {
    font-size: 14px;
    color: #4586FC;
  }
  .owner-taverjump {
    width: 24px;
    >svg {
      width: 24px;
      height: 24px;
      fill: #4586FC;
    }
  }
</style>
