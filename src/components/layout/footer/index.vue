<template>
  <footer class="ld-footer" :class="theme" v-if="show">
    <div class="container md">
      <div class="d-flex sm-col-flex sm-text-center footer-top">
        <div class="v-flex sm-col-flex">
          <div class="d-flex sm-col-flex">
            <div class="v-flex ld-footer-item">
              <ul class="ld-footer-ul footer-lordless-ul">
                <li>
                  <strong class="relative footer-lordless-title">LORDLESS</strong>
                </li>
                <li>
                  <router-link to="/map">Map</router-link>
                </li>
                <li>
                  <router-link to="/market">Marketplace</router-link>
                </li>
                <li>
                  <span class="cursor-pointer" @click.stop="jumpHome">Home</span>
                </li>
                <!-- <li>
                  <a href="http://lordless.io/team" target="_blank">Team</a>
                </li> -->
                <li>
                  <a href="http://lordless.io/#ROADMAP" target="_blank">Roadmap</a>
                </li>
                <!-- <li>
                  <a href="http://lordless.io/airdrop" target="_blank">Airdrop plan</a>
                </li> -->
              </ul>
            </div>
            <div class="v-flex ld-footer-item" v-if="!isMobile">
              <ul class="ld-footer-ul footer-lordless-user">
                <li>
                  <strong>User</strong>
                </li>
                <li>
                  <router-link to="/owner/info">Overview</router-link>
                </li>
                <li>
                  <router-link to="/owner/candy">Candy</router-link>
                </li>
                <li>
                  <router-link to="/owner/task">Tasks</router-link>
                </li>
                <li>
                  <router-link to="/owner/taverns">Taverns</router-link>
                </li>
                <li>
                  <router-link to="/owner/authorization">Authorization</router-link>
                </li>
                <li>
                  <router-link to="/owner/activity">Activity</router-link>
                </li>
              </ul>
            </div>
            <div class="v-flex ld-footer-item">
              <ul class="ld-footer-ul footer-lordless-about">
                <li>
                  <strong>About</strong>
                </li>
                <li>
                  <a href="http://lordless.io/team" target="_blank">Team</a>
                </li>
                <li>
                  <router-link to="/guide">Guide</router-link>
                </li>
                <li>
                  <a href="https://github.com/lordlessio/game-contracts/wiki/FAQ" target="_blank">
                    FAQs
                  </a>
                </li>
                <li>
                  <router-link to="/terms">Terms</router-link>
                </li>
                <li>
                  <router-link to="/privacy">Privacy policy</router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="d-flex sm-col-flex">
            <div class="v-flex ld-footer-item">
              <ul class="ld-footer-ul footer-whitepaper-ul">
                <li>
                  <strong>Whitepaper</strong>
                </li>
                <li>
                  <a target="_blank" href="http://lordless.io/whitepaper-en.pdf">English</a>
                </li>
                <li>
                  <a target="_blank" href="http://lordless.io/whitepaper-cn.pdf">中文</a>
                </li>
              </ul>
            </div>
            <div class="v-flex ld-footer-item"></div>
            <div class="v-flex ld-footer-item"></div>
          </div>
        </div>
        <div class="ld-footer-letter">
          <strong>Newsletter</strong>
          <p>The latest LORDLESS news, articles, and resources, sent straight to your inbox every month.</p>
          <a href="http://eepurl.com/dsLYcr" target="_blank" class="d-flex footer-subscribe-eamil">
            <p class="v-flex footer-subscribe-input">
              <input aria-label="subscribe email" disabled type="text" placeholder="Email me when it's ready"/>
            </p>
            <span class="TTFontBolder inline-block">Subscribe</span>
          </a>
          <div class="footer-link-icons">
            <a class="inline-block" href="https://t.me/lordlessio" target="_blank">
              <svg>
                <use xlink:href="#icon-telegram"/>
              </svg>
            </a>
            <a class="inline-block" href="https://twitter.com/LordLessIo" target="_blank">
              <svg>
                <use xlink:href="#icon-twitter"/>
              </svg>
            </a>
            <a class="inline-block" href="https://github.com/lordlessio" target="_blank">
              <svg>
                <use xlink:href="#icon-github"/>
              </svg>
            </a>
            <a class="inline-block" href="https://medium.com/@LordLessIo" target="_blank">
              <svg>
                <use xlink:href="#icon-medium"/>
              </svg>
            </a>
            <a class="inline-block" href="mailto:eury@lordless.io" target="_blank">
              <svg>
                <use xlink:href="#icon-email"/>
              </svg>
            </a>
          </div>
          <p class="footer-copyright">Copyright © 2017 - 2018 LORDLESS. All right reserved</p>
        </div>
      </div>
      <p class="text-center ld-footer-term">Term of use & Privacy policy</p>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {

    // 是否显示
    show: {
      type: Boolean,
      default: true
    },

    // footer 主题
    theme: {
      type: String,
      default: 'dark'
    }
  },
  computed: {
    ...mapState('user', [
      'userHome'
    ]),

    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  methods: {
    jumpHome () {
      const home = this.userHome || {}
      if (!home._id) return
      this.$router.push(`/tavern/${home.ldb.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ld-footer {
    padding: 50px 0;
    strong {
      display: inline-block;
      font-size: 16px;
      @include margin('bottom', 20px, 1.5);
    }
    &.light {
      strong {
        color: #555;
      }
      .ld-footer-ul {
        a, span {
          color: #999;
        }
      }
      .ld-footer-letter {
        color: #999;
      }
      .footer-subscribe-eamil {
        >span {
          color: #fff;
          background-color: $--text-blue-color;
        }
      }
      .footer-subscribe-input {
        border: 1px solid #DDDDDD;
        color: #999;
      }
      .footer-link-icons {
        fill: #bbb;
      }
      .ld-footer-term {
        color: #555;
      }
    }
    &.dark {
      background-color: $--text-deep-blue-color;
      strong {
        color: #fff;
      }
      .ld-footer-ul {
        a, span {
          color: #BDB9FD;
        }
      }
      .ld-footer-letter {
        color: #BDB9FD;
      }
      .footer-subscribe-eamil {
        >span {
          background-color: #fff;
          color: $--text-deep-blue-color;
        }
      }
      .footer-subscribe-input {
        color: #BDB9FD;
        background-color: #726BFF;
      }
      .footer-link-icons {
        fill: #BDB9FD
      }
      .ld-footer-term {
        color: #fff;
      }
    }
  }
  .footer-lordless-title {
    position: relative;
    &::before {
      content: 'BETA';
      position: absolute;
      top: -5px;
      right: -10px;
      margin-left: 3px;
      padding: 3px 5px;
      font-family: $--font-TTNormsBold;
      color: #fff;
      font-size: 12px;
      background-color: #BDB9FD;
      border-radius: 2px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
      transform: scale(.75) translateX(100%);
    }
  }

  // .ld-footer-beta {
  //   position: absolute;
  //   top: -5px;
  //   right: -10px;
  //   margin-left: 3px;
  //   padding: 3px 5px;
  //   font-family: $--font-TTNormsBold;
  //   color: #fff;
  //   font-size: 12px;
  //   background-color: #BDB9FD;
  //   border-radius: 2px;
  //   box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  //   transform: scale(.75) translateX(100%);
  // }
  .ld-footer-ul {
    &:not(.footer-lordless-ul) {
      @include margin('top', 30px, 1, -2);
    }
    a {
      font-family: $--font-TTNormsRegular;
      font-size: 16px;
      line-height: 1.8;
    }
  }
  .footer-whitepaper-ul {
    margin-top: 50px;
  }

  .ld-footer-letter {
    width: 100%;
    max-width: 350px;
    @include margin('top', 30px, 1, -2);
    >p {
      font-size: 16px;
    }
    .footer-copyright {
      margin-top: 15px;
      font-size: 12px;
    }
  }
  .footer-subscribe-eamil {
    margin-top: 20px;
    max-width: 350px;
    >span {
      padding: 15px 18px;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
  .footer-subscribe-input {
    padding: 0 15px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    overflow: hidden;
    >input {
      width: 100%;
      height: 100%;
      padding: 0;
      border: none;
      font-family: $--font-TTNormsMedium;
      font-size: 16px;
      background-color: transparent;
      color: inherit;
      outline: none;
      &::placeholder {
        color: inherit;
      }
    }
  }

  .footer-link-icons {
    margin-top: 45px;
    >a {
      width: 22px;
      height: 22px;
      cursor: pointer;
      &:not(:first-of-type) {
        margin-left: 25px;
      }
    }
  }

  .ld-footer-term {
    margin-top: 30px;
    font-family: $--font-TTNormsRegular;
    font-size: 16px;
  }

</style>
