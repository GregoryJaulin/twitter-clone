import { createApp } from 'vue'
import App from '@/App.vue'

import store from '@/store'
import router from '@/router'
import API from '@/api'

require('@/utils/DateUtils.js')
require('@/utils/ArraysUtils.js')

require('@/assets/common.scss')

const app = createApp(App)
    .use(store)
    .use(router)

app.config.globalProperties.$API = API
app.config.silent = true

app.mount('#app')
