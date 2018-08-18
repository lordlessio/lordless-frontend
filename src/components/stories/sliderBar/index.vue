<template>
  <div class="lordless-slider-bar">
    <div class="slider-bar-btn" :style="slider"></div>
    <span
      :id="item"
      class="text-upper inline-block lordless-slider-item"
      :class="{ 'is-active': item === active }"
      v-for="(item, index) of list"
      :key="index"
      @click="choose($event, item)">
      {{ item }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      slider: {
        opacity: 0,
        transform: 'translateX(0)'
      }
    }
  },
  watch: {
    active (val) {
      if (val) this.change(val)
    }
  },
  methods: {
    init () {
      this.change()
    },
    change (active = this.active || this.list[0]) {
      if (!active) return
      const chooseDom = document.getElementById(active)
      const left = chooseDom.offsetLeft
      this.$set(this.slider, 'transform', `translateX(${left}px)`)
      if (!this.slider.opacity) this.$set(this.slider, 'opacity', 1)
    },
    choose (e, item) {
      this.$emit('update:active', item)
      this.$emit('change', item)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .lordless-slider-bar {
    padding: 3px 20px;
    position: relative;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    border-radius: 20px;
  }
  .slider-bar-btn {
    position: absolute;
    left: 0;
    top: -4px;
    width: 68px;
    height: 36px;
    opacity: 0;
    border-radius: 5px;
    background-color: #4586FC;
    transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .lordless-slider-item {
    position: relative;
    padding: 0 15px;
    font-size: 16px;
    color: #999;
    background-color: transparent;
    transition: color .4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    cursor: pointer;
    &.is-active {
      color: #fff;
    }
  }
</style>
