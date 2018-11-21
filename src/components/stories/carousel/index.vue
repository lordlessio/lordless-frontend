<template>
  <el-carousel
    ref="taskCarousel"
    class="lordless-carousel"
    indicator-position="none"
    arrow="never"
    :autoplay="false"
    type="card"
    height="223px"
    @change="carouselChange">
    <lordless-btn
      theme="inherit"
      class="inline-block lordless-carousel-btn prev"
      :disabled="disabledPrev"
      @click="carouselChoose('prev', disabledPrev)">
    </lordless-btn>
    <lordless-btn
      theme="inherit"
      class="inline-block lordless-carousel-btn next"
      :disabled="disabledNext"
      @click="carouselChoose('next', disabledNext)">
    </lordless-btn>
    <slot></slot>
  </el-carousel>
</template>
<script>
import { _setTimeout } from 'utils/tool'
export default {
  props: {
    type: {
      type: String,
      default: 'card'
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    length: {
      type: Number,
      default: 0
    },
    activeItem: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      disabledPrev: true,
      disabledNext: false,
      carouselLoading: false
    }
  },
  watch: {
    activeItem (val) {
      this.init(val)
    }
  },
  methods: {
    init (activeItem = this.activeItem || this.list[0]) {
      this.$refs.taskCarousel.setActiveItem(activeItem)
    },
    carouselChoose (value, bool) {
      if (bool || this.carouselLoading) return
      this.$refs.taskCarousel[value]()
      this.carouselLoading = true
      _setTimeout({ duration: 300 }, () => {
        this.carouselLoading = false
      })
    },
    carouselChange (index, old) {
      // 改变 canousel 按钮状态
      if (index === 0) this.disabledPrev = true
      else this.disabledPrev = false

      if (index === this.length - 1) this.disabledNext = true
      else this.disabledNext = false

      this.$emit('change', index, old)
    }
  }
}
</script>
<style lang="scss" scoped>

  .lordless-carousel {
    overflow: visible;
    /deep/ .el-carousel__item--card {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        opacity: 0;
        background-color: #f5f5f5;
        transition: all 0.2s;
      }
      &:not(.is-active) {
        background-color: #f5f5f5;
        pointer-events: none;
        .tasks-now-item {
          box-shadow: none;
        }
        &::before {
          z-index: 3;
          opacity: 1;
        }
      }
      // width: 60%;
      // min-width: 412px;
      &.is-in-stage {
        z-index: 2;
      }
      &.is-active {
        z-index: 3;
      }
    }
    /deep/ {
      .el-carousel__item {
        overflow: visible;
        z-index: 1;
      }
    }
  }

  .lordless-carousel-btn {
    position: absolute;
    top: 50%;
    width: 50px;
    height: 50px;
    color: #fff;
    border-radius: 100%;
    background-color: $--text-blue-color;
    transform: translateY(-50%);
    z-index: 5;
    border: none;
    // cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right: 12px solid #fff;
      border-radius: 2px;
    }
    &.prev {
      left: 12.5%;
      &::before {
        transform: translate(-60%, -50%);
      }
    }
    &.next {
      right: 12.5%;
      &::before {
        transform: translate(-40%, -50%) rotate(180deg);
      }
    }
  }
</style>

