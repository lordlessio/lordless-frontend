<template>
  <span class="ld-link-symbol" :class="{ 'hover-underline': underline }">
    <a v-if="href" :href="href" :target="{ '_blank': blank }"><slot></slot></a>
    <router-link v-else :to="link || jumpLink"><slot></slot></router-link>
  </span>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'link-symbol',
  props: {
    to: {
      type: String,
      default: null
    },
    underline: {
      type: Boolean,
      default: true
    },
    link: {
      type: String,
      default: null
    },
    href: {
      type: String,
      default: null
    },
    blank: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    jumpLink () {
      if (this.userInfo._id === this.to) return '/owner/info'
      return `/user/${this.to}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .ld-link-symbol {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    a {
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
    }
  }
</style>

