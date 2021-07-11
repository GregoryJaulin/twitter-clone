<template>
  <div class="header compact border-v">
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
    <div class="tabs border" style="--row-count: 2">
        <div :class="{ active: $route.meta.selected === 1 }"
            @click="$router.replace(`/${$route.params.user}/followers`)">
        <span>Abonnés</span>
        </div>
        <div :class="{ active: $route.meta.selected === 2 }"
            @click="$router.replace(`/${$route.params.user}/follows`)">
        <span>Abonné</span>
        </div>
    </div>
    <Suspense>
      <template #default>
        <router-view />
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

export default {
  name: "UserView",
  components: {
    Icon
  },
  async setup() {
    const store = useStore();
    const route = useRoute()

    await store.dispatch('fetchUser', route.params.user)
  },
  methods: {
      print() {
          console.log('YO')
      }
  }
};
</script>