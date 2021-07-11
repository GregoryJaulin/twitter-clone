<template>
    <TweetBase class="border" v-for="post in $store.getters.userPosts" v-bind="post" :key="post._id"/>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import TweetBase from "@/components/TweetBase.vue"

export default {
    name: "UserPosts",
    components: {
        TweetBase
    },
    async setup() {
        const store = useStore()
        const route = useRoute()

        await store.dispatch('fetchUser', route.params.user)
        
        if(store.getters.userPosts.length <= 0)
            await store.dispatch('fetchPosts', store.getters.currentUser._id)
    }
}
</script>