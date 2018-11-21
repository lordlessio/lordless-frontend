<template>
  <section id="mobile-sort-bar" class="relative mobile-sort-bar" :class="{ 'inherit-height': inheritHeight }">
    <div id="sort-bar-box" class="alone-layer lg-d-flex f-align-center relative sort-bar-box">
      <div class="relative sort-bar-container" :class="{ 'sort': openModel }">
        <div class="d-flex f-align-center sort-bar-cnt">
          <slot></slot>
          <div
            v-if="showSort"
            class="alone-layer d-flex f-align-center mobile-sort-select"
            @click="toggleBar">
            <span class="inline-block sort-bar-label">{{ sortItems[sortModel] }}</span>
            <span class="inline-block sort-bar-icon">
              <i class="el-icon el-icon-caret-top"></i>
            </span>
          </div>
          <switch-input
            v-if="showOrder"
            class="mobile-switch-input"
            v-model="orderModel"
            :items="orderItems"
            @change="orderChange"/>
          <p v-if="showTotal" class="v-flex text-right mobile-sort-total">Total {{ total }}</p>
        </div>
        <ul class="sort-bar-list" :style="`height: ${openModel ? sortListHeight : 0}px;`">
          <li
            v-for="(sort, index) of Object.keys(sortItems)" :key="index"
            class="d-flex f-align-center f-justify-between mobile-sort-item"
            :class="{ 'active': sort === sortModel }"
            @click="chooseSort(sort)">
            <span class="text-cap">{{ sortItems[sort] }}</span>
            <span class="inline-blick sort-active-svg">
              <svg>
                <use xlink:href="#icon-ok"/>
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { addClass, removeClass, hasClass } from 'utils/tool'
import { layoutMixins } from '@/mixins'
import SwitchInput from '@/components/stories/switchInput'
export default {
  mixins: [layoutMixins],
  props: {
    sortItems: {
      type: Object,
      default: () => {}
    },

    orderItems: {
      type: Array,
      default: () => {
        return [
          {
            value: -1,
            label: 'Descending'
          }, {
            value: 1,
            label: 'Ascending'
          }
        ]
      }
    },
    showSort: {
      type: Boolean,
      default: true
    },
    showOrder: {
      type: Boolean,
      default: true
    },
    showTotal: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    static: {
      type: Boolean,
      default: false
    },
    inheritHeight: {
      type: Boolean,
      default: false
    },
    scrollHeight: {
      type: Number,
      default: 0
    }
  },
  data: (vm) => {
    console.log('------ sort bar', vm.sortItems)
    return {
      openModel: false,

      // order options
      orderModel: 'desc',

      // sort options
      sortIndex: 0,
      sortModel: Object.keys(vm.sortItems)[0]
    }
  },
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    },
    sortListHeight () {
      return 54 * Object.keys(this.sortItems).length
    }
  },
  watch: {
    openModel (val) {
      if (val) {
        this.prohibitScroll()
      } else {
        this.freeScroll()
      }
    }
  },
  components: {
    SwitchInput
  },
  methods: {
    toggleBar () {
      this.openModel = !this.openModel
    },

    /**
     * order 改变触发事件
     */
    orderChange (order) {
      if (this.openModel) {
        this.toggleBar()
      }
      document.documentElement.scrollTop = 100
      this.$emit('order', order)
    },

    /**
     * sort 选择事件
     */
    chooseSort (sort) {
      if (this.sortModel === sort) return

      document.documentElement.scrollTop = 100

      this.sortModel = sort
      this.toggleBar()
      this.$emit('sort', sort)
    },

    /**
     * sortBar 滚动监听
     */
    sortBarScroll () {
      console.log('sortBarScroll')
      let navHeight = 0
      let _navHeight = 0

      const h = this.scrollHeight
      const pdom = document.getElementById('mobile-sort-bar')
      const sdom = document.getElementById('sort-bar-box')
      const isMobile = this.isMobile
      const func = () => {
        // 因为 mobile navbar 高度固定，所以第一次取到之后就可以保存到变量
        if (isMobile && !navHeight) {
          if (_navHeight) navHeight = _navHeight
          else {
            const mobileNavbar = document.getElementById('mobile-nav-bar')
            if (mobileNavbar) navHeight = mobileNavbar.offsetHeight
          }
          _navHeight = navHeight
        }
        const y = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        const bool = hasClass('fixed', sdom)
        if (y <= h && bool) {
          navHeight = 0
          sdom.style.top = '0px'

          removeClass('fixed', sdom)
          pdom.appendChild(sdom)
        } else if (y > h && !bool) {
          addClass('fixed', sdom)
          document.body.appendChild(sdom)

          sdom.style.top = navHeight + 'px'
        }
      }
      document.addEventListener('scroll', func)
      this.$once('hook:beforeDestroy', () => {
        this.openModel = false
        if (!pdom.firstChild) {
          pdom.appendChild(sdom)
        }
        document.removeEventListener('scroll', func)
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.static && this.showSort) this.sortBarScroll()
    })
  }
}
</script>

<style lang="scss" scoped>
  /**
   *  mobile-sort-bar --- begin
   */
  .mobile-sort-bar {
    height: 60px;
    z-index: 9;
    &.inherit-height {
      height: inherit;
    }
  }
  .sort-bar-box {
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
      .sort-bar-cnt {
        padding: 8px 20px;
      }
    }
  }
  .sort-bar-container {
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
      .sort-bar-icon {
        transform: rotate(180deg);
      }
      .sort-bar-list {
        // height: 162px;
        visibility: visible;
        transition: all .15s ease-in-out, visibility 0s 0s;
      }
    }
  }
  .mobile-sort-select {
    transition: color .15s;
    &.open {
      color: $--text-blue-color;
      .sort-bar-icon {
        transform: rotate(180deg);
      }
    }
  }
  .sort-bar-icon {
    transition: transform .15s;
  }

  .sort-bar-label {
    margin-right: 5px;
    width: initial;
    overflow: hidden;
  }

  .sort-bar-cnt {
    position: relative;
    padding: 13px 20px;
    background-color: #f8f8f8;
    box-sizing: border-box;
    z-index: 2;
    transition: all .35s;
  }
  .mobile-sort-total {
    color: #999;
  }

  .sort-bar-list {
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
   *  mobile-sort-bar --- end
   */
</style>
