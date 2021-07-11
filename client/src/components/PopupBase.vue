<template>
    <div class="pop-up float">
        <slot name="texts" />
        <slot name="users" />

        <slot />
    </div>
</template>

<script>
export default {
    name: 'Popup'
}
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

.pop-up.float {
    position: absolute;
    bottom: -.5rem; left: 50%;

    max-height: 60vh;
    overflow-y: auto;
    padding: 0;
    box-shadow: .25rem .25rem .5rem rgba($gray, .2),
                -.25rem -.25rem .5rem rgba($gray, .2);

    transform: translate(-50%, 100%);
}

</style>