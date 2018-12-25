<template>
  <span class="inline-block line-height-0 lordless-candy-box" :class="{ 'linear': linear }">
    <span v-if="url && filterSvgSymbols.includes(symbol.toLocaleUpperCase())" class="inline-block line-height-0 candy-symbol-img">
      <img class="full-width" :alt="`${symbol} icon`" :src="ossOrigin + url"/>
    </span>
    <span v-else class="relative inline-block candy-svg-box">
      <span class="inline-block candy-symbol-svg">
        <svg>
          <use :xlink:href="`#coin-${symbol.toLocaleLowerCase()}`"/>
        </svg>
      </span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'lordless-candy-icon',
  props: {
    url: {
      type: String,
      default: ''
    },
    symbol: {
      type: String,
      default: ''
    },
    linear: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      filterSvgSymbols: ['BITE', 'LNM']
    }
  },
  computed: {
    ossOrigin () {
      return process.env.LDBICON_ORIGIN
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-candy-box {
    width: 100%;
    height: 100%;
    &.linear {
      .candy-symbol-svg {
        background-image: linear-gradient(-45deg, #00C0EB 0%, #0079FF 100%);
      }
    }
  }
  .candy-symbol-img {
    padding: 8%;
    width: 100%;
    border-radius: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .candy-svg-box {
    width: 100%;
    padding-top: 100%;
  }
  .candy-symbol-svg {
    padding: 22%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0079FF;
    fill: #fff;
    box-sizing: border-box;
    border-radius: 100%;
    overflow: hidden;
  }
</style>
