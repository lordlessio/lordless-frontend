<template>
  <el-dialog
    :visible.sync="dialog"
    custom-class="inline-block lordless-dialog message-dialog no-header transparent"
    width="100%"
    append-to-body
    center
    top="0"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false">
    <div class="lordless-message-box">
      <span
        @click.stop="closeDialog"
        class="inline-block line-height-1 lordless-message-close dark">
        <i class="el-icon-close"></i>
      </span>
      <h3 class="text-center">LORDLESS Term of Use</h3>
      <terms class="dialog"/>
      <div class="text-center terms-btns">
        <lordless-btn class="terms-btn" theme="blue" shadow inverse @click.native="agree">Agree</lordless-btn>
        <!-- <lordless-btn theme="red" shadow inverse>DisAgress</lordless-btn> -->
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Terms from '@/components/content/sign/terms.vue'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      dialog: false
    }
  },
  watch: {
    value (val) {
      this.dialog = val
    },
    dialog (val) {
      this.$emit('input', val)
    }
  },
  components: {
    Terms
  },
  methods: {
    closeDialog () {
      this.dialog = false
    },
    agree () {
      this.dialog = false
      this.$emit('agree')
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    // padding: 50px 50px 60px 50px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 800px;
    background: #fff;
    @include viewport-unit('width', 100vw, 40px);
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    >h3 {
      margin-bottom: 25px;
      color: #555;
    }
  }
  .terms-btn {
    margin-top: 25px;
    padding: 15px 25px;
  }
</style>
