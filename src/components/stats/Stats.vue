<template lang="pug">
	v-container
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Resultados Generales
					v-divider
			v-flex(xs12 v-if="assessments")
				highcharts(:options="optionsChartGlobal" ref="highcharts")
			v-tabs(fixed centered)
					v-tabs-bar(class="primary" dark)
						v-tabs-slider(class="yellow")
						v-tabs-item(href="#hour" ripple) Por hora
						v-tabs-item(href="#day" ripple) Por día
						v-tabs-item(href="#month" ripple) Por mes
					v-tabs-items
						v-tabs-content(id="hour")
							v-flex.py-5(xs12 v-if="assessments")
								highcharts(:options="optionsChartGlobalDatesHour" ref="highcharts")
						v-tabs-content(id="day")
							v-flex.py-5(xs12 v-if="assessments")
								highcharts(:options="optionsChartGlobalDatesDay" ref="highcharts")
						v-tabs-content(id="month")
							v-flex.py-5(xs12 v-if="assessments")
								highcharts(:options="optionsChartGlobalDatesMonth" ref="highcharts")
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'
	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts });

	import router from '@/router/'
  export default {
    data () {
      return {
				assessments: [],
				optionsChartGlobal: {
					lang: {
						downloadCSV: 'Descargar el puto SVG',
					},
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'pie',
						height: 450,
						backgroundColor: '#fafafa'
					},
					colors: ['#036303', '#00ff01', '#f7ff00', '#e30909'],
					title: { text: null },
					tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: { enabled: false },
							showInLegend: true
						}
					},
					series: [{
						name: 'Valoraciones',
						colorByPoint: true,
						data: [
							{ name: 'Muy Bueno', y: null }, 
							{ name: 'Bueno', y: null, sliced: true, selected: true }, 
							{ name: 'Malo', y: null }, 
							{ name: 'Muy Malo', y: null }
						]
					}]
				},
				optionsChartGlobalDatesHour: {
					chart: { type: 'column', backgroundColor: '#fafafa' },
					title: { text: 'Resultados por Hora' },
					xAxis: { 
						categories: ['00:00 hs','01:00 hs','02:00 hs','03:00 hs','04:00 hs','05:00 hs',
                '06:00 hs','07:00 hs','08:00 hs','09:00 hs','10:00 hs','11:00 hs',
                '12:00 hs','13:00 hs','14:00 hs','15:00 hs','16:00 hs','17:00 hs',
                '18:00 hs','19:00 hs','20:00 hs','21:00 hs','22:00 hs','23:00 hs',
							],
						crosshair: true 
					},
					yAxis: {
						min: 0,
						title: { text: 'Valoraciones' }
					},
					colors: ['#036303', '#00ff01', '#f7ff00', '#e30909'],
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: { pointPadding: 0.2, borderWidth: 0 }
					},
					series: [
						{ name: 'Muy Bueno', data: null }, 
						{ name: 'Bueno', data: null }, 
						{ name: 'Malo', data: null }, 
						{ name: 'Muy Malo', data: null}
					]
				},
				optionsChartGlobalDatesDay: {
					chart: { type: 'column', backgroundColor: '#fafafa' },
					title: { text: 'Resultados por Día' },
					xAxis: { categories: ['Lun','Mar','Mie','Jue','Vie','Sab','Dom'], crosshair: true },
					yAxis: {
						min: 0,
						title: { text: 'Valoraciones' }
					},
					colors: ['#036303', '#00ff01', '#f7ff00', '#e30909'],
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: { pointPadding: 0.2, borderWidth: 0 }
					},
					series: [
						{ name: 'Muy Bueno', data: null }, 
						{ name: 'Bueno', data: null }, 
						{ name: 'Malo', data: null }, 
						{ name: 'Muy Malo', data: null }
					]
				},
				optionsChartGlobalDatesMonth: {
					chart: { type: 'column', backgroundColor: '#fafafa' },
					title: { text: 'Resultados por Mes' },
					xAxis: { categories: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'], crosshair: true },
					yAxis: {
						min: 0,
						title: { text: 'Valoraciones' }
					},
					colors: ['#036303', '#00ff01', '#f7ff00', '#e30909'],
					tooltip: {
						headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' + '<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
						footerFormat: '</table>',
						shared: true,
						useHTML: true
					},
					plotOptions: {
						column: { pointPadding: 0.2, borderWidth: 0 }
					},
					series: [{
						name: 'Muy Bueno',
						data: null
					}, {
						name: 'Bueno',
						data: null
					}, {
						name: 'Malo',
						data: null
					}, {
						name: 'Muy Malo',
						data: null
					}]
				},
			}
		},
		async created() {
			this.$firebase.firestore().collection('assessments')
			.onSnapshot(querySnapshot => { 
				this.assessments = []
				querySnapshot.forEach(doc => this.assessments.push(doc.data()) )
				this.getChartGlobal()
				this.getChartGlobalDatesHour()
				this.getChartGlobalDatesDay()
				this.getChartGlobalDatesMonth()
			})
		},
		methods: {
			getAssessments() {
				this.$firebase.firestore().collection('assessments')
				.onSnapshot(querySnapshot => { 
					this.assessments = []
					querySnapshot.forEach(doc => this.assessments.push(doc.data()) )
				})
			},
			getChartGlobal() {
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0
				for (let assesment of this.assessments) {
					switch(assesment.face) {
						case 'veryGood':
							numVeryGood++
						break
						case 'good':
							numGood++
						break
						case 'bad':
							numBad++
						break
						case 'veryBad':
							numVeryBad++
						break
					}
				}
				this.optionsChartGlobal.title.text = "Encuestas realizadas hasta la fecha:" + this.assessments.length
				this.optionsChartGlobal.series[0].data[0].y = numVeryGood
				this.optionsChartGlobal.series[0].data[1].y = numGood
				this.optionsChartGlobal.series[0].data[2].y = numBad
				this.optionsChartGlobal.series[0].data[3].y = numVeryBad
			},
   		converTime(date) {
				function pad(s) { return (s < 10) ? '0' + s : s }
				var d = new Date(date)
				return d.getHours()
			},
			getDayOfWeek(date) {
				var d = new Date(date);
				return d.getDay()
			},
   		getMonth(date) {
				var d = new Date(date)
				return d.getMonth()
    	},
			getChartGlobalDatesHour() {
				let timesVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				for(let assessment of this.assessments) {
					let currentTime = this.converTime(assessment.date)
					switch(assessment.face) {
						case 'veryGood':
							timesVeryGood[currentTime]++
						break
						case 'good':
							timesGood[currentTime]++
						break
						case 'bad':
							timesBad[currentTime]++
						break
						case 'veryBad':
							timesVeryBad[currentTime]++
						break						
					}
				}
				this.optionsChartGlobalDatesHour.series[0].data = timesVeryGood
				this.optionsChartGlobalDatesHour.series[1].data = timesGood
				this.optionsChartGlobalDatesHour.series[2].data = timesBad
				this.optionsChartGlobalDatesHour.series[3].data = timesVeryBad
			},
			getChartGlobalDatesDay() {
				let daysVeryGood = [0,0,0,0,0,0,0]
				let daysGood = [0,0,0,0,0,0,0]
				let daysBad = [0,0,0,0,0,0,0]
				let daysVeryBad = [0,0,0,0,0,0,0]
				for(let assessment of this.assessments) {
					let currentDay = this.getDayOfWeek(assessment.date)
					switch(assessment.face) {
						case 'veryGood':
							daysVeryGood[currentDay]++
						break
						case 'good':
							daysGood[currentDay]++
						break
						case 'bad':
							daysBad[currentDay]++
						break
						case 'veryBad':
							daysVeryBad[currentDay]++
						break						
					}
				}
				this.optionsChartGlobalDatesDay.series[0].data = daysVeryGood
				this.optionsChartGlobalDatesDay.series[1].data = daysGood
				this.optionsChartGlobalDatesDay.series[2].data = daysBad
				this.optionsChartGlobalDatesDay.series[3].data = daysVeryBad
			},
			getChartGlobalDatesMonth() {
				let monthsVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsBad = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0]
				for(let assessment of this.assessments) {
					let currentMonth = this.getMonth(assessment.date)
					switch(assessment.face) {
						case 'veryGood':
							monthsVeryGood[currentMonth]++
						break
						case 'good':
							monthsGood[currentMonth]++
						break
						case 'bad':
							monthsBad[currentMonth]++
						break
						case 'veryBad':
							monthsVeryBad[currentMonth]++
						break						
					}
					console.log(currentMonth)
				}
				this.optionsChartGlobalDatesMonth.series[0].data = monthsVeryGood
				this.optionsChartGlobalDatesMonth.series[1].data = monthsGood
				this.optionsChartGlobalDatesMonth.series[2].data = monthsBad
				this.optionsChartGlobalDatesMonth.series[3].data = monthsVeryBad
			}
		}
  }
</script>