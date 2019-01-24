<template>
  <div class="lordless-deposits-main">
    <mobile-owner-deposits :account="account"/>
  </div>
</template>

<script>
import MobileOwnerDeposits from '@/components/content/_mobile/plan/deposits'

import { publicMixins } from '@/mixins'
export default {
  name: 'lordless-deposits-page',
  mixins: [ publicMixins ],
  components: {
    MobileOwnerDeposits
  }
}
</script>

<style>

</style>
