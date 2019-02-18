<template lang="pug">
	v-toolbar(fixed app dark color="primary")
		v-toolbar-title.header-title Net Promoter Score - {{ title }}
		v-spacer
		v-toolbar-items.header-computer
			v-btn(v-if="userStorage.privileges !== 'Local'" flat to="/dashboard") Menú Encuesta
				v-icon.pl-2 dashboard
			v-btn(flat to="/stats") Gráficos
				v-icon.pl-2 pie_chart
			v-btn(flat to="/tickets") Comentarios
				v-icon.pl-2 assignment
			v-menu(offset-y)
				v-btn(flat slot="activator") {{ name }}
					v-icon.pl-2 account_circle
				v-list
					v-list-tile(v-for="item in items" :key="item.title" @click="")
						v-list-tile-title
							a(@click="signOut") {{ item.title }}
</template>

<script>
	import router from '@/router/'
  export default {
    name: 'HeaderApp',
    data () {
      return {
				title: null,
				name: null,
				userStorage: JSON.parse(localStorage.getItem('user')),
				items: [
					{ title: 'Cerrar sesión', route: '/auth', method: 'signOut' },
				],
      }
		},
		methods: {
			signOut() {
				this.$firebase.auth().signOut()
				localStorage.removeItem('user')
				localStorage.removeItem('assessment')
				router.push('/auth')
			}
		},
		created() {
			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
			business.onSnapshot(doc => this.title = doc.data().title)

			let user = this.$firebase.firestore().doc("users/" + this.userStorage.id)
			user.onSnapshot(doc => this.name = doc.data().name)
		}
  }
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
	@media (max-width: 600px)
		.header-computer
			display: none
		.header-title
			display: none
</style>