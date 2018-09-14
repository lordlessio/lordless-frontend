<template>
  <div class="ld-header-tip">
    <div class="d-flex f-align-center header-tip-container">
      <lordless-btn v-if="market" class="header-tip-btn" theme="blue-purple" inverse shadow @click.native="$router.push('/market')">Marketplace</lordless-btn>
      <user-avatar :tip="true" :leftInfo="leftInfo"></user-avatar>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/reuse/userAvatar'
export default {
  props: {
    market: {
      type: Boolean,
      default: true
    },
    leftInfo: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UserAvatar
  }
}
</script>

<style lang="scss" scoped>
  .ld-header-tip {
    border-radius: 5px;
    box-shadow: 1px 3px 8px 3px rgba(0,0,0,0.25);
  }
  .header-tip-container {
    padding: 15px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  .header-tip-btn {
    margin-right: 20px;
    padding: 20px 25px;
  }
</style>
