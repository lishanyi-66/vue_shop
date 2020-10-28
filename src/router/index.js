import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User.vue'
import Rights from '@/components/power/Right.vue'
import Role from "@/components/power/Role.vue"
import Cate from "@/components/goods/Cate.vue"
import Params from "@/components/goods/Params.vue"
import List from "@/components/goods/List.vue"
import Add from '@/components/goods/Add.vue'
import Order from "@/components/order/Order.vue"
// import {
// component
// } from 'vue/types/umd'
// import { component } from 'vue/types/umd'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'

  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Role
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path:'/goods/add',
        component:Add
      },
      {
        path:'/orders',
        component:Order
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
