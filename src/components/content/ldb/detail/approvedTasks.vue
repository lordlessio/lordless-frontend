<template>
  <div class="relative ldb-approved-tasks">

    <!-- ldb detail approved skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
      <approved-skeletion v-if="loading"/>
    <!-- </transition> -->

    <transition name="ld-hide-fade">
      <section v-show="!loading" class="ldb-approved-section">
        <!-- <p class="d-flex f-align-baseline">Approved tasks</p> -->
        <div class="ldb-approved-cnt">
          <el-row class="approved-tasks-list">
            <el-col
              class="sm-mar-t5 text-center approved-tasks-item alone-layer"
              :span="24">
              <div class="relative" style="z-index: 2;">
                <p class="approved-card-tip" v-if="approvedTask && approvedTask.executor.info.nickName">
                  <link-symbol :to="approvedTask.executor.info._id">{{ approvedTask.executor.info.nickName || (approvedTask.executor.info._id | splitAddress({ before: 4, end: 2 })) }}</link-symbol>
                  <span>just completed a new task</span>
                </p>
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
                  <figcaption v-if="approvedTask"><link-symbol :link="`/task/${approvedTask._id}`">{{ approvedTask.ldbTaskType.name }}</link-symbol></figcaption>
                  <div class="d-flex f-align-center approved-task-rewards" v-if="approvedTask">
                    <div class="v-flex">
                      <p>Tavernkeep</p>
                      <h3>+{{ approvedTask.lord.reward.count | formatDecimal }} <span class="text-upper">{{ approvedTask.reward.candy.symbol }}</span></h3>
                      <p>≈$ {{ approvedTask.lord.reward.count / approvedTask.reward.candy.USD2TokenCount | formatDecimal }}</p>
                    </div>
                    <div class="v-flex">
                      <p>Bounty hunter</p>
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
import ApprovedSkeletion from '@/components/skeletion/ldb/detail/approved'

import { getApprovedTask } from 'api'
import { transitionEvent, addClass, removeClass } from 'utils/tool'
export default {
  name: 'tavern-approved-tasks',
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
      approvedTimeout: null
    }
  },
  watch: {
    approvedTask (val, oval) {
      // 如果初始加载，不执行动画
      if (oval) this.change()
    },
    loading (val) {
      if (!val) {
        this.approvedTimeoutFunc()
      }
    }
  },
  components: {
    ApprovedSkeletion
  },
  methods: {
    async getApprovedTask (ldbId = this.ldbId) {
      if (!ldbId && ldbId !== 0) return
      const res = await getApprovedTask({ ldbId, taskId: this.approvedTask ? this.approvedTask._id : undefined })
      if (res.code === 1000 && res.data) {
        this.approvedTask = res.data
      }
    },
    change () {
      const tEvent = transitionEvent()
      const dom = document.getElementById('approved-item-container')
      const func = () => {
        dom.removeEventListener(tEvent, func, false)
        removeClass('animate', dom)
      }
      dom.addEventListener(tEvent, func, false)
      this.$nextTick(() => {
        addClass('animate', dom)
      })
    },
    async approvedTimeoutFunc () {
      this.getApprovedTask()
      this.clearApproved()

      this.approvedTimeout = setTimeout(() => {
        this.approvedTimeoutFunc()
      }, 10000)
    },
    clearApproved () {
      if (this.approvedTimeout) {
        clearTimeout(this.approvedTimeout)
        this.approvedTimeout = null
      }
    }
  },
  beforeDestroy () {
    removeClass('animate', document.getElementById('approved-item-container'))
    this.clearApproved()
  }
}
</script>

<style lang="scss" scoped>
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
    top: 16px;
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #fff;
    z-index: 2;
  }
  .approved-item-container {
    // min-height: 300px;
    opacity: 1;
    transition: opacity .4s cubic-bezier(0.4, 0, 0.2, 1);
    &.animate {
      opacity: 0;
      &::before {
        transform: skewY(14deg) translateY(-50%);
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
    padding: 63px 15px 48px;
    >figcaption {
      margin-top: 25px;
      margin-bottom: 25px;
      font-size: 18px;
      color: #777;
      transform: translateY(0);
      transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: -16%;
      width: 100%;
      height: 50%;
      // background-image: linear-gradient(45deg, #16222A, #3A6073);
      background-color: $--text-blue-color;
      transform: skewY(14deg) translateY(0);
      transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: -1;
    }
  }
  .approved-task-header {
    >span {
      position: relative;
      left: 0;
      padding: 22px;
      width: 88px;
      height: 88px;
      fill: $--text-blue-color;
      border-radius: 100%;
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: 0 0px 10px 2px rgba(0, 0, 0, .25);
      transition: left .4s cubic-bezier(0.4, 0, 0.2, 1);
      &:not(:first-of-type) {
        margin-left: -15px;
        // z-index: 1;
      }
    }
  }
  .approved-task-rewards {
    transform: translateY(0);
    transition: .4s cubic-bezier(0.4, 0, 0.2, 1);
    color: #0B2A48;
    >div {
      >h3 {
        margin-top: 6px;
        margin-bottom: 6px;
        font-size: 20px;
      }
      >p {
        &:nth-of-type(1) {
          font-size: 16px;
          color: #999;
        }
      }
      &:not(:first-of-type) {
        margin-left: 15px;
      }
    }
  }
</style>
