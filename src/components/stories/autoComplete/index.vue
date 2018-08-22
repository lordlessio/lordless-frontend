<template>
  <div class="auto-complete-box" :class="{ 'redius-top': isSelect, 'shadow': shadow }">
    <div class="auto-complete-container">
      <div class="complete-input">
        <el-autocomplete
          ref="ld_autocomplete"
          v-model="searchText"
          popper-class="lordless-autocomplete hide-arrow redius-bottom"
          :fetch-suggestions="handleSearch"
          :placeholder="placeholder"
          @select="handleSelect"
          @blur="inputBlur"
          @focus="inputFocus">
          <i
            class="el-input__icon ld-auto-icon color-secondary"
            :class="`el-icon-${searchText ? 'close' : 'search'}`"
            slot="suffix"
            @click="iconClick">
          </i>
          <div class="d-inline-flex f-auto-center complete-icon" slot="prefix">
            <svg>
              <use xlink:href="#icon-logo-image"/>
            </svg>
          </div>
          <template slot-scope="{ item }">
            <div class="d-flex f-align-center popper-trending" v-if="item.trending">
              <div class="v-flex d-flex col-flex popper-trending-item"
                v-for="(trend, index) of item.list"
                :key="index">
                <div class="popper-trending-container">
                  <div class="popper-trending-poster" @click.stop="$emit('trend', trend)">
                    <img-box
                      type="span"
                      absolute
                      :src="trend.ldbIcon.source.preview | reldbIcon('map')"></img-box>
                  </div>
                  <div class="d-flex f-align-center popper-trending-text">
                    <span>
                      <svg class="popper-trending-svg">
                        <use xlink:href="#icon-hot"/>
                      </svg>
                    </span>
                    <span class="popper-trending-name">{{ trend.name.zh }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex popper-record" :class="{ 'theme-gray': !item.id }" v-if="!item.trending">
              <div class="d-inline-flex f-auto-center popper-record-icon">
                <i :class="`el-icon-${item.id ? (item.history ? 'time' : 'location') : 'location-outline'} color-secondary`"></i>
              </div>
              <div class="v-flex popper-record-text">
                <span class="d-inline-block record-name">{{ item.name.zh }}</span>
                <span class="d-inline-block record-area">{{ item.address }}</span>
              </div>
            </div>
          </template>
        </el-autocomplete>
      </div>
      <!-- <div class="complete-search">
        <i class="el-icon-search"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
export default {
  props: {

    placeholder: {
      type: String,
      default: 'Search Somthing'
    },

    trendings: {
      type: Array,
      default: () => {
        return []
      }
    },

    shadow: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
      searchText: '',
      isSelect: false
    }
  },
  computed: {
    trendingLdbs () {
      return this.trendings.slice(0, 3)
    }
  },
  components: {
    ImgBox
  },
  methods: {
    inputBlur () {
      this.isSelect = false
    },

    inputFocus () {
      this.isSelect = true
    },

    handleSearch (string, cb) {
      this.$emit('handleSearch', string, cb)
    },

    handleSelect (item) {
      this.$emit('handleSelect', item)
    },

    iconClick () {
      if (this.searchText) this.searchText = ''
      else this.$refs.ld_autocomplete.focus()
      this.$emit('iconClick')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .auto-complete-box {
    width: inherit;
    height: inherit;
    padding: 8px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    &.redius-top {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    &.shadow {
      box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
    }
  }
  .auto-complete-container {
    /deep/ .el-autocomplete {
      width: 100%;
      .el-input {
        font-size: 16px;
      }
      .el-input__inner {
        padding-left: 63px;
        padding-right: 40px;
        border: none;
        outline: none;
      }
      .el-input__suffix {
        margin-right: 8px;
        font-size: 22px;
        font-weight: bold;
        color: #aaa;
      }
    }
  }
  .ld-auto-icon {
    cursor: pointer;
  }
  .complete-icon {
    margin-left: 5px;
    width: 40px;
    height: 40px;
    background-color: $--map-blue-pink-color;
    border-radius: 5px;
    >svg {
      fill: #fff;
      width: 30px;
      height: 30px;
    }
  }

  // popper-trending
  .popper-trending {
    padding: 0 10px;
    border-bottom: 1px solid #eee;
  }
  .popper-trending-container {
    padding: 0 10px 10px;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .popper-trending-poster {
    margin-bottom: 10px;
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
  .popper-trending-text {
    font-size: 14px;
    max-width: 96px;
    overflow: hidden;
  }
  .popper-trending-svg {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    fill: #FAD054;
  }
  .popper-trending-name {
    display: inline-block;
    width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // popper-record
  .popper-record {
    padding-right: 20px;
    &.theme-gray {
      .popper-record-icon {
        i {
          color: #aaa;
        }
      }
      .record-name {
        color: #aaa;
      }
    }
    &:hover {
      background-color: #f5f7fa;
    }
  }
  .popper-record-icon {
    padding: 0 15px;
    font-size: 20px;
  }
  .popper-record-text {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    .record-area {
      margin-left: 5px;
      color: #aaa;
      font-weight: bold;
    }
  }
</style>
