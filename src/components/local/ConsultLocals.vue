<template lang="pug">
	v-container(v-if='locals.length')
		v-layout(row)
		v-flex(xs12)
			div.pb-5
				span.display-1 Locales
				v-divider
			v-flex(xs12 sm12)
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
										span.grey--text.text--darken-2 {{ local.province }}, {{ local.location }} - {{ local.street }}
							v-divider
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				locals: [],
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		created() {
			let locals = this.$firebase.firestore().collection("locals").where('business', '==', this.userStorage.business)
			locals.onSnapshot(querySnapshot => {
				this.locals = []
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					local.assessments = 0

					let assessments = this.$firebase.firestore().collection("assessments").where('business', '==', this.userStorage.business)
					assessments.onSnapshot(querySnapshot => {
						local.assessments = 0
						querySnapshot.forEach(doc => {
							if (doc.data().local.id == local.id) local.assessments++
						})
					})
					this.locals.unshift(local)
				})
			})
		},
		methods: {
			viewLocal(id) {
				{ router.push('/locals/' + id) }
			}
		}
  }
</script>