<template>
  <div class="router-view">
    <div class="pop-up flex parent">
      <div class="header start">
        <Icon
          class="return hover-blue"
          name="close"
          color="#1DA1F2"
          :size="40"
          @click="$router.go(-1)"
        />
      </div>

      <div class="tweet minified parent" v-if="post">
        <div class="main">
          <div
            class="profile"
            style="--src: url('')"
          />

          <div class="user row">
            <div class="name">{{ post.author.name }}</div>
            <div class="tag">@{{ post.author.tag }}</div>
            <span>·</span>
            <div
              class="date"
              :aria-label="
                new Date(post.createdAt).toLocaleDateString('fr-FR', {
                  hour: 'numeric',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
              "
            >
              {{ new Date(post.createdAt).formatTwitter() }}
            </div>
          </div>

          <div class="content">
            {{ post.content }}
          </div>
        </div>
      </div>
      <TweetField :to="post ? {_id, author} : undefined" placeholder="Tweetez votre réponse." @new="$router.go(-1)"/>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref } from "vue";

import Icon from "@/components/Icon.vue";
import TweetField from "@/components/TweetField.vue";

export default {
  name: "TweetCompose",
  components: {
    Icon,
    TweetField
  },
  props: {
    _id: String,
    author: String
  },
  setup(props) {
    if (!props._id) return;

    const store = useStore();
    const post = ref(null);

    store.dispatch("getPost", props._id).then(res => (post.value = res));

    return { post };
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.pop-up .header.start {
  display: flex;
  justify-content: flex-start;
}

.tweet.minified .main {
  cursor: initial;

  display: grid;
  grid-template-areas:
    "profile author"
    "profile content"
    "profile to";
  grid-template-columns: auto 1fr;
  column-gap: 0.5rem;
  row-gap: 0.5rem;

  padding: 0.75rem 1rem;

  &:hover {
    background: none;
  }
}
</style>