<template>
  <div
    class="result userResume border"
    v-for="user in $store.getters.searchUsers"
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
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "SearchUsers",
  async setup() {
    const store = useStore();
    const route = useRoute();

    if (store.getters.searchUsers.length <= 0)
      await store.dispatch("fetchSearchUsers", route.query.filter);
  }
};
</script>