<template>
  <div class="lordless-input-box">
    <div class="lordless-input-container" :class="requiredTheme || theme">
      <label
        class="lordless-input-tip inline-block"
        :class="{ 'small': inputModel || focused || inputModel === 0 }"><span v-if="!regexError || isRequired">{{ placeholder }}</span><span v-if="!isRequired && regexError">{{ regexError }}</span></label>
      <input
        v-model="inputModel"
        aria-label="input text"
        class="lordless-input"
        :type="type"
        :maxlength="maxlength"
        :pattern="pattern"
        @focus="textFocus"
        @blur="textBlur"/>
      <span v-if="symbol" class="lordless-input-symbol">{{ symbol }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    number: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'default'
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    maxlength: {
      type: Number,
      default: -1
    },
    pattern: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    regex: {
      type: RegExp,
      default: null
    },
    regexError: {
      type: String,
      default: ''
    },
    symbol: {
      type: String,
      default: ''
    }
  },
  data: (vm) => {
    return {
      inputModel: vm.value,
      focused: false
    }
  },
  computed: {
    isRequired () {
      if (!this.required || (this.required && this.regex.test(this.inputModel + ''))) return true
      return false
    },

    requiredTheme () {
      if (!this.required || !this.inputModel) return null
      if (this.isRequired) return 'green'
      return 'red'
    }
  },
  methods: {
    textFocus () {
      this.focused = true
      this.$emit('focus', { model: this.inputModel, required: this.isRequired })
    },
    textBlur () {
      this.focused = false
      this.$emit('blur', { model: this.inputModel, required: this.isRequired })
    }
  },
  watch: {
    inputModel (val) {
      this.$emit('change', { model: val, required: this.isRequired })
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>

  .lordless-input-box {
    width: inherit;
    height: inherit;
  }
  .lordless-input-container {
    margin-top: 16px;
    position: relative;
    border-bottom: 1px solid;
    border-bottom-color: inherit;
    &.default {
      .lordless-input-tip {
        color: inherit;
        &.small {
          color: #fff;
        }
      }
      border-bottom-color: inherit;
    }
    &.red {
      .lordless-input-tip {
        color: $--text-red-color;
      }
      border-bottom-color: $--text-red-color;
    }
    &.green {
      .lordless-input-tip {
        color: $--text-green-color;
      }
      border-bottom-color: $--text-green-color;
    }
  }
  .lordless-input {
    position: relative;
    z-index: 1;
  }
  .lordless-input-tip {
    position: absolute;
    top: 0;
    left: 0;
    font-size: inherit;
    height: inherit;
    line-height: inherit;
    color: inherit;
    transition: all .15s ease-in;
    transform-origin: 0 0;
    z-index: 0;
    // @include fontSize(18px, 1.125);
    &:not(.small) {
      color: inherit;
    }
    &.small {
      top: 0;
      transform: translateY(-16px) scale(.75);
      transition-timing-function: ease-out;
    }
  }
  .lordless-input-symbol {
    position: absolute;
    right: 3px;
    bottom: 3px;
    font-size: 14px;
    color: #f8f8f8;
  }
</style>
