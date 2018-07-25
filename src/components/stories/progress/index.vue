<template>
  <div class="ld-progress-box">
    <div class="ld-progress-bar" :style="`width: ${current / max}%;background-image: linear-gradient(${gradient.direction}, ${gradient.start}, ${gradient.end});`"></div>
  </div>
</template>

<script>
export default {
  props: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-progress-box {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25) inset;
    background-color: #f8f8f8;
    overflow: hidden;
  }
  .ld-progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
  }
</style>
