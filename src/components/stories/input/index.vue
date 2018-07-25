<template>
  <div class="lordless-input-box">
    <div class="lordless-input-container" :class="requiredTheme || theme">
      <label
        class="lordless-input-tip inline-block"
        :class="{ 'small': inputModel || focused }">{{ placeholder }}</label>
      <input
        v-model="inputModel"
        class="lordless-input"
        :type="type"
        :maxlength="maxlength"
        @focus="textFocus"
        @blur="textBlur"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
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
    required: {
      type: Boolean,
      default: false
    },
    regex: {
      type: RegExp,
      default: null
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
      if (!this.required || (this.required && this.inputModel.match(this.regex))) return true
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
  @import '@/assets/stylus/mixin/index.scss';
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
        color: $--text-third-color;
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
    font-size: 18px;
    height: inherit;
    line-height: inherit;
    color: inherit;
    transition: all .15s ease-in;
    transform-origin: 0 0;
    z-index: 0;
    &:not(.small) {
      color: $--text-third-color;
    }
    &.small {
      top: 0;
      transform: translateY(-16px) scale(.75);
      transition-timing-function: ease-out;
    }
  }
</style>
