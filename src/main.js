import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/css/main.css';
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import fontAwesome from '@fortawesome/fontawesome-free'

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(fontAwesome);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
