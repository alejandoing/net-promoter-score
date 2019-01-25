<template lang="pug">
  div.container
    div.justification(v-for="service in services" @click="dynamicDialog(service)")
      img.pr-3(:src="service.url" width=158 height=138)
      span.justification-span {{ service.title }}
      div.text
        span {{service.percentage}}% | {{service.value}} resp.
    v-dialog(v-model="dynamicDialogAct" fullscreen hide-overlay transition="dialog-bottom-transition")
      v-card
        v-toolbar(dark color="primary")
          v-btn(icon dark @click="finalize")
            v-icon close
          v-toolbar-title Detalle - Servicios: {{ currentService.title }}
          v-spacer
          v-toolbar-items
            v-btn(dark flat @click="finalize") Regresar
        v-card-text
          v-flex(xs9 offset-xs2)
            Face.pb-5(:data="currentService.stats")
          v-flex.pt-3.pb-5(xs12)
            v-card.my-1.mr-1(flat tile)
              v-card-media.white--text.primary(height="75px")
                span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ currentService.stats.indicatorsGlobal.satisfaction }}%
              v-card-title
                v-progress-linear(:value="currentService.stats.indicatorsGlobal.satisfaction" height="20" color="info")
          v-layout
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Quejas: {{ currentService.stats.indicatorsGlobal.complain[1] }}% - {{ currentService.stats.indicatorsGlobal.complain[0] }} total
                v-card-title
                  v-progress-linear(:value="currentService.stats.indicatorsGlobal.complain[1]" height="20" color="info")
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Com. Positivos: {{ currentService.stats.indicatorsGlobal.comment[1] }}% - {{ currentService.stats.indicatorsGlobal.comment[0] }} total
                v-card-title
                  v-progress-linear(:value="currentService.stats.indicatorsGlobal.comment[1]" height="20" color="info")
          v-tabs(fixed centered)
            v-tabs-bar.primary(dark)
              v-tabs-slider(class="yellow")
              v-tabs-item(href="#hourService" ripple) Horario
              v-tabs-item(href="#weekService" ripple) Día de la Semana
              v-tabs-item(href="#dayService" ripple) Día del Mes
              v-tabs-item(href="#monthService" ripple) Mensual
            v-tabs-items
              v-tabs-content(id="hourService")
                v-flex.py-5(xs12)
                  Chart(type="columnStacked" title="Distribución General Horaria" :data="chartHourGlobal")
              v-tabs-content(id="weekService")
                v-flex.py-5(xs12)
                  Chart(type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobal")
              v-tabs-content(id="dayService")
                v-flex.py-5(xs12)
                  Chart(type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobal")
              v-tabs-content(id="monthService")
                v-flex.py-5(xs12)
                  Chart(type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobal")
</template>

<script>
	import Vue from 'vue'
	import Highcharts from 'highcharts'
  import VueHighcharts from 'vue-highcharts'
  import Face from './Face.vue'
  import Chart from './Chart.vue'

	require('highcharts/modules/exporting')(Highcharts)
	Vue.use(VueHighcharts, { Highcharts })

  export default {
    props: ['data'],
    data () {
      return {
        chartHourGlobal: [],
        chartDayWGlobal: [],
        chartDayGlobal: [],
        chartMonthGlobal: [],
        dynamicDialogAct: false,
        currentService: { stats: { indicatorsGlobal: { comment: [], complain: [] }}},
				services: {
					0: { url: "./../../../static/services/pago-servicios.png", title: 'Pago Servicios', value: 0, percentage: 0 },
					1: { url: "./../../../static/services/envio-internacional.png", title: 'Envío Internacional', value: 0, percentage: 0 },
					2: { url: "./../../../static/services/pago-servicios.png", title: 'Envío Nacional', value: 0, percentage: 0 },
					3: { url: "./../../../static/services/casa-cambio.png", title: 'Casa de Cambio', value: 0, percentage: 0 },
				},
      }
    },
    watch: {
      data() {
        if (this.$props.data) {
          for (let service in this.services) {
            this.services[service].value = this.$props.data.services[service][0]
            this.services[service].percentage = this.$props.data.services[service][1]
            this.services[service].stats = this.$props.data.services[service][2]
          }
        }
      }
    },
    methods: {
      finalize() {
        this.dynamicDialogAct = false
        this.chartHourGlobal = []
        this.chartDayWGlobal = []
        this.chartDayGlobal = []
        this.chartMonthGlobal = []
      },
			dynamicDialog(data) {
        console.log(data)
        data.stats.indicatorsGlobal = { satisfaction: null, complain: [null, null], comment: [null, null] }
        this.currentService = data
        this.dynamicDialogAct = !this.dynamicDialogAct
        this.getIndicatorsGlobal(data)
        this.getChartGlobalDatesHour(data)
        this.getChartGlobalDatesDayW(data)
        this.getChartGlobalDatesDay(data)
        this.getChartGlobalDatesMonth(data)
      },
   		converTime(date) {
				function pad(s) { return (s < 10) ? '0' + s : s }
				var d = new Date(date)
				return d.getHours()
      },
   		getMonth(date) {
				var d = new Date(date)
				return d.getMonth()
      },
			getChartGlobalDatesHour(data) {
				let timesVeryGood = new Array(24).fill(0)
				let timesGood = new Array(24).fill(0)
				let timesBad = new Array(24).fill(0)
        let timesVeryBad = new Array(24).fill(0)

				for(let assessment of data.stats.assessments) {
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

				for (let i = 8; i < 23; i++) {
					let total = timesVeryGood[i] + timesGood[i] + timesBad[i] + timesVeryBad[i]
					this.chartHourGlobal.push({
						title: i + " hs",
						total,
						veryGood: this.getPercentage(timesVeryGood[i], total),
						good: this.getPercentage(timesGood[i], total),
						bad: this.getPercentage(timesBad[i], total),
						veryBad: this.getPercentage(timesVeryBad[i], total)
					})
        }
      },
			getChartGlobalDatesDayW(data) {
				let daysWVeryGood = new Array(7).fill(0)
				let daysWGood = new Array(7).fill(0)
				let daysWBad = new Array(7).fill(0)
				let daysWVeryBad = new Array(7).fill(0)
				const CATEGORIES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

				for(let assessment of data.stats.assessments) {
					let currentDay = this.getDayOfWeek(assessment.date)
					switch(assessment.face) {
						case 'veryGood':
							daysWVeryGood[currentDay]++
						break
						case 'good':
							daysWGood[currentDay]++
						break
						case 'bad':
							daysWBad[currentDay]++
						break
						case 'veryBad':
							daysWVeryBad[currentDay]++
						break						
					}
				}

				for (let i = 0; i < 7; i++) {
					let total = daysWVeryGood[i] + daysWGood[i] + daysWBad[i] + daysWVeryBad[i]
					this.chartDayWGlobal.push({
						title: CATEGORIES[i],
						total,
						veryGood: this.getPercentage(daysWVeryGood[i], total),
						good: this.getPercentage(daysWGood[i], total),
						bad: this.getPercentage(daysWBad[i], total),
						veryBad: this.getPercentage(daysWVeryBad[i], total)
					})
				}
      },
			getChartGlobalDatesMonth(data) {
				let monthsVeryGood = new Array(12).fill(0)
				let monthsGood = new Array(12).fill(0)
				let monthsBad = new Array(12).fill(0)
				let monthsVeryBad = new Array(12).fill(0)
				const CATEGORIES = ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']

				for(let assessment of data.stats.assessments) {
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
				}

				for (let i = 0; i < 12; i++) {
					let total = monthsVeryGood[i] + monthsGood[i] + monthsBad[i] + monthsVeryBad[i]
					this.chartMonthGlobal.push({
						title: CATEGORIES[i],
						total,
						veryGood: this.getPercentage(monthsVeryGood[i], total),
						good: this.getPercentage(monthsGood[i], total),
						bad: this.getPercentage(monthsBad[i], total),
						veryBad: this.getPercentage(monthsVeryBad[i], total)
					})
				}
			},
			getDayOfWeek(date) {
				var d = new Date(date)
				return d.getDay() - 1
			},
			getPercentage(part, universe) {
				let result = parseFloat(((part * 100) / universe).toFixed(2))
				return isNaN(result) ? 0 : result
			},
			getIndicatorsGlobal(data) {
				const PRC_GOOD_R = 0.25, PRC_BAD_R = 0.50, PRC_VERY_BAD_R = 1
				
        const total = data.value
				
        let complains = 0, comments = 0, services = 0, reasons = 0

				for (let assessment of data.stats.assessments) {
					assessment.complain ? complains++ : complains
					assessment.comment ? comments++ : comments
					assessment.flow.justification ? services++ : services
					assessment.flow.justificationTwo ? reasons++ : reasons
				}

				const partialGood = data.stats.good[0] * PRC_GOOD_R
				const partialBad = data.stats.bad[0] * PRC_BAD_R
				const partialVeryBad = data.stats.veryBad[0] * PRC_VERY_BAD_R
				
				const partials = partialGood + partialBad + partialVeryBad

				this.currentService.stats.indicatorsGlobal.satisfaction = 100 - this.getPercentage(partials, total)
				
				this.currentService.stats.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				this.currentService.stats.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
      },
			getChartGlobalDatesDay(data) {
				let daysVeryGood = new Array(31).fill(0)
				let daysGood = new Array(31).fill(0)
				let daysBad = new Array(31).fill(0)
				let daysVeryBad = new Array(31).fill(0)

				for(let assessment of data.stats.assessments) {
					let currentDay = new Date(assessment.date).getDate()
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

				for (let i = 1; i < 32; i++) {
					let total = daysVeryGood[i] + daysGood[i] + daysBad[i] + daysVeryBad[i]
					this.chartDayGlobal.push({
						title: "Día " + i,
						total: isNaN(total) ? 0 : total,
						veryGood: this.getPercentage(daysVeryGood[i], total),
						good: this.getPercentage(daysGood[i], total),
						bad: this.getPercentage(daysBad[i], total),
						veryBad: this.getPercentage(daysVeryBad[i], total)
					})
				}
			},
    },
    components: {
      Face, Chart
    }
	}
</script>

<style lang="sass" scoped>
  .container
    display: grid
    position: relative
    right: 30px
    grid-template: 1fr / repeat(4, .5fr)
    .justification
      .text
        display: grid
        justify-content: center
        font-size: 20px
        grid-template: .5fr .5fr / 1fr
        span
          font-size: 18px
          text-align: center
  .justification
    display: grid
    justify-content: center
    padding-right: 30px
    img
      cursor: pointer
      padding: 0 !important
    .justification-span
      justify-self: center
      font-size: 20px
      font-weight: bold
</style>