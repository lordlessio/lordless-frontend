<template>
  <div class="mobile-quests-page">
    <mobile-quests/>
  </div>
</template>

<script>
import MobileQuests from '@/components/content/_mobile/quests'
import { activatedMixins } from '@/mixins'
export default {
  name: 'mobile-quests-page',
  mixins: [activatedMixins],
  components: {
    MobileQuests
  },
  beforeUpdate () {
    console.log('beforeUpdate')
  },
  beforeCreate () {
    console.log('beforeCreate')
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  }
}
</script>

<style lang="scss" scoped>

</style>
