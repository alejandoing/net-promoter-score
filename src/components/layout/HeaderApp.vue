<template lang="pug">
	v-toolbar(fixed='', app='', :clipped-left='clipped')
		v-toolbar-side-icon(@click.stop='cool_event_name')
		v-btn(icon='', @click.stop='miniVariant = !miniVariant')
			v-icon(v-html="miniVariant ? 'chevron_right' : 'chevron_left'")
		v-btn(icon='', @click.stop='clipped = !clipped')
			v-icon web
		v-btn(icon='', @click.stop='fixed = !fixed')
			v-icon remove
		v-toolbar-title(v-text='title')
		v-spacer
		v-btn(icon='', @click.stop='rightDrawer = !rightDrawer')
			v-icon menu
</template>

<script>
  export default {
    name: 'HeaderApp',
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js'
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