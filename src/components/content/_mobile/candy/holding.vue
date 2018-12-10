<template>
  <div class="candies-holding-parent" ref="candies-holding-parent">
    <div ref="candies-holding-box" class="relative candies-holding-box">
      <div class="d-flex col-flex f-auto-center candies-holding-container">
        <p class="candies-holding-title">Total holding</p>
        <p class="TTFontBolder candies-holding-value-box">
          <span class="inline-block candies-holding-symbol">$</span>
          <span class="inline-block candies-holding-value">{{ holdingValue | formatDecimal({ len: 4 }) }}</span>
        </p>
        <el-tooltip effect="dark" content="Coming soon" placement="left" :hide-after="2000">
          <span class="inline-block line-height-0 nav-withdraw-icon">
            <svg>
              <use xlink:href="#icon-withdraw"/>
            </svg>
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from 'utils/tool'
export default {
  name: 'mobile-candy-holding',
  props: {
    holdingValue: {
      type: Number,
      default: null
    },
    scrollMark: {
      type: Number,
      default: 100
    }
  },
  data: () => {
    return {
      rendered: false,
      parentNode: null,
      scrollNode: null,
      scrollFunc: null
    }
  },
  methods: {
    async scrollListener () {
      this.scrollFunc && await this.destory()
      let navbarInverse = false
      const pdom = this.$refs['candies-holding-parent']
      const sdom = this.$refs['candies-holding-box']
      const scrollMark = this.scrollMark
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (!navbarInverse && scrollTop >= scrollMark) {
          addClass('is-fixed', sdom)
          navbarInverse = true

          // 在判断阶段 append 至已有 dom 变量中，可以解决组件穿透页面情况
          pdom && sdom && document.body.appendChild(sdom)
        } else if (navbarInverse && scrollTop < scrollMark) {
          removeClass('is-fixed', sdom)
          navbarInverse = false

          // 在判断阶段 append 至已有 dom 变量中，可以解决组件穿透页面情况
          pdom && sdom && pdom.appendChild(sdom)
        }
      }

      this.scrollFunc = func
      this.parentNode = pdom
      this.scrollNode = sdom

      this.$nextTick(() => document.addEventListener('scroll', this.scrollFunc))
    },
    init () {
      this.$nextTick(() => {
        if (!this.rendered) this.rendered = true
        this.scrollListener()
      })
    },
    destory () {
      return new Promise(resolve => {
        const pdom = this.parentNode || this.$refs['candies-holding-parent']
        const sdom = this.scrollNode || this.$refs['candies-holding-box']
        if (pdom && !pdom.firstChild) {
          pdom.appendChild(sdom)
        }

        this.scrollFunc && document.removeEventListener('scroll', this.scrollFunc)
        this.scrollFunc = null

        return resolve()
      })
    }
  },
  async beforeDestroy () {
    await this.destory()
  },
  async deactivated () {
    await this.destory()
  },
  activated () {
    if (!this.rendered) return
    this.init()
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .candies-holding-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 140px;
    color: #fff;
    background-color: #0079FF;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    transition: all .3s ease-in-out, height 0s 0s;
    &.is-fixed {
      position: fixed;
      height: 44px;
      background-image: linear-gradient(-225deg, #0079FF 0%, #0079FF 100%);
      .candies-holding-container {
        padding-top: 0;
      }
      .candies-holding-title {
        display: none;
      }
      // .candies-holding-value-box {
      //   height: 28px;
      //   // line-height: 28px;
      // }
      .candies-holding-symbol {
        // font-size: 16px;
        // line-height: 28px;
        transform: translateY(0);
      }
      .candies-holding-value {
        font-size: 16px;
      }
    }
  }
  .candies-holding-container {
    padding-top: 10px;
    height: 100%;
  }
  .candies-holding-title {
    margin-bottom: 8px;
    font-size: 14px;
  }
  .candies-holding-symbol {
    font-size: 20px;
    transform: translateY(-15px);
    transition: all .3s ease-in-out;
  }
  .candies-holding-value {
    font-size: 36px;
    // transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .nav-withdraw-icon {
    position: absolute;
    right: 20px;
    top: 15px;
    width: 20px;
    height: 20px;
    fill: #fff;
  }
</style>
