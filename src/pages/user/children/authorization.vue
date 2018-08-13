<template>
  <div class="d-flex user-authorization-box">
    <div class="d-flex v-flex col-flex user-authorization-container">
      <h1 class="text-cap user-authorization-title">authorization</h1>
      <div class="user-authorization-cnt">
        <el-row :gutter="20" class="authorization-cnt-container">
          <el-col
            :xs="24" :sm="12" :lg="8"
            class="authorization-item"
            v-for="(authorization, index) of authorizations"
            :key="index">
            <authorization-card
              :active="models[authorization.symbol]"
              :info="authorization"
              @click="authorizeFunc($event, index)">
            </authorization-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import AuthorizationCard from '@/components/reuse/card/authorization'
export default {
  data: (vm) => {
    return {
      authorizations: [
        {
          symbol: 'marketplace',
          title: 'Marketplace contract',
          desc: 'Authorized the marketplace contract to operate LDB',
          icon: 'icon-marketplace'
        }, {
          symbol: 'telegram',
          title: 'Telegram',
          desc: 'Authorize the Telegram to apply tasks',
          icon: 'icon-telegram'
        }
      ]
    }
  },
  computed: {
    user () {
      console.log('this.$parent.$children', this.$parent.$children)
      return this.$parent.$children[0].userInfo
    },
    models () {
      const marketplace = this.$root.$children[0].isCrowdsaleApproved
      return { marketplace }
    }
  },
  components: {
    AuthorizationCard
  },
  methods: {
    authorizeFunc (e, index) {
      console.log('---', index)
      this.$set(this.models, index, true)
      console.log('models', this.models)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .user-authorization-box {
    font-size: 16px;
    @include padding(-1, 30px, 1);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      position: static;
      overflow: initial;
    }
    /deep/ .el-tabs__item {
      font-size: 18px;
      color: #999;
      &.is-active {
        color: inherit;
      }
    }
  }
  .user-authorization-title {
    font-size: 36px;
    color: #999;
  }
  .user-authorization-cnt {
    margin-top: 35px;
  }
  .authorization-cnt-container {

  }
  .authorization-item {
    @include margin('top', 25px, 1, -2);
  }
</style>
