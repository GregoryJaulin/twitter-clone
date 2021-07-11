<template>
  <div class="userdata error">
    <div class="banner"></div>

    <div class="infos border">
      <div class="profile wide" />

      <div class="user wide">
        <span>@{{ tag }}</span>
      </div>
    </div>

    <div class="errorInfo margin">
      <span>Ce compte n'existe pas.</span>
      <span>Essayez d'effectuer une autre recherche.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserError",
  props: {
    tag: String
  },
  created() {
    document.title = 'Profil / Twitter';
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.userdata.error {
  .user {
    color: $extra-light-gray !important;
  }
}
</style>