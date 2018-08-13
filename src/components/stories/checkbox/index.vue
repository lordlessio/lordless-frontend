<template>
  <div class="checkbox-box">
    <span class="inline-block checkbox-inner" :class="{ 'choose': value || choose }" @click.stop="toggleChoose"></span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    sync: {
      type: Boolean,
      default: false
    },
    choose: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {}
  },
  methods: {
    toggleChoose () {
      if (this.sync) {
        this.$emit('click', () => {
          this.$emit('input', !this.value)
        })
      } else {
        this.$emit('click')
        this.$emit('input', !this.value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .checkbox-box {
    width: inherit;
    height: inherit;
    line-height: 1;
  }
  .checkbox-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: inherit;
    cursor: pointer;
    &::after {
      content: "";
      box-sizing: content-box;
      border: 2px solid;
      border-color: #fff;
      border-left: 0;
      border-top: 0;
      height: 60%;
      left: 50%;
      position: absolute;
      top: 17%;
      transform: rotate(40deg) translateX(-50%);
      width: 25%;
      visibility: hidden;
    }
    &.choose {
      &::after {
        visibility: visible;
      }
    }
  }
</style>
