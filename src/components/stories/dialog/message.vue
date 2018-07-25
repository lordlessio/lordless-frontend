<template>
  <el-dialog
    :visible.sync="value"
    :custom-class="`inline-block lordless-dialog message-dialog ${lClass}`"
    :width="width"
    append-to-body
    center
    :top="top"
    :show-close="showClose"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close"
        :class="closeTheme">
        <i class="el-icon-close"></i>
      </span>
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    lClass: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    top: {
      type: String,
      default: '0'
    },
    showClose: {
      type: Boolean,
      default: false
    },
    closeTheme: {
      type: String,
      default: 'light'
    }
  },
  data: () => {
    return {
      authorizeDialog: true,

      // crowdsale options
      crowdsaleModel: false,
      crowdsaleInterval: null,
      crowdsaleTx: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    margin: -25px -25px -30px;
    width: inherit;
    height: inherit;
  }
  .lordless-message-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 34px;
    cursor: pointer;
    z-index: 9;
    [class^="el-icon-"] {
      font-weight: bold;
    }
    &.light {
      color: #fff;
    }
  }
</style>
