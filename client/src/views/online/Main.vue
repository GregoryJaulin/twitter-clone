<template>
  <div class="frame">
    <nav>
      <div class="menu" ref="menu">
        <Icon name="logo" color="#E1E8ED" :size="40" class="logo hover-blue" />
        <Icon
          name="home"
          innerTxt="Accueil"
          :color="$route.meta.menu === 1 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          @click="$router.push('/home')"
        />
        <Icon
          name="explore"
          innerTxt="Explorer"
          :color="$route.meta.menu === 2 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          disabled
        />
        <Icon
          name="notification"
          innerTxt="Notifications"
          :color="$route.meta.menu === 3 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          disabled
          v-if="$store.getters.isConnected"
        />
        <Icon
          name="dm"
          innerTxt="Messages"
          :color="$route.meta.menu === 4 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          disabled
          v-if="$store.getters.isConnected"
        />
        <Icon
          name="bookmark"
          innerTxt="Signets"
          :color="$route.meta.menu === 5 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          disabled
          v-if="$store.getters.isConnected"
        />
        <Icon
          name="list"
          innerTxt="Listes"
          :color="$route.meta.menu === 6 ? '#1DA1F2' : '#E1E8ED'"
          :size="40"
          class="menu-item hover-blue"
          disabled
          v-if="$store.getters.isConnected"
        />
        <Icon
          name="profile"
          innerTxt="Profil"
          :color="
            $route.meta.menu === 7 &&
            $route.params.user === $store.getters.fullUser.tag
              ? '#1DA1F2'
              : '#E1E8ED'
          "
          :size="40"
          class="menu-item hover-blue"
          @click="$router.push(`/${$store.getters.fullUser.tag}`)"
          v-if="$store.getters.isConnected"
        />
        <Icon
          name="more"
          innerTxt="Plus"
          color="#E1E8ED"
          :size="40"
          class="menu-item hover-blue"
          disabled
        />
        <button
          class="btn btn-style-1"
          @click="$router.push({ name: $route.meta.tweet })"
        >
          Tweet
        </button>
      </div>
      <div class="self" v-if="$store.getters.isConnected">
        <div class="profile" style="--src: url('')" />

        <div class="user">
          <span>{{ $store.getters.fullUser.name }}</span>
          <span>@{{ $store.getters.fullUser.tag }}</span>
        </div>
      </div>
      <div class="self column" v-else>
        <router-link to="/register" class="btn btn-style-1">
          S'inscrire
        </router-link>
        <router-link to="/login" class="btn btn-style-2">
          Se connecter
        </router-link>
      </div>
    </nav>

    <main @scroll="onScroll" ref="main">
      <div class="data">
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <div class="loading-icon"></div>
          </template>
        </Suspense>
      </div>
      <div class="additional">
        <div class="header" v-if="!$route.meta.hideSearchBar">
          <SearchBar />
        </div>
        <div class="dynamic">
          <div class="trends">
            <h3 class="border">Tendances pour vous</h3>
            <ul>
              <li>
                <div class="errorInfo">
                  <span>Impossible de charger les tendances.</span>
                  <span>Veuillez réessayer ultérieurement.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>

  <router-view name="popup" />
</template>

<script>
import API from "@/api";
import { useStore } from "vuex";

import Icon from "@/components/Icon.vue";
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "Main",
  components: {
    Icon,
    SearchBar
  },
  setup() {
    const store = useStore();

    if (!store.getters.fullUser._id)
      API.auth.cookie().then(res => {
        if (res && res.status === 200) {
          store.commit("updateAccount", res.data);
        }
      });
  },
  data() {
    return {
      lastScroll: {
        date: Date.now(),
        position: 0
      }
    };
  },
  methods: {
    onScroll() {
      if (!this.$route.meta.onScroll) return;
      if (
        Date.now() - this.lastScroll.date < 500 ||
        this.$refs.main.scrollTop <= this.lastScroll.position
      )
        return;

      this.lastScroll = {
        date: Date.now(),
        position: this.$refs.main.scrollTop
      };

      this.$route.meta.onScroll(
        this.$refs.main.scrollTop /
          (this.$refs.main.scrollHeight - this.$refs.main.clientHeight)
      );
    }
  },
  watch: {
    $route() {
      // Reinit on route change
      this.lastScroll = {
        date: Date.now(),
        position: 0
      };
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.frame {
  --header-height: 3.5rem;
  --nav-size: 16rem;
  --padding: 10vw;

  display: grid;
  grid-template-columns: var(--nav-size) 1fr;
  grid-template-areas: "none main additional";

  margin-left: var(--padding);

  height: 100vh;

  .separator {
    height: 0.75rem;
    width: 100%;

    background: $dark-gray;
  }

  main {
    --header-width: 36rem;
    grid-area: main;
    display: flex;

    height: 100vh;
    width: 100%;

    overflow-x: hidden;
    overflow-y: auto;

    .additional {
      --header-width: 25rem;

      grid-area: additional;

      width: 100%;
      margin-right: var(--padding);
    }

    .header {
      position: fixed;
      z-index: 500;

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;

      height: var(--header-height);
      width: var(--header-width);
      padding: 1rem 1.25rem;

      background: $dark;

      font-size: 1.25rem;
      font-weight: 800;

      &.compact {
        justify-content: start;
      }
    }
  }

  .dynamic {
    position: relative;
    display: flex;
    flex-direction: column;

    min-height: 100%;
    width: var(--header-width);
    padding-top: var(--header-height);
  }

  .trends {
    margin: 1rem 1.25rem;

    border-radius: 1rem;
    background: $dark-gray;

    > * {
      padding: 0.75rem 1rem;
    }

    ul {
      display: flex;
      flex-direction: column;
      justify-content: center;

      min-height: 7.5rem;
    }

    .errorInfo {
      padding-top: 0;

      font-size: 0.9rem;

      :first-child {
        font-weight: 700;
        font-size: 1.12rem;
        color: $extra-light-gray;
      }
    }
  }
}

nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;
  width: var(--nav-size);
  padding: 0.5rem 1.5rem;

  .menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;

    .logo:hover use {
      fill: $extra-light-gray;
    }

    .icon {
      font-size: 1.25rem;
      font-weight: 700;

      color: $extra-light-gray;
    }

    .btn {
      align-self: stretch;
    }
  }

  .self {
    display: flex;
    gap: 1rem;

    margin-bottom: 1rem;

    &.column {
      flex-direction: column;
    }
  }
}
</style>