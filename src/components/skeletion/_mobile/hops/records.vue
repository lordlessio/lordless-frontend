<template>
  <div class="mobile-skeletion-records-box">
    <div class="skeletion-records-container skeletion-breath">
      <p></p>
      <ul class="skeletion-records-box">
        <li
          v-for="item in 3" :key="item"
          class="d-flex f-align-center skeletion-records-item">
          <span class="inline-block"></span>
          <div class="v-flex records-item-right">
            <h3></h3>
            <p></p>
            <p></p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-hops-records-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-records-box {

  }
  .skeletion-records-container {
    padding-top: 16px;
    >p {
      margin-left: 16px;
      width: 150px;
      height: 22px;
      background-color: $--skeletion-dark;
    }
  }
  .skeletion-records-box {
    margin-top: 10px;
  }
  .skeletion-records-item {
    padding: 0 15px;
    background-color: $--skeletion-light;
    >span {
      width: 36px;
      height: 36px;
      border-radius: 5px;
      background-color: $--skeletion-dark;
    }
    &:not(:first-of-type) {
      .records-item-right {
        border-top: 1px solid $--skeletion-dark;
      }
    }
  }
  .records-item-right {
    margin-left: 16px;
    padding: 20px 0;
    >h3 {
      margin-bottom: 8px;
      width: 50%;
      height: 20px;
      background-color: $--skeletion-dark;
    }
    >p {
      margin-top: 4px;
      height: 14px;
      background-color: $--skeletion-dark;
    }
  }
</style>
