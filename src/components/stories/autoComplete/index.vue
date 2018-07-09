<template>
  <div :class="`auto-complete-box ${isSelect ? 'redius-top' : ''}`">
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
              <use xlink:href="static/svg/icon.svg#icon-logo-image"/>
            </svg>
          </div>
          <template slot-scope="{ item }">
            <div class="popper-trending" v-if="false">
              <div class="d-flex popper-record-icon">
                <span>
                  <i :class="`el-icon-${item._id ? 'location' : 'location-outline'} color-secondary`"></i>
                </span>
              </div>
              <div class="popper-record-text">
                <span>{{ item.name }}</span>
              </div>
            </div>
            <div class="d-flex popper-record" :class="item._id ? '' : 'theme-gray'" v-if="true">
              <div class="d-inline-flex f-auto-center popper-record-icon">
                <i :class="`el-icon-${item._id ? (item.history ? 'time' : 'location') : 'location-outline'} color-secondary`"></i>
              </div>
              <div class="v-flex popper-record-text">
                <span class="d-inline-block record-name">{{ item.name.zh.split(',')[0] }}</span>
                <span class="d-inline-block record-area">{{ item.area }}</span>
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
export default {
  props: {

    placeholder: {
      type: String,
      default: 'Search Somthing'
    }
  },
  data: () => {
    return {
      searchText: '',
      isSelect: false
    }
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
    background-color: #776AFF;
    border-radius: 5px;
    >svg {
      fill: #fff;
      width: 30px;
      height: 30px;
    }
  }

  // popper-trending
  .popper-trending {
    padding-bottom: 1px dashed #aaa;
  }

  // popper-record
  .popper-record {
    margin-left: -20px;
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
