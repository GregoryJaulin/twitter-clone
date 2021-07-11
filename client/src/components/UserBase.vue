<template>
  <component :is="component" v-bind="user"/>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "UserBase",
  computed: {
    user() {
      return this.$store.getters.currentUser
    },
    component() {
      return defineAsyncComponent(() =>
        import(
          `@/components/users/${
            this.user ? "User" : "NotFound"
          }.vue`
        )
      );
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.userdata {
  display: grid;
  grid-template-rows: 7rem 1fr;

  .banner {
    height: 12rem;
    width: 100%;

    background: no-repeat var(--src, $dark-gray);
    background-size: cover;
  }

  .infos {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    padding: 1rem 1rem;
  }
}
</style>