<template>
  <div class="projecct-promotions-skeletion">
    <div class="promotions-skeletion-container breath-skeletion">
      <div class="promotions-public-skeletion promotions-airdrops-skeletion">
        <p></p>
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
      <div class="promotions-public-skeletion promotions-candies-skeletion">
        <p></p>
        <ul>
          <li class="d-flex f-auto-center candies-table-thead">
            <p class="v-flex"></p>
          </li>
          <li
            v-for="item in 3" :key="item"
            class="d-flex f-auto-center candies-table-item">
            <p class="v-flex"></p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'project-promotions-skeletion'
}
</script>

<style lang="scss" scoped>
  .projecct-promotions-skeletion {
    padding-bottom: 48px;
    p {
      background-color: $--skeletion-dark;
    }
  }
  .promotions-skeletion-container {
    margin: 0 auto;
    max-width: 1100px;
  }

  .promotions-public-skeletion {
    margin-top: 48px;
    >p {
      margin-bottom: 24px;
      height: 30px;
      width: 280px;
      background-color: $--skeletion-light;
    }
  }

  // promotions-airdrops-skeletion
  .promotions-airdrops-skeletion {
  }
  .info-promotion-skeletion {
    // margin-left: 20px;
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

  // promotions-candies-skeletion
  .promotions-candies-skeletion {
    >ul {
      padding: 0 20px;
      background-color: $--skeletion-light;
      border-radius: 5px;
    }
  }
  .candies-table-item {
    height: 80px;
    border-top: 1px solid #dddddd80;
    >p {
      height: 20px;
    }
  }
  .candies-table-thead {
    height: 70px;
    >p {
      height: 16px;
    }
  }
</style>
