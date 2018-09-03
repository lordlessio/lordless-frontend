<template>
  <div class="relative ldb-header-box" :class="{ 'dialog': dialog }">

    <!-- ldb detail header skeletion -->
    <transition name="ld-suspension-hide-fade">
      <header-skeletion v-if="loading" :class="{ 'dialog': dialog }"></header-skeletion>
    </transition>

    <transition name="ld-hide-fade" @after-enter="afterEnter">
      <section v-if="!loading && info" id="ldb-detail-header" class="ldb-detail-header" :class="{ 'animate': animate }">
        <div class="absolute-full detail-header-mask"></div>
        <div class="container header-container">
          <div v-if="!owner" class="detail-ldb-candies">
            <div id="ldb-candies-box" class="ldb-candies-container" :class="{ 'show': rendered }">
              <span class="inline-block ldb-candies-item"
                :id="`ldb-candy-${candy.tid}`"
                :style="`transform: translate(${candyCoords[candy.tid][0]}px, ${candyCoords[candy.tid][1]}px)`"
                v-for="(candy, index) of candyTasks"
                :key="candy.tid">
                <span
                  class="inline-block ldb-circle-candy"
                  :style="`animation-delay: ${index * .35}s;`"
                  :data-num="`≈ ${(candy.ldbTaskType.priceInUSD * candy.ldbTaskType.candyType.USD2TokenCount).toFixed(4)}`"
                  @click="receiveCandy(candy)">
                  <svg>
                    <use xlink:href="#ldb-candy-circle"/>
                  </svg>
                  <span class="inline-block ldb-candies-coin">
                    <svg>
                      <use :xlink:href="`#coin-${candy.ldbTaskType.candyType.symbol.toLowerCase()}`"/>
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="detail-header-left">
            <div class="header-left-container">
              <span class="header-left-mask"></span>
              <div class="header-left-cnt-box">
                <div class="header-left-cnt-container">
                  <figure class="header-left-cnt">
                    <h1 v-if="info.name.zh" :class="{ 'md': info.name.zh.length > 6, 'sm': info.name.zh.length > 9 }">{{ info.name.zh }}</h1>
                    <p class="detail-ldb-tag">
                      <span class="inline-block" v-for="type of info.ldbType" :key="type">{{ type | formatLdbType }}</span>
                    </p>
                    <p class="TTFontNormal detail-ldb-address">{{ info.address }}</p>
                    <p class="detail-ldb-location">{{ info.chain.lng | transferCoords | sliceStr}}, {{ info.chain.lat | transferCoords | sliceStr }}</p>
                    <p class="detail-ldb-desc">{{ info.desc.zh | sliceStr({ end: 65 }) }}...</p>
                    <ld-btn
                      class="ldb-home-btn"
                      theme="deep-blue"
                      shadow
                      inverse
                      :disabled="isHome"
                      @click="setHome">{{ isHome ? 'Your home' : 'Set as home' }}</ld-btn>
                    <figcaption>
                      <div class="d-flex f-align-center detail-lord-box">
                        <blockies
                          theme="light"
                          :scale="6"
                          jump
                          :seed="info.lord.address">
                        </blockies>
                        <div class="v-flex d-flex col-flex f-justify-around detail-lord-info">
                          <p>{{ info.lord.nickName || 'LORDLESS' }}</p>
                          <p>{{ info.lord.address | splitAddress({ symbol: '******' }) }}</p>
                        </div>
                      </div>
                      <p class="d-flex row-flex detail-ldb-city">
                        <span class="ldb-city-item">Shanghai</span>
                        <span class="ldb-city-item">China</span>
                        <!-- <span class="ldb-city-item" :style="`order: ${-index};`" v-for="(region, index) of info.origin.regions.slice(0, 2)" :key="`${region}_${index}`">
                          {{ region | singleRegion }}
                        </span> -->
                      </p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-header-right">
            <div class="detail-ldb-poster">
              <!-- <img src="http://lordless.oss-cn-hongkong.aliyuncs.com//lordlesstest/ldbicon/!-4-detail.jpg?x-oss-process=image/resize,w_1600"/> -->
              <ld-img absolute type="span" :src="info.ldbIcon.source.detail | reldbIcon('detail')"></ld-img>
            </div>
            <div class="detail-ldb-level">
              <img alt="tavern popularity image" :src="`/img/ldb-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import HeaderSkeletion from '@/components/skeletion/ldb/detail/tool/header'

import LdBtn from '@/components/stories/button'
import LdImg from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'

import { addClass, removeClass, transitionEvent } from 'utils/tool'
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    tasks: {
      type: Array,
      default: () => {
        return []
      }
    },
    isHome: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      rendered: false,
      animate: false,
      candyCoords: {},
      candyTasks: [],
      hideTasks: 1,
      allTasks: vm.tasks
    }
  },
  watch: {

    // 监听外部传入的总任务，如果和 allTasks 不相等，重新生成 candyTasks
    tasks (val, oval) {
      if (val.toString() !== this.allTasks.toString() && val.length && this.userInfo.ap !== 0 && this.rendered) this.getCandyTasks(val)
    },

    /**
     * 监听 candyTasks，
     * 如果 candyTasks 为空并且 allTasks 不为空，重新生成 candyTasks
     * 如果用户剩余 ap 不足，重新生成 candyTasks
     */
    candyTasks (val) {
      if (this.userInfo.ap !== 0 && !val.length && this.allTasks.length && this.rendered) this.getCandyTasks()
    }
  },
  components: {
    HeaderSkeletion,

    LdBtn,
    LdImg,
    Blockies
  },
  methods: {

    afterEnter () {
      this.animate = true
      const header = document.getElementById('ldb-detail-header')
      if (!header) return
      const animateFunc = () => {
        this.rendered = true
        this.getCandyTasks()
        header.removeEventListener(transitionEvent(), animateFunc)
      }
      header.addEventListener(transitionEvent(), animateFunc)
    },

    async setHome (ldbInfo = this.info) {
      if (this.isHome) return
      this.$emit('setHome')
    },
    async receiveCandy (task) {
      if (task.status !== 'processing') return
      let animateAfter = false
      let dataBack = false

      const removeCandy = () => {
        if (!animateAfter || !dataBack) return
        if (this.hideTasks === this.candyTasks.length) {
          this.$set(this, 'hideTasks', 1)
          this.$set(this, 'candyTasks', [])
        } else {
          this.hideTasks = this.hideTasks + 1
        }
      }

      // 获取当前 receive 糖果dom
      const dom = document.getElementById(`ldb-candy-${task.tid}`)
      if (!dom) return

      // 获取子元素
      const children = dom.firstChild
      if (!children) return

      // 设置当前dom鼠标形态
      dom.style.cursor = 'no-drop'

      // 屏蔽子元素鼠标事件及暂停动画
      children.style.pointerEvents = 'none'
      children.style.animationPlayState = 'paused'

      const num = children.getAttribute('data-num')
      children.setAttribute('data-msg', `+ ${num} ${task.ldbTaskType.candyType.symbol.toLowerCase()}`)

      // 执行动画
      addClass('animate', dom)

      const animateFunc = () => {
        animateAfter = true
        removeCandy()
        dom.removeEventListener(transitionEvent(), animateFunc, false)
      }
      dom.addEventListener(transitionEvent(), animateFunc, false)

      this.$emit('receive', task, ({ errorMsg, data } = {}) => {
        // 获取当前 receive 糖果dom
        // const dom = document.getElementById(`ldb-candy-${task.tid}`)
        // if (!dom) return

        // // 获取子元素
        // const children = dom.firstChild
        // if (!children) return

        if (!data) {
          // 设置当前dom鼠标形态
          dom.style.cursor = 'pointer'

          // 屏蔽子元素鼠标事件及暂停动画
          children.style.pointerEvents = ''
          children.style.animationPlayState = ''

          // 执行动画
          removeClass('animate', dom)
          return
        }

        dataBack = true
        removeCandy()
      })
    },

    /**
     * 获取糖果任务
     */
    getCandyTasks (tasks = this.tasks) {
      if (this.owner) return

      const leftAp = this.userInfo._id ? this.userInfo.ap : 6
      console.log('leftAp', leftAp)
      const clen = leftAp >= 6 ? 6 : leftAp

      // 获取全部糖果任务
      let allTasks = JSON.parse(JSON.stringify(tasks))
      const candyTasks = []
      // if (candies.length) return

      // const
      // 遍历获取 candyTasks，并且修改 allTasks
      let loop = () => {
        while (candyTasks.length < clen && allTasks.length) {
          allTasks.map((tasks, index) => {
            if (candyTasks.length >= clen) return
            if (!tasks || !tasks.length) {
              allTasks.splice(index, 1)
              return false
            }
            candyTasks.push(tasks[0])
            allTasks[index].shift()
          })
        }
        loop = null
      }
      loop()
      console.log('------------- candyTasks', candyTasks)

      // 随机糖果坐标
      this.randomCandies(candyTasks)

      this.allTasks = allTasks
      this.$emit('update:tasks', allTasks)
    },

    // 随机糖果坐标
    randomCandies (candyTasks = this.candyTasks) {
      const candyBox = document.getElementById('ldb-candies-box')
      if (!candyBox) return
      const w = candyBox.offsetWidth
      const h = candyBox.offsetHeight
      const diameter = 54 + 27
      const radius = 27
      const row = Math.floor(w / diameter)
      const col = Math.floor(h / diameter)
      const arr = []
      let loop = () => {
        while (candyTasks.length && arr.length < candyTasks.length) {
          const randomX = Math.floor(Math.random() * row + 0.5)
          const randomY = Math.floor(Math.random() * col + 0.5)
          const newCoord = [randomX, randomY]
          arr.map(item => {
            let cloop = () => {
              while (item[0] === newCoord[0] && item[1] === newCoord[1]) {
                if (item[0] === newCoord[0]) newCoord[0] = Math.floor(Math.random() * row + 0.5)
                else newCoord[1] = Math.floor(Math.random() * col + 0.5)
              }
              cloop = null
            }
            cloop()
          })
          arr.push(newCoord)
        }
        loop = null
      }
      loop()
      const candyCoords = {}
      arr.map((item, index) => {
        candyCoords[candyTasks[index].tid] = [item[0] * diameter - Math.floor(Math.random() * 2 - 1) * radius, item[1] * diameter - Math.floor(Math.random() * 2 - 1) * Math.floor(Math.random() * 5) * radius / 5]
      })
      this.$set(this, 'candyCoords', candyCoords)
      this.$set(this, 'candyTasks', candyTasks)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ldb-header-box {
    &.dialog {
      .header-left-cnt {
        @include viewport-unit('width', 90vw, 0px, -1);
      }
      .header-left-cnt-box {
        @include viewport-unit('width', 90vw, 0px, -1);
      }
      .header-left-cnt-container {
        padding-top: 50px;
      }
      .ldb-detail-header {
        padding-top: 60px;
      }
      .detail-ldb-level {
        transform: translate(0, -25%);
      }
    }
  }

  /**
   *  ldb-detail-header  -- begin
   */
  .ldb-detail-header {
    position: relative;
    padding-bottom: 150px;
    padding-top: 120px;
    overflow: hidden;
    &.animate {
      .detail-header-mask {
        &::after {
          animation: bounceSkewInRight .55s 1;
          opacity: 1;
          transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
        }
      }
      .detail-header-left {
        // left: 0;
        animation: bounceInLeft .55s 1;
        opacity: 1;
        transform: translate3d(0, -50%, 0);
        &::before {
          opacity: 1;
        }
      }
      .detail-header-right {
        animation: bounceInRight .55s .15s 1;
        opacity: 1;
        transform: translate3d(-100%, 0, 0) translateX(0px);
      }
    }
  }
  .detail-header-mask {
    // left: 65%;
    z-index: 1;
    overflow: hidden;
    // transition: left .55s spring;
    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 200%;
      height: 100%;
    }
    &::before {
      left: -100%;
      background-image: linear-gradient(to bottom, #96A8FD, #CDCAF6);
    }
    &::after {
      left: 100%;
      background-image: linear-gradient(to bottom, #00C0EB, #3588FD);
      transform: translate3d(10%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
      opacity: 0;
      z-index: 1;
      transition: all 0s .55s;
    }
  }

  .header-container {
    position: relative;
    min-width: 1000px;
    max-width: 1280px;
    z-index: 2;
  }

  // detail-ldb-candies
  .detail-ldb-candies {
    position: absolute;
    top: 50%;
    right: 20%;
    width: 40%;
    height: 25%;
    transform: translateY(-50%);
    z-index: 9;
  }
  .ldb-candies-container {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0s 1s;
    &.show {
      opacity: 1;
      animation: candiesShow 1s 1;
    }
  }

  @keyframes candyAnimate {
    0% {
      transform: translateY(-10px) translate3d(0,0,0);
      -moz-transform: translateY(-10px) translate3d(0,0,0);
      animation-timing-function: ease-in;
    }
    50% {
      transform: translateY(10px) translate3d(0,0,0);
      -moz-transform: translateY(10px) translate3d(0,0,0);
      animation-timing-function: ease-out;
    }
  }

  @keyframes candyAfterAnimate {
    0% {
      transform: translate(-40%, 5px) translateZ(0);
      opacity: 0;
      animation-timing-function: ease-in;
    }
    20% {
      transform: translate(-40%, 0px) translateZ(0);
      opacity: 1;
    }
    50% {
      animation-timing-function: ease-out;
    }
    100% {
      transform: translate(-40%, -5px) translateZ(0);
      opacity: 0;
    }
  }
  @keyframes candiesShow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .ldb-candies-item {
    position: absolute;
    left: 0;
    top: 0;
    &.animate {
      z-index: -1;
      .ldb-circle-candy {
        >svg, >span, &::before {
          opacity: 0;
          transition: opacity .75s ease-out;
        }
        &::after {
          animation: candyAfterAnimate 1s 1;
        }
      }
    }
    // &.afterAnimate {
    //   .ldb-circle-candy {
    //     &::after {
    //       animation: candyAfterAnimate 1s 1;
    //     }
    //   }
    // }
  }
  .ldb-circle-candy {
    position: relative;
    width: 54px;
    height: 54px;
    cursor: pointer;
    transform: translateY(-10px);
    // -moz-transform: translateY(-20px);
    animation: candyAnimate 5s linear infinite;
    -moz-animation-duration: 2.4s;
    will-change: transform;
    &::before {
      content: attr(data-num);
      position: absolute;
      bottom: -20px;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #EA3C53;
    }
    &::after {
      content: attr(data-msg);
      position: absolute;
      top: -25px;
      left: 50%;
      font-size: 14px;
      white-space: nowrap;
      transform: translateX(-40%) translateY(0);
      opacity: 0;
      will-change: transform;
      color: #EA3C53;
    }
    >svg {
      width: 54px;
      height: 54px;
    }
    &:hover {
      animation-play-state: paused;
      z-index: 1;
    }
  }
  .ldb-candies-coin {
    position: absolute;
    top: 12px;
    left: 12px;
    width: 30px;
    line-height: 0;
    fill: #fff;
    >svg {
      width: 30px;
      height: 30px;
    }
  }

  // detail-header-left
  .detail-header-left {
    position: absolute;
    left: 0;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translate3d(-100%, -50%, 0);;
    color: #fff;
    opacity: 0;
    z-index: 1;
    transition: all 0s .55s;
    // transition: all .55s 0s;
    // transition: left .55s spring, opacity .55s spring;
    // background-blend-mode: soft-light;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      right: 25%;
      border-radius: 10px;
      transform: skew(-25deg) translateZ(0);
      background-color: #3588FD;
      z-index: -1;
      box-shadow: 13px 13px 30px 3px rgba(0, 0, 0, .35);
      opacity: 0;
      transition: opacity .3s ease-in .55s;
    }
  }
  .header-left-container {
    position: relative;
    // padding-top: 80px;
    // padding-bottom: 40px;
    // padding-left: 140px;
    height: 100%;
    overflow: hidden;
  }
  .header-left-mask {
    position: absolute;
    top: 0;
    left: -25%;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    transform: skew(-25deg) translateZ(0);
    background-color: #3588FD;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      top: -15%;
      left: -50%;
      width: 100%;
      padding-top: 100%;
      border-radius: 100%;
      background-image: linear-gradient(45deg, #3588FD, #00C0EB);
      // background-color: #3588FD;
      transform: skew(25deg) scale(1.4);
      mix-blend-mode: soft-light;
      overflow: hidden;
      z-index: 1;
    }
  }
  .header-left-cnt-box {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 1280px;
    min-width: 1100px;
    height: 100%;
    @include viewport-unit('width', 100vw, 0px, 1);
  }
  .header-left-cnt-container {
    padding-top: 90px;
    padding-bottom: 40px;
    margin-left: 50%;
    width: 100%;
    width: 1000px;
    // max-width: 1000px;
    height: 100%;
    transform: translateX(-50%);
    box-sizing: border-box;
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .header-left-cnt {
    position: relative;
    max-width: 400px;
    height: 100%;
    z-index: 2;
    >h1 {
      &.md {
        font-size: 42px;
      }
      &.sm {
        font-size: 36px;
      }
    }
    >figcaption {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      max-width: 250px;
    }
  }
  .detail-ldb-tag {
    margin-top: 5px;
    >span {
      padding: 4px 10px;
      font-size: 14px;
      background-color: #4586FC;
      border-radius: 5px;
    }
  }
  .detail-ldb-address {
    margin-top: 10px;
    font-size: 20px;
  }
  .detail-ldb-location {
    font-size: 18px;
  }
  .detail-ldb-desc {
    margin-top: 25px;
    max-width: 300px;
    font-size: 14px;
  }
  .ldb-home-btn {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 18px;
    font-family: $--font-TTNormsMedium;
  }
  .detail-lord-info {
    margin-left: 10px;
    >p {
      font-size: 16px;
      &:nth-of-type(1) {
        font-size: 18px;
      }
    }
  }
  .detail-ldb-city {
    margin-top: 10px;
    font-size: 20px;
  }
  .ldb-city-item {
    &:not(:first-of-type) {
      position: relative;
      margin-left: 16px;
      &::before {
        content: '·';
        position: absolute;
        left: -8px;
        top: 50%;
        color: inherit;
        font-size: 36px;
        font-weight: bold;
        transform: translate(-50%, -50%);
      }
    }
  }

  // detail-header-right
  .detail-header-right {
    position: relative;
    padding: 15px;
    margin-left: calc(100% - 30px);
    max-width: 980px;
    min-width: 810px;
    width: 80%;
    background-color: #fff;
    opacity: 0;
    transform: translate3d(0, 0, 0) translateX(0px);
    transition: all 0s .7s;
    // transition: all .55s .15s;
    // transition: transform .55s spring .25s, opacity .55s spring .25s;
    // height: calc(930px / 4 * 3);
  }
  .detail-ldb-level {
    position: absolute;
    top: 0;
    right: 0;
    width: 33%;
    transform: translate(20%, -20%);
    >img {
      width: 100%;
    }
  }
  .detail-ldb-poster {
    position: relative;
    padding-top: 63%;
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background-color: #fff;
    // padding: 15px;
    // height: 100%;
    >img {
      width: 100%;
    }
  }
  /**
   *  ldb-detail-header  -- end
   */

  @media screen and (max-width: 1200px) {
    .header-left-cnt-container {
      padding-top: 50px;
    }
    .header-left-cnt {
      >h1 {
        font-size: 42px;
      }
    }
  }
</style>
