import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Auth from '@/components/auth/Auth'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/components/dashboard/Dashboard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/dashboard', component: Layout, 
      children: [
        { path: '', component: Dashboard }
      ]
    },
    { path: '/auth', name: 'Auth', component: Auth },
    { path: '*', redirect: '/dashboard' },
  ]
})
