import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'
import Auth from '@/components/auth/Auth'
import Layout from '@/components/layout/Layout'
import Dashboard from '@/components/dashboard/Dashboard'
import CreatePoll from '@/components/poll/CreatePoll'
import ViewPoll from '@/components/poll/ViewPoll'
import ConsultPolls from '@/components/poll/ConsultPolls'
import CreateLocal from '@/components/local/CreateLocal'
import ViewLocal from '@/components/local/ViewLocal'
import ConsultLocals from '@/components/local/ConsultLocals'
import ViewAssessment from '@/components/assessment/ViewAssessment'
import Settings from '@/components/Settings'
import Stats from '@/components/stats/Stats'
import ConsultTickets from '@/components/tickets/ConsultTickets'
import ViewTicket from '@/components/tickets/ViewTicket'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/dashboard', component: Layout, 
      children: [
        { path: '', component: Dashboard },
        { path: '/polls/new', component: CreatePoll },
        { path: '/polls/:id', component: ViewPoll },
        { path: '/polls/', component: ConsultPolls },
        { path: '/locals/new', component: CreateLocal },
        { path: '/locals/:id', component: ViewLocal },
        { path: '/locals/', component: ConsultLocals },
        { path: '/settings/', component: Settings },
        { path: '/stats/', component: Stats },
        { path: '/tickets/', component: ConsultTickets },
        { path: '/ticket/:id', component: ViewTicket },
      ]
    },
    { path: '/auth', name: 'Auth', component: Auth },
    { path: '*', redirect: '/dashboard' },
    { path: '/assessment/:id', component: ViewAssessment }
  ]
})
