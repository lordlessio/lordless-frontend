<template>
  <div class="alone-layer ld-progress-box">
    <div v-if="!circle" class="ld-progress-line" :class="{ 'shadow': shadow }" :style="`background-color: ${underColor};`">
      <div
        class="ld-progress-bar"
        :style="`width: ${current / max * 100}%;background-image: linear-gradient(${gradient.direction || 'to bottom'}, ${gradient.start}, ${gradient.end});`"></div>
    </div>
    <div
      v-if="circle"
      class="text-center ld-progress-circle">
      <el-progress
        type="circle"
        :percentage="current / max * 100"
        :color="color"
        :stroke-width="circleWidth"
        :width="width"
        :show-text="false"
        ></el-progress>
      <span class="inline-block circle-text">
        <span :style="`color: ${color};`">{{ current }}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{ max }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lordless-progress',
  props: {
    shadow: {
      type: Boolean,
      default: false
    },
    underColor: {
      type: String,
      default: '#f8f8f8'
    },
    max: {
      type: Number,
      default: 10
    },
    current: {
      type: Number,
      default: 1
    },
    gradient: {
      type: Object,
      default: () => {
        return {
          direction: 'to bottom',
          start: '#EE9AE5',
          end: '#5961F9'
        }
      }
    },

    circle: {
      type: Boolean,
      default: false
    },

    circleWidth: {
      type: Number,
      default: 10
    },

    color: {
      type: String,
      default: '#EE9AE5'
    },

    width: {
      type: Number,
      default: 126
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-progress-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .ld-progress-line {
    position: relative;
    width: 100%;
    height: 100%;
    &.shadow {
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25) inset;
    }
  }
  .ld-progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
    transition: width .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .ld-progress-circle {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .circle-text {
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    background-color: transparent;
    transform: translateY(-50%);
  }
</style>
