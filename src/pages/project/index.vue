<template>
  <div class="lordless-project-main">
    <div class="container project-main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lordless-project-main'
}
</script>

<style lang="scss" scoped>
  .lordless-project-main {
    padding-top: 90px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 90px);
  }
  .project-main-container {
    max-width: 1100px;;
  }
</style>
