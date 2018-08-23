<template>
  <div class="ldb-approved-tasks">
    <div v-if="loading" class="ldb-approved-skeletion">
      <!-- <h3 class="skeletion-breath"></h3> -->
      <div class="skeletion-breath">
        <p>
          <span></span>
          <span></span>
        </p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-fade">
      <section v-if="!loading" class="ldb-approved-section">
        <!-- <p class="d-flex f-align-baseline">Approved tasks</p> -->
        <div class="ldb-approved-cnt">
          <el-row class="approved-tasks-list">
            <el-col
              class="sm-mar-t5 text-center approved-tasks-item"
              :span="24">
              <div class="relative" style="z-index: 2;">
                <p class="approved-card-tip" v-if="approvedTask && approvedTask.executor.info.nickName">{{ approvedTask.executor.info.nickName }} just completed a new task</p>
                <p class="approved-card-tip" v-else-if="approvedTask && !approvedTask.executor.info.nickName">{{ approvedTask.executor.info._id | splitAddress({ before: 4, end: 2 }) }} just completed a new task</p>
                <figure id="approved-item-container" class="approved-item-container">
                  <div class="d-flex f-auto-center approved-task-header">
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
                  <p v-if="!approvedTask" class="approved-no-task">暂无任务被完成</p>
                  <figcaption v-if="approvedTask">{{ approvedTask.ldbTaskType.name }}</figcaption>
                  <div class="d-flex f-align-center approved-task-rewards" v-if="approvedTask">
                    <div class="v-flex">
                      <p>LORD</p>
                      <h3>+{{ approvedTask.lord.reward.count | formatDecimal }} <span class="text-upper">{{ approvedTask.reward.candy.symbol }}</span></h3>
                      <p>≈$ {{ approvedTask.lord.reward.count / approvedTask.reward.candy.USD2TokenCount | formatDecimal }}</p>
                    </div>
                    <div class="v-flex">
                      <p>Swordsman</p>
                      <h3>+{{ approvedTask.executor.reward.count | formatDecimal }} <span class="text-upper">{{ approvedTask.reward.candy.symbol }}</span></h3>
                      <p>≈$ {{ approvedTask.executor.reward.count / approvedTask.reward.candy.USD2TokenCount | formatDecimal }}</p>
                    </div>
                  </div>
                </figure>
              </div>
            </el-col>
          </el-row>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import { getApprovedTaskByLdbId } from 'api'
import { transitionEvent, addClass, removeClass } from 'utils/tool'
export default {
  props: {

    ldbId: {
      type: [String, Number],
      default: null
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      approvedTask: null,
      approvedInterval: null
    }
  },
  watch: {
    ldbId (val) {
      this.getApprovedTask(val)
    },
    approvedTask (val, oval) {
      // 如果初始加载，不执行动画
      if (oval) this.change()
    }
  },
  methods: {
    async getApprovedTask (ldbId = this.ldbId) {
      if (!ldbId && ldbId !== 0) return
      const res = await getApprovedTaskByLdbId(ldbId, { taskId: this.approvedTask ? this.approvedTask._id : undefined })
      if (res.code === 1000 && res.data) {
        this.approvedTask = res.data
      }
    },
    change () {
      const dom = document.getElementById('approved-item-container')
      const func = () => {
        dom.removeEventListener(transitionEvent(), func, false)
        setTimeout(() => {
          removeClass('animate', dom)
        }, 250)
      }
      dom.addEventListener(transitionEvent(), func, false)
      this.$nextTick(() => {
        addClass('animate', dom)
      })
    },
    approvedIntervalFunc () {
      this.getApprovedTask()
      this.clearApproved()
      this.approvedInterval = setInterval(() => {
        this.getApprovedTask()
      }, 10000)
    },
    clearApproved () {
      if (this.approvedInterval) {
        clearInterval(this.approvedInterval)
        this.approvedInterval = null
      }
    }
  },
  beforeDestroy () {
    this.clearApproved()
  },
  mounted () {
    this.$nextTick(() => this.approvedIntervalFunc())
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  // ldb-approved-skeletion
  .ldb-approved-skeletion {
    // >h3 {
    //   height: 40px;
    //   background-color: $--skeletion-light;
    // }
    >div {
      padding: 50px 30px 40px;
      margin-top: 30px;
      border-radius: 5px;
      background-color: $--skeletion-light;
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          text-align: center;
          background-color: transparent;
          >span {
            display: inline-block;
            width: 90px;
            height: 90px;
            border-radius: 100%;
            background-color: $--skeletion-dark;
            &:not(:first-of-type) {
              margin-left: -15px;
            }
          }
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          height: 18px;
        }
        &:nth-of-type(3) {
          margin-top: 20px;
          height: 18px;
        }
        &:nth-of-type(4) {
          margin-top: 15px;
          height: 25px;
        }
        &:nth-of-type(5) {
          margin-top: 10px;
          height: 18px;
        }
      }
    }
  }

  // ldb-approved-tasks

  .ldb-approved-tasks {
  }
  .ldb-approved-section {
    >p {
      padding: 15px;
      font-size: 18px;
      font-family: $--font-TTNormsMedium;
      font-weight: normal;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    }
  }
  .ldb-approved-cnt {
    // margin-top: 10px;
  }
  .approved-tasks-list {
    // margin-top: -20px;
  }

  .approved-tasks-item {
    position: relative;
    // margin-top: 20px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    border-radius: 5px;
    background-color: #fff;
    overflow: hidden;
    // &:nth-of-type(2n + 1) {
    //   @include padding('right', 12px, -2);
    // }
    // &:nth-of-type(2n) {
    //   @include padding('left', 12px, -2);
    // }
  }
  .approved-card-tip {
    position: absolute;
    left: 0;
    top: 25px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
  .approved-item-container {
    min-height: 300px;
    opacity: 1;
    transition: opacity .25s ease-in-out;
    &.animate {
      opacity: 0;
      &::before {
        transform: skewY(15deg) translateY(-50%);
      }
      >figcaption {
        transform: translateY(-200%);
      }
      .approved-task-header {
        >span {
          &:first-of-type {
            left: -50%;
          }
          &:last-of-type {
            left: 50%;
          }
        }
      }
      .approved-task-rewards {
        transform: translateY(100%);
      }
    }
  }
  .approved-no-task {
    margin-top: 50px;
    font-size: 18px;
  }
  .approved-item-container {
    position: relative;
    padding: 60px 15px 40px;
    >figcaption {
      margin-top: 25px;
      margin-bottom: 25px;
      font-size: 18px;
      color: #777;
      transform: translateY(0);
      transition: transform .25s ease-in-out;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: -20%;
      width: 100%;
      height: 50%;
      // background-image: linear-gradient(45deg, #16222A, #3A6073);
      background-color: $--text-blue-color;
      transform: skewY(15deg) translateY(0);
      transition: transform .25s ease-in-out;
      z-index: -1;
    }
  }
  .approved-task-header {
    >span {
      position: relative;
      left: 0;
      padding: 20px;
      width: 96px;
      height: 96px;
      fill: $--text-blue-color;
      border-radius: 100%;
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
      transition: left .25s ease-in-out;
      &:not(:first-of-type) {
        margin-left: -15px;
        z-index: -1;
      }
    }
  }
  .approved-task-rewards {
    transform: translateY(0);
    transition: transform .25s ease-in-out;
    >div {
      >h3 {
        margin-top: 10px;
        color: #777;
      }
      >p {
        &:nth-of-type(1) {
          font-size: 18px;
          color: #999;
        }
      }
      &:not(:first-of-type) {
        margin-left: 15px;
      }
    }
  }
</style>
