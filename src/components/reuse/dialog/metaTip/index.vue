<template>
  <el-dialog
    :visible.sync="tipModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent`"
    width="100%"
    append-to-body
    center
    top="-50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="lordless-message-box lordless-meta-dialog">
      <p class="d-flex f-align-center TTFontBold">
        <span class="v-flex">Handle your transaction in MetaMask please</span>
        <span class="meta-loading">
          <i class="el-icon-loading"></i>
        </span>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      tipModel: false
    }
  },
  watch: {
    value (val) {
      this.tipModel = val
      this.$emit('blurs', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .lordless-meta-dialog {
    font-size: 20px;
  }
  .meta-loading {
    font-size: 30px;
  }
</style>
