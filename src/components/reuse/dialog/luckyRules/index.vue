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
    <div class="text-center lordless-message-box lordless-lucky-rules-dialog">
      <span
        @click.stop="$emit('input', false)"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h2>Lucky Blocks rules</h2>
      <p class="lucky-rules-slogan">Lucky Blocks is a little game with more fun for token promotion.</p>
      <ul class="text-left lucky-rules-desc">
        <li>Various types of bets match different winnings in a game.</li>
        <li>There is a certain probability of getting the winnings. It means that you can play a game to earn more tokens than the Windfall.</li>
      </ul>
      <div class="lucky-rules-contract">
        <p>The probability is onchain.</p>
        <h3>
          <a href="#" target="_blank">READ SMART CONTRACT</a>
        </h3>
      </div>
      <p class="lucky-rules-icon">GOOD LUCK!</p>
      <p class="lucky-rules-btns">
        <lordless-btn class="lucky-rules-btn" theme="dialog">Got it</lordless-btn>
      </p>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'lordless-lucky-rules',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      dialogModel: false
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
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .lordless-lucky-rules-dialog {
    // font-size: 16px;
    color: #fff;
    fill: #fff;
    @include fontSize(18px, 1.125);
    >h2 {
      font-size: 24px;
    }
  }
  .lucky-rules-slogan {
    margin-top: 12px;
  }
  .lucky-rules-desc {
    margin-top: 24px;
    >li {
      padding-left: 22px;
      position: relative;
      counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
      counter-increment: list-0;
      &::before {
        content: counter(list-0) ". ";
        position: absolute;
        left: 0;
        top: 0;
        width: 22px;
        height: 100%;
      }
    }
  }
  .lucky-rules-contract {
    margin-top: 24px;
    >h3 {
      margin-top: -4px;
      a {
        position: relative;
        font-size: 18px;
        color: #fff;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -3px;
          height: 3px;
          width: 100%;
          background-color: #fff;
        }
        // text-decoration: underline;
        // text-decoration-line:
      }
    }
  }

  .lucky-rules-icon {
    margin-top: 28px;
  }

  .lucky-rules-btns {
    margin-top: 36px;
  }
  .lucky-rules-btn {
    padding: 0 16px;
    height: 43px;
    line-height: 43px;
    @include fontSize(18px, 1.125);
  }
</style>
