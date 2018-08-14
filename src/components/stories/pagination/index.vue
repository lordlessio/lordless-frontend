<template>
  <div class="ld-pagination-box TTFontBold" :class="{ 'background': background }">
    <el-pagination
      class="d-flex f-align-center"
      :layout="layout"
      :total="total"
      :current-page.sync="currentPage"
      @size-change="$emit('sizeChange', $event)"
      @current-change="$emit('currentChange', $event)"
      @prev-click="$emit('prev', $event)"
      @next-click="$emit('next', $event)">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    background: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'prev,pager,next'
    },
    total: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
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
