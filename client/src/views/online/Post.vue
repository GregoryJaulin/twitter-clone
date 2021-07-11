<template>
  <div class="header compact border border-v">
    <Icon
      name="back"
      color="#1DA1F2"
      class="hover-blue"
      :size="40"
      @click="$router.go(-1)"
    />
    Discussion
  </div>

  <div class="dynamic border-v">
    <Suspense>
      <template #default>
        <ConversationBase :key="postID"/>
      </template>
      <template #fallback>
        <div class="loading-icon"></div>
      </template>
    </Suspense>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";
import ConversationBase from "@/components/ConversationBase.vue"

export default {
  name: "PostView",
  components: {
    Icon, ConversationBase
  },
  computed: {
    // Little hack to force re-render when we click on reply or parent in conversation 
    // and to  keep conversation visible in background when replying
    postID() {
      return this.$route.params.post || this.$store.state.data.post
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";
</style>