<template>
  <div class="bc-holding-box">
    <div class="relative d-flex f-align-center bc-tabs-box">
      <div
        ref="bc-holding-tabs"
        class="v-flex d-flex f-align-center text-center bc-holding-tabs"
        @click.stop="chooseTab">
        <span ref="bc_tab_active_bar" class="inline-block bc-tab-active-bar"></span>
        <div
          v-for="(item, index) of bcTabs" :key="index"
          :data-name="item.name"
          class="TTFontBolder bc-tabs-item">
          <span class="inline-block">{{ item.label }}</span>
        </div>
      </div>
      <span class="inline-block line-height-0 bc-bounty-icon" @click.stop="$router.push('/owner/bountyChest')">
        <svg>
          <use xlink:href="#icon-bounty-chests"/>
        </svg>
      </span>
    </div>
    <div class="bc-holding-cnt">
      <div v-if="currentTab === 'materials' && holdingValue !== 0" class="d-flex f-align-start bc-holding-materials">
        <div class="v-flex holding-marterials-left">
          <p>Materials value</p>
          <h2 v-if="holdingValue !== -1">$ {{ holdingValue | formatDecimal }}</h2>
          <h2 v-else>$ ???</h2>
        </div>
        <p>Total {{ tokenTotal }}</p>
      </div>
      <ul v-if="currentTab === 'chests'" class="d-flex f-align-center bc-holding-chests" @click.stop="chooseChest">
        <li
          v-for="(chest, index) of bcChests"
          :key="index"
          :data-name="chest.name"
          class="TTFontBolder holding-chest-item"
          :class="{ 'is-active': chest.name === currentChest }">
          <span class="inline-block">{{ chest.label }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { historyState } from 'utils/tool'
export default {
  name: 'mobile-bc-holding',
  props: {
    holdingValue: {
      type: Number,
      default: -1
    },
    tokenTotal: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      rendered: false,
      bcTabs: [
        {
          label: 'Materials',
          name: 'materials'
        }, {
          label: 'Bounty Chests',
          name: 'chests'
        }
      ],
      currentTab: 'materials',

      // bc chests options
      bcChests: [
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
      ],
      currentChest: 'all'
    }
  },
  watch: {
    currentTab (val) {
      this.$emit('bcTab', val)
    },
    currentChest (val) {
      this.$emit('bcChest', val)
    }
  },
  methods: {
    getAttr (node) {
      if (!node || node.nodeName === 'BODY') return {}

      const name = node.getAttribute('data-name')
      if (name !== null) {
        return { name }
      } else return this.getAttr(node.parentNode)
    },

    chooseTab (e) {
      const { name } = this.getAttr(e.target)
      if (!name || name === this.currentTab) return
      this.changeBCTab(name)
      // this.initChestMethod(name)
    },

    chooseChest (e) {
      const { name } = this.getAttr(e.target)
      if (!name || name === this.currentChest) return
      this.currentChest = name
    },

    // 改变 tabs 处理事件
    changeBCTab (currentTab = this.currentTab) {
      const tabChildrens = document.querySelectorAll('.bc-tabs-item')
      if (!tabChildrens.length) return

      const activeBar = this.$refs['bc_tab_active_bar']
      for (const item of tabChildrens) {
        const name = item.getAttribute('data-name')
        if (name === currentTab) {
          const nodeLeft = item.offsetLeft
          // const nodeWidth = item.offsetWidth
          const textWidth = item.firstChild.offsetWidth
          activeBar.style = `width: 32px;left: ${nodeLeft + textWidth / 2 - 16}px;`
          break
        }
      }
      historyState(`/owner/bc?type=${currentTab}`)
      this.currentTab = currentTab
    },

    // 初始化 chest tabs
    initBCTabs (currentTab = this.currentTab) {
      let _currentTab = this.$route.query.type === 'chests' ? 'chests' : 'materials'
      currentTab = _currentTab
      const dom = this.$el
      const parent = this.$el.parentNode
      console.log('------- parent', parent)
      if (!dom || !parent || parent.tagName === 'BODY') return
      document.body.appendChild(dom)

      if (!this.rendered) this.rendered = true

      this.changeBCTab(currentTab)
      this.$once('hook:beforeDestroy', () => {
        console.log('-------- beforeDestroy bc tabs destroy')
        parent.appendChild(dom)
      })
      this.$once('hook:deactivated', () => {
        console.log('-------- deactivated bc tabs destroy', parent, dom)
        parent.appendChild(dom)
      })
    }
  },
  beforeDestroy () {
    // this.destory()
  },
  deactivated () {
    // this.destory()
  },
  activated () {
    if (!this.rendered) return
    console.log('-------- holding activated')
    this.initBCTabs()
  },
  mounted () {
    console.log('-------- holding mounted')
    this.initBCTabs()
  }
}
</script>

<style lang="scss" scoped>
  .bc-holding-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  /**
   *  bc-tabs-box -- begin
   */
  .bc-tabs-box {
    // margin-bottom: 1px;
    height: 44px;
    background-color: #0079FF;
    border-bottom: 1px solid #4AA0FF;
    box-sizing: border-box;
  }
  .bc-holding-tabs {
    padding: 0 20px;
  }
  .bc-tabs-item {
    font-size: 16px;
    color: #fff;
    &:not(:first-of-type) {
      margin-left: 24px;
    }
  }
  .bc-tab-active-bar {
    position: absolute;
    bottom: -0.5px;
    width: 0;
    height: 6px;
    background-color: #FFCC66;
    transition: left .15s;
  }
  /**
   *  bc-tabs-box -- end
   */

  .bc-bounty-icon {
    margin-right: 20px;
    width: 24px;
    height: 24px;
    fill: #fff;
  }

  /**
   *  bc-holding-cnt  -- begin
   */
  .bc-holding-cnt {

  }

  // bc-holding-materials
  .bc-holding-materials {
    padding: 18px 20px;
    font-size: 14px;
    color: #fff;
    background-color: #0079FF;
  }
  .holding-marterials-left {
    >h2 {
      margin-top: 4px;
      font-size: 24px;
    }
  }

  // bc-holding-chests
  .bc-holding-chests {
    padding: 14px 0;
    background-color: #fff;
    @include overflow();
  }
  .holding-chest-item {
    position: relative;
    padding: 0 12px;
    font-size: 14px;
    color: #999;
    &.is-active {
      color: #0079FF;
    }
    &:not(:first-of-type) {
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -0.5px;
        width: 1px;
        height: 8px;
        background-color: #bbb;
        transform: translateY(-50%);
      }
    }
  }
  /**
   *  bc-holding-cnt  -- end
   */
</style>
