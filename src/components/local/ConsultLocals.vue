<template lang="pug">
	v-container(v-if='locals.length')
		v-layout(row)
			v-flex(xs12 sm12)
				v-card
					v-list
						template(v-for="local in locals")
							v-list-tile(avatar @click="viewLocal(local.id)")
								v-list-tile-avatar.pr-5
									v-badge(overlay left color="primary" overlap medium)
										span(slot="badge") 6
										v-icon(large color="light-green accent-3") mood
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") 6
										v-icon(large color="green accent-3") fa-smile-o
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") 6
										v-icon(large color="warning") fa-meh-o
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") 6
										v-icon(large color="red darken-4") fa-frown-o
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