<template>
  <Tweet v-bind="$props">
    <template v-slot:parent>
      <Tweet v-bind="parent" class="parent"/>
    </template>
  </Tweet>
</template>

<script>
import { ref } from 'vue'
import { useStore } from "vuex";

import Tweet from "./Tweet.vue";

export default {
  name: "Reply",
  components: {
    Tweet
  },
  props: {
    _id: String,
    type: String,
    author: {
      _id: String,
      tag: String,
      name: String
    },
    content: String,
    target: String,
    createdAt: Number,
    repliesCount: {
      type: [String, Number],
      default: 0
    },
    likesCount: {
      type: [String, Number],
      default: 0
    },
    retweetsCount: {
      type: [String, Number],
      default: 0
    },
    isLiked: Boolean,
    isRetweeted: Boolean
  },
  async setup(props) {
    const store = useStore();
    const parent = ref(null)

    parent.value = await store.dispatch("getPost", props.target)

    return { parent } 
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.tweet .parentAuthor {
    grid-area: parent;
    color: $gray;

    span {
      color: $blue;
    }
  }
</style>