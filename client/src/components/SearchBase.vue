<template>
  <component :is="component" />
</template>

<script>
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { defineAsyncComponent } from "vue";

export default {
  name: "SearchBase",
  async setup() {
    const store = useStore();
    const route = useRoute();

    await store.dispatch("fetchSearch", route.query.filter);
  },
  computed: {
    valid() {
      return (
        this.$route.query.filter &&
        this.$route.query.filter !== "" &&
        (this.$store.getters.searchUsers.length > 0 ||
          this.$store.getters.searchPosts.length > 0)
      );
    },
    component() {
      return defineAsyncComponent(() =>
        import(`@/components/search/${this.valid ? "Search" : "NotFound"}.vue`)
      );
    }
  }
};
</script>