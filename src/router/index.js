import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profil from '../views/Profil.vue'
import post from '../components/post.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
path: '/profil/:id',
 name: 'Profil',
  props: true,
component: Profil
//   // //   // route level code-splitting
//   // //   // this generates a separate chunk (about.[hash].js) for this route
//   // //   // which is lazy-loaded when the route is visited.
//   // ///component: () => import(/* webpackChunkName: "about" */ '../views/Profil.vue')
},
  {
    path: '/post',
    name: 'post',
    //props: true,
    component: post
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/Profil.vue')
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
