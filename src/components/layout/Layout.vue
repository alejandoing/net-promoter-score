<template lang="pug">
	div
		header-app
		v-content.py-4
			router-view
		v-footer(fixed class="pa-2")
			span.text-footer Histórico general de valoraciones: {{ totalAssessments }} | Valoraciones en el mes actual: {{ totalAssessmentsMonth }}
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
				totalAssessments: null,
				totalAssessmentsMonth: null,
				dialog: true,
				veryGood: JSON.parse(localStorage.getItem('statsFaces'))[3].value,
				good: JSON.parse(localStorage.getItem('statsFaces'))[1].value,
				bad: JSON.parse(localStorage.getItem('statsFaces'))[0].value,
				veryBad: JSON.parse(localStorage.getItem('statsFaces'))[2].value,
				userStorage: JSON.parse(localStorage.getItem('user'))
			}
		},
		async created() {
			this.$axios.post('assessments/stats/total',
			{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(async res => {
				this.totalAssessmentsMonth = res.data[0].total
				localStorage.setItem('totalAssessments', JSON.stringify(res.data[0].total))
				this.$axios.post('assessments/stats/faces/value-prc', { condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					localStorage.setItem('statsFaces', JSON.stringify(res.data))
					this.veryGood = res.data[3].value
					this.good = res.data[1].value
					this.veryBad = res.data[2].value
					this.bad = res.data[0].value	
				})
			})

			this.$axios.post('assessments/stats/total').then(async res => {
				this.totalAssessments = res.data[0].total
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
