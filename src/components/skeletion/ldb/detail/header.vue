<template>
  <div class="ldb-header-skeletion">
    <div class="container header-container">
      <div class="header-left-skeletion">
        <div class="header-left-box-skeletion">
          <div class="header-left-container-skeletion">
            <div class="left-skeletion-container skeletion-breath">
              <h1></h1>
              <p></p>
              <p></p>
              <p></p>
              <div class="desc-skeletion">
                <p></p>
                <p></p>
                <p></p>
              </div>
              <p></p>
              <div class="left-bottom-skeletion">
                <div class="d-flex f-align-center lord-skeletion">
                  <p></p>
                  <div class="v-flex">
                    <p></p>
                    <p></p>
                  </div>
                </div>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-right-skeletion">
        <div>
          <!-- <svg>
            <use xlink:href="#icon-logo-image"/>
          </svg> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // ldb-header-skeletion
  .ldb-header-skeletion {
    padding-top: 120px;
    padding-bottom: 150px;
    background-color: #f8f8f8;
    &.dialog {
      padding-top: 60px;
      .header-left-container-skeletion {
        padding-top: 50px;
      }
      .header-left-box-skeletion {
        @include viewport-unit('width', 90vw, 0px, -1);
      }
    }
  }

  .header-container {
    position: relative;
    max-width: 1280px;
    z-index: 2;
  }

  .header-left-skeletion {
    position: absolute;
    left: 0;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translateY(-50%);
    z-index: 1;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      left: -25%;
      border-radius: 10px;
      transform: skew(-25deg) translateZ(0);
      background-color: $--skeletion-light;
      z-index: -1;
    }
  }
  .header-left-box-skeletion {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 1280px;
    height: 100%;
    @include viewport-unit('width', 100vw, 0px, 1);
  }
  .header-left-container-skeletion {
    padding: 90px 0 40px;
    margin-left: 50%;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    transform: translateX(-50%);
    box-sizing: border-box;
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .left-bottom-skeletion {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    max-width: 250px;
    >p {
      margin-top: 20px;
      height: 25px;
      width: 100px;
    }
  }
  .left-skeletion-container {
    position: relative;
    max-width: 350px;
    height: 100%;
    h1, p {
      background-color: $--skeletion-dark;
    }
    >h1 {
      height: 45px;
    }
    >p {
      &:nth-of-type(1) {
        margin-top: 10px;
        width: 100px;
        height: 20px;
        border-radius: 5px;
      }
      &:nth-of-type(2) {
        margin-top: 15px;
        height: 25px;
        width: 200px;
      }
      &:nth-of-type(3) {
        margin-top: 10px;
        height: 20px;
        width: 180px;
      }
      &:nth-of-type(4) {
        margin-top: 30px;
        height: 40px;
        width: 150px;
        border-radius: 5px;
      }
    }
    .desc-skeletion {
      max-width: 300px;
      margin-top: 30px;
      >p {
        margin-top: 10px;
        height: 15px;
        &:last-of-type {
          width: 40%;
        }
      }
    }
    .lord-skeletion {
      >p {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      >div {
        margin-left: 15px;
        >p {
          &:nth-of-type(1) {
            width: 50%;
            height: 20px;
          }
          &:nth-of-type(2) {
            width: 80%;
            margin-top: 5px;
            height: 18px;
          }
        }
      }
    }
  }

  .header-right-skeletion {
    margin-left: calc(100% - 30px);
    max-width: 980px;
    width: 80%;
    border: 15px $--skeletion-light solid;
    box-sizing: border-box;
    transform: translateX(-100%);
    >div {
      position: relative;
      padding-top: 63%;
      // background-color: $--skeletion-light;
      // >svg {
      //   position: absolute;
      //   left: 50%;
      //   top: 50%;
      //   width: 25%;
      //   transform: translate(-50%, -50%);
      //   fill: $--skeletion-dark;
      // }
    }
  }
</style>
