<template>
  <div
    :ref="refName"
    class="lordless-fixed-container"
    :class="{ 'is-leave': isLeave, 'is-shadow': shadow, 'is-static': isStatic }"
    :style="fixedStyle">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'lordless-fixed',
  props: {
    container: {
      type: Number,
      default: Math.ceil(Math.random() * 1000000)
    },
    isStatic: {
      type: Boolean,
      default: false
    },
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: null
    },
    shadow: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 9
    }
  },
  data: () => {
    return {
      rendered: false,
      parent: null,
      isLeave: false
    }
  },
  computed: {
    fixedStyle () {
      const { top = 0, bottom } = this
      if (bottom !== null) return `bottom: ${bottom}px;z-index: ${this.zIndex};`
      return `top: ${top}px;z-index: ${this.zIndex};`
    },
    refName () {
      return `fixed-${this.container}`
    }
  },
  methods: {
    initFixed () {
      if (this.isStatic) return
      this.isLeave = false
      if (!this.$refs[this.refName]) return
      this.parent = this.$refs[this.refName].parentNode
      document.body.appendChild(this.$refs[this.refName])
      this.$once('hook:deactivated', () => {
        this.parent && this.parent.appendChild(this.$refs[this.refName])
        this.parent = null
        this.isLeave = true
      })
      this.$once('hook:beforeDestroy', () => {
        this.isLeave = true
        this.rendered = false
        this.parent = null
        this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
      })
    }
  },
  // deactivated () {
  //   this.parent && this.parent.appendChild(this.$refs[this.refName])
  //   this.parent = null
  //   this.isLeave = true
  // },
  // beforeDestroy () {
  //   this.isLeave = true
  //   this.rendered = false
  //   this.parent = null
  //   this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  // },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initFixed()
  },
  mounted () {
    this.initFixed()
  }
}
</script>

<style lang="scss" scoped>
  .lordless-fixed-container {
    position: fixed;
    left: 0;
    width: 100%;
    opacity: 1;
    transition: opacity .4s;
    &.is-static {
      position: static;
    }
    &.is-leave {
      opacity: 0;
    }
    &.is-shadow {
      box-shadow: 0 0 10px 3px rgba(0, 0, 0, .1);
    }
  }
</style>
