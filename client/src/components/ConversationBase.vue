<template>
  <component :is="component" v-bind="post" />
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from "vue";

export default {
  name: "ConversationBase",
  async setup() {
    const store = useStore();
    const route = useRoute()

    await store.dispatch("fetchPost", route.params.post);
  },
  computed: {
    post() {
      return this.$store.getters.currentPost
    },
    component() {
      return defineAsyncComponent(() =>
        import(
          `@/components/posts/${
            this.post ? "Conversation" : "NotFound"
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