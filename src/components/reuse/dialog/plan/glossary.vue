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
    <div class="text-center lordless-message-box theme-glossary dialog-plan-glossary-dialog">
      <p class="lordless-glossary">LORDLESS Glossary</p>
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h2>{{ info.title }}</h2>
      <p class="plan-glossary-desc">{{ info.desc }}</p>
      <p class="plan-glossary-btns">
        <lordless-btn class="plan-glossary-btn" theme="glossary" @click="$emit('input', false)">Got it</lordless-btn>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'lordless-plan-glossary-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'deposit'
    }
  },
  data: () => {
    return {
      dialogModel: false
    }
  },
  computed: {
    info () {
      const infos = {
        deposit: {
          title: 'LESS Term Deposits',
          desc: 'A LESS term deposit is a LESS investment held at LORDLESS. Your LESS is invested for an agreed rate of interest over a fixed amount of time, or term. In contrast to traditional term deposit in the bank, LORDLESS would pay the HOPS as advance interest.'
        },
        helm: {
          title: 'HELM',
          desc: 'HELM is acronym for "HELM = HOPS earned on every LESS per month". For example, 10 HELM means that 1 LESS can earn 10 HOPS per month. You can make more HOPS if you choose a LESS Term deposit with higher HELM.'
        }
      }
      console.log('this.type', this.type)
      return infos[this.type]
    }
  },
  watch: {
    value (val) {
      this.dialogModel = val
      this.$emit('blurs', val)
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
  .dialog-plan-glossary-dialog {
    // font-size: 16px;
    color: #fff;
    fill: #fff;
    @include fontSize(18px, 1.125);
    >h2 {
      font-size: 24px;
    }
  }
  .plan-glossary-desc {
    margin-top: 18px;
    font-size: 16px;
  }

  .plan-glossary-btns {
    margin-top: 36px;
  }
  .plan-glossary-btn {
    padding: 0 16px;
    height: 43px;
    line-height: 43px;
    @include fontSize(18px, 1.125);
  }
</style>
