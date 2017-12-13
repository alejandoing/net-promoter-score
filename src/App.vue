<template>
  <v-app>
    <header-app></header-app>
    <dashboard></dashboard>
  </v-app>
</template>

<script>
  import HeaderApp from './components/layout/HeaderApp'
  import Dashboard from './components/dashboard/Dashboard'
  export default {
    components: {
      HeaderApp,
      Dashboard
    }
  }
</script>
