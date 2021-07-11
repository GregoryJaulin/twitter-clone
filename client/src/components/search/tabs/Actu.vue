<template>
  <div class="searchResults">
    <div class="users" v-if="userSample.length > 0">
      <h2 class="category border">Personnes</h2>
      <div
        class="result userResume border"
        v-for="user in userSample"
        :key="user.tag"
        @click="$router.push(`/${user.tag}`)"
      >
        <div
          class="profile"
          style="--src: url('')"
        />

        <div class="user">
          <span>{{ user.name }}</span>
          <span>@{{ user.tag }}</span>
        </div>
      </div>
      <div
        class="result border"
        @click="
          $router.push({
            path: '/search/users',
            query: { filter: $route.query.filter }
          })
        "
      >
        Voir tout
      </div>
      <div class="separator border"></div>
    </div>

    <div class="posts">
      <TweetBase
        v-for="tweet in $store.getters.searchPosts"
        v-bind="tweet"
        :key="tweet._id"
        class="border"
        needParent
      />
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import TweetBase from "@/components/TweetBase.vue";

export default {
  name: "SearchActus",
  components: {
    TweetBase
  },
  async setup() {
    const store = useStore();
    const route = useRoute();

    if (store.getters.searchPosts.length <= 0)
      await store.dispatch("fetchSearchPosts", route.query.filter);
  },
  data() {
    return {
      userSample: this.$store.getters.searchUsers.slice(0, 2)
    };
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.category {
  padding: 0.75rem;

  font-size: 1.25rem;
  font-weight: 800;
}
</style>