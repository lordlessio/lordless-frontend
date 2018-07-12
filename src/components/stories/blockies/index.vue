<template>
  <div
    ref="blockies"
    class="d-flex f-auto-center blockies"
    :style="`border-radius: ${radius}`"></div>
</template>

<script>
import Blockies from 'ethereum-blockies'
export default {
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    radius: {
      type: String,
      default: '100px'
    },
    seed: {
      type: String,
      default: 'lordless'
    },
    size: {
      type: Number,
      default: 6
    },
    scale: {
      type: Number,
      default: 6
    },
    color: {
      type: String,
      default: '#993399'
    },
    bgcolor: {
      type: String,
      default: '#ea4c88'
    },
    spotcolor: {
      type: String,
      default: '#fdadc7'
    }
  },
  data: () => {
    return {}
  },
  methods: {
    init () {
      const { seed, size, scale, color, bgcolor, spotcolor } = this
      const icon = Blockies.create({
        seed,
        size,
        scale,
        color,
        bgcolor,
        spotcolor
      })
      this.$refs.blockies.appendChild(icon)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.autoInit) this.init()
    })
  }
}
</script>

<style lang="scss" scoped>
  .blockies {
    position: relative;
    width: inherit;
    height: inherit;
    /deep/ canvas {
      border-radius: inherit;
    }
  }
</style>
