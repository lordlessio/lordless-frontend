<template>
  <div class="mobile-user-privileges">
    <transition name="ld-hide-fade" mode="out-in">
      <privileges-skeletion v-if="loading"/>
      <div v-else class="user-privileges-container">
        <div class="user-privileges-card">
          <div class="d-flex f-align-center user-privileges-title">
            <span class="inline-block line-height-0 privileges-title-icon">
              <svg>
                <use xlink:href="#icon-rocket"/>
              </svg>
            </span>
            <span class="TTFontBolder">Boosts</span>
          </div>
          <ul class="user-privileges-ul privileges-boosts-ul">
            <li v-for="(boost, index) of userBoosts" :key="index"
              class="d-flex f-align-start user-privileges-item privileges-boost-item"
              :class="{ 'privileges-none-item': !boost.number }"
              @click.stop="(!boost.number && boost.path) ? $router.push(boost.path) : null">
              <span class="inline-block line-height-0 privileges-item-icon">
                <svg>
                  <use :xlink:href="boost.number ? boost.icon : boost.grayIcon"/>
                </svg>
              </span>
              <div class="v-flex d-flex f-align-center privileges-item-cnt">
                <div class="v-flex privileges-item-cnt-container">
                  <h3 class="privileges-item-title">{{ boost.title }}</h3>
                  <p class="d-flex f-align-start privileges-item-desc">
                    <span class="inline-block line-height-0 privileges-checked-icon">
                      <svg>
                        <use xlink:href="#icon-bounty-chest-checked"/>
                      </svg>
                    </span>
                    <span class="v-flex">{{ boost.text }}</span>
                  </p>
                  <p class="TTFontBolder privileges-item-none">{{ boost.noneDesc }}</p>
                </div>
                <span v-if="boost.path" class="inline-block line-height-0 privileges-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </div>
            </li>
            <li class="TTFontBolder d-flex f-align-center user-privileges-item user-privileges-boost">
              <span class="v-flex">Total boost</span>
              <span class="privileges-boost-number">{{ userTotalBoost * 100 }}%</span>
            </li>
          </ul>
        </div>
        <div class="user-privileges-card">
          <div class="d-flex f-align-center user-privileges-title">
            <span class="inline-block line-height-0 privileges-title-icon">
              <svg>
                <use xlink:href="#icon-rocket"/>
              </svg>
            </span>
            <span class="TTFontBolder">Commissions</span>
          </div>
          <ul class="user-privileges-ul privileges-commission-ul">
            <li v-for="(commission, index) of userCommissions" :key="index"
              class="d-flex f-align-start user-privileges-item privileges-boost-item"
              :class="{ 'privileges-none-item': !commission.open }"
              @click.stop="(!commission.open && commission.path) ? $router.push(commission.path) : null">
              <span class="inline-block line-height-0 privileges-item-icon">
                <svg>
                  <use :xlink:href="commission.open ? commission.icon : commission.grayIcon"/>
                </svg>
              </span>
              <div class="v-flex d-flex f-align-center privileges-item-cnt">
                <div class="v-flex privileges-item-cnt-container">
                  <h3 class="privileges-item-title">{{ commission.title }}</h3>
                  <p class="d-flex f-align-start privileges-item-desc">
                    <span class="inline-block line-height-0 privileges-checked-icon">
                      <svg>
                        <use xlink:href="#icon-bounty-chest-checked"/>
                      </svg>
                    </span>
                    <span class="v-flex">{{ commission.text }}</span>
                  </p>
                  <p class="TTFontBolder privileges-item-none">{{ commission.noneDesc }}</p>
                </div>
                <span v-if="commission.path" class="inline-block line-height-0 privileges-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import PrivilegesSkeletion from '@/components/skeletion/_mobile/privileges'

import { getPlanBoosts } from 'api'
import { initLoadingMixins, planBoostsMixins, publicMixins } from '@/mixins'
export default {
  name: 'mobile-user-privileges-component',
  mixins: [ initLoadingMixins, planBoostsMixins, publicMixins ],
  data: () => {
    return {
      rendered: false,
      unOwnerPlanBoosts: null
    }
  },
  computed: {
    isOwner () {
      return this.$route.params.address === this.account
    },
    userBoosts () {
      const planBoosts = this.planBoosts
      if (!planBoosts.boosts) return []

      const infos = {
        referee: {
          icon: '#icon-color-certificate',
          grayIcon: '#icon-gray-certificate',
          title: 'Referee boost',
          noneDesc: 'Enter others invitation address and become a referee.',
          path: this.isOwner ? `/owner/referee?refer=${this.$route.path}` : null
        },
        recruit: {
          icon: '#icon-color-shield',
          grayIcon: '#icon-gray-shield',
          title: 'Recruit boost',
          noneDesc: 'Find a high popularity Tavern and get recruited.',
          path: this.isOwner ? `/taverns?refer=${this.$route.path}` : null
        },
        tavernkeep: {
          icon: '#icon-color-tavernkeep',
          grayIcon: '#icon-gray-tavernkeep',
          title: 'Tavernkeep boost',
          noneDesc: 'Purchase a Tavern and become a Tavernkeep.',
          path: this.isOwner ? `/taverns?refer=${this.$route.path}` : null
        }
      }
      return planBoosts.boosts.map((item) => {
        return Object.assign({}, item, infos[item.type], {
          text: `${item.dynamic && !item.number ? 'max' : ''} ${item.number || item.static || item.dynamic}% boost if you deposit`
        })
      })
    },

    userCommissions () {
      const planBoosts = this.planBoosts
      if (!planBoosts.commissions) return []

      const infos = {
        referrer: {
          icon: '#icon-color-diploma',
          grayIcon: '#icon-gray-diploma',
          title: 'Referral commission',
          noneDesc: 'Invite your friends to LORDLESS.',
          path: this.isOwner ? `/owner/referral/invitation?refer=${this.$route.path}` : null
        },
        recruit: {
          icon: '#icon-color-flag',
          grayIcon: '#icon-gray-flag',
          title: 'Recruit commission',
          noneDesc: 'Purchase a Tavern. Share it to your friends and get them recruited.',
          path: this.isOwner ? `/taverns?refer=${this.$route.path}` : null
        }
      }
      return planBoosts.commissions.map((item) => {
        return Object.assign({}, item, infos[item.type], {
          text: `${item.dynamic ? 'max' : ''} ${item.number || item.dynamic || item.static}% HOPS commission if your referee deposits`
        })
      })
    }
  },
  components: {
    PrivilegesSkeletion
  },
  methods: {
    async initPrivileges (user = this.$route.params.address) {
      this.loading = true
      try {
        const res = await getPlanBoosts({ user })
        if (res.code === 1000 && res.data) {
          this.unOwnerPlanBoosts = res.data
        }
      } catch (err) {}
      this.loading = false
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initPrivileges()
  },
  deactivated () {
    this.loading = true
  },
  async mounted () {
    this.$nextTick(() => {
      this.initPrivileges()
    })
  }
}
</script>

<style lang="scss" scoped>
  .mobile-user-privileges {

  }
  .user-privileges-container {
    padding: 64px 20px 50px;
  }
  .user-privileges-card {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .user-privileges-title {
    font-size: 18px;
    color: #555;
  }
  .privileges-title-icon {
    margin-right: 6px;
    width: 18px;
    height: 18px;
  }

  .user-privileges-ul {
    margin-top: 8px;
    padding: 0 20px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }
  .user-privileges-item {
    padding: 20px 0;
    &:not(:last-of-type) {
      border-bottom: 1px solid #ddd;
    }
  }
  .privileges-none-item {
    .privileges-item-title, .privileges-item-desc {
      color: #777;
    }
    .privileges-item-none {
      display: block;
    }
    .privileges-checked-icon {
      display: none;
    }
    .privileges-arrow-icon {
      display: inline-block;
    }
  }
  .user-privileges-boost {
    padding: 14px 0;
    font-size: 16px;
    color: #555;
  }
  .privileges-boost-number {
    color: $--main-color;
  }
  .privileges-item-icon {
    width: 42px;
    height: 42px;
  }
  .privileges-item-cnt {
    margin-left: 12px;
  }
  .privileges-item-title {
    margin-bottom: 6px;
    font-size: 16px;
    color: $--main-color;
  }
  .privileges-item-desc {
    font-size: 14px;
    color: #555;
  }
  .privileges-checked-icon {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    transform: translateY(1px);
  }
  .privileges-item-none {
    display: none;
    margin-top: 6px;
    font-size: 14px;
    color: $--main-color;
  }
  .privileges-arrow-icon {
    display: none;
    width: 16px;
    height: 16px;
    fill: #999;
  }
</style>
