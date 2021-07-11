<template>
  <router-view />
  <transition name="errorFade" appear @after-enter="prepareClear" @after-leave="$store.commit('nextError')" >
    <PopupError v-bind="$store.state.currentError" :isCritical="false" v-if="$store.state.currentError" />
  </transition>
</template>

<script>
import PopupError from '@/components/errors/Popup.vue'

export default {
  name: "App",
  components: { PopupError },
  methods: {
    prepareClear() {
      setTimeout(() => this.$store.commit('clearError'), 1000)
    }
  }
};
</script>
