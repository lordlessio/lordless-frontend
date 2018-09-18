<template>
  <div class="relative ldb-header-box" :class="{ 'dialog': dialog }">

    <!-- ldb detail header skeletion -->
    <transition name="ld-suspension-hide-fade">
      <header-skeletion v-if="loading" :class="{ 'dialog': dialog }"></header-skeletion>
    </transition>

    <transition name="ld-hide-fade" @after-enter="afterEnter">
      <section v-if="!loading && info" id="ldb-detail-header" class="ldb-detail-header" :class="{ 'animate': animate }">
        <div class="alone-layer absolute-full detail-header-mask"></div>
        <div class="alone-layer container header-container">
          <div v-if="!owner" class="detail-ldb-candies">
            <div id="ldb-candies-box" class="alone-layer ldb-candies-container" :class="{ 'show': rendered }">
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
          <div id="header-candy-layer" class="alone-layer header-candy-layer">
            <div id="header-receive-box" class="header-receive-box">
              <div class="header-receive-main">
                <div id="receive-box-container" class="receive-box-container">
                  <img alt="tavern box top" class="receive-box-top" :src="'/img/tavern/box-top.png' | originSource"/>
                  <img alt="tavern box bottom" class="receive-box-bottom" :src="'/img/tavern/box-bottom.png' | originSource"/>
                  <span id="receive-box-candy" class="receive-box-candy"></span>
                </div>
              </div>
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
                    <p class="detail-ldb-desc">{{ info.desc.zh | sliceStr({ end: 62 }) }}...</p>
                    <lordless-btn
                      class="ldb-home-btn"
                      theme="deep-blue"
                      shadow
                      inverse
                      :disabled="isHome"
                      @click="setHome">{{ isHome ? 'Your home' : 'Set as home' }}</lordless-btn>
                    <figcaption>
                      <div class="d-flex f-align-center detail-lord-box">
                        <lordless-blockies
                          theme="light"
                          :scale="6"
                          jump
                          :seed="info.lord.address">
                        </lordless-blockies>
                        <div class="v-flex d-flex col-flex f-justify-around detail-lord-info">
                          <p>{{ info.lord.nickName || 'LORDLESS' }}</p>
                          <p><link-symbol underline :to="info.lord.address">{{ info.lord.address | splitAddress({ symbol: '***' }) }}</link-symbol></p>
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
              <lordless-img absolute type="span" :src="info.ldbIcon.source.detail | reldbIcon('detail')"></lordless-img>
            </div>
            <div class="alone-layer detail-ldb-level">
              <img :alt="`tavern popularity ${info.chain.popularity}`" :src="`/img/tavern/ldb-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import HeaderSkeletion from '@/components/skeletion/ldb/detail/tool/header'

import { addClass, removeClass, hasClass, transitionEvent, animationEndEvent, animationIterationEvent } from 'utils/tool'
import { receiveAnimate } from 'utils/tool/animate'
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
      allTasks: vm.tasks,
      receiveBoxShow: false,
      receiveEndCandy: null
    }
  },
  watch: {

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
    },

    receiveBoxShow (val) {
      const receiveLayer = document.getElementById('header-candy-layer')
      if (val) {
        addClass('show', receiveLayer)
      } else {
        addClass('hide', receiveLayer)
        const func = () => {
          receiveLayer.removeEventListener(animationEndEvent(), func)
          if (this.receiveBoxShow) {
            removeClass('hide', receiveLayer)
            return
          }
          removeClass('hide', receiveLayer)
          removeClass('show', receiveLayer)
        }
        receiveLayer.addEventListener(animationEndEvent(), func)
      }
    }
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
      const header = document.getElementById('ldb-detail-header')
      if (!header) return
      const animateFunc = () => {
        header.removeEventListener(transitionEvent(), animateFunc)
        this.$nextTick(() => {
          this.rendered = true
          this.getCandyTasks()
        })
      }
      header.addEventListener(transitionEvent(), animateFunc)
      this.animate = true
    },

    /**
     * 设置home
     */
    async setHome (ldbInfo = this.info) {
      if (this.isHome) return
      this.$emit('setHome')
    },

    // 已知抛物线两个点的坐标，求抛物线 二次项系数 Quadratic
    getBezierQuadratic (a, b) {
      const x1 = a.x
      const y1 = a.y
      const x2 = b.x
      const y2 = b.y
      return (x1 * y2 - y1 * x2) / (x1 * x2 * x2 - x1 * x1 * x2)
    },

    // 获取抛物线顶点
    getVertex ({ v1, v2 = { x: 0, y: 0 }, speed = 1 } = {}) {
      if (!v1) return null
      const x2 = v1.x
      const y2 = v1.y
      const vx = x2 - v2.x
      const vy = y2 - v2.y
      const rate = vx > 0 ? 1 : -1

      // 圆的半径
      // x1 * x1 + x2 * x2 = r * r
      const r = Math.sqrt(vx * vx + vy * vy) / 2
      const vertex = {}

      // vertex.x * vertex.x = r * r - (vy / 2) * (vy / 2) = r * r - (vy * vy / 4)
      vertex.x = rate * (Math.sqrt(r * r - (vy * vy / 4)))
      vertex.y = (r - (vy / 2))
      return vertex
    },

    /**
     * 抛物线公式
     * @param {Number} rate 方向
     * @param {Number} time 当前时间
     * @param {Number} duration 持续时间
     * @param {Number} a 纵向加速度
     * @param {Number} sx 水平位移量
     * @param {Number} sy 垂直位移量
     * @return {Object} x, y 坐标
     */
    bezierPath ({ time = 0, duration = 1000, a = 980, sx = 1000, sy = 0 } = {}) {
      const ta = duration / 1000
      const t = time / 1000

      // 根据总时间求出 x 轴及 y 轴方向的初速度
      const v0x = sx / ta
      const v0y = sy / ta - 1 / 2 * a * ta

      // 物理抛物线
      // s = v1 * t + 1 / 2 * a * t * t
      const x = v0x * t
      const y = v0y * t + 1 / 2 * a * t * t
      return { x, y }
    },

    /**
     * 领取糖果
     */
    async receiveCandy (task) {
      if (task.status !== 'processing') return

      this.receiveBoxShow = true

      // 糖果盒子对象
      const rbox = document.getElementById('header-receive-box')

      let animateAfter = false
      let dataBack = false
      let iserror = false

      const removeCandy = () => {
        if (!animateAfter || !dataBack) return
        console.log('------ this.hideTasks', this.hideTasks, this.candyTasks.length)
        if (this.hideTasks === this.candyTasks.length) {
          this.$set(this, 'hideTasks', 1)
          this.$set(this, 'candyTasks', [])
        } else {
          this.hideTasks = this.hideTasks + 1
        }
      }

      // 获取当前 receive 糖果dom
      const candy = document.getElementById(`ldb-candy-${task.tid}`)
      if (!candy) return
      const candyId = candy.getAttribute('id')
      this.receiveEndCandy = candyId

      // 获取子元素
      const cCandy = candy.firstChild
      if (!cCandy) return

      // 设置当前dom鼠标形态
      candy.style.cursor = 'no-drop'

      // 屏蔽子元素鼠标事件及暂停动画
      // children.style.pointerEvents = 'none'
      cCandy.style.animationPlayState = 'paused'
      addClass('move', cCandy)

      const intoBoxCandy = document.getElementById('receive-box-candy')

      const cloneCandyId = `clone_${candyId}`

      receiveAnimate(cCandy, document.getElementById('header-receive-box'), { duration: 500 }, ({ boxCenter, coords, beforeEnd }) => {
        if (!hasClass('animate', rbox)) addClass('animate', rbox)
        else rbox.style.animationPlayState = 'running'

        const rboxFunc = () => {
          rbox.removeEventListener(animationIterationEvent(), rboxFunc)
          rbox.style.animationPlayState = 'paused'

          animateAfter = true
          removeCandy()
        }
        rbox.addEventListener(animationIterationEvent(), rboxFunc)

        const eatFunc = () => {
          console.log('-------- eatFunc')
          const cloneCandy = document.getElementById(cloneCandyId)
          cloneCandy.removeEventListener(animationEndEvent(), eatFunc)
          // cloneCandy.style.animationPlayState = 'paused'
          addClass('hidden', cloneCandy)

          intoBoxCandy.style = ''

          // 如果当前糖果是box关闭前的最后那个糖果，关闭box
          if (this.receiveEndCandy === candyId) {
            rbox.style = ''
            removeClass('animate', rbox)
            setTimeout(() => {
              this.receiveBoxShow = false
            }, 0)
          }
        }

        if (intoBoxCandy.firstChild) intoBoxCandy.removeChild(intoBoxCandy.firstChild)

        const cloneCandy = cCandy.cloneNode(true)

        cloneCandy.setAttribute('id', cloneCandyId)
        cloneCandy.style = ''
        cloneCandy.className = 'receive-clone-candy animate'
        intoBoxCandy.appendChild(cloneCandy)

        document.getElementById(cloneCandyId).addEventListener(animationEndEvent(), eatFunc)

        const ccr = cCandy.getClientRects()[0]
        const ibcr = document.getElementById('receive-box-container').getClientRects()[0]

        const ibcleft = ccr.left - ibcr.left
        const ibctop = ccr.top - ibcr.top
        intoBoxCandy.style = `transform: translate3d(${ibcleft}px, ${ibctop}px, 0);`

        if (!iserror) {
          addClass('hidden', cCandy)
        }
        cCandy.style.transform = ''
      })

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
          removeClass('move', cCandy)
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
  @keyframes bounceInLeft {
    from,
    55%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      // -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1.55);
      // animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1.55);
    }

    0% {
      opacity: 0;
      -webkit-transform: translate3d(-100%, -50%, 0);
      transform: translate3d(-100%, -50%, 0);
    }

    55% {
      opacity: 1;
      -webkit-transform: translate3d(30px, -50%, 0);
      transform: translate3d(30px, -50%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }
  }
  @keyframes bounceInRight {
    from,
    55%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      // -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1.55);
      // animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1.55);
    }

    0% {
      opacity: 0;
      -webkit-transform: translate3d(0, 0, 0) translateX(0px);
      transform: translate3d(0, 0, 0) translateX(0px);
    }

    55% {
      opacity: 1;
      -webkit-transform: translate3d(-100%, 0, 0) translateX(-30px);
      transform: translate3d(-100%, 0, 0) translateX(-30px);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(-100%, 0, 0) translateX(0px);
      transform: translate3d(-100%, 0, 0) translateX(0px);
    }
  }

  @keyframes bounceSkewInRight {
    from,
    55%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      // -webkit-animation-timing-function: cubic-bezier(0, 0, 0, 1.45);
      // animation-timing-function: cubic-bezier(0, 0, 0, 1.45);
    }

    0% {
      opacity: 0;
      -webkit-transform: translate3d(10%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
      transform: translate3d(10%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
    }

    55% {
      opacity: 1;
      -webkit-transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(-30px) translateZ(0px);
      transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(-30px) translateZ(0px);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
      transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
    }
  }
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
        transform: translate(5%, -25%) translateZ(0);
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
          animation: bounceSkewInRight .55s 1 forwards;
          // opacity: 1;
          // transform: translate3d(-20%, 0, 0) skew(-25deg) translateX(0px) translateZ(0px);
        }
      }
      .detail-header-left {
        // left: 0;
        animation: bounceInLeft .55s 1 forwards;
        // opacity: 1;
        // transform: translate3d(0, -50%, 0);
        &::before {
          opacity: 1;
        }
      }
      .detail-header-right {
        animation: bounceInRight .55s .15s 1 forwards;
        // opacity: 1;
        // transform: translate3d(-100%, 0, 0) translateX(0px);
      }
      .detail-ldb-level {
        >img {
          opacity: 1;
          transform: scale(1);
        }
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
      // transition: all 0s .45s;
    }
  }

  .header-container {
    position: relative;
    min-width: 1000px;
    max-width: 1280px;
    z-index: 2;
  }

  // header-candy-layer

  @keyframes receiveBoxShowAnimate {
    from,
    70%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      transform: translate3d(-100%, 100%, 0) translate(0, 0) translateZ(0px);
    }
    70% {
      transform: translate3d(-25%, 20%, 0) translate(6px, -6px) translateZ(0px);
    }
    to {
      transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
    }
  }
  @keyframes receiveBoxHideAnimate {
    0% {
      transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
    }
    100% {
      transform: translate3d(-100%, 100%, 0) translate(0, 0) translateZ(0px);
    }
  }

  @keyframes receiveBoxEat {
    0% {
      transform: translate(0px, 0px) scale(1) translateZ(0px);
    }

    50% {
      transform: translate(-10px, 10px) scale(1.1) translateZ(0px);
    }
  }

  .header-candy-layer {
    position: absolute;
    left: 0;
    top: 5%;
    width: 40%;
    height: 90%;
    z-index: 1;
    overflow: hidden;
    &.show {
      z-index: 5;
      .header-receive-main {
        visibility: visible;
        animation: receiveBoxShowAnimate .5s linear forwards;
      }
    }
    &.hide {
      .header-receive-main {
        animation-name: receiveBoxHideAnimate;
        animation-duration: .35s;
      }
    }
  }

  .header-receive-box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 264px;
    &.animate {
      animation: receiveBoxEat .5s ease-out infinite;
    }
  }
  .header-receive-main {
    visibility: hidden;
    transform: translate3d(-25%, 20%, 0) translate(0px, 0px) translateZ(0px);
    // transition: transform .5s 0s ease-out;
    will-change: transform;
  }
  .receive-box-container {
    position: relative;
    width: 100%;
    >img {
      transform: rotate(45deg);
    }
  }
  .receive-box-top {
    position: relative;
    width: 100%;
    z-index: 1;
  }
  .receive-box-bottom {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 3;
  }
  .receive-box-candy {
    position: absolute;
    top: 0;
    left: 0;
    width: 54px;
    height: 54px;
    z-index: 2;
  }

  @keyframes cloneCandyAnimate {
    0% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      animation-timing-function: ease-in;
    }
    30% {
      opacity: 1;
      transform: translate3d(5px, -15px, 0);
      animation-timing-function: ease-out;
    }
    // 50% {
    //   opacity: 0;
    //   transform: translate3d(-50px, 25px, 0);
    // }
    100% {
      opacity: 0;
      transform: translate3d(-50px, 25px, 0);
    }
  }
  .receive-clone-candy {
    display: inline-block;
    position: relative;
    width: 54px;
    height: 54px;
    opacity: 0;
    &.animate {
      animation: cloneCandyAnimate .75s ease-out 1;
    }
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
    z-index: 3;
    // transition: all 0s .45s;
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
      transition: opacity .3s ease-in .45s;
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
    // transition: all 0s .6s;
    // transition: all .55s .15s;
    // transition: transform .55s spring .25s, opacity .55s spring .25s;
    // height: calc(930px / 4 * 3);
  }
  .detail-ldb-level {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    transform: translate(15%, -20%) translateZ(0);
    >img {
      opacity: 0;
      width: 100%;
      transform: scale(.75);
      transition: all .25s ease-in-out .5s;
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
