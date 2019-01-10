<template>
  <div class="telegram-bind-page">
    <transition name="ld-hide-fade">
      <telegram-bind v-if="!userInfo.telegram.id"/>
      <telegram-bind-success v-else/>
    </transition>
  </div>
</template>

<script>
import TelegramBind from '@/components/content/_mobile/bind/telegram'
import TelegramBindSuccess from '@/components/content/_mobile/bind/telegram/success'

import { scrollTo } from 'utils/tool'

import { mapState } from 'vuex'
export default {
  name: 'lordless-telegram-bind-page',
  components: {
    TelegramBind,
    TelegramBindSuccess
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  watch: {
    'userInfo.telegram' (val) {
      if (val.id) {
        scrollTo(0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .telegram-bind-page {
    // padding-bottom: -50px;
  }
</style>
