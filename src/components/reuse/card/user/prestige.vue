<template>
  <div class="info-item-container info-prestige-section">
    <h2 class="info-cnt-title">Prestige Value</h2>
    <div v-if="loading || !user" class="d-flex f-align-center info-prestige-skeletion">
      <div class="v-flex prestige-level-skeletion skeletion-breath">
        <p></p>
        <p></p>
        <p></p>
      </div>
      <div class="d-flex row-flex prestige-ac-skeletion skeletion-breath">
        <p></p>
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-in-fade">
      <div v-if="!loading && user" class="d-flex f-align-center info-cnt-box info-prestige-box">
        <div class="v-flex exp-progress-box">
          <div class="d-flex f-align-end exp-progress-top">
            <span class="v-flex text-left">LEVEL {{ user.level }}</span>
            <span class="exp-text-progress">
              <span class="exp-current">{{ currentActiveness }}</span>
              <span>&nbsp;/&nbsp;</span>
              <span>{{ nextActiveness }}</span>
            </span>
          </div>
          <div class="exp-progress">
            <lordless-progress
              shadow
              :current="currentActiveness"
              :max="nextActiveness"
              :gradient="progress.gradient">
            </lordless-progress>
          </div>
          <p class="exp-tip-text">You still need to earn {{ nextActiveness - currentActiveness }} to level up.</p>
        </div>
        <div class="exp-recived-box sm-hidden">
          <span
            class="exp-recived-item"
            v-for="(item, index) of overviews.activeness.list.slice(0, overviews.ps)"
            :key="index"
            :style="`color: rgba(78, 71, 211, ${1 - 0.25 * index});border-color: rgba(78, 71, 211, ${1 - 0.25 * index});z-index: ${-index};`">
            +{{ item.activeness }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { nextAC } from 'utils/tool'
export default {
  props: {
    loading: {
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
          gradient: {
            direction: 'to bottom',
            start: '#EE9AE5',
            end: '#5961F9'
          }
        }
      }
    }
  },
  computed: {
    currentActiveness () {
      return this.user.activeness - nextAC(this.user.level - 1)
    },
    nextActiveness () {
      return nextAC(this.user.level) - nextAC(this.user.level - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  // info-prestige-skeletion
  .info-prestige-skeletion {
    padding: 20px 25px;
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .prestige-level-skeletion {
    >p {
      background-color: $--skeletion-dark;
      &:nth-of-type(1) {
        height: 22px;
      }
      &:nth-of-type(2) {
        margin-top: 10px;
        margin-bottom: 10px;
        height: 25px;
        border-radius: 5px;
      }
      &:nth-of-type(3) {
        width: 80%;
        height: 18px;
      }
    }
  }
  .prestige-ac-skeletion {
    margin-left: 25px;
    >p {
      width: 40px;
      height: 40px;
      background-color: $--skeletion-dark;
      border-radius: 100%;
      &:not(:first-of-type) {
        margin-left: -6px;
      }
    }
  }

  .info-prestige-section {
    @include width(100%, 1, -2);
    @include margin('right', 15px, -2);
  }
  .info-prestige-box {
    @include height(135px, -2);
  }
  .exp-progress-top {
    font-size: 20px;
  }
  .exp-current {
    color: #5961F9;
  }
  .exp-text-progress {
    color: #999999;
    font-size: 18px;
  }
  .exp-progress {
    height: 27px;
    border-radius: 5px;
    overflow: hidden;
    @include margin('top', 6px, 1);
    @include margin('bottom', 6px, 1);
  }
  .exp-tip-text {
    color: #999999;
    font-size: 14px;
  }
  .exp-recived-box {
    position: relative;
    z-index: 1;
    @include margin('left', 20px, 1);
  }
  .exp-recived-item {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: rgb(78, 71, 211);
    border: 3px solid rgb(78, 71, 211);
    border-radius: 100%;
    background-color: #fff;
    white-space: nowrap;
    box-sizing: border-box;
    &:not(:first-of-type) {
      margin-left: -10px;
    }
  }
</style>
