<template>
  <div class="bc-materials-cnt-box">
    <transition name="ld-hide-fade" mode="out-in">
      <mobile-asset-skeletion v-if="loading"/>
      <div v-else-if="!loading && !materialAssets.totalValue" class="v-flex d-flex col-flex f-auto-center children-none-data-box none-candies-box bounty-chest-empty">
        <span class="inline-block line-height-0 chest-empty-icon">
          <svg>
            <use xlink:href="#icon-chest-empty"/>
          </svg>
        </span>
        <h2>You have no tokens.</h2>
        <p>Claim some tokens in the taverns or buy a tavern to get reward.</p>
        <div class="chest-empty-btn-box">
          <lordless-btn class="chest-empty-btn" theme="blue-linear" @click="$router.push('/taverns')">Apply a quest</lordless-btn>
          <lordless-btn class="chest-empty-btn" theme="blue-linear">
            <a href="https://opensea.io/assets/lordless" target="_blank">Buy a tavern</a>
          </lordless-btn>
        </div>
      </div>
      <div v-else-if="!loading && materialAssets.total" class="v-flex d-flex col-flex mobile-candies-container">
        <div class="v-flex candies-main-cnt">
          <ul class="candies-list">
            <li
              class="candies-item"
              v-for="(asset, index) of materials" :key="index">
              <mobile-asset-card :info="asset" :totalValue="materialAssets.totalValue"/>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import MobileAssetSkeletion from '@/components/skeletion/_mobile/candy'
import MobileAssetCard from '@/components/reuse/_mobile/card/asset'

import { getUserAssets } from 'api'
export default {
  name: 'mobile-bc-materials',
  props: {
    holdingValue: {
      type: Number,
      default: 0
    },
    tokenTotal: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      rendered: false,
      loading: true,
      materialAssets: {
        total: 0,
        list: [],
        totalValue: 0
      }
    }
  },
  computed: {
    materials () {
      const _materialAssets = this.materialAssets
      return _materialAssets.list.sort((a, b) => b.value - a.value)
    }
  },
  components: {
    MobileAssetSkeletion,
    MobileAssetCard
  },
  methods: {

    // 获取用户 assets
    async getAssets () {
      if (this.rendered) return
      this.loading = true
      const res = await getUserAssets()
      if (res.code === 1000 && res.data) {
        this.materialAssets = res.data
        this.$emit('update:holdingValue', res.data.totalValue)
        this.$emit('update:tokenTotal', res.data.total)
      } else {
        this.$emit('update:holdingValue', 0)
        this.$emit('update:tokenTotal', 0)
      }
      this.loading = false
      if (!this.rendered) this.rendered = true
    },
    initMaterials () {
      this.getAssets()
    }
  },
  async activated () {
    // this.init()
    if (!this.rendered) return
    this.initMaterials()
  },
  mounted () {
    this.$nextTick(() => this.initMaterials())
  }
}
</script>

<style lang="scss" scoped>
  .bc-materials-cnt-box {
    padding: 20px;
  }
  .candies-item {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }

  .bounty-chest-empty {
    @include viewport-unit(min-height, 100vh, 138px);
    >h2 {
      margin-top: 32px;
      font-size: 20px;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
      color: #555;
    }
  }
  .chest-empty-icon {
    width: 200px;
    height: 200px;
  }
  .chest-empty-btn-box {
    margin-top: 32px;
  }
  .chest-empty-btn {
    padding: 12px 24px;
    width: 100%;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
