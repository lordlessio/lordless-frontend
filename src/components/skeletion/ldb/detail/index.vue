<template>
  <transition name="ld-in-hide-fade">
    <div v-if="visible" class="ldb-detail-main">
      <header-skeletion :class="{ 'dialog': dialog }"></header-skeletion>
      <section class="ldb-detail-content">
        <div class="container md d-flex sm-col-flex">
          <div class="detail-cnt-left v-flex">
            <datas-skeletion></datas-skeletion>

            <task-now-skeletion></task-now-skeletion>

            <records-skeletion></records-skeletion>

          </div>
          <div class="detail-cnt-right">

            <approved-skeletion></approved-skeletion>

            <sale-skeletion></sale-skeletion>
          </div>
        </div>
      </section>
    </div>
  </transition>
</template>

<script>
import HeaderSkeletion from './tool/header'
import TaskNowSkeletion from './tool/taskNow'
import ApprovedSkeletion from './tool/approved'
import DatasSkeletion from './tool/datas'
import RecordsSkeletion from './tool/records'
import SaleSkeletion from './tool/sale'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    HeaderSkeletion,
    TaskNowSkeletion,
    ApprovedSkeletion,
    DatasSkeletion,
    RecordsSkeletion,
    SaleSkeletion
  }
}
</script>

<style lang="scss" scoped>
  .ldb-detail-main {
    background-color: #fff;
  }
  .ldb-detail-content {
    position: relative;
    transform: translateY(-80px);
    z-index: 2;
  }
  .detail-cnt-right {
    margin-left: 40px;
    width: 100%;
    max-width: 300px;
  }
</style>
