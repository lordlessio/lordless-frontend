<template>
  <div class="image-box" :class="[sType, { 'd-flex f-justify-center': center, 'absolute': absolute }]">
    <img v-if="type === 'img'" :alt="alt" :src="src"/>
    <span v-else :class="{ 'contain': contain, 'bottom': bottom }" :style="`background-image: url('${src}')`"></span>
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

    alt: {
      type: String,
      default: ''
    },

    sType: {
      type: String,
      default: 'width'
    },

    center: {
      type: Boolean,
      default: true
    },

    contain: {
      type: Boolean,
      default: false
    },

    bottom: {
      type: Boolean,
      default: false
    },

    absolute: {
      type: Boolean,
      default: false
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
      &.contain {
        background-size: contain;
      }
      &.bottom{
        background-position-y: 100%;
      }
    }
    &.absolute {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
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
