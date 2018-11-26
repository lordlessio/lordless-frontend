<template>
  <section id="mobile-nav-bar" class="TTFontBolder text-center mobile-nav-bar" :class="{ 'is-static': !fixed, 'is-active': fixed && !scroll }">
    <div class="relative">
      <p class="TTFontBolder nav-history-icon" v-if="history" @click.stop="$emit('history')">
        <svg>
          <use xlink:href="#icon-arrow-line-left"/>
        </svg>
      </p>
      <p class="text-cap">{{ text }}</p>
      <p class="line-height-0 nav-withdraw" v-if="withdraw" @click.stop="withdrawTip = true">
        <el-tooltip v-model="withdrawTip" effect="dark" content="Coming soon" placement="left" :hide-after="3000">
          <span class="inline-block line-height-0 nav-withdraw-icon">
            <svg>
              <use xlink:href="#icon-withdraw"/>
            </svg>
          </span>
        </el-tooltip>
      </p>
    </div>
  </section>
</template>

<script>
import { addClass, removeClass } from 'utils/tool'
export default {
  name: 'mobile-nav-bar',
  props: {
    text: {
      type: String,
      default: 'Marketplace'
    },
    history: {
      type: Boolean,
      default: false
    },
    withdraw: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: true
    },
    scroll: {
      type: Boolean,
      default: false
    },
    scrollMark: {
      type: Number,
      default: 150
    }
  },
  data: () => {
    return {
      navbarScrollFunc: null,
      withdrawTip: false
    }
  },
  methods: {
    scrollListener () {
      if (this.navbarScrollFunc) document.removeEventListener('scroll', this.navbarScrollFunc)
      this.navbarScrollFunc = null
      // if (!this.scroll || this.pageTitle) return
      let navbarInverse = false
      const dom = document.getElementById('mobile-nav-bar')
      const scrollMark = this.scrollMark
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (!navbarInverse && scrollTop >= scrollMark) {
          addClass('is-active', dom)
          navbarInverse = true
        } else if (navbarInverse && scrollTop < scrollMark) {
          removeClass('is-active', dom)
          navbarInverse = false
        }
      }
      func()

      this.navbarScrollFunc = func
      document.addEventListener('scroll', func)

      this.$once('hook:beforeDestroy', () => {
        removeClass('is-active', dom)
        document.removeEventListener('scroll', func)
      })
    }
  },
  beforeDestroy () {
    this.$el && this.$el.parentNode.removeChild(this.$el)
  },
  mounted () {
    this.$nextTick(() => {
      if (this.scroll || this.fixed) {
        document.body.appendChild(this.$el)
        this.scroll && this.scrollListener()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-nav-bar {
    // padding: 12px 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    background-color: #4586fc;
    font-size: 20px;
    color: #fff;
    opacity: 0;
    z-index: -99;
    &.is-active {
      opacity: 1;
      z-index: 99;
    }
    &.is-static {
      position: static;
      opacity: 1;
      z-index: 99;
    }
  }
  .nav-history-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    width: 20px;
    height: 20px;
    fill: #fff;
    transform: translateY(-50%);
  }
  .nav-withdraw {
    position: absolute;
    right: 20px;
    top: 55%;
    transform: translateY(-50%);
  }
  .nav-withdraw-icon {
    width: 22px;
    height: 22px;
    fill: #fff;
  }
</style>
