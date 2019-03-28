<template>
  <div class="v-flex owner-referee-page">
    <h1 class="d-flex f-align-baseline text-cap owner-children-title margin-bottom">
      <span class="v-flex">Referee</span>
    </h1>
    <referee-page isWebsite/>
  </div>
</template>

<script>
import RefereePage from '@/components/content/_mobile/referee'
export default {
  name: 'website-owner-referee-page',
  components: {
    RefereePage
  }
}
</script>

<style>

</style>
