<template>
  <div v-if="user">
    <div
      class="errorInfo"
      v-if="!user.followers || user.followers.length === 0"
    >
      <span>@{{ user.tag }} n'a aucun abonné.</span>
      <span>Quand quelqu'un le fera, il apparaitra ici.</span>
    </div>
    <div
      class="follower border"
      v-for="follower in user.followers"
      :key="follower._id"
      @click="$router.push(`/${follower.tag}`)"
    >
      <div
        class="profile"
        style="--src: url('')"
      />

      <div class="user">
        <span>{{ follower.name }}</span>
        <span>@{{ follower.tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "UserFollowers",
  async setup() {
    const store = useStore();

    await store.dispatch("fetchFollowers", store.getters.currentUser._id);
  },
  computed: {
    user() {
      return this.$store.getters.currentUser;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";
</style>