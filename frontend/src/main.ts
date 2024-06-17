import { createApp } from 'vue'
import App from './App.vue'
import router from './app/routes/_index'
import { globalCookiesConfig } from "vue3-cookies";

globalCookiesConfig({
  expireTimes: "7d",
  secure: true,
  sameSite: "None",
});

createApp(App)
  .use(router)
  .mount('#app')
