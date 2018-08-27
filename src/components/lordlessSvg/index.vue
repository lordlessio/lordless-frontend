<template>
  <div style="width: 0;height: 0;overflow: hidden;visibility: hidden;">
    <gradient-svg/>
    <map-svg/>
    <icon-svg/>
    <user-svg/>
    <task-svg/>
  </div>
</template>

<script>
import GradientSvg from './gradient'
import MapSvg from './map'
import IconSvg from './icon'
import UserSvg from './user'
import TaskSvg from './task'
export default {
  components: {
    GradientSvg,
    MapSvg,
    IconSvg,
    UserSvg,
    TaskSvg
  },
  mounted () {
    document.body.appendChild(this.$el)
  }
}
</script>
