<template>
  <div class="checkbox-box">
    <span class="inline-block checkbox-inner" :class="{ 'choose': choose }" @click.stop="toggleChoose"></span>
  </div>
</template>

<script>
export default {
  props: {
    default: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    const choose = this.default
    return {
      choose
    }
  },
  methods: {
    toggleChoose () {
      this.$emit('click', () => {
        this.choose = !this.choose
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .checkbox-box {
    width: inherit;
    height: inherit;
  }
  .checkbox-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: $--main-color;
    &::after {
      content: "";
      box-sizing: content-box;
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 50%;
      left: 25%;
      position: absolute;
      top: 1px;
      transform: rotate(45deg);
      width: 3px;
      visibility: hidden;
    }
    &.choose {
      &::after {
        visibility: visible;
      }
    }
  }
</style>
