import { createApp } from 'vue'
import App from './App.vue'
import router from './app/routes/_index'

createApp(App)
  .use(router)
  .mount('#app')
