<template>
  <div class="ldb-header-box">
    <div v-if="loading" class="ldb-header-skeletion">
      <div class="relative">
        <div class="header-left-skeletion">
          <div class="header-left-box-skeletion" :class="{ 'dialog': dialog }">
            <div class="header-left-container-skeletion">
              <div class="left-skeletion-container">
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
    <transition name="ld-hide-fade">
      <section v-show="!loading" class="ldb-detail-header" :class="{ 'is-active': !loading}">
        <div class="absolute-full detail-header-mask"></div>
        <div class="container header-container">
          <div class="detail-header-left">
            <div class="header-left-container">
              <span class="header-left-mask"></span>
              <div class="header-left-cnt-box" :class="{ 'dialog': dialog }">
                <div class="header-left-cnt-container">
                  <figure class="header-left-cnt">
                    <h1>{{ info.name.zh }}</h1>
                    <p class="detail-ldb-tag">
                      <span class="inline-block">Buddhist & Church</span>
                    </p>
                    <p class="TTFontNormal detail-ldb-address">{{ info.address }}</p>
                    <p class="detail-ldb-location">{{ info.chain.lng | transferCoords | sliceStr}}, {{ info.chain.lat | transferCoords | sliceStr }}</p>
                    <p class="detail-ldb-desc">静安寺，又称静安古寺，位于上海市静安区，其历史相传最早可追溯至三国孙吴赤乌十年（247年），初名沪渎重玄寺。</p>
                    <ld-btn class="ldb-home-btn" theme="info" shadow inverse>Set as home</ld-btn>
                    <figcaption>
                      <div class="d-flex f-align-center detail-lord-box">
                        <blockies
                          :scale="6"
                          :seed="info.lord.address"></blockies>
                        <div class="v-flex d-flex col-flex f-justify-around detail-lord-info">
                          <p>{{ info.lord.nickName || 'LORDLESS' }}</p>
                          <p>{{ info.lord.address | splitAddress({ symbol: '******' }) }}</p>
                        </div>
                      </div>
                      <p class="detail-ldb-city">Shanghai China</p>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <div class="detail-header-right">
            <div class="detail-ldb-poster">
              <!-- <img src="http://lordless.oss-cn-hongkong.aliyuncs.com//lordlesstest/ldbicon/!-4-detail.jpg?x-oss-process=image/resize,w_1600"/> -->
              <ld-img absolute type="span" :src="info.ldbIcon.source.detail | reldbIcon('detail')"></ld-img>
            </div>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
import LdImg from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'
export default {
  props: {
    info: {
      type: Object,
      default: {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LdBtn,
    LdImg,
    Blockies
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  // ldb-header-skeletion
  .ldb-header-skeletion {
    padding-top: 100px;
    padding-bottom: 150px;
    background-color: #f8f8f8;
  }
  .header-left-skeletion {
    position: absolute;
    left: 0;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translateY(-50%);
    z-index: 1;
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
    &.dialog {
      @include viewport-unit('width', 90vw, 0px, -1);
    }
  }
  .header-left-container-skeletion {
    padding: 80px 0 40px;
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
        height: 25px;
        border-radius: 5px;
      }
      &:nth-of-type(2) {
        margin-top: 15px;
        height: 35px;
        width: 200px;
      }
      &:nth-of-type(3) {
        margin-top: 10px;
        height: 24px;
        width: 180px;
      }
      &:nth-of-type(4) {
        margin-top: 30px;
        height: 45px;
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
    margin-left: 20%;
    max-width: 930px;
    width: 80%;
    border: 15px $--skeletion-light solid;
    box-sizing: border-box;
    >div {
      position: relative;
      padding-top: 75%;
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

  /**
   *  ldb-detail-header  -- begin
   */
  .ldb-detail-header {
    position: relative;
    padding-top: 100px;
    padding-bottom: 150px;
    &.is-active {
      .detail-header-mask {
        animation: springMove .55s linear 1 forwards;
      }
      .detail-header-left {
        left: 0;
        opacity: 1;
        &::before {
          opacity: 1;
        }
      }
      .detail-header-right {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
  .detail-header-mask {
    // left: 65%;
    z-index: 1;
    // transition: left .55s spring;
    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 200%;
      height: 100%;
    }
    &::before {
      left: -100%;
      background-image: linear-gradient(to bottom, #96A8FD, #CDCAF6);
    }
    &::after {
      left: 60%;
      background-image: linear-gradient(to bottom, #00C0EB, #3588FD);
      transform: skew(-25deg) translateZ(0);
      z-index: 1;
    }
  }

  .header-container {
    position: relative;
    max-width: 1280px;
    overflow: hidden;
    z-index: 2;
  }

  // detail-header-left
  .detail-header-left {
    position: absolute;
    left: -100%;
    top: 50%;
    width: 50%;
    height: 90%;
    transform: translateY(-50%);
    z-index: 1;
    color: #fff;
    opacity: 0;
    transition: left .55s spring, opacity .55s spring;
    // background-blend-mode: soft-light;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      right: 25%;
      border-radius: 10px;
      transform: skew(-25deg) translateZ(0);
      background-color: #3588FD;
      z-index: -1;
      box-shadow: 13px 13px 30px 3px rgba(0, 0, 0, .35);
      opacity: 0;
      transition: opacity .3s spring .55s;
    }
  }
  .header-left-container {
    position: relative;
    // padding-top: 80px;
    // padding-bottom: 40px;
    // padding-left: 140px;
    height: 100%;
    overflow: hidden;
  }
  .header-left-mask {
    position: absolute;
    top: 0;
    left: -25%;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    transform: skew(-25deg) translateZ(0);
    background-color: #3588FD;
    overflow: hidden;
    &::after {
      content: '';
      position: absolute;
      top: -15%;
      left: -50%;
      width: 100%;
      padding-top: 100%;
      border-radius: 100%;
      background-image: linear-gradient(45deg, #3588FD, #00C0EB);
      // background-color: #3588FD;
      transform: skew(25deg) scale(1.4);
      mix-blend-mode: soft-light;
      overflow: hidden;
      z-index: 1;
    }
  }
  .header-left-cnt-box {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 1280px;
    height: 100%;
    @include viewport-unit('width', 100vw, 0px, 1);
    &.dialog {
      @include viewport-unit('width', 90vw, 0px, -1);
    }
  }
  .header-left-cnt-container {
    padding-top: 80px;
    padding-bottom: 40px;
    margin-left: 50%;
    width: 100%;
    max-width: 1000px;
    height: 100%;
    transform: translateX(-50%);
    box-sizing: border-box;
    @include padding('left', 20px, 1, -2);
    @include padding('right', 20px, 1, -2);
  }
  .header-left-cnt {
    position: relative;
    max-width: 400px;
    height: 100%;
    z-index: 2;
    >figcaption {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      max-width: 250px;
    }
  }
  .detail-ldb-tag {
    margin-top: 15px;
    >span {
      padding: 4px 10px;
      font-size: 14px;
      background-color: #4586FC;
      border-radius: 5px;
    }
  }
  .detail-ldb-address {
    margin-top: 10px;
    font-size: 20px;
  }
  .detail-ldb-location {
    font-size: 18px;
  }
  .detail-ldb-desc {
    margin-top: 25px;
    max-width: 300px;
    font-size: 14px;
  }
  .ldb-home-btn {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 18px;
    font-family: $--font-TTNormsMedium;
  }
  .detail-lord-box {

  }
  .detail-lord-info {
    margin-left: 10px;
    >p {
      font-size: 16px;
      &:nth-of-type(1) {
        font-size: 18px;
      }
    }
  }
  .detail-ldb-city {
    margin-top: 15px;
    font-size: 20px;
  }

  // detail-header-right
  .detail-header-right {
    position: relative;
    padding: 15px;
    margin-left: 20%;
    max-width: 930px;
    width: 80%;
    background-color: #fff;
    opacity: 0;
    transform: translateX(100%);
    transition: transform .55s spring .25s, opacity .55s spring .25s;
    // height: calc(930px / 4 * 3);
  }
  .detail-ldb-poster {
    position: relative;
    padding-top: 75%;
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // background-color: #fff;
    // padding: 15px;
    // height: 100%;
    >img {
      width: 100%;
    }
  }
  /**
   *  ldb-detail-header  -- end
   */
</style>
