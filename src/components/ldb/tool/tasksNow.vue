<template>
  <div class="ldb-tasks-now">
    <div v-if="loading" class="ldb-tasks-skeletion">
      <h3></h3>
      <p></p>
      <div></div>
    </div>
    <transition name="ld-hide-fade">
      <section v-show="!loading" class="ldb-left-section">
        <h3>Tasks now</h3>
        <div class="left-section-cnt">
          <div class="tasks-now-slider">
            <ld-slider-bar
              :list="candies"
              :active.sync="sliderBarModel"
              @change="getCarouselNameBySymbol">
            </ld-slider-bar>
          </div>
          <div class="tasks-now-carousel">
            <ld-carousel
              class="ldb-detail-carousel"
              :activeItem="activeCarousel"
              :length="tasks.length"
              @change="taskChange">
              <el-carousel-item
                :name="item._id"
                v-for="(item, index) of tasks"
                :key="index._id">
                <div class="tasks-now-item">
                  <div class="d-flex">
                    <div class="v-flex d-flex col-flex tasks-now-icons">
                      <span class="inline-block">
                        <svg>
                          <use xlink:href="#icon-logo-image"/>
                        </svg>
                      </span>
                      <span class="inline-block">
                        <svg>
                          <use xlink:href="#icon-telegram"/>
                        </svg>
                      </span>
                    </div>
                    <div class="d-flex col-flex tasks-now-detail">
                      <p>{{ item.ldbTaskType.name }}</p>
                      <div class="tasks-now-rewards">
                        <p>-{{ item.ldbTaskType.apCost }} AP</p>
                        <p class="text-upper">+{{ item.ldbTaskType.priceInUSD * item.ldbTaskType.candyType.USD2TokenCount | formatDecimal }} {{ item.ldbTaskType.candyType.symbol }}</p>
                        <p>+{{ item.ac }} AC</p>
                      </div>
                    </div>
                    <div class="v-flex d-flex f-align-end">
                      <ld-btn
                        class="tasks-now-btn"
                        theme="blue"
                        shadow
                        :disabled="receiveLoading || !item.apLeft"
                        :loading="receiveLoading"
                        @click="receive(item)">
                        {{ item.apLeft ? 'Apply' : 'Applied' }}
                      </ld-btn>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </ld-carousel>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
import LdCarousel from '@/components/stories/carousel'
import LdSliderBar from '@/components/stories/sliderBar'

import { receiveTask } from 'api'
export default {
  props: {
    candies: {
      type: Array,
      default: []
    },
    tasks: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: false
    },
    ldbId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      sliderBarModel: null,
      activeCarousel: null,
      receiveLoading: false
    }
  },
  components: {
    LdBtn,
    LdCarousel,
    LdSliderBar
  },
  methods: {
    /**
     * 根据 carousel name 遍历数组，获取当前 symbol
     */
    getCarouselNameBySymbol (symbol) {
      const list = this.tasks
      let carouselName
      for (const item of list) {
        if (item.ldbTaskType.candyType.symbol === symbol) {
          carouselName = item._id
          break
        }
      }
      this.activeCarousel = carouselName
      return carouselName
    },

    /**
     * task carousel 改变事件
     */
    taskChange (index, old) {
      // 获取当前任务所属的糖果 symbol, 改变 sliderBarModel
      const list = this.tasks
      for (let i = 0; i < list.length; i++) {
        if (i === index) this.sliderBarModel = list[i].ldbTaskType.candyType.symbol
      }
    },

    async receive ({ _id, ldbId = this.ldbId }) {
      if (!_id || !ldbId || this.receiveLoading) return
      this.receiveLoading = true
      const res = await receiveTask({ roundId: _id, ldbId })
      if (res.code === 1000 && res.data) {
        setTimeout(() => {
          window.open(`${location.origin}/task/${res.data._id}`)
        })
      }
      this.receiveLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-tasks-skeletion
  .ldb-tasks-skeletion {
    >h3 {
      height: 40px;
      background-color: $--skeletion-light;
    }
    >p {
      margin-top: 30px;
      height: 30px;
      border-radius: 20px;
      background-color: $--skeletion-light;
    }
    >div {
      margin: 80px auto 0;
      position: relative;
      width: 60%;
      height: 223px;
      border-radius: 5px;
      background-color: $--skeletion-light;
      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background-color: $--skeletion-light;
        transform: translateY(-50%);
      }
      &::before {
        left: -25%;
      }
      &::after {
        right: -25%;
      }
    }
  }

  // ldb-tasks-now
  .ldb-tasks-now {
    margin-top: 50px;
  }

  .tasks-now-carousel {
    margin-top: 100px;
    color: #fff;
    overflow: hidden;
  }
  .ldb-detail-carousel {
    width: 120%;
    left: -10%;
  }


  .tasks-now-item {
    position: relative;
    padding: 28px;
    height: 100%;
    background-image: linear-gradient(to right, #3A6073, #16222A);
    border-radius: 5px;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      top: -15%;
      left: 38%;
      width: 100%;
      padding-top: 100%;
      border-radius: 100%;
      background-image: linear-gradient(45deg , #00C0EB, #3588FD);
      mix-blend-mode: soft-light;
      overflow: hidden;
      z-index: 1;
    }
    >div {
      position: relative;
      z-index: 2;
    }
  }
  .tasks-now-icons {
    >span {
      padding: 20px;
      width: 86px;
      height: 86px;
      border-radius: 100%;
      fill: $--text-blue-color;
      background-color: #fff;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
      box-sizing: border-box;
      &:not(:first-of-type) {
        margin-top: -15px;
        z-index: -1;
      }
    }
  }
  .tasks-now-detail {
    margin-left: 25px;
    >p {
      font-size: 18px;
      word-break: break-all;
    }
  }
  .tasks-now-rewards {
    margin-top: 18px;
    >p {
      font-size: 24px;
      &:first-of-type {
        font-size: 18px;
      }
    }
  }
  .tasks-now-btn {
    padding: 9px 14px;
    font-size: 14px;
  }
</style>
