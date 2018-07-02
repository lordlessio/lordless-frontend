<template>
  <div class="image-box" :class="[sType, { 'd-flex f-justify-center': center }]">
    <img v-if="type === 'img'" :src="src"/>
    <span v-else :style="`background-image: url('${src}')`"></span>
  </div>
</template>

<script>
export default {
  name: 'my-image',

  props: {

    // 图片地址
    src: String,

    /**
     * 图片显示类型
     * img: 正常图片显示类型
     * span: span 背景图显示类型
     */
    type: {
      type: String,
      default: 'img'
    },

    sType: {
      type: String,
      default: 'width'
    },

    center: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    imgClick (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .image-box {
    position: relative;
    width: inherit;
    height: inherit;
    > span {
      position: absolute;
      width: 100%;
      height: 100%;
      @include bg-size();
    }
    &.width {
      >img {
        width: 100%;
      }
    }
    &.height {
      >img {
        height: 100%;
      }
    }
    &.center {

    }
  }
</style>
