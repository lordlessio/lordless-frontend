<template>
  <div class="candy-aside-box" :class="{ 'mobile': isMobile, 'show': aside.show }">
    <div class="reward-aside-mask" @click="$emit('close')">
      <span class="inline-block aside-mask-close"></span>
    </div>
    <div class="candy-reward-aside">
      <transition name="ld-suspension-hide-fade">
        <div v-if="aside.show && loading" class="reward-aside-skeletion">
          <div class="aside-skeletion-container skeletion-breath">
            <h1></h1>
            <p></p>
            <div>
              <p></p>
              <p></p>
            </div>
            <div>
              <p></p>
              <p></p>
            </div>
            <div>
              <p></p>
              <p></p>
            </div>
            <div class="big">
              <p></p>
              <h2></h2>
            </div>
            <div class="big">
              <p></p>
              <p></p>
            </div>
            <div>
              <p></p>
              <p></p>
            </div>
            <div>
              <p></p>
              <div></div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="ld-hide-fade">
        <div v-if="!loading && aside.data && aside.show" class="reward-aside-container text-nowrap">
          <h1>+{{ (aside.lord ? aside.data.lord.reward.count : aside.data.executor.reward.count) | formatDecimal }} <span class="text-upper">{{ aside.data.reward.candy.symbol }}</span></h1>
          <lordless-btn theme="green" inverse class="text-cap reward-aside-btn">{{ aside.lord ? 'LORD' : 'Task' }} Reward</lordless-btn>
          <ul class="candy-aside-ul candy--value">
            <!-- <li>
              <p>Valued by <span class="text-upper">ETH</span></p>
              <p>0.000167 ETH</p>
            </li> -->
            <li>
              <p>Valued by <span class="text-upper">USD</span></p>
              <p>$ {{ ((aside.lord ? aside.data.lord.reward.count : aside.data.executor.reward.count) / aside.data.reward.candy.USD2TokenCount) | formatDecimal }}</p>
            </li>
            <li>
              <p>Date</p>
              <p>{{ aside.data.update_at | dateFormat }}</p>
            </li>
          </ul>
          <ul class="candy-aside-ul candy-ldb-related">
            <li>
              <p>Related Tavern</p>
              <p class="aside-big-name"><link-symbol :link="`/tavern/${aside.data.ldb.info._id}`">#{{ aside.data.ldb.info._id }}</link-symbol></p>
            </li>
            <li>
              <p>Name</p>
              <p>{{ aside.data.ldb.info.name.zh }}</p>
            </li>
            <li>
              <p>Coordinate</p>
              <p>{{ aside.data.ldb.info.chain.lng | transferCoords | sliceStr }}, {{ aside.data.ldb.info.chain.lat | transferCoords | sliceStr }}</p>
            </li>
            <li>
              <p>LORD</p>
              <p class="candy-aside-blockies">
                <lordless-blockies
                  :seed="aside.data.ldb.info.lord"
                  :scale="5"
                  jump
                  theme="light"
                  radius="5px"/>
              </p>
            </li>
          </ul>
          <ul class="candy-aside-ul candy-task-related">
            <li>
              <p>Related Task</p>
              <p class="aside-big-name"><link-symbol :link="`/task/${aside.data._id}`">#{{ aside.data._id }}</link-symbol></p>
            </li>
            <li>
              <p>Detail</p>
              <p>{{ aside.data.ldbTaskType.name }}</p>
            </li>
            <li>
              <p>Reward percentage</p>
              <p>{{ (aside.lord ? aside.data.lord.reward.percentage : aside.data.executor.reward.percentage) | formatDecimal({ len: 3, percentage: true }) }}%</p>
            </li>
            <li>
              <p>Employee</p>
              <p class="candy-aside-blockies">
                <lordless-blockies
                  :seed="aside.lord ? aside.data.lord.info : aside.data.executor.info"
                  :scale="5"
                  jump
                  theme="light"
                  radius="5px"/>
              </p>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { checkMobileMixins } from '@/mixins'
export default {
  mixins: [ checkMobileMixins ],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    aside: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    // 'aside.show' (val) {
    //   if (val) {
    //     document.
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  .reward-aside-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    visibility: hidden;
    transition: opacity .15s ease-out .15s, visibility 0s .3s;
    z-index: 0;
  }
  .aside-mask-close {
    position: absolute;
    top: 30px;
    left: 20px;
    width: 30px;
    height: 30px;
    &::before, &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 3px;
      background-color: #fff;
      transform-origin: 50% 50%;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  // candy-reward-aside
  .candy-aside-box {
    &.mobile {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      transition: z-index 0s .3s;
      overflow: hidden;
      .candy-reward-aside {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        z-index: 1;
        @include overflow();
      }
      .reward-aside-container {
        height: auto;
        min-height: 100%;
      }
    }
    &.show {
      .candy-reward-aside {
        padding-left: 30px;
        width: 350px;
        height: inherit;
        opacity: 1;
        visibility: visible;
      }
      .reward-aside-container {
        opacity: 1;
        visibility: visible;
        transition: all .3s .2s;
      }
      &.mobile {
        z-index: 999;
        transition: z-index 0s 0s;
        .candy-reward-aside {
          padding-left: 0;
          width: 300px;
          transition: all .3s, opacity 0s 0s, height 0s 0s;
        }
        .reward-aside-mask {
          opacity: 1;
          visibility: visible;
          transition: opacity .15s ease-in, visibility 0s 0s;
        }
      }
    }
  }
  .candy-reward-aside {
    position: relative;
    color: #fff;
    width: 0;
    height: 0;
    opacity: 0;
    visibility: hidden;
    overflow: hidden;
    transition: all .3s, height 0s 0s;
  }
  .reward-aside-container {
    position: relative;
    padding: 30px 20px 50px 40px;
    height: inherit;
    border-radius: 5px;
    background-image: linear-gradient(45deg, rgba(22, 34, 42, 1), rgba(58, 96, 115, 1));

    opacity: 0;
    background-color: transparent;
    transition: all .3s;
    z-index: 1;
    >h1 {
      font-family: $--font-TTNormsMedium;
      font-weight: normal;
      font-size: 38px;
      >span {
        font-size: 28px;
      }
    }
  }
  .reward-aside-btn {
    padding: 4px 6px;
    font-size: 12px;
  }
  .candy-aside-ul {
    @include margin('top', 25px, 1);
    >li {
      font-size: 16px;
      @include margin('top', 10px, 1);
      >p {
        &:first-of-type {
          font-size: 14px;
        }
      }
      .aside-big-name {
        font-size: 28px;
      }
    }
  }
  .candy-aside-blockies {
    width: 30px;
    height: 30px;
    @include margin('top', 6px, 1);
  }

</style>
