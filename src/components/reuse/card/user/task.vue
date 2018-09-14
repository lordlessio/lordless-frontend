<template>
  <transition name="ld-hide-in-fade">
    <div v-if="!loading && user" class="info-item-container user-info-section info-task-section">
      <h2 class="info-cnt-title">Task</h2>
      <div class="d-flex f-align-center sm-col-flex text-center">
        <div class="info-cnt-box info-card-cnt task-candy-box" style="z-index: 3;">
          <p class="card-cnt-title">Action point</p>
          <div class="task-candy-cnt">
            <p class="card-cnt-tip">{{ user.ap }} Points left</p>
            <div class="inline-block card-cnt-box task-candy-progress">
              <lordless-progress
                circle
                :current="user.ap"
                :max="user.maxAp"
                :width="140"
                :circleWidth="progress.circleWidth"
                :color="progress.color">
              </lordless-progress>
            </div>
            <p class="user-recover-time" v-if="new Date(overviews.recoverAt) - new Date() + 5000 > 0">
              <countdown class="task-status-time" @countdownend="$emit('timeDown')" :time="new Date(overviews.recoverAt) - new Date() + 5000" :interval="1000" tag="p">
                <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                <template slot-scope="props">{{ props | formatDue(3) }}</template>
              </countdown>
            </p>
          </div>
        </div>
        <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-current-box" style="z-index: 2;">
          <p class="card-cnt-title">Current task</p>
          <div v-if="!overviews.currentTask" class="v-flex d-flex col-flex task-current-unknow">
            <p class="card-cnt-tip">Task in progress</p>
            <div class="v-flex d-flex f-auto-center card-cnt-box">
              <p>You have no tasks</p>
            </div>
          </div>
          <div v-if="overviews.currentTask" class="v-flex d-flex col-flex task-current-know">
            <p class="card-cnt-tip">A task from Taverns <a href="#">#{{ overviews.currentTask.ldb.info.chain.tokenId }}</a> in progress</p>
            <div class="v-flex d-flex col-flex task-current-cnt">
              <p class="cursor-pointer hover-underline" @click.stop="$router.push(`/task/${overviews.currentTask._id}`)">{{ overviews.currentTask.ldbTaskType.name }}</p>
              <ul class="d-flex task-current-data">
                <li class="v-flex task-current-symbol">
                  <h3>Symbol</h3>
                  <p class="text-upper">{{ overviews.currentTask.reward.candy.symbol }}</p>
                </li>
                <li class="v-flex task-current-reward">
                  <h3>Reward</h3>
                  <p>{{ overviews.currentTask.executor.reward.count | formatDecimal }}</p>
                </li>
                <li class="v-flex task-current-due">
                  <h3>Due</h3>
                  <p v-if="overviews.currentTask.roundId && new Date(overviews.currentTask.roundId.endAt) - new Date() >= 0">
                    <countdown class="task-status-time" :time="new Date(overviews.currentTask.roundId.endAt) - new Date()" :interval="3000" tag="p">
                      <!-- <template slot-scope="props">{{ parseInt(props.days) || props.hours || props.minutes || props.seconds }}{{ parseInt(props.days) ? 'd' : (props.hours ? 'h' : (props.minutes ? 'm' : props.seconds ? 's' : '')) }}</template> -->
                      <template slot-scope="props">{{ props | formatDue }}</template>
                    </countdown>
                  </p>
                  <p v-else>Over Due</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt task-completed-box" style="z-index: 1;">
          <p class="card-cnt-title">Completed tasks</p>
          <div v-if="!overviews.completeTasks.total" class="v-flex d-flex col-flex f-justify-center task-completed-unknow">
            <p class="card-cnt-tip">Recent rewarded tasks</p>
            <div class="v-flex d-flex f-auto-center card-cnt-box">
              <p>You have no tasks completed</p>
            </div>
          </div>
          <div v-if="overviews.completeTasks.total" class="v-flex d-flex col-flex task-completed-know">
            <p class="card-cnt-tip">Recent rewarded tasks</p>
            <ul class="v-flex d-flex col-flex text-left task-completed-cnt">
              <li
                v-for="item of overviews.completeTasks.list.slice(0, overviews.ps)"
                :key="item._id"
                class="d-flex f-justify-around task-completed-item">
                <span class="v-flex text-ellipsis">{{ item.ldbTaskType.name }}</span>
                <span class="text-ellipsis text-right task-completed-reward">+{{ item.executor.reward.count | sliceStr({ end: 6 }) }} <span>{{ item.reward.candy.symbol }}</span></span>
              </li>
              <li
                v-if="overviews.completeTasks.total >= overviews.ps && owner"
                class="info-more">
                <router-link class="d-flex f-align-baseline" to="/owner/tasks">
                  <span>More </span>
                  <span data-type="icon">
                    <i class="el-icon-d-arrow-right"></i>
                  </span>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => {
        return {}
      }
    },
    overviews: {
      type: Object,
      default: () => {
        return {}
      }
    },
    progress: {
      type: Object,
      default: () => {
        return {
          circleWidth: 15,
          color: '#5961F9'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // info-card-cnt
  .info-card-cnt {
    position: relative;
    height: 260px;
    font-family: $--font-TTNormsRegular;
    &:not(:first-of-type) {
      @include margin('top', 20px, 1, -2);
      @include margin('left', -8px, -2);
      @include padding('left', 33px, -2);
    }
  }
  .card-cnt-title {
    font-family: $--font-TTNormsMedium;
    font-size: 20px;
  }
  .card-cnt-tip {
    font-size: 14px;
    color: #999;
    @include padding('top', 5px, 1);
    @include padding('bottom', 10px, 1);
  }
  .card-cnt-box {
    color: #999;
  }

  // user-task-box
  .task-candy-progress {
    width: 140px;
    height: 140px;
    color: #999999;
  }
  .user-recover-time {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    font-size: 14px;
    color: #999;
  }

  .task-current-know {
    >p {
      >a {
        color: #4E47D3;
      }
    }
  }
  .task-current-cnt {
    >p {
      margin-top: 15px;
      font-size: 18px;
    }
  }
  .task-current-data {
    width: 100%;
    @include margin('top', 30px, 1);
    >li {
      >h3 {
        color: #999;
        font-size: 16px;
      }
      >p {
       font-size: 20px;
       @include margin('top', 10px, 1);
      }
    }
  }
  .task-current-reward {
    color: #4E47D3;
  }
  .task-current-due {
    color: #EB8785;
    >p {
      min-width: 110px;
    }
  }

  .task-completed-cnt {
    color: #999;
  }
  .task-completed-item {
    margin-top: 10px;
    >span {
      display: inline-block;
      max-width: 220px;
    }
  }
  .task-completed-reward {
    font-family: $--font-TTNormsMedium;
    color: #4E47D3;
    // text-align: right;
    @include width(120px, 1.2);
  }
  .info-more {
    transform: translateY(12px);
    >a {
      font-size: 14px;
      color: #4E47D3;
      >[data-type="icon"] {
        margin-left: 3px;
        font-size: 12px;
      }
    }
  }
</style>

