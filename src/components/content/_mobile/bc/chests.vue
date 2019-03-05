<template>
  <div class="bc-chests-cnt-box">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="chestsAfterEnter">
      <bounty-chests-skeletion v-if="loading"/>
      <div v-else-if="!loading && !chests.total" class="d-flex col-flex f-auto-center bounty-chests-empty">
        <span class="inline-block line-height-0 chests-empty-icon">
          <svg>
            <use xlink:href="#icon-bounty-empty"/>
          </svg>
        </span>
        <p class="TTFontBolder">No related chests.</p>
      </div>
      <div v-else id="bounty-chests-scroll-box">
        <div
          class="bounty-chest-item"
          v-for="(item, index) of chests.list" :key="index">
          <bounty-chest-card :info="item"/>
        </div>
        <div class="text-center chest-noMore-text">
          <p v-if="chestsLoadMore && !chests.noMore">
            <i class="el-icon-loading"></i>
          </p>
          <p v-else-if="chests.noMore">No more Chests~</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import BountyChestsSkeletion from '@/components/skeletion/_mobile/bounty/chests'
import BountyChestCard from '@/components/reuse/_mobile/card/bounty/chest'

import { getBountiesByUser } from 'api'
export default {
  name: 'mobile-bc-chests',
  props: {
    chestModel: {
      type: String,
      default: 'all'
    }
  },
  data: () => {
    return {
      rendered: false,
      loading: true,
      chestsLoadMore: false,
      chestScrollHandle: null,
      chests: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0,
        noMore: false
      }
    }
  },
  watch: {
    chestModel (val) {
      this.changeChest(val)
    }
  },
  components: {
    BountyChestsSkeletion,
    BountyChestCard
  },
  methods: {
    chestsAfterEnter () {
      console.log('---------- this.chests.total', this.chests.total)
      this.chests.total && this.chestsScrollListen()
    },

    // 选择 tab
    changeChest (name) {
      this.initChestMethod(name)
    },

    // 初始化 bounty chests 页面
    async initBountyChests () {
      console.log('-------- initBountyChests', this.$route.path)
      this.chestsLoadMore = false
      this.initChestMethod()

      if (!this.rendered) this.rendered = true
    },

    // 初始化 chest 数据函数
    async initChestMethod (type = this.chestModel) {
      this.loading = true
      const { list = [], pn = 1, ps = 10, total = 0 } = (await this.getBountyChestsMethod(type)) || {}
      this.chests = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      this.loading = false
    },

    // 获取 chests 数据原始函数
    async getBountyChestsMethod (type = this.chestModel, { pn = this.chests.pn, ps = this.chests.ps } = {}) {
      try {
        const res = await getBountiesByUser({ pn, ps, type })
        if (res.code === 1000 && res.data) {
          return res.data
        }
      } catch (err) {
        console.log('---- err', err.message)
        return null
      }
      return null
    },

    // 获取更多 Chests
    async loadMoreChests (cb) {
      const info = this.chests
      const pn = info.pn + 1
      const { list = [], ps = info.ps, total = 0 } = (await this.getBountyChestsMethod({ pn })) || {}

      let noMore = false
      if (list.length < ps) {
        noMore = true
      }
      this.$set(this, 'chests', Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        total,
        noMore
      }))

      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    chestsScrollListen ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.chestScrollHandle && document.removeEventListener('scroll', this.chestScrollHandle)
      this.chestScrollHandle = null

      console.log('- this.currentTab', this.chestModel)
      // if (this.currentTab !== 'chests') return

      const box = document.getElementById('bounty-chests-scroll-box')
      let bHeight = box ? box.offsetHeight : 0
      console.log(' --- scroll', bHeight, bottom, pHeight)
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      const handleFunc = () => {
        if (bool || this.chests.noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreChests(() => {
            this.$nextTick(() => {
              bool = false
              bHeight = box.offsetHeight
            })
          })
        }
      }
      handleFunc()

      this.chestScrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.chestScrollHandle)
      })
    }
  },
  beforeDestroy () {
    this.loading = true
  },
  deactivated () {
    this.loading = true
  },
  activated () {
    if (!this.rendered) return
    this.initBountyChests()
    this.$nextTick(() => this.chestsScrollListen())
  },
  mounted () {
    this.initBountyChests()
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  bc-chests-cnt-box  -- begin
   */
  .bc-chests-cnt-box {
    padding: 24px;
  }

  // bounty-chests-empty
  .bounty-chests-empty {
    margin: -24px;
    font-size: 20px;
    @include viewport-unit(min-height, 100vh, 138px);
  }
  .chests-empty-icon {
    margin-bottom: 32px;
    width: 200px;
    height: 200px;
  }

  // bounty-chest-item
  .bounty-chest-item {
    &:not(:first-of-type) {
      margin-top: 18px;
    }
  }
  /**
   *  bc-chests-cnt-box  -- end
   */
  .chest-noMore-text {
    margin-top: 16px;
    font-size: 16px;
    color: #999;
  }
</style>
