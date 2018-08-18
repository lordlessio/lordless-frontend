<template>
  <div class="ldb-candy-box">
    <div v-if="loading" class="ldb-candy-skeletion">
      <p class="skeletion-breath"></p>
      <div class="d-flex skeletion-breath">
        <p></p>
        <div class="v-flex">
          <p></p>
          <p></p>
        </div>
      </div>
    </div>
    <transition name="ld-hide-fade">
      <section v-show="!loading" class="ldb-candy-list">
        <p class="candy-list-title">
          <span class="TTFontBolder inline-block">Candy</span>
        </p>
        <ul>
          <li
            class="d-flex f-align-center ldb-candy-item"
            v-for="(item, index) of list"
            :key="index">
            <span class="inline-block ldb-candy-icon">
              <svg>
                <use xlink:href="#icon-ethereum"/>
              </svg>
            </span>
            <p class="v-flex d-flex col-flex">
              <span class="ldb-candy-name">
                <span class="text-upper">{{ item.symbol }}</span>
                  candy
              </span>
              <span>
                <span class="candy-current-num">3999</span>
                <span>/ {{ item.totalAp | formatDecimal({ len: 0 }) }}</span>
              </span>
            </p>
          </li>
        </ul>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ldb-candy-box {
  }

  // ldb-candy-skeletion
  .ldb-candy-skeletion {
    padding: 35px 25px 25px;
    border-radius: 5px;
    background-color: $--skeletion-light;
    >p {
      height: 25px;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-top: 25px;
      padding: 15px 20px;
      >p {
        width: 50px;
        height: 50px;
        border-radius: 100%;
        background-color: $--skeletion-dark;
      }
      >div {
        margin-left: 20px;
        >p {
          width: 60%;
          height: 15px;
          background-color: $--skeletion-dark;
          &:last-of-type {
            margin-top: 10px;
            width: 100%;
            height: 20px;
          }
        }
      }
    }
  }

  // ldb-candy-list
  .ldb-candy-list {
    padding: 35px 25px 25px;
    background-color: #f8f8f8;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
  }
  .candy-list-title {
    position: relative;
    height: 2px;
    background-color: #ddd;
    >span {
      padding-right: 10px;
      position: absolute;
      left: 0;
      top: calc(50% - 2px);
      font-size: 18px;
      background-color: #f8f8f8;
      transform: translateY(-50%);
    }
  }
  .ldb-candy-item {
    padding: 15px 20px;
    color: #999;
    background-color: #fff;
    border-radius: 5px;
    &:first-of-type {
      margin-top: 25px;
    }
    &:not(:first-of-type) {
      margin-top: 20px;
    }
    >p {
      margin-left: 20px;
    }
  }
  .ldb-candy-icon {
    padding: 10px;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background-color: $--text-blue-color;
    fill: #fff;
    box-sizing: border-box;
  }
  .candy-current-num {
    color: #555;
    font-size: 20px;
  }
</style>
