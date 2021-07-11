<template>
    <TweetBase class="border" v-for="post in $store.getters.userReplies" v-bind="post" :key="post._id" needParent />
</template>

<script>
import { useStore } from 'vuex'

import TweetBase from "@/components/TweetBase.vue"

export default {
    name: "UserReplies",
    components: {
        TweetBase
    },
    async setup() {
        const store = useStore()

        if(store.getters.userReplies.length <= 0)
            await store.dispatch('fetchReplies', store.getters.currentUser._id)
    }
}
</script>