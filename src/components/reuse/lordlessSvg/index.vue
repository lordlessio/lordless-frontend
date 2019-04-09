<template>
  <div style="width: 0;height: 0;overflow: hidden;visibility: hidden;">
    <gradient-svg/>
    <map-svg/>
    <icon-svg/>
    <user-svg/>
    <task-svg/>
    <wallets-svg/>
    <mobile-svg/>
    <market-svg/>
    <coin-svg/>
    <bounty-svg/>
    <hunter-task-svg/>
  </div>
</template>

<script>
import GradientSvg from './gradient'
import MapSvg from './map'
import IconSvg from './icon'
import UserSvg from './user'
import TaskSvg from './task'
import WalletsSvg from './wallets'
import MobileSvg from './mobile'
import MarketSvg from './market'
import CoinSvg from './coin'
import BountySvg from './bounty'
import HunterTaskSvg from './hunterTask'
export default {
  components: {
    GradientSvg,
    MapSvg,
    IconSvg,
    UserSvg,
    TaskSvg,
    WalletsSvg,
    MobileSvg,
    MarketSvg,
    CoinSvg,
    BountySvg,
    HunterTaskSvg
  },
  mounted () {
    document.body.appendChild(this.$el)
  }
}
</script>
