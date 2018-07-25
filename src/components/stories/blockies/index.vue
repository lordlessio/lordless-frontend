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
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data: () => {
    return {
      themes: {
        dark: {
          color: '#993399',
          bgcolor: '#ea4c88',
          spotcolor: '#fdadc7'
        },
        light: {
          color: '#fff',
          bgcolor: '#ea4c88',
          spotcolor: '#993399'
        }
      }
    }
  },
  methods: {
    init () {
      const { color, bgcolor, spotcolor } = this.themes[this.theme]
      const { seed, size, scale } = this
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
