<template lang="pug">
	div
		header-app
		v-content.py-4
			router-view
		v-footer(fixed class="pa-2")
			span.text-footer Se ha registrado un total de {{ assessments.length }} valoraciones
			v-spacer
			v-badge(overlay left color="primary" overlap)
				span(slot="badge") {{ veryGood }}
				v-icon(large color="green") sentiment_very_satisfied
			v-badge(overlay left color="primary" overlap)
				span(slot="badge") {{ good }}
				v-icon(large color="light-green accent-3") sentiment_satisfied
			v-badge(overlay left color="primary" overlap)
				span(slot="badge") {{ bad }}
				v-icon(large color="yellow") sentiment_dissatisfied
			v-badge(overlay left color="primary" overlap)
				span(slot="badge") {{ veryBad }}
				v-icon(large color="red") sentiment_very_dissatisfied
</template>

<script>
	import HeaderApp from  '@/components/layout/HeaderApp'
  export default {
		name: 'Layout',
		components: {
			HeaderApp
		},
		data() {
			return {
				veryGood: 0,
				good: 0,
				bad: 0,
				veryBad: 0,
				assessments: [],
				userStorage: JSON.parse(localStorage.getItem('user'))
			}
		},
		created() {
			let query = this.$firebase.firestore().collection('assessments').where('business', '==', this.userStorage.business)
			if (this.userStorage.privileges === 'Local') query = query.where('local', '==', this.userStorage.local)
			if (this.userStorage.privileges === 'Zone') query = query.where('zone', '==', this.userStorage.zone)
			query.onSnapshot(querySnapshot => {
				this.assessments = []
				this.veryGood = 0
				this.good = 0
				this.bad = 0
				this.veryBad = 0
				querySnapshot.forEach(doc => {
					let assessment = doc.data()
					this.assessments.unshift(assessment)
					this[assessment.face]++
				})
			})
		}
  }
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
	.text-footer
		font-size: 20px
	@media (max-width: 600px)
		footer
			display: none

	span
		font-size: 9px
</style>
