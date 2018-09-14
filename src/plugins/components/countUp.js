import CountUp from 'countup.js'
import isFunction from 'lodash/isFunction'
import Vue from 'vue'

const _CountUp = {
  __countup__: CountUp,
  name: 'count-up',
  props: {
    startVal: {
      type: Number,
      required: false,
      default: 0
    },
    endVal: {
      type: Number,
      required: 0
    },
    decimals: {
      type: Number,
      required: false,
      default: 0
    },
    duration: {
      type: Number,
      required: false,
      default: 2
    },
    options: {
      type: Object,
      required: false
    },
    isReady: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      instance: null
    }
  },
  // computed: {},
  watch: {
    endVal: {
      handler (value) {
        if (this.instance && isFunction(this.instance.update) && this.isReady) {
          this.instance.update(value)
        } else {
          this.init()
        }
      },
      deep: false
    },
    isReady (val) {
      if (val && !this.instance) this.init()
    }
  },
  methods: {
    init () {
      if (this.instance) {
        return
      }

      const dom = this.$el
      const instance = new CountUp(
        dom,
        this.startVal,
        this.endVal,
        this.decimals,
        this.duration,
        this.options
      )

      if (instance.error) {
        // error
      } else {
        instance.start(() => this.$emit('ready', instance, CountUp))
        this.instance = instance
      }
    },
    uninit () {
      this.instance = null
    },
    start (callback) {
      if (this.instance && isFunction(this.instance.start) && isFunction(callback)) {
        return this.instance.start(callback)
      }
    },
    pauseResume () {
      if (this.instance && isFunction(this.instance.pauseResume)) {
        return this.instance.pauseResume()
      }
    },
    reset () {
      if (this.instance && isFunction(this.instance.reset)) {
        return this.instance.reset()
      }
    },
    update (newEndVal) {
      if (this.instance && isFunction(this.instance.update)) {
        return this.instance.update(newEndVal)
      }
    }
  },
  mounted () {
    if (this.isReady && !this.instance) this.init()
  },
  beforeDestroy () {
    this.uninit()
  },
  render (h) {
    // const that = this;
    return h('span', {})
  }
}

Vue.component('count-up', _CountUp)
