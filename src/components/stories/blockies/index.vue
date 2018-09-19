<template>
  <div
    ref="blockies"
    class="d-flex f-auto-center blockies"
    :class="{ 'cursor-pointer': jump }"
    :style="`border-radius: ${radius}`"
    @click="jumpFunc">
  </div>
</template>

<script>
import Blockies from 'ethereum-blockies'
import { mapState } from 'vuex'
export default {
  name: 'lordless-blockies',
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    radius: {
      type: String,
      default: '20%'
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
    },
    jump: {
      type: Boolean,
      default: false
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
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  watch: {
    seed (val) {
      if (val) this.reset()
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
    },
    reset () {
      this.$refs.blockies.removeChild(this.$refs.blockies.firstChild)
      this.init()
    },
    jumpFunc () {
      if (!this.jump) return
      console.log('--- jump', this.seed)
      if (this.userInfo._id && this.userInfo._id.toLowerCase() === this.seed.toLowerCase()) {
        this.$router.push('/owner/info')
      } else {
        this.$router.push(`/user/${this.seed}`)
      }
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
