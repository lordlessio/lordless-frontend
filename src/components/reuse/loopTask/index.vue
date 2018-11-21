<template>
  <transition name="loop-task-fade">
    <div v-if="task" class="ld-loop-task sm-hidden">
      <div id="loop-task-container" class="d-flex f-align-center loop-task-container" :style="`background-image: url(${originSource('/svg/graphic-curve-tr-blue.svg', { size: -1 })})`">
        <div class="building-poster" :class="`building-popularity-${task.ldb.info.chain.popularity}`">
          <lordless-img
            alt="tavern preview"
            type="span"
            absolute
            :src="task.ldb.info.ldbIcon.source.preview | reldbIcon('map')"/>
            <span class="building-sale-bg" :style="`background-image: url(${originSource('/svg/sale-bg.svg', { size: -1 })})`"></span>
            <img alt="tavern curve" class="ldb-curve" :src="'/svg/curve.svg' | originSource({ size: -1 })">
        </div>
        <div class="v-flex loop-task-cnt">
          <p><link-symbol :link="`/task/${task._id}`">{{ task.ldbTaskType.name }}</link-symbol></p>
          <ul class="d-flex text-center loop-task-rewards">
            <li>
              <p>LORD</p>
              <p class="TTFontBolder text-upper">+{{ task.lord.reward.count | formatDecimal }} {{ task.reward.candy.symbol }}</p>
              <p>≈ $ {{ task.lord.reward.count / task.reward.candy.USD2TokenCount | formatDecimal }}</p>
            </li>
            <li>
              <p>Swordsman</p>
              <p class="TTFontBolder text-upper">+{{ task.executor.reward.count | formatDecimal }} {{ task.reward.candy.symbol }}</p>
              <p>≈ $ {{ task.executor.reward.count / task.reward.candy.USD2TokenCount | formatDecimal }}</p>
            </li>
            <li>
              <p>Related Tavern</p>
              <p class="TTFontBolder">+{{ task.ldb.activeness }} AC</p>
              <p>#{{ task.ldb.info._id }}</p>
            </li>
          </ul>
        </div>
        <p class="d-flex f-align-center loop-task-people">
          <span class="inline-block text-ellipsis" v-if="task.executor.info.nickName"><link-symbol :to="task.executor.info._id">{{ task.executor.info.nickName }}</link-symbol></span>
          <span class="inline-block text-ellipsis" v-else><link-symbol :to="task.executor.info._id">{{ task.executor.info._id | splitAddress({ before: 4, end: 2 }) }}</link-symbol></span>
          just completed a new task
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import { transitionEvent, removeClass, addClass, originSource } from 'utils/tool'
import { getApprovedTask } from 'api'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data: () => {
    return {
      task: null,
      loopTimeout: null,
      loading: true
    }
  },
  watch: {
    task (val, oval) {
      if (oval) this.change()
    }
  },
  methods: {
    originSource () {
      return originSource(...arguments)
    },
    init () {
      this.loopTask()
    },
    change () {
      const tEvent = transitionEvent()
      const dom = document.getElementById('loop-task-container')
      const func = () => {
        dom.removeEventListener(tEvent, func, false)
        removeClass('switch', dom)
      }
      dom.addEventListener(tEvent, func, false)
      this.$nextTick(() => {
        addClass('switch', dom)
      })
    },
    async getCurrentTask (taskId = this.task ? this.task._id : undefined) {
      this.loading = true
      const res = await getApprovedTask({ taskId })
      if (res.code === 1000 && res.data) {
        this.task = res.data
      }
      this.loading = false
    },
    loopTask () {
      this.clearLoop()
      this.getCurrentTask()
      this.loopTimeout = setTimeout(() => {
        this.loopTask()
      }, 5000)
    },
    clearLoop (timeout = this.loopTimeout) {
      if (timeout) {
        clearTimeout(this.loopTimeout)
      }
      this.loopTimeout = null
      return null
    }
  },
  beforeDestroy () {
    this.clearLoop()
  }
}
</script>

<style lang="scss" scoped>
  .loop-task-fade-enter-active, .loop-task-fade-leave-active {
    opacity: 1;
    transition: opacity .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .loop-task-fade-enter, .loop-task-fade-leave-to {
    opacity: 0;
  }

  .ld-loop-task {
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 1px 3px 8px 3px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
  .loop-task-container {
    position: relative;
    padding: 35px 40px;
    padding-right: 140px;
    // background-image: url('~static/svg/single/graphic-curve-tr-blue.svg');
    background-size: auto 100%;
    background-position: 100% 0;
    background-repeat: no-repeat;
    // &::before {
    //   content: '';
    //   position: absolute;
    //   right: 0;
    //   top: 0;
    //   width: 50%;
    //   height: 100%;
    //   background-image: url('/static/svg/single/graphic-curve-tr-blue.svg')
    //   background-size:
    // }
    &.switch {
      .building-poster, .loop-task-cnt, .loop-task-rewards, .loop-task-people {
        opacity: 0;
        transition-duration: .15s;
      }
    }
  }
  .building-poster {
    position: relative;
    width: 128px;
    height: 128px;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, 0.25);
    transition: opacity .4s ease-in-out;
    >.image-box {
      z-index: 2;
    }
  }
  .building-sale-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    // background-image: url('~static/svg/single/sale-bg.svg');
    background-size: 200%;
    background-position-x: 50%;
    background-position-y: 45%;
    opacity: .3;
    background-repeat: no-repeat;
  }
  .ldb-curve {
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 3;
  }

  /**
   * loop-task-cnt  -- begin
   */
  .loop-task-cnt {
    margin-left: 20px;
    transition: opacity .4s ease-in-out;
    >p {
      max-width: 300px;
      font-size: 18px;
      font-weight: 500;
      color: #777;
    }
  }
  .loop-task-rewards {
    margin-top: 20px;
    transition: opacity .4s ease-in-out;
    >li {
      >p {
        color: #777;
        &:nth-of-type(1) {
          font-size: 16px;
          color: #bbb;
        }
        &:nth-of-type(2) {
          margin: 3px 0;
          font-size: 18px;
        }
        &:nth-of-type(3) {
          font-size: 14px;
        }
      }
      &:not(:first-of-type) {
        margin-left: 30px;
      }
    }
  }

  /**
   * loop-task-cnt  -- end
   */

  .loop-task-people {
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 14px;
    color: #fff;
    transition: opacity .4s ease-in-out;
    >span {
      margin-right: 12px;
      max-width: 80px;
    }
  }
</style>
