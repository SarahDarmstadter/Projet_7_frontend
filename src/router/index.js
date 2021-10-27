import Vue from 'vue'
import VueRouter from 'vue-router'
import Connexion from '../views/Connexion.vue'
import Profil from '../views/Profil.vue'
import Forum from '../views/Forum.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/profil/:id',
    name: 'Profil',
    props: true,
    component: Profil,
},
{
    path: '/forum',
    name: 'Forum',
    //props: true,
    component: Forum,
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
