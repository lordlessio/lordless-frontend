<template>
  <div class="d-flex f-align-center project-main-breadcrumb">
    <span class="project-breadcrumb-first project-breadcrumb-item" :class="{ 'hover-pointer': info }" @click.stop="choosePromotions">Promotions</span>
    <p v-if="info" class="project-breadcrumb-children">
      <span class="inline-block project-breadcrumb-icon">
        <svg>
          <use xlink:href="#icon-arrow-line-right"/>
        </svg>
      </span>
      <span>{{ info.name }}({{ info.symbol }})</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'promotions-breadcrumb',
  props: {
    info: {
      type: Object,
      default: null
    }
  },
  methods: {
    choosePromotions () {
      if (!this.info) return
      this.$router.push('/project/promotions')
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-main-breadcrumb {
    padding: 24px 0;
    font-size: 18px;
    color: #777;
  }
  .project-breadcrumb-first {

  }
  .project-breadcrumb-children {
    margin-left: 10px;
  }
  .project-breadcrumb-icon {
    margin-right: 5px;
    width: 10px;
    height: 10px;
    fill: #999;
  }
  .project-breadcrumb-item {
    &.hover-pointer {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
