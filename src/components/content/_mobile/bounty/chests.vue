<template>
  <div ref="bounty-chests-box" class="bounty-chests-box">
    <div
      ref="chests_tabs"
      class="d-flex f-align-center text-center chests-tabs-box"
      @click.stop="chooseChest">
      <span ref="chest_tab_active_bar" class="inline-block chest-tab-active-bar"></span>
      <div
        v-for="(item, index) of chestTabs" :key="index"
        :data-name="item.name"
        class="TTFontBolder v-flex chest-tabs-item">
        <span class="inline-block">{{ item.label }}</span>
      </div>
    </div>
    <div class="d-flex col-flex bounty-chests-cnt">
      <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
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
            <p v-if="loadMoreLoading && !chests.noMore">
              <i class="el-icon-loading"></i>
            </p>
            <p v-else-if="chests.noMore">No more Chests~</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import BountyChestsSkeletion from '@/components/skeletion/_mobile/bounty/chests'
import BountyChestCard from '@/components/reuse/_mobile/card/bounty/chest'
import { getBountiesByUser } from 'api'
export default {
  name: 'bounty-chests-component',
  data: () => {
    return {
      rendered: false,
      loadMoreLoading: false,
      loading: true,
      currentTab: 'all',
      chests: {
        list: [],
        pn: 1,
        ps: 10,
        total: 0,
        noMore: false
      },
      chestTabs: [
        {
          label: 'All',
          name: 'all'
        },
        {
          label: 'Wrapping',
          name: 'wrapping'
        },
        {
          label: 'Unopened',
          name: 'unopened'
        },
        {
          label: 'Opened',
          name: 'opened'
        },
        {
          label: 'Failed',
          name: 'failed'
        }
      ]
    }
  },
  components: {
    BountyChestsSkeletion,
    BountyChestCard
  },
  methods: {
    afterEnter () {
      this.chests.total && this.scrollListenerFunc()
    },

    getAttr (node) {
      if (!node || node.nodeName === 'BODY') return {}

      const name = node.getAttribute('data-name')
      if (name !== null) {
        return { name }
      } else return this.getAttr(node.parentNode)
    },

    // 选择 tab
    chooseChest (e) {
      const { name } = this.getAttr(e.target)
      if (!name || name === this.currentTab) return
      this.changeChestTabs(name)
      this.initChestMethod(name)
    },

    // 改变 tabs 处理事件
    changeChestTabs (currentTab = this.currentTab) {
      const tabChildrens = document.querySelectorAll('.chest-tabs-item')
      if (!tabChildrens.length) return

      const activeBar = this.$refs['chest_tab_active_bar']
      for (const item of tabChildrens) {
        const name = item.getAttribute('data-name')
        if (name === currentTab) {
          const nodeLeft = item.offsetLeft
          const nodeWidth = item.offsetWidth
          const textWidth = item.firstChild.offsetWidth
          activeBar.style = `width: ${textWidth}px;left: ${nodeLeft + (nodeWidth - textWidth) / 2}px;`
          break
        }
      }
      this.currentTab = currentTab
    },

    // 初始化 chest tabs
    initChestTabs (currentTab = this.currentTab) {
      const tabs = this.$refs['chests_tabs']
      if (!tabs) return
      console.log('-------- come in initChestTabs')
      const box = tabs
      const parent = this.$refs['bounty-chests-box']
      if (!box || !parent) return
      document.body.appendChild(box)

      this.changeChestTabs(currentTab)
      this.$once('hook:beforeDestroy', () => {
        console.log('-------- beforeDestroy chest tabs destroy')
        parent.appendChild(box)
      })
      this.$once('hook:deactivated', () => {
        console.log('-------- deactivated chest tabs destroy', parent, box)
        parent.appendChild(box)
      })
    },

    // 初始化 bounty chests 页面
    async initBountyChests () {
      console.log('-------- initBountyChests', this.$route.path)
      this.loadMoreLoading = false
      this.initChestTabs()
      this.initChestMethod()

      if (!this.rendered) this.rendered = true
    },

    // 初始化 chest 数据函数
    async initChestMethod (type = this.currentTab) {
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
    async getBountyChestsMethod (type = this.currentTab, { pn = this.chests.pn, ps = this.chests.ps } = {}) {
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
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

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

      this.scrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.scrollHandle)
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
    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.initBountyChests()
  }
}
</script>

<style lang="scss" scoped>
  .bounty-chests-box {
    padding-top: 44px;
    box-sizing: border-box;
  }
  /**
   *  chests-tabs-box  -- begin
   */
  .chests-tabs-box {
    position: fixed;
    top: 44px;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #fff;
    background-color: #0079FF;
  }
  .chest-tab-active-bar {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 4px;
    background-color: #fff;
    transition: left .15s;
  }
  .chest-tabs-item {
    padding: 0 10px;
    box-sizing: border-box;
  }
  /**
   *  chests-tabs-box  -- end
   */

  /**
   *  bounty-chests-cnt  -- begin
   */
  .bounty-chests-cnt {
    padding: 68px 24px 24px;
  }

  // bounty-chests-empty
  .bounty-chests-empty {
    font-size: 20px;
    @include viewport-unit(min-height, 100vh, 88px);
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
   *  bounty-chests-cnt  -- end
   */
  .chest-noMore-text {
    margin-top: 16px;
    font-size: 16px;
    color: #999;
  }


</style>
