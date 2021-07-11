<template>
  <Suspense>
    <template #default>
      <Logout />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>
</template>

<script>
import Logout from '@/views/offline/Logout.vue'
import Loading from '@/components/Loading.vue'

export default {
  name: "HomeView",
  components: {
      Logout, Loading
  }
};
</script>