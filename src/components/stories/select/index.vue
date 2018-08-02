<template>
  <div class="ld-select-box">
    <ul>
      <li class="ld-active-option"></li>
      <li
        v-for="(item, index) of list"
        :key="index"
        @click="choose">
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    choose: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      active: ''
    }
  }
}
</script>

<style>

</style>
