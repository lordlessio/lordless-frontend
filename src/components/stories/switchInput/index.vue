<template>
  <div class="d-flex f-align-center ld-switch-input" @click="toggleSwitch">
    <span>{{ items[active] ? items[active].label : '' }}</span>
    <span class="ld-switch-icon" :class="{ 'change': active === items.length - 1 }">
      <i class="el-icon el-icon-caret-top"></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data: (vm) => {
    let active = 0
    vm.items.map((item, index) => {
      if (item.value === vm.value) active = index
    })
    return {
      active
    }
  },
  methods: {
    toggleSwitch () {
      const items = this.items
      let active = this.active
      if (items.length <= (active + 1)) {
        active = 0
      } else {
        active = active + 1
      }
      this.$emit('input', items[active].value)
      this.active = active
    }
  },
  watch: {
    value (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>

  .ld-switch-input {
    padding: 0 10px 0 20px;
    height: 34px;
    line-height: 34px;
    color: #fff;
    background-color: $--text-blue-color;
    border-radius: 20px;
    cursor: pointer;
  }
  .ld-switch-icon {
    margin-left: 5px;
    transform: rotateZ(180deg);
    transition: transform .3s;
    &.change {
      transform: rotateZ(0);
    }
  }
</style>
