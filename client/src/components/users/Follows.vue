<template>
  <div v-if="user">
    <div class="errorInfo" v-if="!user.follows || user.follows.length === 0">
      <span>@{{ user.tag }} n'a aucun abonnement.</span>
      <span>Quand il le fera, ils apparaitront ici.</span>
    </div>
    <div
      class="userResume border"
      v-for="follow in user.follows"
      :key="follow._id"
      @click="$router.push(`/${follow.tag}`)"
    >
      <div
        class="profile"
        style="--src: url('')"
      />

      <div class="user">
        <span>{{ follow.name }}</span>
        <span>@{{ follow.tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex"

export default {
  name: "UserFollows",
  async setup() {
    const store = useStore()

    await store.dispatch("fetchFollows", store.getters.currentUser._id);
  },
  computed: {
    user() {
      return this.$store.getters.currentUser;
    }
  }
};
</script>