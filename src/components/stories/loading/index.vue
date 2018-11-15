<template>
  <transition name="ld-loading-fade">
    <div
      v-show="loading"
      ref="loading"
      class="ldb-detail-loading"
      :class="[{ 'crown-loading': crown },  position]"
      :style="`z-index: ${index};`">
      <svg v-show="crown">
        <use xlink:href="#icon-logo-image"/>
      </svg>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
// import { transitionEvent } from 'utils/tool'
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'fixed'
    },
    index: {
      type: Number,
      default: 5
    },
    crown: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // transitionEvt () {
    //   const tEvt = transitionEvent()
    //   const dom = this.$refs.loading
    //   const func = () => {
    //     this.$refs.loading.style.display = 'none'
    //     dom.removeEventListener(tEvt, func, false)
    //   }
    //   tEvt && dom.addEventListener(tEvt, func)
    // }
  },
  watch: {
    loading (val) {
      // if (!val) this.transitionEvt()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  .ldb-detail-loading {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // el-popup-parent--hidden
    &.fixed {
      // position: fixed;
      position: absolute;
    }
    &.absolute {
      position: absolute;
    }
  }

  // crown-loading
  // @keyframes outline {
  //   0% {
  //     stroke-dashoffset: 205px;
  //     fill: rgba(202, 202, 202, .5);
  //   }
  //   100% {
  //     stroke-dashoffset: 0;
  //     fill: rgba(202, 202, 202, .1);
  //   }
  // }

  @keyframes fillGradient {
    0% {
      fill: $--text-red-color;
    }
    20% {
      fill: $--text-blue-color;
    }
    40% {
      fill: $--text-green-color;
    }
    60% {
      fill: $--text-yellow-color;
    }
    80% {
      fill: $--text-pink-color;
    }
  }

  .crown-loading {
    // filter: grayscale(30%) sepia(30%);
    background-color: #fff;
    text-align: center;
    svg {
      position: relative;
      top: 35%;
      width: 150px;
      height: 100px;

      // fill: rgba(202, 202, 202, .5);
      // stroke: #332C2B;
      // stroke-dasharray: 205px;
      // animation-fill-mode: both;
      // animation: outline 5s ease-in-out infinite alternate;
      fill: $--text-red-color;
      stroke: none;
      // stroke-dasharray: 205px;
      animation-fill-mode: both;
      animation: fillGradient 5s ease-in-out infinite alternate;
    }
  }

  .ld-loading-fade-enter-active, .ld-loading-fade-leave-active {
    opacity: 1;
    transition: opacity .3s ease-out;
  }
  .ld-loading-fade-leave-active {
    transition: opacity .3s ease-in;
  }
  .ld-loading-fade-enter, .ld-loading-fade-leave-to {
    opacity: 0;
  }
</style>
