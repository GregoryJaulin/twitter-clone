<template>
  <div class="header border border-v">
    Accueil
    <Icon name="shine" color="#1DA1F2" class="hover-blue" :size="40" disabled />
  </div>

  <div class="dynamic border-v">
    <TweetField class="border" />
    <div class="separator border"></div>
    <Suspense>
      <template #default>
        <Feed />
      </template>
      <template #fallback>
        <div class="loading-icon"></div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import TweetField from "@/components/TweetField.vue"
import Feed from "@/components/Feed.vue"

export default {
  name: "LoggedView",
  components: {
    Icon, TweetField, Feed
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";
</style>