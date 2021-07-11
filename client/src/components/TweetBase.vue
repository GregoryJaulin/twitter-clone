<template>
  <component :is="component" v-bind="$props" />
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "TweetBase",
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
    quote: String,
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
    isRetweeted: Boolean,
    needParent: Boolean
  },
  computed: {
    component() {
      return defineAsyncComponent(() =>
        import(
          `@/components/posts/${
            this.quote ? "Quote" : this.target && this.needParent ? "Reply" : "Tweet"
          }.vue`
        )
      );
    }
  }
};
</script>