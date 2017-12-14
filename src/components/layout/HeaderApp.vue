<template lang="pug">
	v-toolbar(fixed app dark color="primary")
		v-toolbar-title(v-text='title')
		v-spacer
		v-toolbar-items
			v-btn(flat to="/dashboard") Dashboard
				v-icon.pl-2 dashboard
			v-btn(flat) Resultados
				v-icon.pl-2 pie_chart
			v-menu(offset-y)
				v-btn(flat slot="activator") Alejandro Uray
					v-icon.pl-2 account_circle
				v-list
					v-list-tile(v-for="item in items" :key="item.title" @click="")
						v-list-tile-title
							router-link(:to="item.route") {{ item.title }}
</template>

<script>
  export default {
    name: 'HeaderApp',
    data () {
      return {
				title: 'Net Promoter Score - Carrefour Express',
				items: [
					{ title: 'Mi perfil', route: '/' },
					{ title: 'Cerrar sesión', route: '/auth' },
				],
      }
    }
  }
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
</style>