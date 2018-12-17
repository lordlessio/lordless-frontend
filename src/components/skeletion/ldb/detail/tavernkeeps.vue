<template>
  <div class="tavern-keeps-skeletion">
    <div class="tavern-keeps-skeletion-container skeletion-breath">
      <div class="d-flex f-align-center keeps-skeletion-header">
        <p></p>
      </div>
      <ul class="keeps-list-skeletion">
        <li class="d-flex f-align-center keeps-skeletion-thead">
          <p></p>
        </li>
        <li v-for="item in 3" :key="item" class="d-flex f-align-center keeps-skeletion-item">
          <p></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tavern-keeps-skeletion'
}
</script>

<style lang="scss" scoped>
  .tavern-keeps-skeletion {

  }
  .tavern-keeps-skeletion-container {
    border-radius: 5px;
    background-color: $--skeletion-light;
    overflow: hidden;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .keeps-skeletion-header {
    padding: 0 36px;
    height: 64px;
    line-height: 64px;
    >p {
      width: 60%;
      height: 24px;
    }
  }
  .keeps-list-skeletion {
    padding: 0 36px;
  }
  .keeps-skeletion-thead, .keeps-skeletion-item {
    >p {
      width: 100%;
      height: 18px;
    }
  }
  .keeps-skeletion-thead {
    height: 56px;
    line-height: 56px;
  }
  .keeps-skeletion-item {
    height: 80px;
    line-height: 80px;
    border-top: 1px solid $--skeletion-border;
    box-sizing: border-box;
  }
</style>
