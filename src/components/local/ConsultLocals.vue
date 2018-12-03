<template lang="pug">
	v-container
		v-layout(row)
		v-flex(xs12)
			div.pb-5
				span.display-1 Locales
				v-divider
			v-flex(xs12 sm12 v-if='locals')
				v-card
					v-list
						template(v-for="local in locals")
							v-list-tile(avatar @click="viewLocal(local.id)")
								v-list-tile-avatar.pr-5
									v-badge(overlay left color="primary" overlap medium)
										span(slot="badge") {{ local.assessments }}
										v-icon(large color="light-primary accent-3") touch_app
								v-list-tile-content
									v-list-tile-title(v-html="local.title")
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ local.number }} - Jefe Zonal: {{ local.zone }}
							v-divider
			v-flex(xs12 sm12 v-else)
				span.message ¡Aún no se han registrado locales para esta organización!
		v-layout.py-5(row child-flex justify-center align-center wrap v-if='!locals')
			v-flex(fill-height xs12 offset-xs5)
				v-btn(to="/locals/new/" large outline color="primary") Registrar Local
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				locals: [],
				zone: null,
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		created() {
			const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
			let newLocals = []

			let locals = this.$firebase.firestore().collection("locals").where('business', '==', this.userStorage.business)
			locals.onSnapshot(querySnapshot => {
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					local.assessments = 0

					let assessments = this.$firebase.firestore().collection("assessments").where('business', '==', this.userStorage.business)
					assessments.onSnapshot(querySnapshot => {
						querySnapshot.forEach(doc => {
							if (doc.data().local.id == local.id || doc.data().local == local.id) local.assessments++
						})
					})

					this.$firebase.firestore().doc('zones/' + local.zone).get()
					.then(doc => {
						this.zone = doc.data().responsable
						local.zone = this.zone
					})
					this.locals.unshift(local)
				})
				if (!this.locals.length) this.locals = false
				this.locals.sort(sortByProperty('title')).reverse()
			})
		},
		methods: {
			viewLocal(id) {
				{ router.push('/locals/' + id) }
			}
		}
  }
</script>

<style lang="sass" scoped>
	.message
		font-size: 20px
</style>
