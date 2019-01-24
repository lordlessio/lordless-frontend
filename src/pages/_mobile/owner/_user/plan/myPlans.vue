<template>
  <div class="lordless-myPlans-main">
    <mobile-my-plans :account="account"/>
  </div>
</template>

<script>
import MobileMyPlans from '@/components/content/_mobile/plan/myPlans'

import { publicMixins } from '@/mixins'
export default {
  name: 'lordless-myPlans-page',
  mixins: [ publicMixins ],
  components: {
    MobileMyPlans
  }
}
</script>

<style>

</style>
