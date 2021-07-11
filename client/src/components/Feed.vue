<template>
  <div class="left feed">
    <TweetBase
      v-for="tweet in $store.getters.feed"
      v-bind="tweet"
      :key="tweet._id"
      class="border"
      needParent
    />
  </div>
</template>

<script>
import { useStore } from "vuex";

import TweetBase from "@/components/TweetBase.vue";

export default {
  name: "Feed",
  components: {
    TweetBase
  },
  async setup() {
    const store = useStore()
    
    await store.dispatch('fetchFeed')
  },
};
</script>