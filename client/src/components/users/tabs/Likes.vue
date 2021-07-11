<template>
    <TweetBase class="border" v-for="post in $store.getters.userLikes" v-bind="post" :key="post._id" needParent />
</template>

<script>
import { useStore } from 'vuex'

import TweetBase from "@/components/TweetBase.vue"

export default {
    name: "UserLikes",
    components: {
        TweetBase
    },
    async setup() {
        const store = useStore()

        if(store.getters.userLikes.length <= 0)
            await store.dispatch('fetchLikes', store.getters.currentUser._id)
    }
}
</script>