<template>
  <div class="relative alone-layer tavern-keeps-box">

    <!-- ldb detail datas skeletion -->
    <!-- <transition name="ld-suspension-hide-fade">
      <tavernkeeps-skeletion v-if="loading || keepsLoading"/>
    </transition> -->

    <transition name="ld-hide-fade" mode="out-in" @after-enter="datasEnter">
      <section v-if="!loading && !keepsLoading && keeps.length" class="d-flex col-flex f-align-ceter sm-col-flex detail-tavern-keeps">
        <h2 class="detail-mobile-title">Successive tavernkeeps</h2>
        <div
          v-for="(keep, index) of keeps" :key="keep._id"
          class="relative mobile-keeps-item">
          <div class="d-flex f-align-start keeps-item-info">
            <lordless-blockies
              class="tavern-keeps-avatar"
              theme="dark"
              :scale="6"
              :size="6"
              jump
              :seed="keep.lord._id"/>
            <div class="v-flex keep-info-detail">
              <p v-if="keep.lord.nickName" class="d-flex col-flex">
                <span class="TTFontBolder line-height-1 keeps-user-name">{{ keep.lord.nickName | sliceStr({ end: 6, symbol: true }) }}</span>
                <span class="keeps-user-address">{{ keep.lord._id | splitAddress({ before: 6, end: 4 }) }}</span>
              </p>
              <p v-else class="TTFontBolder keeps-user-name">{{ keep.lord._id | splitAddress({ before: 6, end: 4, symbol: '******' }) }}</p>
            </div>
            <p class="TTFontBolder mobile-keeps-index"># {{ keeps.length - index }}</p>
          </div>
          <div class="d-flex f-align-center keeps-item-earnings">
            <p>EARNINGS</p>
            <h2 class="v-flex text-right">$ {{ keep.reward | formatNumber | formatDecimal }}</h2>
          </div>
          <!-- <p class="mobile-keeps-index"># {{ keeps.length - index }}</p>
          <span class="d-flex f-align-center">Earnings Value</span>
          <p class="price text-upper">{{ keep.reward | formatNumber | formatDecimal }} ETH</p>
          <span>Tavernkeep</span>
          <div class="v-flex d-flex f-align-center tavern-keeps-user">
            <lordless-blockies
              class="tavern-keeps-avatar"
              theme="dark"
              :scale="6"
              :size="5"
              jump
              :seed="keep.lord._id"/>
            <p v-if="keep.lord.nickName" class="d-flex f-align-center">
              <span class="keeps-user-name">{{ keep.lord.nickName | sliceStr({ end: 6, symbol: true }) }}</span>
              <span class="keeps-user-address">{{ keep.lord._id | splitAddress({ before: 6, end: 4 }) }}</span>
            </p>
            <p v-else class="keeps-user-name">{{ keep.lord._id | splitAddress({ before: 10, end: 8 }) }}</p> -->
          <!-- </div> -->
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import TavernkeepsSkeletion from '@/components/skeletion/ldb/detail/tavernkeeps'

import { getTavernkeeps } from 'api'
export default {
  name: 'mobile-tavern-keeps',
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
      keepsLoading: true,
      keeps: []
    }
  },
  computed: {
  },
  watch: {
    info (val) {
      if (val && val.id) {
        this.getTavernkeepsHandle(val.id)
      }
    }
  },
  components: {
    TavernkeepsSkeletion
  },
  methods: {
    datasEnter () {
      this.$emit('enter')
    },
    async getTavernkeepsHandle (tokenId = this.info.id) {
      this.keepsLoading = true
      try {
        const res = await getTavernkeeps(tokenId)
        if (res.code === 1000 && res.data) {
          this.keeps = (res.data || []).filter(item => item.lord)
        }
      } catch (err) {
        this.keepsLoading = false
      }
      this.keepsLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .tavern-keeps-box {
    // border-radius: 5px;
    // overflow: hidden;
  }
  .detail-mobile-title {
    margin-top: 28px;
    margin-bottom: 10px;
    font-size: 24px;
    color: #0B2A48;
  }
  .mobile-keeps-item {
    padding: 16px 18px;
    font-size: 16px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    >p {
      // font-size: 16px;
      // color: #555;
      &.price {
        font-size: 24px;
        color: $--text-blue-color;
      }
    }
    >span {
      color: #999;
      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
  .keeps-item-info {
    padding-bottom: 16px;
  }
  .mobile-keeps-index {
    // position: absolute;
    // right: 15px;
    // top: 15px;
    font-size: 18px;
    color: #0B2A48;
  }
  // .tavern-keeps-user {
  //   margin-top: 6px;
  // }
  .keep-info-detail {
    margin-left: 10px;
  }
  .keeps-user-name {
    color: #555;
  }
  .keeps-user-address {
    margin-top: 2px;
    color: #999;
  }

  // keeps-item-earnings
  .keeps-item-earnings {
    padding-top: 13px;
    // height: 56px;
    // line-height: 56px;
    font-size: 16px;
    color: #777;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
    >h2 {
      font-size: 24px;
      color: $--text-blue-color;
    }
  }
</style>
