<template>
  <main class="flex">
    <div class="side side-secondary">
      <Icon name="logo" color="#E1E8ED" size="100%" />
    </div>
    <div class="side side-main">
      <h1 class="fancy-font">Ça se passe<br />maintenant</h1>
      <h2 class="fancy-font">Rejoignez Twitter dès aujourd'hui.</h2>
      <div class="btn-wrapper">
        <router-link to="/register" class="btn btn-style-1">
          S'inscrire
        </router-link>
        <router-link to="/login" class="btn btn-style-2">
          Se connecter
        </router-link>
      </div>
    </div>
  </main>
  <router-view />
</template>

<script>
import Icon from "@/components/Icon.vue";

import API from "@/api";
import store from "@/store"
import router from "@/router";

export default {
  name: "LogoutVue",
  components: {
    Icon
  },
  async setup() {
    await API.auth.cookie().then(res => {
      //Success, valid auth cookie found
      if (res && res.status === 200) {
        store.commit('updateAccount', res.data)
        store.commit('connect')
        router.push('/home')
      }
    });
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.side-secondary {
  display: flex;
  flex-shrink: 5;
  height: 100%;
  width: 100%;
  max-width: 45vw;

  background-image: url("../../assets/home-bg.png");
  background-size: cover;

  .icon {
    display: block;
    max-width: 20rem;
    width: 100%;

    margin: auto;
    padding: 2rem;
  }
}

.side-main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 2rem;
  color: $extra-light-gray;

  & > * {
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 2rem;
  }

  .btn-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    max-width: 45%;
    margin-top: 1rem;
  }
}
</style>