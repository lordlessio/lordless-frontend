<template>
  <div class="project-detail-skeletion">
    <div class="container skeletion-breath">
      <p class="project-breadcrumb-skeletion"></p>
      <div class="d-flex md-col-flex">
        <div class="md-order-1 v-flex project-info-skeletion">
          <p class="info-title-skeletion"></p>
          <ul class="info-intro-list">
            <li v-for="item in 4" :key="item" class="info-intro-item">
              <p></p>
              <div class="info-intro-desc">
                <p></p>
                <p></p>
                <p></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="info-promotion-skeletion">
          <div class="promotion-card-skeletion">
            <p class="promotion-card-title"></p>
            <div class="promotion-card-cnt">
              <p class="promotion-card-poster"></p>
              <p class="promotion-card-total"></p>
              <p class="promotion-card-progress"></p>
              <p class="promotion-card-claimed"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'project-info-skeletion'
}
</script>

<style lang="scss" scoped>
  .project-detail-skeletion {
    .container {
      max-width: 1100px;
    }
    p {
      background-color: $--skeletion-dark;
    }
  }
  .project-breadcrumb-skeletion {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 30%;
    height: 24px;
  }
  .project-info-skeletion {
    padding: 24px 18px;
    background-color: $--skeletion-light;
  }
  .info-title-skeletion {
    margin-bottom: 20px;
    width: 300px;
    height: 32px;
  }
  .info-intro-list {
    padding-top: 20px;
    border-top: 1px solid $--skeletion-dark;
  }
  .info-intro-item {
    >p {
      width: 200px;
      height: 20px;
    }
    &:not(:first-of-type) {
      margin-top: 30px;
    }
  }
  .info-intro-desc {
    margin-top: 10px;
    >p {
      width: 95%;
      margin-top: 4px;
      height: 18px;
      &:last-of-type {
        width: 45%;
      }
    }
  }

  .info-promotion-skeletion {
    margin-left: 20px;
    width: 376px;
  }
  .promotion-card-skeletion {
    padding: 20px;
    width: 376px;
    background-color: $--skeletion-light;
    border-radius: 5px;
  }
  .promotion-card-title {
    margin-bottom: 20px;
    width: 60%;
    height: 18px;
  }
  .promotion-card-cnt {
    padding-top: 20px;
    border-top: 1px solid $--skeletion-dark;
  }
  .promotion-card-poster {
    height: 128px;
    border-radius: 5px;
  }
  .promotion-card-total {
    margin-top: 25px;
    height: 18px;
  }
  .promotion-card-progress {
    margin-top: 10px;
    height: 28px;
    border-radius: 5px;
  }
  .promotion-card-claimed {
    margin-top: 10px;
    width: 200px;
    height: 35px;
    background-color: $--skeletion-dark;
  }
</style>
