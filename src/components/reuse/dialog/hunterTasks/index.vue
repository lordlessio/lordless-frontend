<template>
  <el-dialog
    :visible.sync="dialogModel"
    :custom-class="`inline-block lordless-dialog message-dialog center mobile-center no-header transparent`"
    width="100%"
    append-to-body
    center
    top="-20px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="text-center lordless-message-box dialog-hunter-task-dialog">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h2>{{ hunterTaskInfo.title }}</h2>
      <p class="hunter-task-desc">{{ hunterTaskInfo.desc }}</p>
      <p class="TTFontBolder inline-block hunter-task-type-title" v-if="dialogType === 0">{{ taskTitle }}</p>
      <p class="hunter-task-btns">
        <lordless-btn class="hunter-task-btn" theme="dialog" :loading="btnLoading" @click="confirm">{{ hunterTaskInfo.btnText }}</lordless-btn>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'lordless-hunter-task-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    taskTitle: {
      type: String,
      default: ''
    },
    dialogType: {
      type: Number,
      default: 0
    },
    btnLoading: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      dialogModel: false,
      typeInfos: {
        0: {
          title: 'Confirmation',
          desc: 'Are you sure to submit the task?',
          btnText: 'Yes'
        },
        1: {
          title: 'Congratulations',
          desc: 'You have completed the task.',
          btnText: 'Back to the task'
        },
        2: {
          title: 'Rejected',
          desc: 'You have not met the conditions for completing the task.',
          btnText: 'Okey'
        }
      }
    }
  },
  computed: {
    hunterTaskInfo () {
      return Object.assign({}, this.typeInfos[this.dialogType])
    }
  },
  watch: {
    value (val) {
      this.dialogModel = val
      this.$emit('blurs', val)
    }
  },
  methods: {
    confirm () {
      if (this.dialogType === 0) {
        this.$emit('confirm')
      } else this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    max-width: 480px;
    padding-top: 60px;
    padding-bottom: 50px;
  }
  .lordless-glossary {
    position: absolute;
    top: 18px;
    left: 18px;
    font-size: 12px;
    color: #fff;
  }
  .dialog-hunter-task-dialog {
    // font-size: 16px;
    color: #fff;
    fill: #fff;
    @include fontSize(18px, 1.125);
    >h2 {
      font-size: 24px;
    }
  }
  .hunter-task-desc {
    margin-top: 18px;
    font-size: 16px;
  }
  .hunter-task-type-title {
    margin-top: 6px;
    padding: 0 12px;
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    border: 3px dashed #fff;
    border-radius: 5px;
  }

  .hunter-task-btns {
    margin-top: 36px;
  }
  .hunter-task-btn {
    padding: 0 16px;
    height: 43px;
    line-height: 43px;
    @include fontSize(18px, 1.125);
  }
</style>
