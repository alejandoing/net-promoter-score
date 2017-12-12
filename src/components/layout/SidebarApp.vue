<template lang="pug">
  v-navigation-drawer(fixed, :mini-variant='miniVariant', :clipped='clipped', v-model='drawer', app)
    v-list
      v-list-tile(value='true', v-for='(item, i) in items', :key='i')
        v-list-tile-action
          v-icon(v-html='item.icon')
        v-list-tile-content
          v-list-tile-title(v-text='item.title')
</template>

<script>
  export default {
    name: 'SidebarApp',
    data () {
      return {
        clipped: false,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        title: 'Hola'
      }
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>