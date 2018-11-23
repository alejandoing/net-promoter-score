<template lang="pug">
	v-container(v-if="load")
		v-layout(row)
		v-flex(xs12)
			div.pb-5
				span.display-1 Encuestas
				v-divider
			v-flex(xs12 sm12 v-if='polls')
				v-card
					v-list
						template(v-for="poll in polls")
							v-list-tile(avatar @click="viewPoll(poll.id)")
								v-list-tile-avatar.pr-5
									v-badge(overlay left color="primary" overlap medium)
										span(slot="badge") {{ poll.assessments.veryGood }}
										v-icon(large color="light-primary accent-3") sentiment_very_satisfied
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") {{ poll.assessments.good }}
										v-icon(large color="light-primary") sentiment_satisfied
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") {{ poll.assessments.bad }}
										v-icon(large color="light-primary") sentiment_dissatisfied
								v-list-tile-avatar
									v-badge(overlay left color="primary" overlap)
										span(slot="badge") {{ poll.assessments.veryBad }}
										v-icon(large color="light-primary") sentiment_very_dissatisfied
								v-list-tile-content
									v-list-tile-title(v-html="poll.question")
									v-list-tile-sub-title
										//span.grey--text.text--darken-2 {{ poll.local.title }} - {{ poll.context }}
							v-divider
			v-flex(xs12 sm12 v-else) 
				span.message ¡Aún no se han registrado encuestas para esta organización!
		v-layout.py-5(row child-flex justify-center align-center wrap v-if='!polls')
			v-flex(fill-height xs12 offset-xs5)
				v-btn(to="/polls/new/" large outline color="primary") Crear Encuesta
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				load: false,
				polls: false,
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		created() {
			let polls = this.$firebase.firestore().collection("polls").where('business', '==', this.userStorage.business)
			polls.onSnapshot(querySnapshot => {
				this.load = true
				if (querySnapshot.docs.length) this.polls = []
				querySnapshot.forEach(doc => {
					let poll = doc.data()
					poll.id = doc.id
					
					let assessments = this.$firebase.firestore().collection("assessments").where('poll', '==', poll.id)
					assessments.onSnapshot(querySnapshot => {
						poll.assessments = { veryGood: 0, good: 0, bad: 0, veryBad: 0 }
						querySnapshot.forEach(doc => poll.assessments[doc.data().face]++)
						this.polls.unshift(poll)
					})
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

<style lang="sass" scoped>
	.message
		font-size: 20px
</style>