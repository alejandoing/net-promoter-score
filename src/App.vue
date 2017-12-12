<template lang="pug">
  v-app
    sidebar-app
    header-app
    v-content
      v-container(fluid)
        v-slide-y-transition(mode='out-in')
          v-layout(column, align-center)
            img.mb-5(src='/static/v.png', alt='Vuetify.js')
            blockquote
              | “First, solve the problem. Then, write the code.”
              footer
                small
                  em —John Johnson
    v-navigation-drawer(temporary, :right='right', v-model='rightDrawer', fixed)
      v-list
        v-list-tile(@click.native='right = !right')
          v-list-tile-action
            v-icon compare_arrows
          v-list-tile-title Switch drawer (click me)
    v-footer(:fixed='fixed', app)
      span © 2017
</template>

<script>
  import SidebarApp from './components/layout/SidebarApp'
  import HeaderApp from './components/layout/HeaderApp'
  export default {
    data () {
      return {
        fixed: false,
        right: true,
        rightDrawer: false
      }
    },
    components: {
      SidebarApp,
      HeaderApp
    }
  }
</script>
