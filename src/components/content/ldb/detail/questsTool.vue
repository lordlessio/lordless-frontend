<template>
  <div class="relative ldb-quests-now">

    <!-- ldb detail taskNow skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
      <!-- <task-now-skeletion v-if="loading"/> -->
    <!-- </transition> -->

    <transition name="ld-hide-fade">
      <section v-if="!loading" class="ldb-left-section">
        <h3>Quests</h3>
        <ul class="TTFontBolder d-flex col-flex lordless-table-list shadow quests-list">
          <li class="d-flex lordless-table-item lordless-table-thead">
            <p class="quests-item-name">QUEST</p>
            <p class="v-flex quests-item-cost">COST</p>
            <p class="v-flex quests-item-reward">REWARD</p>
          </li>
          <li class="lordless-table-item quests-table-item"
            :class="{ 'is-disable': quest.userStatus !== undefined }"
            v-for="(quest, index) of quests"
            :key="index"
            @click.stop="receive(quest)">
            <div class="relative d-flex f-align-center quests-item-container">
              <p class="quests-item-name">{{ quest.ldbTaskType.name }}</p>
              <p class="v-flex quests-item-cost">{{ quest.ldbTaskType.apCost }}AP</p>
              <p class="v-flex text-upper quests-item-reward">{{ quest.ldbTaskType.priceInUSD * quest.ldbTaskType.candyType.USD2TokenCount | formatDecimal({ len: 2 }) }} {{ quest.ldbTaskType.candyType.symbol }} / {{ quest.ac }}AC</p>
            </div>
          </li>
        </ul>
      </section>
    </transition>
  </div>
</template>

<script>
import TaskNowSkeletion from '@/components/skeletion/ldb/detail/taskNow'
export default {
  props: {
    quests: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    ldbId: {
      type: [String, Number],
      default: null
    },
    owner: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      receiveLoading: false
    }
  },
  components: {
    TaskNowSkeletion
  },
  methods: {

    async receive ({ _id, countLeft, userStatus }) {
      if (!_id || this.receiveLoading || userStatus !== undefined) return
      this.receiveLoading = true
      this.$emit('receive', { _id, countLeft }, ({ errorMsg, data } = {}) => {
        this.receiveLoading = false
        console.log('-------- receive')
        if (data) this.$router.push(`/task/${data._id}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  // ldb-quests-now
  .ldb-quests-now {
    margin-top: 50px;
  }

  .quests-item-name {
    flex: 2;
  }
  // .quests-table-item {
  //   padding: 0 20px;
  // }
  // .quests-item-container {
  //   padding: 24px 0;
  //   position: relative;
  //   z-index: 1;
  //   overflow: hidden;
  //   &::before {
  //     // padding: 10px 0;
  //     position: absolute;
  //     right: 30%;
  //     bottom: 0;
  //     width: 60px;
  //     height: 60px;
  //     line-height: 60px;
  //     border: 2px solid #F5515F;
  //     border-radius: 100%;
  //     font-size: 12px;
  //     color: #F5515F;
  //     // transform: rotate(-45deg);
  //     // transform-origin: 65% -100%;
  //     text-align: center;
  //     z-index: -1;
  //   }
  //   &.status_0, &.status_1, &.status_-1 {
  //     cursor: no-drop;
  //   }
  //   &.status_0 {
  //     &::before {
  //       content: 'Applied';
  //     }
  //   }
  //   &.status_1 {
  //     &::before {
  //       content: 'Completed';
  //     }
  //   }
  //   &.status_-1 {
  //     &::before {
  //       content: 'Failed';
  //     }
  //   }
  // }
</style>
