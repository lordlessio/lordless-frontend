<template>
  <div class="alone-layer ld-pagination-box TTFontBold" :class="{ 'background': background }">
    <el-pagination
      class="d-flex f-align-center"
      :layout="layout"
      :total="total"
      :page-size="size"
      :current-page.sync="currentP"
      @size-change="$emit('sizeChange', $event)"
      @prev-click="$emit('prev', $event)"
      @next-click="$emit('next', $event)"/>
  </div>
</template>

<script>
export default {
  name: 'lordless-pagination',
  props: {
    scrollE: {
      default: null
    },
    scrollPE: {
      default: null
    },
    scrollOffset: {
      type: Number,
      default: 50
    },
    background: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'prev,pager,next'
    },
    size: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data: (vm) => {
    return {
      currentP: vm.currentPage
    }
  },
  watch: {
    currentP (val) {
      if (this.scrollE) {
        const top = this.scrollE.offsetTop - this.scrollOffset
        this.scrollPE ? this.scrollPE.scrollTop = top : document.documentElement.scrollTop = top
      }
      this.$emit('currentChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ld-pagination-box {
    display: inline-block;
    &.background {
      /deep/ .el-pagination {
        padding: 5px 0;
        background-color: #fff;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1);
        border-radius: 3px;
        font-weight: normal;
        @include padding('left', 15px, 1, -2);
        @include padding('right', 15px, 1, -2);
      }
      /deep/ .el-pager {
        li {
          &.active {
            color: #fff;
            background-color: #4E47D3;
          }
        }
      }
    }
    /deep/ .el-pager {
      li {
        padding: 0 5px;
        margin: 0;
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        border-radius: 5px;
      }
      .more {
        &::before {
          line-height: 32px;
        }
      }
    }
    /deep/ .el-pagination {
      .btn-next, .btn-prev {
        height: 32px;
        line-height: 32px;
        @include grid('display', none, -1);
        .el-icon {
          font-size: 16px;
        }
      }
      .btn-prev {
        padding-left: 10px;
        padding-right: 15px;
        margin-right: 15px;
        border-right: 1px solid #BBBBBB;
      }
      .btn-next {
        padding-right: 10px;
        padding-left: 15px;
        margin-left: 15px;
        border-left: 1px solid #BBBBBB;
      }
    }
  }
</style>
