<template>
  <el-select
    class="lordless-sort-select"
    popper-class="lordless-sort-options"
    v-model="model"
    @change="change">
    <span
      slot="suffix">
      <i class="el-icon el-icon-caret-top"></i>
    </span>
    <el-option
      v-for="sort in items"
      :key="sort.value"
      :label="sort.label"
      :value="sort.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    choose: {
      type: String,
      default: null
    },
    lg: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    console.log('--------- select', vm.value)
    return {
      model: vm.value || vm.items[0].value
    }
  },
  methods: {
    change (sort) {
      this.$emit('input', sort)
      this.$emit('change', sort)
    }
  }
}
</script>

<style lang="scss" scoped>

.lordless-sort-select {
  /deep/ .el-input__inner {
    width: 140px;
    height: 34px;
    line-height: 34px;
    font-family: $--font-TTNormsMedium;
    font-size: 16px;
    color: #fff;
    background-color: #4586FC;
    border-radius: 20px;
    border: none;
  }
  /deep/ .el-input {
    .el-select__caret {
      font-weight: bolder;
      color: #fff;
    }
  }
  /deep/ .el-input__icon {
    line-height: 100%;
  }
  &.sm {
    /deep/ .el-input__inner {
      width: 120px;
    }
  }
}
</style>
