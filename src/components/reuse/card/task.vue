<template>
  <div class="ld-task-card" :class="{ 'shadow': shadow }">
    <div class="ld-task-container">
      <div
        v-if="!reward"
        class="d-flex task-status-box">
        <div class="v-flex">
          <h2>
            {{ info.ldbTaskType.name }}
            <span v-if="info.status === 0" class="task-status doing">Under way</span>
            <span v-if="info.status === 1" class="task-status">Approved</span>
            <span v-if="info.status === 2" class="task-status reject">Rejected</span>
          </h2>
          <div class="ld-task-status">
            <p class="d-flex f-align-center task-status-serial">
              <span class="line-height-0"># {{ info._id }}</span>
              <span class="text-cap task-tip">{{ info.ldbTaskType.taskType === 1 ? 'Daily' :'Telegram' }}</span>
            </p>
            <div class="d-flex f-align-center task-status-reward">
              <h2 class="color-blue" :class="{ 'text-line-through': info.status === 2 }">+{{ info.executor.reward.count | formatDecimal }} <span class="text-upper">{{ info.reward.candy.symbol }}</span></h2>
              <span>
                <span>≈ {{ info.executor.reward.count / info.reward.candy.USD2TokenCount | formatDecimal }}</span>
                <span class="text-upper">USD</span>
              </span>
            </div>
          </div>
        </div>
        <div class="d-flex col-flex f-justify-between text-right task-tool-box">
          <div class="task-tool-top">
            <p class="task-tool-status">{{ info.status === 0 ? 'Due on' : info.status === 1 ? 'Completed on' : 'Over due on' }}</p>
            <p class="task-tool-date">{{ info.roundId.endAt | dateFormat }}</p>
          </div>
          <p>
            <span v-if="info.status === 0" class="inline-block task-svg task-play-svg" @click="$emit('play', info)">
              <svg>
                <use xlink:href="#icon-play"/>
              </svg>
            </span>
            <span class="inline-block task-svg" @click="$emit('choose', info)">
              <svg>
                <use xlink:href="#icon-eye"/>
              </svg>
            </span>
          </p>
        </div>
      </div>
      <div
        v-if="reward"
        class="ld-task-reward">
        <h2>
          Follow EOS Telegram
          <span class="task-tip">Daily</span>
        </h2>
        <div class="d-flex task-reward-cnt">
          <div class="v-flex d-flex text-center reward-cnt-left">
            <div class="reward-cnt-item">
              <p>Task</p>
              <p>#67823</p>
              <h2 class="color-blue">+1.2 <span>EOS</span></h2>
              <p>≈ 0.03 <span class="text-upper">USD</span></p>
            </div>
            <div class="v-flex reward-cnt-item">
              <p>Task</p>
              <p>#67823</p>
              <h2 class="color-blue">+10 <span>act</span></h2>
            </div>
            <div class="reward-cnt-item">
              <p>Task</p>
              <p>#67823</p>
              <h2 class="color-blue">+1.6 <span>EOS</span></h2>
              <p>≈ 0.03 <span class="text-upper">USD</span></p>
            </div>
          </div>
          <div class="d-flex col-flex f-justify-between text-right reward-cnt-right">
            <div class="task-tool-top">
              <p class="task-tool-status">Completed on</p>
              <p class="task-tool-date">{{ info.created_at | dateFormat }}</p>
            </div>
            <p>
              <span class="inline-block task-svg" @click="$emit('choose', info)">
                <svg>
                  <use xlink:href="#icon-eye"/>
                </svg>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shadow: {
      type: Boolean,
      default: true
    },
    reward: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-task-card {
    padding: 30px 45px;
    background-color: #fff;
    border-radius: 5px;
    &.shadow {
      box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .1);
    }
  }
  .ld-task-container {
    color: #555;
    h2 {
      font-family: $--font-TTNormsBold;
      font-size: 24px;
    }
  }

  .task-tip {
    margin-left: 15px;
    display: inline-block;
    padding: 4px 5px;
    font-size: 12px;
    color: #fff;
    background-color: $--text-blue-color;
    border-radius: 5px;
  }

  .task-tool-box {

  }
  .task-tool-top {
    margin-bottom: 25px;
  }
  .task-tool-status {
    color: #999;
  }
  .task-tool-date {
    color: #777;
  }

  .task-svg {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    fill: #BBBBBB;
    cursor: pointer;
    &:hover {
      fill: $--text-blue-color;
    }
  }

  .task-play-svg {
    margin-right: 15px;
    width: 26px;
    height: 26px;
  }

  /**
   *  task-status-box  -- begin
   */
  .task-status-box {

  }
  .task-status {
    font-size: 18px;
    font-weight: normal;
    color: $--text-green-color;
    &.reject {
      color: $--text-red-color;
    }
    &.doing {
      color: $--text-blue-color;
    }
  }
  .task-status-serial {
    margin-top: 8px;
    font-size: 16px;
    color: #999;
  }
  .task-status-reward {
    margin-top: 17px;
    >h2 {
      margin-right: 10px;
    }
    >span {
      font-family: $--font-TTNormsMedium;
      font-size: 16px;
      color: #555555;
    }
  }

  /**
   *  task-status-box  -- begin
   */


  /**
   *  ld-task-reward  -- begin
   */

  .ld-task-reward {

  }
  .task-reward-cnt {
    margin-top: 35px;
  }
  .reward-cnt-item {
    >p {
      &:first-of-type {
        font-size: 18px;
        color: #777;
      }
      &:nth-of-type(2) {
        margin-top: 6px;
        font-size: 16px;
        color: #bbb;
      }
      &:nth-of-type(3) {
        font-size: 16px;
        color: #555555;
      }
    }
    >h2 {
      margin-top: 6px;
    }
  }
  .reward-cnt-left {
    font-family: $--font-TTNormsMedium;
    @include margin('left', 15px, -2);
    @include margin('right', 60px, -2);
  }
  .reward-cnt-right {
    position: relative;
    @include margin('left', 60px, -2);
    &::before {
      content: '';
      position: absolute;
      left: -60px;
      top: 20%;
      width: 0;
      height: 70%;
      border-left: 1px solid #ddd;
    }
  }

  /**
   *  ld-task-reward  -- end
   */
</style>
