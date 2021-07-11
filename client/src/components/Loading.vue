<template>
  <div class="loading">
    <Icon name="logo" color="#1DA1F2" size="128" />
    <div class="loading-icon"></div>
  </div>
</template>

<script>
import Icon from "@/components/Icon.vue";

export default {
  name: "LoadingView",
  components: {
    Icon
  }
};
</script>

<style lang='scss'>
@import "@/assets/_variables.scss";

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    height: 100%;
    width: 100%;
}

.loading-icon {
  align-self: center;
  
  height: 2rem;
  width: 2rem;
  border-radius: 100%;

  margin-top: 1rem;

  border: .3rem solid rgba(#1DA1F2, 0.1);
  border-left-color: $blue;

  animation: loading 1s linear infinite;

  @keyframes loading {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
