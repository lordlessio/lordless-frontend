<template>
  <div class="carousel-box">
    <div class="d-flex carousel-container">
      <div class="v-flex carousel-content">
        <div class="carousel-loop-box">
          <div class="d-flex f-align-center carousel-loop-item animating is-active">
            <div class="v-flex d-flex f-justify-center sm-hidden">
              <span class="inline-block md-mar-r1">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-hourglass"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">transactions</span>
                <span class="inline-block">40 sceonds ago</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-tx"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Address</span>
                <span class="inline-block">0x5cF5...305ABB</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-price"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Price</span>
                <span class="inline-block">1.1ETH</span>
              </span>
            </div>
          </div>
          <div class="d-flex f-align-center carousel-loop-item">
            <div class="v-flex d-flex f-justify-center sm-hidden">
              <span class="inline-block md-mar-r1">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-hourglass"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">transactions</span>
                <span class="inline-block">40 sceonds ago</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-tx"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Address</span>
                <span class="inline-block">0x5cF5...305ABB</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-price"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Price</span>
                <span class="inline-block">2.2ETH</span>
              </span>
            </div>
          </div>
          <div class="d-flex f-align-center carousel-loop-item">
            <div class="v-flex d-flex f-justify-center sm-hidden">
              <span class="inline-block md-mar-r1">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-hourglass"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">transactions</span>
                <span class="inline-block">40 sceonds ago</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-tx"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Address</span>
                <span class="inline-block">0x5cF5...305ABB</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-price"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Price</span>
                <span class="inline-block">3.3ETH</span>
              </span>
            </div>
          </div>
          <div class="d-flex f-align-center carousel-loop-item">
            <div class="v-flex d-flex f-justify-center sm-hidden">
              <span class="inline-block md-mar-r1">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-hourglass"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">transactions</span>
                <span class="inline-block">40 sceonds ago</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-tx"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Address</span>
                <span class="inline-block">0x5cF5...305ABB</span>
              </span>
            </div>
            <div class="v-flex d-flex f-justify-center">
              <span class="inline-block md-mar-r1 sm-hidden">
                <svg>
                  <use xlink:href="static/svg/color_icon.svg#icon-price"/>
                </svg>
              </span>
              <span class="d-inline-flex col-flex f-justify-center loop-item-text">
                <span class="inline-block">Price</span>
                <span class="inline-block">4.4ETH</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex f-align-center carousel-logo color-main" @click.stop="logoEvt">
        <span class="block">
          <svg>
            <use xlink:href="static/svg/color_icon.svg#icon-marketplace"/>
          </svg>
        </span>
        <span class="block sm-hidden"> Marketplace</span>
      </div>
    </div>
  </div>
</template>

<script>
import { hasClass, addClass, removeClass, hasContent } from 'utils/tool'
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    dulation: {
      type: Number,
      default: 10000
    },
    direction: {
      type: Number,
      default: 1
    }
  },
  data: () => {
    return {
      loop: true
    }
  },
  methods: {

    /**
     * 初始化
     */
    init () {
      const height = document.querySelector('.carousel-loop-item').offsetHeight
      const loops = document.querySelectorAll('.carousel-loop-item')
      let aIndex = 0
      for (let i = 0; i < loops.length; i++) {
        if (hasClass('is-active', loops[i])) {
          aIndex = i
          break
        }
      }
      addClass('is-prev', loops[loops.length - 1])
      addClass('is-next', loops[aIndex + 1] || loops[0])

      this.initTransform(height, aIndex)
      this.loopFunc(height)
      this.boxMouseEvt()
    },

    /**
     * 改变 dom transform 值
     */
    initTransform (height, aIndex = 0) {
      const items = document.querySelectorAll('.carousel-loop-item')
      const direction = this.direction
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (hasClass('is-next', item)) {
          item.style = `transform: translateY(${height * direction}px)`
        } else if (hasClass('is-prev', item)) {
          item.style = `transform: translateY(${-height * direction}px)`
        } else {
          item.style = `transform: translateY(${(i - aIndex) * height * direction}px)`
        }
      }
    },

    /**
     * 改变dom状态
     */
    change (height) {
      if (!this.loop) return
      const items = document.querySelectorAll('.carousel-loop-item')
      const classes = Array.from(items).map(item => item.className)
      let aIndex = 0
      for (let i = 0; i < items.length; i++) {
        const itemClass = classes[i]
        const item = items[i]
        if (hasContent('is-next', itemClass)) {
          removeClass('is-next', item)
          addClass('animating', item)
          addClass('is-active', item)
          addClass('is-next', items[i + 1] || items[0])
          aIndex = i
        } else if (hasContent('is-active', itemClass)) {
          removeClass('is-active', item)
          addClass('is-prev', item)
        } else if (hasContent('is-prev', itemClass)) {
          removeClass('animating', item)
          removeClass('is-prev', item)
        }
      }
      this.initTransform(height, aIndex)
    },

    /**
     * 循环执行
     */
    loopFunc (height) {
      let instance
      const func = () => {
        if (instance) this.destroy(instance)
        instance = setTimeout(() => {
          this.change(height)
          this.destroy(instance)
          return func()
        }, this.dulation)
        return instance
      }
      func()
      this.$once('hook:beforeDestroy', () => {
        this.destroy(instance)
      })
    },

    /**
     * carousel box 鼠标事件
     */
    boxMouseEvt () {
      const loopBox = document.querySelector('.carousel-loop-box')
      const toggleLoop = (loop = this.loop) => {
        return () => {
          this.loop = !loop
        }
      }
      loopBox.addEventListener('mouseenter', toggleLoop(true))
      loopBox.addEventListener('mouseleave', toggleLoop(false))
    },

    /**
     * carousel logo 点击事件
     */
    logoEvt () {
      this.$emit('logoEvt')
    },

    destroy (instance) {
      clearTimeout(instance)
      instance = null
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .carousel-box {
    position: relative;
    width: inherit;
    height: inherit;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    // @include padding(-1, 20px, 1);
  }
  .carousel-container {

  }
  .carousel-content {
    @include padding('left', 20px, 1, -2);
  }
  .carousel-loop-box {
    position: relative;
    height: 100px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;
    @include height(100px, 1.25);
    // @include padding-around(15px, 0, 15px, 0, 1);
  }
  .carousel-loop-item {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: inherit;
    @include fontSize(15px, 1);
    svg {
      width: 50px;
      height: 50px;
    }
    &.animating {
      transition: transform .35s ease-in-out;
    }
    &.is-active {
      z-index: 2;
    }
  }
  .loop-item-text {
    >span {
      &:not(:first-of-type) {
        margin-top: 8px;
      }
    }
  }
  .carousel-logo {
    position: relative;
    color: #3F51B5;
    cursor: pointer;
    @include padding('left', 20px, 1);
    @include padding('right', 20px, 1);
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 20%;
      width: 1px;
      height: 60%;
      background-color: #ccc;
    }
    svg {
      width: 40px;
      height: 40px;
      fill: #3F51B5;
    }
  }
</style>
