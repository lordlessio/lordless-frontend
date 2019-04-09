<template>
  <div class="mobile-skeletion-hunter-task-box">
    <div class="skeletion-hunter-task-container skeletion-breath">
      <h3></h3>
      <ul class="skeletion-hunter-task-cnt">
        <li v-for="item in 2" :key="item" class="hunter-task-cnt-item">
          <h3></h3>
          <div class="cnt-item-info">
            <p></p>
            <h3></h3>
          </div>
          <div class="d-flex f-align-end">
            <div class="v-flex cnt-item-info">
              <p></p>
              <h3></h3>
            </div>
            <span class="inline-block hunter-task-btn"></span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-hunter-task-skeletion'
}
</script>

<style lang="scss" scoped>
  .mobile-skeletion-hunter-task-box {
  }
  .skeletion-hunter-task-container {
    padding: 20px 20px 30px;
    span, p, h3 {
      background-color: $--skeletion-dark;
    }
    >h3 {
      width: 40%;
      height: 24px;
    }
  }
  .hunter-task-cnt-item {
    margin-top: 16px;
    padding: 18px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    >h3 {
      width: 80%;
      height: 20px;
    }
  }
  .cnt-item-info {
    margin-top: 12px;
    >p {
      width: 40%;
      height: 16px;
    }
    >h3 {
      margin-top: 6px;
      width: 80%;
      height: 20px;
    }
  }
  .hunter-task-btn {
    width: 80px;
    height: 32px;
    border-radius: 5px;
  }
</style>
