<template>
  <div class="header border-v">
    <Icon
      name="back"
      color="#1DA1F2"
      class="hover-blue"
      :size="40"
      @click="$router.go(-1)"
    />
    <SearchBar :initial="$route.query.filter" />
  </div>

  <div class="dynamic border-v">
      <div class="tabs border" style="--row-count: 2">
        <div :class="{ active: $route.meta.tab === 1 }"
            @click="$router.replace({ path: '/search', query: { filter: $route.query.filter }})">
        <span>À la une</span>
        </div>
        <div :class="{ active: $route.meta.tab === 2 }"
            @click="$router.replace({ path: '/search/users', query: { filter: $route.query.filter }})">
        <span>Personnes</span>
        </div>
      </div>
    <SearchBase :key="filter" />
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import SearchBar from "@/components/SearchBar.vue";
import SearchBase from "@/components/SearchBase.vue";

export default {
  name: "SearchView",
  components: {
    Icon,
    SearchBar,
    SearchBase
  },
  created() {
    document.title = `${this.$route.query.filter} - Recherche sur Twitter / Twitter`;
  },
  computed: {
      filter() {
          return this.$route.query.filter
      }
  }
};
</script>