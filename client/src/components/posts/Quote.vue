<template>
  <Tweet v-bind="$props" class="quote">
    <template v-slot:parent v-if="target">
      <div class="parent">
        <Tweet v-bind="parent" />
      </div>
    </template>
    <template v-slot:quote>
      <div class="quoteData">
        <div v-if="quotePost" @click="$router.push(`/${quotePost.author.tag}/${quotePost._id}`)">
          <div
            class="profile"
            style="--src: url('')"
          />
          <div class="user row">
            <div class="name">{{ quotePost.author.name }}</div>
            <div class="tag">@{{ quotePost.author.tag }}</div>
            <span>·</span>
            <div
              class="date"
              :aria-label="
                new Date(quotePost.createdAt).toLocaleDateString('fr-FR', {
                  hour: 'numeric',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              "
            >
              {{ formatedDate }}
            </div>
          </div>

          <div class="content">
            {{ quotePost.content }}
          </div>
        </div>
        <div v-else>Échec du chargement du tweet</div>
      </div>
    </template>
  </Tweet>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

import Tweet from "./Tweet.vue";

export default {
  name: "Quote",
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
    isRetweeted: Boolean
  },
  async setup(props) {
    const store = useStore();
    const parent = ref(null),
      quotePost = ref(null);

    const [p, q] = await Promise.all([
      store.dispatch("getPost", props.target),
      store.dispatch("getPost", props.quote)
    ]);

    parent.value = p;
    quotePost.value = q;

    return { parent, quotePost };
  },
  data() {
    return {
      formatedDate: new Date(this.createdAt).formatTwitter()
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.quoteData {
  display: flex;
  justify-content: stretch;

  margin-top: 0.75rem;
  padding: 0.75rem;
  border: solid 1px rgba($gray, 0.5);
  border-radius: 1rem;

  > div {
    display: grid;
    grid-template-areas:
      "profile author"
      "profile content";
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    row-gap: 0.5rem;
  }

  &:hover {
    background: rgba($extra-light-gray, 0.03);
  }
}
</style>