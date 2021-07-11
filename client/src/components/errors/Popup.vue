<template>
  <div class="error-wrapper" :class="{ 'pop-up': isCritical }">
    <div class="error">
      <span>{{ type + (isCritical ? "" : ":") }}</span>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PopupError",
  props: {
    isCritical: Boolean,
    type: String,
    message: String,
  },
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.error-wrapper {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 999;

  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  background: $darker;

  transform: translate(-50%, -150%);

  &:empty {
    display: none;
  }

  .error {
    display: flex;
    gap: 0.5rem;

    :first-child {
      color: $extra-light-gray;
      font-weight: 700;
    }

    :last-child {
      color: $gray;
    }
  }
}

.error-wrapper.pop-up {
  .error {
    flex-direction: column;
    align-items: center;
  }
}
</style>