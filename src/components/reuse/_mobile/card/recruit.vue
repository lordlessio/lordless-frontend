<template>
  <div class="recruit-card-box">
    <div class="d-flex f-align-start recruit-card-container">
      <lordless-blockies :scale="5" :seed="info.sender" jump/>
      <div class="recruit-card-cnt">
        <div class="v-flex recruit-info-box">
          <p class="text-break recruit-user-address">{{ info.sender }}</p>
          <p class="recruit-info-date">{{ new Date(info.created_at) | dateFormat('HH:mm MMM DD YYYY') }}</p>
        </div>
        <!-- <p class="TTFontBolder recruit-hops-count">+{{ 9000 }}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lordless-recruit-card',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
  .recruit-card-box {

  }
  .recruit-card-container {
    padding-top: 20px;
    padding-left: 20px;
    line-height: 1.2;
    background-color: #fff;
  }
  .recruit-token-icon {
    padding: 6px;
    width: 32px;
    height: 32px;
    border-radius: 5px;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    box-sizing: border-box;
  }
  .recruit-card-cnt {
    margin-left: 18px;
    padding-right: 20px;
    padding-bottom: 20px;
    &:not(:last-of-type) {
      border-bottom: 1px solid #ddd;
    }
  }
  .recruit-info-box {
    // margin-left: 18px;
  }
  .recruit-user-address {
    font-size: 14px;
    color: $--main-color;
  }
  .recruit-info-date {
    margin-top: 2px;
    font-size: 14px;
    color: #bbb;
  }
  // .recruit-hops-count {
  //   color: $--main-blue-color;
  // }
</style>
