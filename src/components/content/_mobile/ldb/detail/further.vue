<template>
  <div v-if="!loading" class="mobile-further-box" :class="{ 'lg-blur': blurs[0] }">
    <lordless-btn
      class="tavern-further-btn"
      theme="blue-linear"
      shadow>
        <a class="d-inline-flex f-align-center" :href="`https://opensea.io/assets/0x15820072729d045ec5232ba3bd060ec5df38e09a/${info.id}`" target="_blank">
          <span class="inline-block line-height-0 trading-opensea-icon">
            <svg>
              <use xlink:href="#icon-open-sea"/>
            </svg>
          </span>
          <span>Further trading on OpenSea</span>
        </a>
      </lordless-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('layout', [
      'blurs'
    ])
  },
  methods: {
    init () {
      document.body.appendChild(this.$el)
    },
    destroy () {
      this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
    }
  },
  activated () {
    this.init()
  },
  deactivated () {
    this.destroy()
  },
  beforeDestroy () {
    this.destroy()
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-further-box {
    // padding: 0 18px;
    position: fixed;
    // position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    z-index: 2199;
  }
  .tavern-further-btn {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-radius: 0;
  }
  .trading-opensea-icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    fill: #fff;
  }
</style>
