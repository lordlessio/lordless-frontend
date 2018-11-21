<template>
  <div class="relative mobile-header-box" :class="{ 'dialog': dialog }">

    <!-- ldb detail header skeletion -->
    <transition name="ld-suspension-hide-fade">
      <header-skeletion v-if="loading" :class="{ 'dialog': dialog }"/>
    </transition>

    <transition name="ld-hide-fade" @after-enter="afterEnter">
      <section v-if="!loading && info" id="mobile-detail-header" class="mobile-detail-header">
        <!-- <div class="alone-layer absolute-full detail-header-mask"></div> -->
        <div class="detail-header-top">
          <div v-if="!owner" class="detail-mobile-candies">
            <div id="mobile-candies-box" class="alone-layer mobile-candies-container" :class="{ 'show': rendered }">
              <span class="inline-block mobile-candies-item"
                :id="`mobile-candy-${candy.tid}`"
                :style="`transform: translate(${candyCoords[candy.tid][0]}px, ${candyCoords[candy.tid][1]}px)`"
                v-for="(candy, index) of candyTasks"
                :key="candy.tid">
                <span
                  class="inline-block mobile-circle-candy"
                  :style="`animation-delay: ${index * .35}s;`"
                  :data-num="`≈ ${(candy.ldbTaskType.priceInUSD * candy.ldbTaskType.candyType.USD2TokenCount).toFixed(4)}`"
                  @click="receiveCandy(candy)">
                  <svg>
                    <use xlink:href="#ldb-candy-circle"/>
                  </svg>
                  <span class="inline-block mobile-candies-coin">
                    <svg>
                      <use :xlink:href="`#coin-${candy.ldbTaskType.candyType.symbol.toLowerCase()}`"/>
                    </svg>
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div class="detail-mobile-poster">
            <!-- <img src="http://lordless.oss-cn-hongkong.aliyuncs.com//lordlesstest/ldbicon/!-4-detail.jpg?x-oss-process=image/resize,w_1600"/> -->
            <lordless-img absolute type="span" :src="info.ldbIcon.source.detail | reldbIcon('detail')"></lordless-img>
          </div>
          <!-- <div class="alone-layer detail-mobile-level">
            <img :alt="`tavern popularity ${info.chain.popularity}`" :src="`/img/tavern/mobile-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
          </div> -->
        </div>
        <div class="alone-layer container header-container">
          <!-- <div id="header-candy-layer" class="alone-layer header-candy-layer">
            <div id="header-receive-box" class="header-receive-box">
              <div class="header-receive-main">
                <div id="receive-box-container" class="receive-box-container">
                  <img alt="tavern box top" class="receive-box-top" :src="'/img/tavern/box-top.png' | originSource"/>
                  <img alt="tavern box bottom" class="receive-box-bottom" :src="'/img/tavern/box-bottom.png' | originSource"/>
                  <span id="receive-box-candy" class="receive-box-candy"></span>
                </div>
              </div>
            </div>
          </div> -->
          <div class="detail-header-bottom">
            <div class="header-bottom-container">
              <figure class="header-bottom-figure">
                <h1 v-if="info.name.zh" :class="{ 'md': info.name.zh.length > 6, 'sm': info.name.zh.length > 9 }">{{ info.name.zh }}</h1>
                <div class="d-flex f-align-end relative">
                  <div class="v-flex">
                    <p class="text-nowrap detail-mobile-tag">
                      <span class="inline-block level">LVL 11</span>
                      <span class="inline-block" v-for="type of info.ldbType" :key="type">{{ type | formatLdbType }}</span>
                      <span class="inline-block region">Shanghai</span>
                    </p>
                    <div class="d-flex row-flex f-align-center detail-mobile-location">
                      <p>
                        <svg>
                          <use xlink:href="#icon-location"/>
                        </svg>
                      </p>
                      <p class="d-flex col-flex">
                        <span>{{ info.chain.lng | transferCoords | sliceStr}}, {{ info.chain.lat | transferCoords | sliceStr }}</span>
                        <span>{{ info.address }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="d-flex f-justify-end line-height-0 detail-mobile-level">
                    <img :alt="`tavern popularity ${info.chain.popularity}`" :src="`/img/tavern/ldb-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
                  </div>
                </div>
                <p class="detail-mobile-desc">{{ info.desc.zh | sliceStr({ end: 78 }) }}...</p>
                <div class="detail-progress-box">
                  <p class="d-flex detail-progress-tip">
                    <span class="v-flex">Action Point</span>
                    <span>
                      <count-up class="inline-block" :startVal="countUp.cAP.start" :endVal="countUp.cAP.end" :duration="countUp.cAP.duration" :isReady="countUp.cAP.isReady"></count-up>
                      <span class="text-color-third">/
                        <count-up class="inline-block" :startVal="countUp.nAP.start" :endVal="countUp.nAP.end" :duration="countUp.nAP.duration" :isReady="countUp.nAP.isReady"></count-up>
                      </span>
                    </span>
                  </p>
                  <div class="detail-progress-bar">
                    <lordless-progress
                      shadow
                      :current="countUp.cAP.end"
                      :max="countUp.nAP.end"
                      :gradient="progress.gradient"/>
                  </div>
                </div>
                <figcaption class="d-flex f-align-center">
                  <div class="v-flex d-flex f-align-center detail-lord-box">
                    <lordless-blockies
                      theme="dark"
                      :scale="7"
                      jump
                      :seed="info.lord.address">
                    </lordless-blockies>
                    <div class="v-flex d-flex col-flex f-justify-around detail-lord-info">
                      <p>{{ info.lord.nickName || 'LORDLESS' }}</p>
                      <p><link-symbol underline :to="info.lord.address">{{ info.lord.address | splitAddress({ before: 6, end: 4, symbol: '***' }) }}</link-symbol></p>
                    </div>
                  </div>
                  <lordless-btn
                    class="mobile-home-btn"
                    theme="blue"
                    shadow
                    inverse
                    :disabled="isHome"
                    @click="setHome(isHome)">{{ isHome ? 'Your home' : 'Set as home' }}</lordless-btn>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import HeaderSkeletion from '@/components/skeletion/_mobile/ldb/detail/header'

import { addClass, removeClass, transitionEvent, _setTimeout } from 'utils/tool'
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
      apTimer: null,
      rendered: false,
      // animate: false,
      candyCoords: {},
      candyTasks: [],
      hideTasks: 1,
      allTasks: vm.tasks,
      // receiveBoxShow: false,
      // receiveEndCandy: null,
      progress: {
        gradient: {
          direction: 'to right',
          start: '#1613B0',
          end: '#7D72F0'
        }
      },
      countUp: {
        cAP: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        },
        nAP: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        }
      }
    }
  },
  watch: {
    /**
     * 监听当前建筑 apLeft
     */
    apLeft (val) {
      const func = () => {
        clearTimeout(this.apTimer)
        this.apTimer = null
        this.apTimer = setTimeout(() => {
          this.initCurrentAPCU({ end: val })
          clearTimeout(this.apTimer)
          this.apTimer = null
        }, 600)
      }
      func()
    },

    // 监听外部传入的总任务，如果和 allTasks 不相等，重新生成 candyTasks
    tasks (val, oval) {
      if (val.toString() !== this.allTasks.toString() && val.length && this.userInfo.ap !== 0 && this.info.apLeft !== 0 && this.rendered) this.getCandyTasks(val)
    },

    /**
     * 监听 candyTasks，
     * 如果 candyTasks 为空并且 allTasks 不为空，重新生成 candyTasks
     * 如果用户剩余 ap 不足，重新生成 candyTasks
     */
    candyTasks (val) {
      console.log('----- candyTasks', val, this.allTasks, this.rendered)
      if (this.userInfo.ap !== 0 && this.info.apLeft !== 0 && !val.length && this.allTasks.length && this.rendered) this.getCandyTasks()
    }

    // receiveBoxShow (val) {
    //   const receiveLayer = document.getElementById('header-candy-layer')
    //   if (val) {
    //     addClass('show', receiveLayer)
    //   } else {
    //     addClass('hide', receiveLayer)
    //     const func = () => {
    //       receiveLayer.removeEventListener(animationEndEvent(), func)
    //       if (this.receiveBoxShow) {
    //         removeClass('hide', receiveLayer)
    //         return
    //       }
    //       removeClass('hide', receiveLayer)
    //       removeClass('show', receiveLayer)
    //     }
    //     receiveLayer.addEventListener(animationEndEvent(), func)
    //   }
    // }
  },
  components: {
    HeaderSkeletion
  },
  methods: {

    // hideReceiveLayer () {
    //   const receiveLayer = document.getElementById('header-candy-layer')
    //   const func = () => {
    //     receiveLayer.removeEventListener(animationEndEvent(), func)
    //     if (this.receiveBoxShow) {
    //       removeClass('hide', receiveLayer)
    //       return
    //     }
    //     removeClass('hide', receiveLayer)
    //     removeClass('show', receiveLayer)
    //   }
    //   receiveLayer.addEventListener(animationEndEvent(), func)
    // },

    afterEnter () {
      this.initCountUp()

      const header = document.getElementById('mobile-detail-header')
      if (!header) return
      // const animateFunc = () => {
      //   header.removeEventListener(transitionEvent(), animateFunc)
      //   this.$nextTick(() => {
      //     this.rendered = true
      //     this.getCandyTasks()
      //   })
      // }
      // header.addEventListener(transitionEvent(), animateFunc)
      // this.animate = true
      this.rendered = true
      this.getCandyTasks()

      this.$emit('enter')
    },

    /**
     * 设置home
     */
    async setHome (isReset) {
      // if (this.isHome) return
      this.$emit('setHome', isReset)
    },

    /**
     * 领取糖果
     */
    async receiveCandy (task) {
      // this.$root.$children[0].mobileAlertModel = true

      // 移动端，暂时阻断
      // if (task) return
      if (task.status !== 'processing') return

      this.receiveBoxShow = true

      // 糖果盒子对象
      // const rbox = document.getElementById('header-receive-box')

      // let animateAfter = false
      let transitionAfter = false
      let dataBack = false
      let iserror = false

      const removeCandy = () => {
        if (!transitionAfter || !dataBack) return
        transitionAfter = false
        console.log('------ this.hideTasks', this.hideTasks, this.candyTasks.length)
        if (this.hideTasks === this.candyTasks.length) {
          this.$set(this, 'hideTasks', 1)
          this.$set(this, 'candyTasks', [])
        } else {
          this.hideTasks = this.hideTasks + 1
        }
      }

      // 获取当前 receive 糖果dom
      const candy = document.getElementById(`mobile-candy-${task.tid}`)
      if (!candy) return
      // const candyId = candy.getAttribute('id')
      // this.receiveEndCandy = candyId

      // 获取子元素
      const cCandy = candy.firstChild
      if (!cCandy) return

      // 设置当前dom鼠标形态
      candy.style.cursor = 'no-drop'

      // 屏蔽子元素鼠标事件及暂停动画
      // children.style.pointerEvents = 'none'
      cCandy.style.animationPlayState = 'paused'
      // addClass('move', cCandy)
      addClass('animate', candy)

      const func = () => {
        transitionAfter = true
        removeCandy()
        if (!iserror) {
          addClass('hidden', candy)
        }
        candy.removeEventListener(transitionEvent(), func)
      }
      candy.addEventListener(transitionEvent(), func)

      this.$emit('receive', task, ({ errorMsg, data } = {}) => {
        if (!data) {
          // 设置当前dom鼠标形态
          candy.style.cursor = 'pointer'

          // 屏蔽子元素鼠标事件及暂停动画
          cCandy.style.pointerEvents = ''
          cCandy.style.animationPlayState = ''

          // restart candy animation
          iserror = true
          removeClass('hidden', cCandy)
          removeClass('animate', candy)
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

      // 根据用户及建筑剩余ap判断显示糖果
      const leftAp = this.userInfo._id ? (this.info.apLeft > this.userInfo.ap ? this.userInfo.ap : this.info.apLeft) : 6
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
      const candyBox = document.getElementById('mobile-candies-box')
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
    },

    initCountUp () {
      this.initCurrentAPCU()
      this.initNextAPCU()
    },

    initCurrentAPCU ({ start = this.countUp.cAP.start, end = this.countUp.cAP.end || this.info.apLeft } = {}) {
      if (!this.countUp.cAP.isReady) {
        this.$set(this.countUp, 'cAP', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.cAP, 'end', end)

      _setTimeout({ duration: this.countUp.cAP.duration }, () => {
        this.$set(this.countUp.cAP, 'start', end)
      })
    },

    initNextAPCU ({ start = this.countUp.nAP.start, end = this.countUp.nAP.end || this.info.ap } = {}) {
      if (!this.countUp.nAP.isReady) {
        this.$set(this.countUp, 'nAP', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.nAP, 'end', end)

      _setTimeout({ duration: this.countUp.nAP.duration }, () => {
        this.$set(this.countUp.nAP, 'start', end)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-header-box {
    &.dialog {
      // .header-bottom-figure {
      //   @include viewport-unit('width', 90vw, 0px, -1);
      // }
      // .header-bottom-figure-box {
      //   @include viewport-unit('width', 90vw, 0px, -1);
      // }
      // .header-bottom-container {
      //   padding-top: 50px;
      // }
      // .mobile-detail-header {
      //   padding-top: 60px;
      // }
      // .detail-mobile-level {
      //   transform: translate(5%, -25%) translateZ(0);
      // }
    }
  }

  /**
   *  mobile-detail-header  -- begin
   */
  .mobile-detail-header {
    position: relative;
    // padding-bottom: 150px;
    // padding-top: 120px;
    // overflow: hidden;
    &.animate {
      // .detail-header-mask {
      //   &::after {
      //     animation: bounceSkewInRight .55s 1 forwards;
      //     // opacity: 1;
      //     // transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
      //   }
      // }
      // .detail-header-bottom {
      //   // left: 0;
      //   animation: bounceInLeft .55s 1 forwards;
      //   // opacity: 1;
      //   // transform: translate3d(0, -50%, 0);
      //   &::before {
      //     opacity: 1;
      //   }
      // }
      // .detail-header-top {
      //   animation: bounceInRight .55s .15s 1 forwards;
      //   // opacity: 1;
      //   // transform: translate3d(-100%, 0, 0) translateX(0px);
      // }
      // .detail-mobile-level {
      //   >img {
      //     opacity: 1;
      //     transform: scale(1);
      //   }
      // }
    }
  }
  // .detail-header-mask {
  //   // left: 65%;
  //   z-index: 1;
  //   overflow: hidden;
  //   // transition: left .55s spring;
  //   &::before, &::after {
  //     content: '';
  //     position: absolute;
  //     top: 0;
  //     width: 200%;
  //     height: 100%;
  //   }
  //   &::before {
  //     left: -100%;
  //     background-image: linear-gradient(to bottom, #96A8FD, #CDCAF6);
  //   }
  //   &::after {
  //     left: 100%;
  //     background-image: linear-gradient(to bottom, #00C0EB, #3588FD);
  //     transform: translate3d(10%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
  //     opacity: 0;
  //     z-index: 1;
  //     // transition: all 0s .45s;
  //   }
  // }

  .header-container {
    position: relative;
    padding: 0 10px;
    // min-width: 1000px;
    // max-width: 1280px;
    z-index: 2;
  }

  .detail-progress-box {
    margin-top: 15px;
  }
  .detail-progress-tip {
    >span {
      &:first-of-type {
        font-size: 16px;
      }
      &:last-of-type {
        font-size: 14px;
      }
    }
  }
  .detail-progress-bar {
    margin-top: 10px;
    height: 27px;
    border-radius: 5px;
    overflow: hidden;
  }

  // header-candy-layer

  // @keyframes receiveBoxShowAnimate {
  //   from,
  //   70%,
  //   to {
  //     -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  //     animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  //   }

  //   0% {
  //     transform: translate3d(-100%, 100%, 0) translate(0, 0) translateZ(0px);
  //   }
  //   70% {
  //     transform: translate3d(-25%, 20%, 0) translate(6px, -6px) translateZ(0px);
  //   }
  //   to {
  //     transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
  //   }
  // }
  // @keyframes receiveBoxHideAnimate {
  //   0% {
  //     transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
  //   }
  //   100% {
  //     transform: translate3d(-100%, 100%, 0) translate(0, 0) translateZ(0px);
  //   }
  // }

  // @keyframes receiveBoxEat {
  //   0% {
  //     transform: translate(0px, 0px) scale(1) translateZ(0px);
  //   }

  //   50% {
  //     transform: translate(-10px, 10px) scale(1.1) translateZ(0px);
  //   }
  // }

  // .header-candy-layer {
  //   position: absolute;
  //   left: 0;
  //   top: 5%;
  //   width: 40%;
  //   height: 90%;
  //   z-index: 1;
  //   overflow: hidden;
  //   &.show {
  //     z-index: 5;
  //     .header-receive-main {
  //       visibility: visible;
  //       animation: receiveBoxShowAnimate .5s linear forwards;
  //     }
  //   }
  //   &.hide {
  //     .header-receive-main {
  //       animation-name: receiveBoxHideAnimate;
  //       animation-duration: .35s;
  //     }
  //   }
  // }

  // .header-receive-box {
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   width: 264px;
  //   &.animate {
  //     animation: receiveBoxEat .5s ease-out infinite;
  //   }
  // }
  // .header-receive-main {
  //   visibility: hidden;
  //   transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
  //   // transition: transform .5s 0s ease-out;
  //   will-change: transform;
  // }
  // .receive-box-container {
  //   position: relative;
  //   width: 100%;
  //   >img {
  //     transform: rotate(45deg);
  //   }
  // }
  // .receive-box-top {
  //   position: relative;
  //   width: 100%;
  //   z-index: 1;
  // }
  // .receive-box-bottom {
  //   position: absolute;
  //   left: 0;
  //   top: 0;
  //   width: 100%;
  //   z-index: 3;
  // }
  // .receive-box-candy {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 54px;
  //   height: 54px;
  //   z-index: 2;
  // }

  // detail-mobile-candies
  .detail-mobile-candies {
    position: absolute;
    bottom: 20%;
    left: 27px;
    width: calc(100% - 54px);
    height: 30%;
    // transform: translateY(-50%);
    z-index: 9;
  }
  .mobile-candies-container {
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

  // @keyframes candyAfterAnimate {
  //   0% {
  //     transform: translate(-40%, 5px) translateZ(0);
  //     animation-timing-function: ease-in;
  //   }
  //   20% {
  //     transform: translate(-40%, 0px) translateZ(0);
  //     opacity: 1;
  //   }
  //   50% {
  //     animation-timing-function: ease-out;
  //   }
  //   100% {
  //     transform: translate(-40%, -5px) translateZ(0);
  //     opacity: 0;
  //   }
  // }
  @keyframes candiesShow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .mobile-candies-item {
    position: absolute;
    left: 0;
    top: 0;
    &.animate {
      z-index: -1;
      .mobile-circle-candy {
        >svg, >span, &::before {
          opacity: 0;
          transition: opacity .5s ease-out;
        }
        // &::before {
        //   opacity: 0;
        //   transition-duration: 0s;
        // }
        // &::after {
        //   animation: candyAfterAnimate 1s 1;
        // }
      }
    }
    // &.afterAnimate {
    //   .mobile-circle-candy {
    //     &::after {
    //       animation: candyAfterAnimate 1s 1;
    //     }
    //   }
    // }
  }
  .mobile-circle-candy {
    position: relative;
    width: 54px;
    height: 54px;
    cursor: pointer;
    transform: translateY(-10px);
    // -moz-transform: translateY(-20px);
    animation: candyAnimate 5s linear infinite;
    -moz-animation-duration: 2.4s;
    will-change: transform;
    &.move {
      &::before {
        display: none;
      }
      animation: none;
    }
    &.transition {
      transition: all .35s ease-in;
    }
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
  .mobile-candies-coin {
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

  // detail-header-bottom
  .detail-header-bottom {
    // position: absolute;
    // left: 0;
    // top: 50%;
    width: 100%;
    // padding: 15px;
    // height: 90%;
    // transform: translate3d(-100%, -50%, 0);;
    color: #fff;
    // opacity: 0;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    background-color: #fff;
    z-index: 3;
    // transition: all 0s .45s;
    // transition: all .55s 0s;
    // transition: left .55s spring, opacity .55s spring;
    // background-blend-mode: soft-light;
    // &::before {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   width: 50%;
    //   height: 100%;
    //   right: 25%;
    //   border-radius: 10px;
    //   transform: skew(-25deg) translateZ(0);
    //   background-color: #3588FD;
    //   z-index: -1;
    //   box-shadow: 13px 13px 30px 3px rgba(0, 0, 0, .35);
    //   opacity: 0;
    //   transition: opacity .3s ease-in .45s;
    // }
  }
  // .header-left-container {
  //   position: relative;
  //   // padding-top: 80px;
  //   // padding-bottom: 40px;
  //   // padding-left: 140px;
  //   width: 100%;
  //   // height: 100%;
  //   overflow: hidden;
  // }
  // .header-left-mask {
  //   position: absolute;
  //   top: 0;
  //   left: -25%;
  //   width: 100%;
  //   height: 100%;
  //   border-radius: 10px;
  //   transform: skew(-25deg) translateZ(0);
  //   background-color: #3588FD;
  //   overflow: hidden;
  //   &::after {
  //     content: '';
  //     position: absolute;
  //     top: -15%;
  //     left: -50%;
  //     width: 100%;
  //     padding-top: 100%;
  //     border-radius: 100%;
  //     background-image: linear-gradient(45deg, #3588FD, #00C0EB);
  //     // background-color: #3588FD;
  //     transform: skew(25deg) scale(1.4);
  //     mix-blend-mode: soft-light;
  //     overflow: hidden;
  //     z-index: 1;
  //   }
  // }
  // .header-bottom-figure-box {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   max-width: 1280px;
  //   min-width: 1100px;
  //   height: 100%;
  //   @include viewport-unit('width', 100vw, 0px, 1);
  // }


  .header-bottom-container {
    margin-top: -30px;
    padding: 20px 20px 30px;
    width: 100%;
    box-sizing: border-box;
    color: #555;
  }
  .header-bottom-figure {
    position: relative;
    // max-width: 400px;
    // height: 100%;
    z-index: 2;
    >h1 {
      &.md {
        font-size: 36px;
      }
      &.sm {
        font-size: 28px;
      }
    }
    >figcaption {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      // position: absolute;
      // left: 0;
      // bottom: 0;
      // width: 100%;
      // max-width: 250px;
    }
  }
  .detail-mobile-tag {
    margin-top: 5px;
    color: #fff;
    >span {
      padding: 3px 7px;
      font-size: 12px;
      background-color: #4586FC;
      border-radius: 5px;
      &.level {
        background-color: #7d72f0;
      }
      &.region {
        background-color: #2D0EBD;
      }
    }
  }
  .detail-mobile-location {
    margin-top: 14px;
    font-size: 14px;
    color: #bbb;
    fill: #4586FC;
    svg {
      width: 16px;
      height: 16px;
    }
    >p {
      &:not(:first-of-type) {
        margin-left: 8px;
      }
    }
  }
  .detail-mobile-address {
    margin-top: 10px;
    font-size: 20px;
  }
  .detail-mobile-desc {
    margin-top: 20px;
    max-width: 300px;
    font-size: 14px;
  }
  .mobile-home-btn {
    padding: 10px 15px;
    // font-size: 18px;
    font-family: $--font-TTNormsMedium;
  }
  .detail-lord-info {
    margin-left: 10px;
    >p {
      font-size: 14px;
      &:last-of-type {
        color: #bbb;
      }
    }
  }
  .detail-mobile-city {
    margin-top: 10px;
    font-size: 20px;
  }
  .mobile-city-item {
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

  // detail-header-top
  .detail-header-top {
    position: relative;
    width: 100%;
    background-color: #fff;
  }
  .detail-mobile-level {
    position: relative;
    // margin-left: 10px;
    width: 86px;
    // height: 86px;
    padding-top: 86px;
    // position: absolute;
    // bottom: 0;
    // right: 0;
    // width: 100%;
    // height: 86px;
    >img {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
  .detail-mobile-poster {
    position: relative;
    padding-top: 100%;
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background-color: #fff;
    // padding: 15px;
    // height: 100%;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 80px;
      bottom: 0;
      left: 0;
      background-image: linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
      z-index: 1;
    }
    >img {
      width: 100%;
    }
  }
  /**
   *  mobile-detail-header  -- end
   */

  @media screen and (max-width: 1200px) {
    .header-bottom-figure {
      >h1 {
        font-size: 42px;
      }
    }
  }
</style>
