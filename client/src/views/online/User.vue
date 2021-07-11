<template>
  <div class="header compact border border-v">
    <Icon
      name="back"
      color="#1DA1F2"
      class="hover-blue"
      :size="40"
      @click="$router.go(-1)"
    />
    {{$store.getters.currentUser ? $store.getters.currentUser.name : 'Profil'}}
  </div>

  <div class="dynamic border-v">
    <Suspense>
      <template #default>
        <UserBase />
      </template>
      <template #fallback>
        <div class="loading-icon"></div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from 'vue-router'

import Icon from "@/components/Icon.vue";
import UserBase from "@/components/UserBase.vue"

export default {
  name: "UserView",
  components: {
    Icon, UserBase
  },
  async setup() {
    const store = useStore();
    const route = useRoute()

    await store.dispatch('fetchUser', route.params.user)
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.follow, .follower {
  cursor: pointer;

  display: flex;
  gap: 1rem;

  width: 100%;
  padding: .5rem;

  &:hover {
    background: rgba($extra-light-gray, 0.03);
  }
}
</style>