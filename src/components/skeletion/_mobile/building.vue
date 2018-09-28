<template>
  <div class="mobile-skeletion-building">
    <div class="d-flex f-align-stretch skeletion-building-container skeletion-breath">
      <p></p>
      <div class="v-flex d-flex col-flex f-justify-between">
        <p></p>
        <div>
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .mobile-skeletion-building {
    padding: 20px;
    background-color: $--skeletion-light;
  }
  .skeletion-building-container {
    >p {
      width: 120px;
      height: 120px;
      background-color: $--skeletion-dark;
      border-radius: 5px;
    }
    >div {
      margin-left: 20px;
      p {
        margin-top: 10px;
        height: 20px;
        background-color: $--skeletion-dark;
      }
    }
  }
</style>
