<template>
  <div class="ld-task-card" :class="{ 'shadow': shadow }">
    <div class="ld-task-container">
      <div
        v-if="!reward"
        class="d-flex task-status-box">
        <div class="v-flex">
          <h2>
            Follow EOS Telegram
            <span class="task-status">Under way</span>
          </h2>
          <div class="ld-task-status">
            <p class="d-flex f-align-center task-status-serial">
              <span class="line-height-0">#67854</span>
              <span class="text-cap task-tip">Telegram</span>
            </p>
            <div class="d-flex f-align-center task-status-reward">
              <h2 class="color-blue">+1.2 <span class="text-upper">EOS</span></h2>
              <span>
                <span>≈ 0.03</span>
                <span class="text-upper">USD</span>
              </span>
            </div>
          </div>
        </div>
        <div class="d-flex col-flex f-justify-between text-right task-tool-box">
          <div class="task-tool-top">
            <p class="task-tool-status">Completed on</p>
            <p class="task-tool-date">{{ taskInfo.created_at | dateFormat }}</p>
          </div>
          <p>
            <span class="inline-block task-svg task-play-svg" @click="$emit('play', taskInfo)">
              <svg>
                <use xlink:href="/static/svg/user/task.svg#icon-play"/>
              </svg>
            </span>
            <span class="inline-block task-svg" @click="$emit('choose', taskInfo)">
              <svg>
                <use xlink:href="/static/svg/user/task.svg#icon-eye"/>
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
              <p class="task-tool-date">{{ taskInfo.created_at | dateFormat }}</p>
            </div>
            <p>
              <span class="inline-block task-svg" @click="$emit('choose', taskInfo)">
                <svg>
                  <use xlink:href="/static/svg/user/task.svg#icon-eye"/>
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
    taskInfo: {
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
    background-color: #fff;
    border-radius: 5px;
    @include padding-around(30px, 45px, 30px, 45px, 1);
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
    display: inline-block;
    padding: 4px 5px;
    font-size: 12px;
    color: #fff;
    background-color: $--text-blue-color;
    border-radius: 5px;
    @include margin('left', 15px, 1);
  }

  .task-tool-box {

  }
  .task-tool-top {
    @include margin('bottom', 25px, 1);
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
    width: 26px;
    height: 26px;
    @include margin('right', 15px, 1);
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
    font-size: 18px;
    color: #999;
    @include margin('top', 8px, 1);
  }
  .task-status-reward {
    @include margin('top', 17px, 1);
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
    @include margin('top', 35px, 1);
  }
  .reward-cnt-item {
    >p {
      &:first-of-type {
        font-size: 18px;
        color: #777;
      }
      &:nth-of-type(2) {
        font-size: 16px;
        color: #bbb;
        @include margin('top', 6px, 1);
      }
      &:nth-of-type(3) {
        font-size: 16px;
        color: #555555;
      }
    }
    >h2 {
      @include margin('top', 6px, 1);
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
