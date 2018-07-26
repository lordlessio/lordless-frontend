<template>
  <el-container class="ld-user-box">
    <el-aside width="200px" class="ld-user-navgation">Aside</el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main class="ld-user-content">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  methods: {
    created () {
      this[mutationTypes.LAYOUT_SET_HEADER_OPTIONS]({ showLogo: false })
    },
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_HEADER_OPTIONS
    ])
  }
}
</script>

<style>

</style>
