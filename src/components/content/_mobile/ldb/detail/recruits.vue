<template>
  <div class="relative alone-layer tavern-recruits-box">
    <transition name="ld-hide-fade" mode="out-in">
      <section v-if="!loading && !recruitsLoading" class="d-flex col-flex f-align-ceter sm-col-flex detail-tavern-recruits">
        <h2 class="detail-mobile-title">Recruits</h2>
        <div class="tavern-recruits-cnt">
          <div class="d-flex f-align-center recruits-cnt-top">
            <div class="v-flex recruits-limit-box">
              <p>Recruits / Maximum limit</p>
              <h3>
                <span class="recruits-current-limit" :class="{ 'color-blue': info.hunterMembers !== info.maxHunterMembers, 'color-gray': info.hunterMembers >= info.maxHunterMembers }">{{ info.hunterMembers }}</span> <span :class="{ 'color-red': info.hunterMembers / info.maxHunterMembers > 0.9 }">/ {{ info.maxHunterMembers || 30 }}</span>
              </h3>
            </div>
            <div class="alone-layer recruits-tavern-level">
              <img class="full-width" :alt="`tavern popularity ${info.chain.popularity}`" :src="`/img/tavern/ldb-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
            </div>
          </div>
          <div class="d-flex col-flex f-auto-center recruits-cnt-bottom">
            <p>Recruit boost comparison</p>
            <div class="d-flex f-align-center recruits-boosts-box">
              <div class="v-flex recruits-boosts-item">
                <h3 class="text-nowrap">+ {{ info.chain.popularity }}%</h3>
                <p>Tavern’s</p>
              </div>
              <p class="v-flex recruits-boosts-vs">VS.</p>
              <div class="v-flex recruits-boosts-item">
                <h3 class="text-nowrap">+ {{ userHome ? userHome.homeInfo.tavern.chain.popularity : 0 }}%</h3>
                <p>Yours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
// import { getTavernkeeps } from 'api'
import { mapState } from 'vuex'
export default {
  name: 'mobile-tavern-recruits',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      recruitsLoading: false
    }
  },
  computed: {
    ...mapState('user', [
      'userHome'
    ])
  },
  watch: {
    info (val) {
      if (val && val.id) {
        // this.getTavernkeepsHandle(val.id)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .tavern-recruits-box {
    // overflow: hidden;
  }
  .detail-mobile-title {
    margin-top: 28px;
    margin-bottom: 10px;
    font-size: 18px;
    color: $--main-color;
  }
  .tavern-recruits-cnt {
    padding: 16px 18px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
  }
  .recruits-cnt-top {
    padding-bottom: 16px;
    border-bottom: 1px solid #ddd;
  }
  .recruits-limit-box {
    font-size: 14px;
    color: #777;
    >h3 {
      margin-top: 2px;
      font-size: 16px;
    }
  }
  .recruits-current-limit {
    // color: $--main-blue-color;
  }
  .recruits-tavern-level {
    width: 48px;
    height: 48px;
    line-height: 1;
  }

  // recruits-cnt-bottom
  .recruits-cnt-bottom {
    padding-top: 12px;
    font-size: 14px;
    color: #777;
  }
  .recruits-boosts-box {
    margin-top: 12px;
    line-height: 1.2;
  }
  .recruits-boosts-item {
    >h3 {
      font-size: 20px;
      color: $--main-color;
    }
  }
  .recruits-boosts-vs {
    margin: 0 24px;
  }
</style>
