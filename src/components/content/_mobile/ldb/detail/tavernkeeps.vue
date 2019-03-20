<template>
  <div class="relative alone-layer tavern-keeps-box">

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
              :scale="4"
              :size="5"
              jump
              :seed="keep.lord._id"/>
            <div class="TTFontBolder v-flex d-flex f-align-center keep-info-detail">
              <span class="mobile-keeps-index">[{{ index === 0 ? 'current' : index + 1 }}]</span>
              <p class="v-flex keeps-user-name">{{ keep.lord._id | splitAddress({ before: 6, end: 4, symbol: '******' }) }}</p>
            </div>
          </div>
          <ul class="keeps-item-earnings">
            <li class="keeps-earnings-item">
              <p>Earned Materials value in USD</p>
              <h3>$ {{ keep.materials | formatDecimal({ len: 2 }) }}</h3>
            </li>
            <li class="keeps-earnings-item">
              <p>Commission of HOPS</p>
              <h3>{{ keep.commissions.toLocaleString() }}</h3>
            </li>
          </ul>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
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
  watch: {
    info (val) {
      if (val && val.id) {
        this.getTavernkeepsHandle(val.id)
      }
    }
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
    font-size: 18px;
    color: $--main-color;
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
    font-size: 14px;
    color: $--main-color;
  }
  // .tavern-keeps-user {
  //   margin-top: 6px;
  // }
  .keep-info-detail {
    margin-left: 6px;
  }
  .keeps-user-name {
    margin-left: 6px;
    font-size: 14px;
    color: #777;
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
  .keeps-earnings-item {
    font-size: 14px;
    color: #777;
    >h3 {
      margin-top: 4px;
      font-size: 16px;
      color: $--main-color;
    }
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
