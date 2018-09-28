<template>
  <div class="mobile-header-skeletion">
    <div class="header-skeletion-top"></div>
    <div class="header-skeletion-bottom">
      <div class="skeletion-bottom-container skeletion-breath">
        <h2></h2>
        <p></p>
        <p class="d-flex col-flex location">
          <span></span>
          <span></span>
        </p>
        <div class="skeletion-bottom-desc">
          <p></p>
          <p></p>
          <p></p>
        </div>
        <div class="skeletion-bottom-ap">
          <p></p>
          <p></p>
        </div>
        <div class="d-flex f-align-center skeletion-bottom-figcaption">
          <p class="v-flex d-flex f-align-center">
            <span class="avatar"></span>
            <span>
              <span></span>
              <span></span>
            </span>
          </p>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .mobile-header-skeletion {
    padding: 0 10px;
    span {
      display: block;
    }
  }
  .header-skeletion-top {
    margin: 0 -10px;
    padding-top: 100%;
    background-color: $--skeletion-light;
    // box-sizing: border-box;
    // border: 10px solid #fff;
  }
  .header-skeletion-bottom {
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
  }
  .skeletion-bottom-container {
    >h2 {
      width: 60%;
      height: 40px;
      background-color: $--skeletion-light;
    }
    >p {
      margin-top: 20px;
      width: 70%;
      height: 20px;
      background-color: $--skeletion-light;
      &.location {
        width: 60%;
        margin-top: 10px;
        height: auto;
        background-color: transparent;
      }
      >span {
        margin-top: 6px;
        height: 15px;
        background-color: $--skeletion-light;
      }
    }
  }
  .header-skeletion-bottom {
    margin-top: -40px;
    padding: 20px 20px 30px;
    background-color: #fff;
    border-radius: 5px;
  }
  .skeletion-bottom-desc {
    margin-top: 20px;
    >p {
      margin-top: 6px;
      height: 18px;
      background-color: $--skeletion-light;
      &:last-of-type {
        width: 60%;
      }
    }
  }
  .skeletion-bottom-ap {
    margin-top: 20px;
    >p {
      margin-top: 10px;
      background-color: $--skeletion-light;
      height: 30px;
      &:first-of-type {
        width: 100px;
        height: 20px;
      }
    }
  }
  .skeletion-bottom-figcaption {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
    >p {
      >span {
        &.avatar {
          margin-right: 10px;
          width: 50px;
          height: 50px;
          border-radius: 5px;
          background-color: $--skeletion-light;
        }
        >span {
          width: 60px;
          height: 18px;
          background-color: $--skeletion-light;
          &:not(:first-of-type) {
            width: 100px;
            margin-top: 6px;
          }
        }
      }
    }
    >span {
      margin-left: 50px;
      width: 130px;
      height: 40px;
      border-radius: 5px;
      background-color: $--skeletion-light;
    }
  }
</style>
