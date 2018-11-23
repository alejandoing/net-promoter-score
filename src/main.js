// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VMenu,
  VBtnToggle,
  VCard,
  VForm,
  VTextField,
  VSelect,
  VCheckbox,
  VSnackbar,
  VDialog,
  VChip,
  VAvatar,
  VSubheader,
  VDivider,
  VBadge,
  VExpansionPanel,
  VTabs,
  VTooltip,
  VStepper,
  VProgressLinear,
  VProgressCircular,
  VDatePicker,
  VTimePicker,
  VAlert,
  VRadioGroup,
  VSwitch,
  transitions
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

import App from './App'
import router from './router'
import store from './store/store'
import Firebase from './plugins/Firebase.js'
import VueGoogleCharts from 'vue-google-charts'

Vue.use(VueGoogleCharts)
Vue.use(Firebase)

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VMenu,
    VBtnToggle,
    VCard,
    VForm,
    VTextField,
    VSelect,
    VCheckbox,
    VSnackbar,
    VDialog,
    VChip,
    VAvatar,
    VSubheader,
    VDivider,
    VBadge,
    VExpansionPanel,
    VTabs,
    VTooltip,
    VStepper,
    VProgressLinear,
    VProgressCircular,
    VDatePicker,
    VTimePicker,
    VAlert,
    VRadioGroup,
    VSwitch,
    transitions
  },
  theme: {
    primary: 'rgb(0, 96, 100)',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
