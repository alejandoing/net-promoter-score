<template lang="pug">
	v-container(v-if='polls.length')
		v-layout(row)
			v-flex(xs12 sm12)
				v-card
					v-list
						template(v-for="poll in polls")
							v-list-tile(avatar @click="viewPoll(poll.id)")
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
									v-list-tile-title(v-html="poll.question")
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ poll.local.title }} - {{ poll.context }}
							v-divider
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				polls: [],
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		created() {
			let polls = this.$firebase.firestore().collection("polls").where('business', '==', this.userStorage.business)
			polls.onSnapshot(querySnapshot => {
				this.polls = []
				querySnapshot.forEach(doc => {
					let poll = doc.data()
					poll.id = doc.id
					this.polls.unshift(poll)
				})
			})
		},
		methods: {
			viewPoll(id) {
				{ router.push('/polls/' + id) }
			}
		}
  }
</script>