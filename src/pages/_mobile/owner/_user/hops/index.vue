<template>
  <div class="lordless-hops-main">
    <mobile-hops :account="account"/>
  </div>
</template>

<script>
import MobileHops from '@/components/content/_mobile/hops'

import { publicMixins } from '@/mixins'
export default {
  name: 'lordless-hops-page',
  mixins: [ publicMixins ],
  components: {
    MobileHops
  }
}
</script>

<style>

</style>
