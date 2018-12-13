<template>
  <div class="authorize-loading-box">
    <div class="text-center d-flex col-flex f-auto-center authorize-loading-container">
      <h2>Checking web3 ...<p class="authorize-loading-icon"><i class="el-icon-loading"></i></p></h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authorize-loading'
}
</script>

<style lang="scss" scoped>
  .authorize-loading-container {
    // min-height: 220px;
    padding: 35px 0;
    >h2 {
      font-size: 24px;
    }
  }
  .authorize-loading-icon {
    margin-top: 20px;
  }
</style>
