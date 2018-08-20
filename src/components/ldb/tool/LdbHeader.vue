<template>
  <div class="ldb-header-box">
    <div v-if="loading" class="ldb-header-skeletion" :class="{ 'dialog': dialog }">
      <div class="container header-container">
        <div class="header-left-skeletion">
          <div class="header-left-box-skeletion" :class="{ 'dialog': dialog }">
            <div class="header-left-container-skeletion">
              <div class="left-skeletion-container">
                <h1></h1>
                <p></p>
                <p></p>
                <p></p>
                <div class="desc-skeletion">
                  <p></p>
                  <p></p>
                  <p></p>
                </div>
                <p></p>
                <div class="left-bottom-skeletion">
                  <div class="d-flex f-align-center lord-skeletion">
                    <p></p>
                    <div class="v-flex">
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="header-right-skeletion">
          <div>
            <!-- <svg>
              <use xlink:href="#icon-logo-image"/>
            </svg> -->
          </div>
        </div>
      </div>
    </div>
    <transition name="ld-hide-fade">
      <section v-if="!loading && info" class="ldb-detail-header" :class="{ 'is-active': !loading, 'dialog': dialog }">
        <div class="absolute-full detail-header-mask"></div>
        <div class="container header-container">
          <div class="detail-ldb-candies">
            <div id="ldb-candies-box" class="ldb-candies-container">
              <span class="inline-block ldb-candies-item"
                :id="`ldb-candy-${candy.tid}`"
                :style="`transform: translate(${candyCoords[candy.tid][0]}px, ${candyCoords[candy.tid][1]}px)`"
                v-for="(candy, index) of candies"
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
              <div class="header-left-cnt-box" :class="{ 'dialog': dialog }">
                <div class="header-left-cnt-container">
                  <figure class="header-left-cnt">
                    <h1 :class="{ 'md': info.name.zh.length > 6, 'sm': info.name.zh.length > 9 }">{{ info.name.zh }}</h1>
                    <p class="detail-ldb-tag">
                      <span class="inline-block">Buddhist & Church</span>
                    </p>
                    <p class="TTFontNormal detail-ldb-address">{{ info.address }}</p>
                    <p class="detail-ldb-location">{{ info.chain.lng | transferCoords | sliceStr}}, {{ info.chain.lat | transferCoords | sliceStr }}</p>
                    <p class="detail-ldb-desc">静安寺，又称静安古寺，位于上海市静安区，其历史相传最早可追溯至三国孙吴赤乌十年（247年），初名沪渎重玄寺。</p>
                    <ld-btn class="ldb-home-btn" theme="info" shadow inverse @click="setHome">Set as home</ld-btn>
                    <figcaption>
                      <div class="d-flex f-align-center detail-lord-box">
                        <blockies
                          :scale="6"
                          :seed="info.lord.address"></blockies>
                        <div class="v-flex d-flex col-flex f-justify-around detail-lord-info">
                          <p>{{ info.lord.nickName || 'LORDLESS' }}</p>
                          <p>{{ info.lord.address | splitAddress({ symbol: '******' }) }}</p>
                        </div>
                      </div>
                      <p class="detail-ldb-city">Shanghai China</p>
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
              <img :src="`/static/img/ldb/ldb-level-${info.chain.popularity}.png`"/>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
import LdImg from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'

import { hasClass, removeClass, addClass, transitionEvent } from 'utils/tool'
import { setHome } from 'api'
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    candyTasks: {
      type: Array,
      default: () => {
        return []
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
      candyCoords: {},
      candies: [],
      hideCandies: 1,
      tasks: vm.candyTasks
    }
  },
  watch: {
    candyTasks (val, oval) {
      if (val.toString() !== this.tasks.toString() && val.length) this.getCandies(val)
    },
    candies (val) {
      if (!val.length && this.tasks.length) this.getCandies()
    }
  },
  components: {
    LdBtn,
    LdImg,
    Blockies
  },
  methods: {
    checkHome () {

    },
    async setHome (ldbInfo = this.info) {
      const res = await setHome({ ldbId: ldbInfo._id })
      if (res.code === 1000) {
        console.log('set success')
      } else {
        console.log(res.errorMsg)
      }
    },
    async receiveCandy (task) {
      if (task.status !== 'processing') return
      this.$emit('receive', task, ({ errorMsg, data }) => {
        console.log('-errorMsg', errorMsg)
        console.log('--- data', data)

        // 获取当前 receive 糖果dom
        const dom = document.getElementById(`ldb-candy-${task.tid}`)
        if (!dom) return

        // 获取子元素
        const children = dom.firstChild
        if (!children) return

        // 如果接口报错
        if (errorMsg) {
          children.setAttribute('data-msg', errorMsg)
          if (!hasClass('afterAnimate', dom)) {
            // 执行动画
            addClass('afterAnimate', dom)
            setTimeout(() => {
              removeClass('afterAnimate', dom)
            }, 1000)
          }
          return
        }
        if (!data) return

        // 设置当前dom鼠标形态
        dom.style.cursor = 'no-drop'

        // 屏蔽子元素鼠标事件及暂停动画
        children.style.pointerEvents = 'none'
        children.style.animationPlayState = 'paused'

        // set 结果信息
        children.setAttribute('data-msg', `+ ${data.executor.reward.count.toFixed(4)} ${task.ldbTaskType.candyType.symbol.toUpperCase()}`)

        // 执行动画
        addClass('animate', dom)

        console.time('animate')
        const animateFunc = () => {
          console.timeEnd('animate')
          setTimeout(() => {
            // 根据 hideCandies 次数，删除 candies
            if (this.hideCandies === this.candies.length) {
              this.$set(this, 'hideCandies', 1)
              this.$set(this, 'candies', [])
            } else {
              this.hideCandies = this.hideCandies + 1
            }
          }, 500)
          dom.removeEventListener(transitionEvent(), animateFunc, false)
        }
        dom.addEventListener(transitionEvent(), animateFunc, false)
      })
    },
    getCandies (tasks = this.tasks) {
      let allTasks = JSON.parse(JSON.stringify(tasks))
      const candies = []
      // if (candies.length) return

      let loop = () => {
        while (candies.length < 6 && allTasks.length) {
          allTasks.map((tasks, index) => {
            if (candies.length >= 6) return
            if (!tasks || !tasks.length) {
              allTasks.splice(index, 1)
              return false
            }
            candies.push(tasks[0])
            allTasks[index].shift()
          })
        }
        loop = null
      }
      loop()
      console.log('------------- candies', candies)
      this.randomCandies(candies)
      this.tasks = allTasks
      this.$emit('update:candyTasks', allTasks)
    },

    // 随机糖果坐标
    randomCandies (candies = this.candies) {
      const candyBox = document.getElementById('ldb-candies-box')
      const w = candyBox.offsetWidth
      const h = candyBox.offsetHeight
      const diameter = 54 + 27
      const radius = 27
      const row = Math.floor(w / diameter)
      const col = Math.floor(h / diameter)
      const arr = []
      let loop = () => {
        while (candies.length && arr.length < candies.length) {
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
        candyCoords[candies[index].tid] = [item[0] * diameter - Math.floor(Math.random() * 2 - 1) * radius, item[1] * diameter - Math.floor(Math.random() * 2 - 1) * Math.floor(Math.random() * 5) * radius / 5]
      })
      this.$set(this, 'candyCoords', candyCoords)
      this.$set(this, 'candies', candies)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-header-skeletion
  .ldb-header-skeletion {
    padding-top: 120px;
    padding-bottom: 150px;
    background-color: #f8f8f8;
    &.dialog {
      padding-top: 60px;
    }
  }
  .header-left-skeletion {
    position: absolute;
    left: 0;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translateY(-50%);
    z-index: 1;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: -25%;
      border-radius: 10px;
      transform: skew(-25deg) translateZ(0);
      background-color: $--skeletion-light;
      z-index: -1;
    }
  }
  .header-left-box-skeletion {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 1280px;
    height: 100%;
    @include viewport-unit('width', 100vw, 0px, 1);
    &.dialog {
      @include viewport-unit('width', 90vw, 0px, -1);
    }
  }
  .header-left-container-skeletion {
    padding: 80px 0 40px;
    margin-left: 50%;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    transform: translateX(-50%);
    box-sizing: border-box;
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .left-bottom-skeletion {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 250px;
    >p {
      margin-top: 20px;
      height: 25px;
      width: 100px;
    }
  }
  .left-skeletion-container {
    position: relative;
    max-width: 350px;
    height: 100%;
    h1, p {
      background-color: $--skeletion-dark;
    }
    >h1 {
      height: 45px;
    }
    >p {
      &:nth-of-type(1) {
        margin-top: 10px;
        width: 100px;
        height: 20px;
        border-radius: 5px;
      }
      &:nth-of-type(2) {
        margin-top: 15px;
        height: 25px;
        width: 200px;
      }
      &:nth-of-type(3) {
        margin-top: 10px;
        height: 20px;
        width: 180px;
      }
      &:nth-of-type(4) {
        margin-top: 30px;
        height: 40px;
        width: 150px;
        border-radius: 5px;
      }
    }
    .desc-skeletion {
      max-width: 300px;
      margin-top: 30px;
      >p {
        margin-top: 10px;
        height: 15px;
        &:last-of-type {
          width: 40%;
        }
      }
    }
    .lord-skeletion {
      >p {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      >div {
        margin-left: 15px;
        >p {
          &:nth-of-type(1) {
            width: 50%;
            height: 20px;
          }
          &:nth-of-type(2) {
            width: 80%;
            margin-top: 5px;
            height: 18px;
          }
        }
      }
    }
  }

  .header-right-skeletion {
    margin-left: calc(100% - 30px);
    max-width: 980px;
    width: 80%;
    border: 15px $--skeletion-light solid;
    box-sizing: border-box;
    transform: translateX(-100%);
    >div {
      position: relative;
      padding-top: 63%;
      // background-color: $--skeletion-light;
      // >svg {
      //   position: absolute;
      //   left: 50%;
      //   top: 50%;
      //   width: 25%;
      //   transform: translate(-50%, -50%);
      //   fill: $--skeletion-dark;
      // }
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
    &.dialog {
      padding-top: 60px;
      .detail-ldb-level {
        transform: translate(0, -25%);
      }
    }
    &.is-active {
      .detail-header-mask {
        animation: springMove .55s linear 1 forwards;
      }
      .detail-header-left {
        left: 0;
        opacity: 1;
        &::before {
          opacity: 1;
        }
      }
      .detail-header-right {
        opacity: 1;
        // transform: translateX(0);
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
      left: 60%;
      background-image: linear-gradient(to bottom, #00C0EB, #3588FD);
      transform: skew(-25deg) translateZ(0);
      z-index: 1;
    }
  }

  .header-container {
    position: relative;
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
  }

  @keyframes candyAnimate {
    0% {
      transform: translateY(-10px);
      animation-timing-function: ease-in;
    }
    50% {
      transform: translateY(10px);
      animation-timing-function: ease-out;
    }
  }

  @keyframes candyAfterAnimate {
    0% {
      transform: translate(-40%, 5px);
      opacity: 0;
      animation-timing-function: ease-in;
    }
    20% {
      transform: translate(-40%, 0px);
      opacity: 1;
    }
    50% {
      animation-timing-function: ease-out;
    }
    100% {
      transform: translate(-40%, -5px);
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
    opacity: 0;
    animation: candiesShow 1s 1 forwards;
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
    &.afterAnimate {
      .ldb-circle-candy {
        &::after {
          animation: candyAfterAnimate 1s 1;
        }
      }
    }
  }
  .ldb-circle-candy {
    position: relative;
    width: 54px;
    height: 54px;
    cursor: pointer;
    transform: translateY(-10px);
    animation: candyAnimate 5s ease-in-out infinite;
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
    left: -100%;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translateY(-50%);
    z-index: 1;
    color: #fff;
    opacity: 0;
    transition: left .55s spring, opacity .55s spring;
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
      transition: opacity .3s spring .55s;
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
    height: 100%;
    @include viewport-unit('width', 100vw, 0px, 1);
    &.dialog {
      @include viewport-unit('width', 90vw, 0px, -1);
    }
  }
  .header-left-cnt-container {
    padding-top: 80px;
    padding-bottom: 40px;
    margin-left: 50%;
    width: 100%;
    max-width: 1000px;
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
  .detail-lord-box {

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

  // detail-header-right
  .detail-header-right {
    position: relative;
    padding: 15px;
    margin-left: calc(100% - 30px);
    max-width: 980px;
    width: 80%;
    background-color: #fff;
    opacity: 0;
    transform: translateX(-100%);
    transition: transform .55s spring .25s, opacity .55s spring .25s;
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
</style>
