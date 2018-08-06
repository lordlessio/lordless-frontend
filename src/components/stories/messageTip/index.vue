<template>
  <div class="TTFontBold tip-main-box" :class="[{ 'show': value }, theme]">
    <div class="container">
      <span class="tip-close" @click="close">
        <i class="el-icon-close"></i>
      </span>
      <span v-if="text">{{ text }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Message Tip'
    },
    theme: {
      type: String,
      default: 'default'
    },
    closeSync: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {

    }
  },
  methods: {

    close () {
      if (!this.closeSync) {
        this.$emit('input', false)
        return
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .tip-main-box {
    position: relative;
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 16px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(100%);
    transition: all .3s ease;
    @include padding('top', 35px);
    @include padding('bottom', 35px);
    &.default {
      background-color: $--text-green-color;
    }
    &.error {
      background-color: $--text-red-color;
    }
    &.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .tip-close {
      position: absolute;
      top: 15px;
      right: 35px;
      font-size: 20px;
      cursor: pointer;
    }
  }
</style>
