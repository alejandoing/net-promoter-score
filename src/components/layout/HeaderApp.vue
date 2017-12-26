<template lang="pug">
	v-toolbar(fixed app dark color="primary")
		v-toolbar-title Net Promoter Score - {{ title }}
		v-spacer
		v-toolbar-items
			v-btn(flat to="/dashboard") Dashboard
				v-icon.pl-2 dashboard
			v-btn(flat to="/stats") Resultados
				v-icon.pl-2 pie_chart
			v-menu(offset-y)
				v-btn(flat slot="activator") Alejandro Uray
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
				userStorage: JSON.parse(localStorage.getItem('user')),
				items: [
					{ title: 'Cerrar sesión', route: '/auth', method: 'signOut' },
				],
      }
		},
		methods: {
			signOut() {
				this.$firebase.auth().signOut()
				router.push('/auth')
			}
		},
		created() {
			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
			business.onSnapshot(doc => {
				this.title = doc.data().title
			})
		}
  }
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
</style>