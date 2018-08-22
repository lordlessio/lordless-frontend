<template>
  <div class="ld-authorize-card" :class="{ 'active': active }">
    <div class="ld-authorize-container">
      <div class="d-flex col-flex f-auto-center ld-authorize-top">
        <svg>
          <use :xlink:href="`#${info.icon}`"/>
        </svg>
        <p>{{ info.title }}</p>
      </div>
      <div class="text-center ld-authorize-bottom">
        <p class="text-left">{{ info.desc }}</p>
        <ld-btn
          class="TTFontBolder ld-authorize-btn"
          theme="blue"
          inverse
          shadow
          :loading="!active && info.loading"
          :disabled="!active && info.loading"
          @click="$emit('click', info.symbol)">
          <span v-if="!active">Authorize</span>
          <span v-if="active" class="inline-block authorize-check-box">
            <svg>
              <use xlink:href="#icon-ok"/>
            </svg>
          </span>
        </ld-btn>
        <!-- <div v-if="!active && info.customize" class="ld-authorize-btn ld-customize-btn" :id="info.symbol">
          <p class="d-flex f-align-baseline customize-loading">loading <span class="line-height-1"><i class="el-icon-loading"></i></span></p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
export default {
  props: {
    active: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {}
  },
  components: {
    LdBtn
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-authorize-card {
    width: 100%;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .1);
    &.active {
      .ld-authorize-top {
        background-color: $--text-blue-color;
        fill: #fff;
        color: #fff;
        >svg {
          opacity: 1;
        }
      }
      .ld-authorize-bottom {
        >button {
          padding: 0;
          border-radius: 100%;
        }
      }
    }
  }
  .ld-authorize-container {

  }
  .ld-authorize-top {
    height: 230px;
    color: #999;
    fill: $--text-blue-color;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    >svg {
      height: 108px;
      opacity: .75;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
    }
  }

  .ld-authorize-bottom {
    position: relative;
    padding: 20px 35px 80px;
    >p {
      margin-bottom: 25px;
      color: #555;
      font-size: 18px;
      height: 50px;
    }
    >button {
      padding: 13px 18px;
    }
  }
  .ld-authorize-btn {
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translate(-50%, 50%);
  }
  // .ld-customize-btn {
  //   .customize-loading {
  //     position: absolute;
  //     left: 50%;
  //     top: 0;
  //     padding: 8px 15px;
  //     z-index: 0;
  //     transform: translateX(-50%);
  //   }
  //   > :nth-child(2) {
  //     position: relative;
  //     background-color: #fff;
  //     z-index: 1;
  //   }
  // }
  .authorize-check-box {
    padding: 10px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    >svg {
      width: 100%;
      height: 100%;
    }
  }
</style>
