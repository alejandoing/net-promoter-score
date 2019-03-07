<template lang="pug">
	div
		header-app
		v-content.py-4
			router-view
		v-footer(fixed class="pa-2")
			span.text-footer Se ha registrado un total de {{ totalAssessments }} valoraciones el día de hoy
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
	//- .text-xs-center(v-else)
	//- 	v-dialog(
	//- 		v-model="dialog"
	//- 		hide-overlay
	//- 		persistent
	//- 		width="300"
	//- 	)
	//- 		v-card(color="primary" dark)
	//- 			v-card-text
	//- 				| Cargando el sistema, espera un momento
	//- 				v-progress-linear.mb-0(indeterminate color="white")
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
				dialog: true,
				veryGood: 0,
				good: 0,
				bad: 0,
				veryBad: 0,
				assessments: [],
				userStorage: JSON.parse(localStorage.getItem('user'))
			}
		},
		async created() {
			this.totalAssessments = (await this.$axios.get('assessments/stats/total')).data[0].total
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
