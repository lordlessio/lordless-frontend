<template>
  <div class="ld-task-box" :class="{ 'dialog': dialog }">
    <div class="d-flex f-auto-center task-detail-header">
      <div class="detail-header-cnt">
        <h2>EOS Task Announcement</h2>
        <div class="d-flex f-align-center header-cnt-desc">
          <div class="inline-block header-coin-svg">
            <svg>
              <use xlink:href="/static/svg/coin.svg#icon-ethereum"/>
            </svg>
          </div>
          <div class="v-flex inline-block header-coin-desc">
            <p>The most powerful infrastructure for decentralized applications</p>
            <p class="coin-href">https://eos.io</p>
          </div>
        </div>
      </div>
    </div>
    <div class="task-detail-cnt">
      <div class="container md">
        <div class="task-status-box">
          <div class="task-cnt-section task-status-top">
            <h1>Follow EOS Telegram</h1>
            <p class="d-flex f-align-center task-status-serial">
              <span>#67854</span>
              <span class="inline-block">·</span>
              <span>Under way</span>
            </p>
            <p>
              <span>Task detail</span>
              <span class="task-tip">Telegram</span>
            </p>
            <p class="TTFontNormal">Join the Telegram of EOS official</p>
            <ld-btn
              class="TTFontBolder task-start-btn">
              Getting started
            </ld-btn>
          </div>
          <div class="d-flex sm-f-align-center sm-col-flex task-cnt-section task-status-bottom">
            <div class="v-flex task-status-remaining">
              <p>Time remaining</p>
              <countdown class="task-status-time" :time="new Date() - new Date('2018-08-04T15:57:51.269Z')" :interval="1000" tag="p">
                <template slot-scope="props">{{ parseInt(props.days) }}d : {{ props.hours }}h : {{ props.minutes }}m : {{ props.seconds }}s</template>
              </countdown>
            </div>
            <div class="task-status-date">
              <p>Create on</p>
              <p>{{ new Date() | dateFormat }}</p>
            </div>
            <div class="task-status-date">
              <p>Due on</p>
              <p>{{ new Date() | dateFormat }}</p>
            </div>
          </div>
        </div>
        <div class="task-cnt-section task-rewards-box">
          <h1>Rewards</h1>
          <p class="TTFontBolder">If the swordman wants to claim candy or get rewards of the task from the LDB, you need to battle with the LORD. The final reward is  based on the result of the battle.</p>
          <div class="d-flex f-justify-between sm-col-flex text-center rewards-cards-box">
            <span class="rewards-vs-svg sm-hidden">
              <svg>
                <use xlink:href="#icon-gradient-vs"/>
              </svg>
            </span>
            <div class="v-flex rewards-cards-item rewards-cards-left">
              <div class="rewards-small-card blue">
                <p>Total candy reward</p>
                <p>3.76 <span class="text-upper">EOS</span></p>
              </div>
              <div class="rewards-big-card red">
                <div class="big-card-top">
                  <span class="big-card-svg">
                    <svg>
                      <use xlink:href="/static/svg/user/task.svg#icon-sword"/>
                    </svg>
                  </span>
                  <div class="card-top-cnt">
                    <div class="rewards-user-avatar">
                      <blockies
                        :scale="12"
                        theme="light"
                        seed="0x4cd98f82decade2d152e256efd1f8d5a334a3e28">
                      </blockies>
                    </div>
                    <p>Swordsman</p>
                    <p>{{ '0x4cd98f82decade2d152e256efd1f8d5a334a3e28' | splitAddress }}</p>
                    <div class="card-user-level">
                      <p class="text-upper">LEVEL 14</p>
                      <strong>50.4<span>%</span></strong>
                    </div>
                  </div>
                </div>
                <div class="big-card-bottom">
                  <p class="text-upper">EOS</p>
                  <h1>+{{ 1.89839 | sliceStr({ end: 8 }) }}</h1>
                  <p>Prestige</p>
                  <h1>+10</h1>
                </div>
              </div>
            </div>
            <div class="v-flex rewards-cards-item rewards-cards-right">
              <div class="rewards-big-card yellow">
                <div class="big-card-top">
                  <span class="big-card-svg crown">
                    <svg>
                      <use xlink:href="#icon-crown"/>
                    </svg>
                  </span>
                  <div class="card-top-cnt">
                    <div class="rewards-user-avatar">
                      <blockies
                        :scale="12"
                        theme="light"
                        seed="0x4cd98f82decade2d152e256efd1f8d5a334a3e28">
                      </blockies>
                    </div>
                    <p>LORD</p>
                    <p>{{ '0x4cd98f82decade2d152e256efd1f8d5a334a3e28' | splitAddress }}</p>
                    <div class="card-user-level">
                      <p class="text-upper">LEVEL 14</p>
                      <strong>49.6<span>%</span></strong>
                    </div>
                  </div>
                </div>
                <div class="big-card-bottom">
                  <p class="text-upper">EOS</p>
                  <h1>+{{ 1.89839 | sliceStr({ end: 8 }) }}</h1>
                  <p>Prestige</p>
                  <h1>+2</h1>
                </div>
              </div>
              <div class="rewards-small-card green">
                <p>Related LDB</p>
                <p>+20 act.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
import Blockies from '@/components/stories/blockies'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    taskId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      loading: false
    }
  },
  components: {
    LdBtn,
    Blockies
  },
  methods: {
    getTaskInfo ({ id = this.taskId }) {
      this.loading = true
      console.log('--get task Info', id)
      this.loading = false
    }
  },
  watch: {
    taskId (val) {
      if (val) {
        this.getTaskInfo({ id: val })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ld-task-box {
    background-color: #f2f2f2;
    @include padding('bottom', 50px, 1);
    h1 {
      font-size: 36px;
    }
    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 24px;
    }
    &.dialog {
      padding-bottom: 0;
      border-radius: 5px;
      .task-detail-header {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
      }
      .task-rewards-box {
        margin-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
      .task-status-bottom {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .task-cnt-section {
    @include padding-around(50px, 74px, 0, 74px, -2);
    @include padding-around(25px, 20px, 0, 20px, 1, -2);
  }

  /**
   *  task-detail-header  -- begin
   */

  .task-detail-header {
    color: #fff;
    background-image: linear-gradient(45deg, #F46AA0, #FFB397);
    @include padding('top', 180px, 1.2);
    @include padding('bottom', 180px, 1.2);
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .header-cnt-desc {
    width: 100%;
    max-width: 450px;
    @include margin('top', 20px, 1);
  }
  .header-coin-svg {
    fill: #fff;
    border-radius: 10px;
    background-image: linear-gradient(45deg, #16222A, #3A6073);
    @include width(100px, 1.2);
    @include height(100px, 1.2);
    @include padding(-1, 22px, 1.2);
  }
  .header-coin-desc {
    @include margin('left', 15px, 1);
    @include fontSize(18px, 1.2);
  }
  .coin-href {
    font-size: 16px;
    @include margin('top', 10px, 1);
  }

  /**
   *  task-detail-header  -- end
   */

  .task-detail-cnt {
    margin-top: -80px;
  }

  /**
   *  task-status-box  -- begin
   */
  .task-status-box {
    color: #fff;
    border-radius: 5px;
    background-color: $--text-blue-color;
    box-shadow: 0 2px 15px 0 #4586FC;
  }
  .task-tip {
    display: inline-block;
    padding: 4px 6px;
    font-size: 12px;
    color: #fff;
    background-color: $--text-deep-blue-color;
    border-radius: 5px;
    @include margin('left', 5px, 1);
  }

  // task-status-top
  .task-status-top {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    @include padding('bottom', 35px, 1);
    >p {
      font-size: 16px;
      &:nth-of-type(2) {
        color: #ddd;
        @include margin('top', 24px, 1);
      }
      &:nth-of-type(3) {
        @include margin('top', 10px, 1);
      }
    }
  }
  .task-status-serial {
    @include margin('top', 10px, 1);
    >span {
      &:nth-of-type(1) {
        font-size: 24px;
        font-weight: 500;
        color: #ddd;
      }
      &:nth-of-type(2) {
        line-height: 0;
        font-size: 54px;
        @include margin('left', 5px, 1);
        @include margin('right', 5px, 1);
      }
      &:nth-of-type(3) {
        font-size: 16px;
      }
    }
  }
  .task-start-btn {
    padding: 10px 15px;
    font-size: 18px;
    color: $--text-blue-color;
    box-shadow: 2.5px 5px 10px 0 rgba(255, 255, 255, .25);
    @include margin('top', 20px, 1);
  }

  // task-status-bottom

  .task-status-bottom {
    background-color: rgba(0, 170, 255, 0.5);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, .25) inset;
    @include padding('top', 30px, 1);
    @include padding('bottom', 30px, 1);
  }
  .task-status-remaining {
    >p {
      font-size: 16px;
      @include margin('bottom', 10px, 1);
    }
    .task-status-time {
      font-size: 24px;
    }
  }
  .task-status-date {
    @include margin('left', 30px, -2);
    @include margin('top', 20px, 1, -2);
    >p {
      &:nth-of-type(1) {
        font-size: 16px;
      }
      &:nth-of-type(2) {
        font-size: 18px;
        @include margin('top', 10px, 1);
      }
    }
  }
  /**
   *  task-status-box  -- end
   */

  /**
   *  task-rewards-box  -- end
   */
  .task-rewards-box {
    background-color: #fff;
    color: #777;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, .15);
    @include margin('top', 100px, 1);
    @include padding('bottom', 80px, 1);
    >p {
      color: #999;
      font-size: 16px;
      @include margin('top', 40px, 1);
    }
  }

  .rewards-cards-left {
    @include margin('right', 35px, -2);
    .rewards-big-card {
      @include margin('top', 24px, 1);
    }
  }
  .rewards-cards-right {
    @include margin('left', 35px, -2);
    .rewards-small-card {
      @include margin('top', 24px, 1);
    }
  }

  .rewards-cards-box {
    position: relative;
    @include margin('top', 65px, 1);
  }

  .rewards-vs-svg {
    width: 300px;
    height: 280px;

    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-10deg);
    z-index: 1;
  }

  .rewards-small-card {
    font-family: $--font-TTNormsMedium;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, .25);
    @include padding('top', 19px, 1);
    @include padding('bottom', 19px, 1);
    >p {
      &:nth-of-type(1) {
        @include fontSize(18px, 1);
      }
      &:nth-of-type(2) {
        font-size: 24px;
        @include margin('top', 5px, 1);
      }
    }
    &.blue {
      background-color: $--text-blue-color;
    }
    &.green {
      background-color: $--text-green-color;
    }
  }

  .rewards-big-card {
    font-family: $--font-TTNormsMedium;
    border-radius: 5px;
    box-shadow: 0px 2px 20px 0 rgba(0, 0, 0, .35);
    // @include padding('top', 48px, 1);
    // @include padding('bottom', 15px, 1);
    &.red {
      color: #fff;
      background-color: $--text-red-color;
    }
    &.yellow {
      color: #555;
      background-color: $--text-yellow-color;
    }
  }
  .big-card-top {
    position: relative;
    @include padding('top', 48px, 1);
    @include padding('bottom', 15px, 1);
    >p {
      &:nth-of-type(1) {
        font-size: 18px;
      }
      &:nth-of-type(2) {
        font-size: 16px;
        @include margin('top', 5px, 1);
      }
    }
  }
  .card-top-cnt {
    position: relative;
    z-index: 1;
  }
  .big-card-svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    fill: rgba(0, 0, 0, .1);
    >svg {
      position: relative;
      left: -15%;
      top: 0;
      width: 120%;
      height: 120%;
    }
    &.crown {
      fill: rgba(255, 255, 255, .2);
      >svg {
        left: -20%;
        transform: rotate(45deg);
      }
    }
  }
  .rewards-user-avatar {
    @include margin('bottom', 15px, 1);
  }

  .card-user-level {
    @include margin('top', 25px, 1);
    >p {
      font-family: $--font-TTNormsBold;
      font-size: 20px;
    }
    >strong {
      font-family: $--font-TTNormsBlack;
      @include fontSize(72px, 1.2);
      >span {
        font-family: $--font-TTNormsBold;
        @include fontSize(36px, 1.2);
      }
    }
  }

  .big-card-bottom {
    box-shadow: 0px 2px 5px 0 rgba(0, 0, 0, .25) inset;
    @include padding('top', 35px, 1);
    @include padding('bottom', 35px, 1);
    >p {
      font-family: $--font-TTNormsMedium;
      @include fontSize(20px, 1);
    }
  }


  /**
   *  task-rewards-box -- end
   */


</style>
