<template>
  <div class="relative ldb-tasks-now">

    <!-- ldb detail taskNow skeletion -->
    <transition name="ld-suspension-hide-fade">
      <task-now-skeletion v-if="loading"></task-now-skeletion>
    </transition>

    <transition name="ld-hide-fade">
      <section v-if="!loading" class="ldb-left-section">
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
                  <div class="d-flex row-flex">
                    <div class="d-flex col-flex tasks-now-icons">
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
                      <p><link-symbol :href="item.ldbTaskType.url">{{ item.ldbTaskType.name }}</link-symbol></p>
                      <div class="tasks-now-rewards">
                        <p>-{{ item.ldbTaskType.apCost }} AP</p>
                        <p class="text-upper">+{{ item.ldbTaskType.priceInUSD * item.ldbTaskType.candyType.USD2TokenCount | formatDecimal }} {{ item.ldbTaskType.candyType.symbol }}</p>
                        <p>+{{ item.ac }} AC</p>
                      </div>
                    </div>
                    <div class="d-flex f-align-end">
                      <ld-btn
                        class="tasks-now-btn"
                        theme="blue"
                        shadow
                        inverse
                        :disabled="receiveLoading || !item.countLeft || owner"
                        :loading="receiveLoading"
                        @click="receive(item)">
                        <span v-if="item.userStatus === 0">Applied</span>
                        <span v-else-if="item.userStatus === 1">Completed</span>
                        <span v-else-if="item.userStatus === -1">Failed</span>
                        <span v-else>Apply</span>
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
import TaskNowSkeletion from '@/components/skeletion/ldb/detail/tool/taskNow'

import LdBtn from '@/components/stories/button'
import LdCarousel from '@/components/stories/carousel'
import LdSliderBar from '@/components/stories/sliderBar'
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
      type: [String, Number],
      default: null
    },
    owner: {
      type: Boolean,
      default: false
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
    TaskNowSkeletion,

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

    async receive ({ _id, countLeft }) {
      if (!_id || this.receiveLoading) return
      this.receiveLoading = true
      this.$emit('receive', { _id, countLeft }, ({ errorMsg, data } = {}) => {
        this.receiveLoading = false
        console.log('-------- receive')
        if (data) this.$router.push(`/task/${data._id}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-tasks-now
  .ldb-tasks-now {
    margin-top: 50px;
  }

  .tasks-now-carousel {
    padding: 20px 0;
    margin-top: 80px;
    color: #777;
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
    // background-image: linear-gradient(to right, #3A6073, #16222A);
    background-color: #fff;
    border-radius: 5px;
    // overflow: hidden;
    box-shadow: 0 2px 10px -1px rgba(0, 0, 0, 0.25);
    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: -15%;
    //   left: 38%;
    //   width: 100%;
    //   padding-top: 100%;
    //   border-radius: 100%;
    //   background-image: linear-gradient(45deg , #00C0EB, #3588FD);
    //   mix-blend-mode: soft-light;
    //   overflow: hidden;
    //   z-index: 1;
    // }
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
      box-shadow: 0 2px 10px -1px rgba(0, 0, 0, 0.25);
      box-sizing: border-box;
      &:not(:first-of-type) {
        margin-top: -15px;
        z-index: -1;
      }
    }
  }
  .tasks-now-detail {
    margin-left: 25px;
    max-width: 125px;
    >p {
      font-size: 18px;
      // word-break: break-all;
    }
  }
  .tasks-now-rewards {
    margin-top: 18px;
    color: #999;
    white-space: nowrap;
    >p {
      font-size: 16px;
    }
  }
  .tasks-now-btn {
    padding: 9px 14px;
    font-size: 14px;
  }
</style>
