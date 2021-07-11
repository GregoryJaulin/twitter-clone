<template>
  <div class="postdata error">
    <div class="errorInfo margin">
      <span>Impossible de trouver ce Tweet.</span>
      <span>Essayez d'effectuer une autre recherche.</span>
      <button class="btn btn-style-1" @click="$router.go()">Réessayer</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserError",
  created() {
    document.title = 'Discussion / Twitter';
  }
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.postdata.error button {
    margin-top: 1rem;
}
</style>