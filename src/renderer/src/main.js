import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueSweetalert2 from 'vue-sweetalert2'
import App from './App.vue'
import router from './router'
import globalComponents from './global-components'
import './assets/css/index.css'

const app = createApp(App).use(router).use(createPinia()).use(VueSweetalert2)
globalComponents(app)
app.mount('#app')
