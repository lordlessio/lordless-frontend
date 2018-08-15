<template>
  <div v-dom-portal style="width: 0;height: 0;overflow: hidden;visibility: hidden;">
    <gradient-svg/>
    <map-svg/>
    <icon-svg/>
    <user-svg/>
  </div>
</template>

<script>
import GradientSvg from './gradient'
import MapSvg from './map'
import IconSvg from './icon'
import UserSvg from './user'
export default {
  components: {
    GradientSvg,
    MapSvg,
    IconSvg,
    UserSvg
  }
}
</script>
