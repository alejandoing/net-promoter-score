<template lang="pug">
  div.container
    .justification(v-for="zone in zones" @click="dynamicDialog(zone)")
      img(:src="zone.url" width=158 height=138)
      span.justification-span {{ zone.title }}
      .text-xs-center.text
        span {{ zone.value }} {{ title }} | {{ zone.stats.satisfaction || 0 }} {{ titleTwo }}
    v-dialog(v-model="dynamicDialogAct" fullscreen hide-overlay transition="dialog-bottom-transition")
      v-card
        v-toolbar(dark color="primary")
          v-btn(icon dark @click="finalize")
            v-icon close
          v-toolbar-title Detalle - Zonas: {{ currentZone.title }}
          v-spacer
          v-toolbar-items
            v-btn(dark flat @click="finalize") Regresar
        v-card-text
          v-flex(xs9 offset-xs2)
            Face.pb-5(:data="statsFacesZone")
          v-flex(xs3 offset-xs10)
            v-tooltip(top)
              v-btn(
                fab
                color="primary"
                slot="activator"
                @click="printGeneralReport(currentZone.stats.assessments)"
                :loading="loading2"
                :disabled="loading2"
              )
                v-icon(dark) picture_as_pdf
              span Generar Reporte (PDF)
            v-tooltip(top)
              v-btn(
                fab
                color="primary"
                slot="activator"
                @click="downloadXLSX(currentZone.stats.assessments)"
                :loading="loading3"
                :disabled="loading3"
              )
                v-icon(dark) storage
              span Descargar Crudo de Datos (XLSX)
          v-flex.pt-3.pb-5(xs12)
            v-card.my-1.mr-1(flat tile)
              v-card-media.white--text.primary(height="75px")
                span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ currentZone.stats.indicatorsGlobal.satisfaction }}%
              v-card-title
                // v-progress-linear(:value="currentZone.stats.indicatorsGlobal.satisfaction" height="20" color="info")
                span.display-1.headline % que representa el grado general de satisfacción del cliente.
          v-layout
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Quejas: {{ currentZone.stats.indicatorsGlobal.complain[1] }}% - {{ currentZone.stats.indicatorsGlobal.complain[0] }} total
                v-card-title
                  //v-progress-linear(:value="currentZone.stats.indicatorsGlobal.complain[1]" height="20" color="info")
                  span.display-1.headline % del total de encuestados que dejaron una queja.
            v-flex(xs6)
              v-card.my-1.mr-1(flat tile)
                v-card-media.white--text.primary(height="75px")
                  span.indicatorsTwoTitle.ml-4.pt-3 Com. Positivos: {{ currentZone.stats.indicatorsGlobal.comment[1] }}% - {{ currentZone.stats.indicatorsGlobal.comment[0] }} total
                v-card-title
                  //v-progress-linear(:value="currentZone.stats.indicatorsGlobal.comment[1]" height="20" color="info")
                  span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
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
	import jsPDF from 'jspdf'
	import html2canvas from 'html2canvas'
	import XLSX from 'xlsx'
	import { saveAs } from 'file-saver'
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
				statsFacesZone: null,
				loader2: null,
				loading3: false,
				loading2: false,
				locals: [],
				zones2: [],
				userStorage: JSON.parse(localStorage.getItem('user')),
				title: 'resp.',
				titleTwo: '% satis',
        chartHourGlobal: [],
        chartDayWGlobal: [],
        chartDayGlobal: [],
        chartMonthGlobal: [],
        dynamicDialogAct: false,
        currentZone: { stats: { indicatorsGlobal: { comment: [], complain: [], satisfaction: "" }}},
				zones: {
					0: { index: 0, ftitle: 'MM3exjMdkKaQ0cUkAkM2', url: "./../../../static/zones/walter-mancho.png", title: 'Walter Mancho', value: 0, percentage: 0, stats: { satisfaction: null }  },
					1: { index: 1, ftitle: 'MopGQtv8fBJU4Pbad7vD', url: "./../../../static/zones/luciana-bernadotti.png", title: 'Luciana Bernadotti', value: 0, percentage: 0, stats: { satisfaction: null }  },
					2: { index: 2, ftitle: 'Ngw5aiu8JFFKlHMDeZVd', url: "./../../../static/zones/cristina-marigomez.png", title: 'Cristina Marigomez', value: 0, percentage: 0, stats: { satisfaction: null }  },
          3: { index: 3, ftitle: 'cRc6N1NsFEXInsBtkB9w', url: "./../../../static/zones/dardo-ricci.png", title: 'Dardo Ricci', value: 0, percentage: 0, stats: { satisfaction: null }  },
          4: { index: 4, ftitle: 'mTMi65jxCFXXglPMEARV', url: "./../../../static/zones/diego-longo.png", title: 'Diego Longo', value: 0, percentage: 0, stats: { satisfaction: null }  },
					5: { index: 5, ftitle: 'wk77ITDgnPYUjZ28MxJK', url: "./../../../static/zones/florencia-casa.png", title: 'Florencia Casa', value: 0, percentage: 0, stats: { satisfaction: null }  },
					6: { index: 6, ftitle: '9O2CXPk2PFzaNV2JBpRL', url: "./../../../static/zones/eduardo-cesio.png", title: 'Eduardo Cesio', value: 0, percentage: 0, stats: { satisfaction: null }  },
				},
      }
		},
    watch: {
      data() {
        if (this.$props.data) {
					let index
          for (let zone in this.zones) {
						if (this.$props.data.zones) {
							this.title = "quej."
							this.titleTwo = " com."
							try {
								this.zones[zone].value = this.$props.data.zones[zone][0]
								this.zones[zone].stats.satisfaction = this.$props.data.zones[zone][1]
							} catch(e) {
								e = null
							}
						} else {
							index = this.zones[zone].index
							this.zones[zone].value = this.$props.data[index][0]
							this.zones[zone].percentage = this.$props.data[index][1]
							this.zones[zone].stats = this.$props.data[index][2]					
						}
					}
        }
			},
      loader2 () {
				const l = this.loader2
				this[l] = !this[l]
			},
		},
    methods: {
			async printGeneralReport(data) {
				this.loader2 = 'loading2'

				const FILENAME  = 'reporte_zona.pdf'
				let pdf = new jsPDF()

				const WU_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nOzdZ5gk2Vkn+n+kL5Plvfe+2nePk0PSlRBIK4GE0BV+BfvgBIhdLuwud7XsrHZBXF1Ae9HCwgq38ICklQQaNCADkkZtqqrLe+99VWZVehtxP/SMZrqzuiOqTmZWReT/9zz5YWKy09eJN97znvcARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER6IplMJhQVFZ3pH7tcLossyw4ANgCmpL4yIiIiOkkMQCg7OzuUnZ196n8ciUTg8XhgaWhowOLiouZ/uLm56RgeHu75q7/6qzd/8YtffC4YDHYBqAHgOPWrICIiotM6ALDS1tY28ta3vvXr733ve+/cvHlzzWw2a/rHL7zwAt71rncBTU1NUBRF9Xb79u3cd7/73T9aU1PzEgA/AIU33njjjTfeeDv32+aNGzf+6KMf/eiNg4MDk9r5/Etf+hIAqAcA4XDY9Bu/8Rtvs9vtowDiF+CN8sYbb7zxxhtviTf/U089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'
				const DWT_LOGO = 'data:image/jpeg;base64,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'

				pdf.addImage(WU_LOGO, 'JPEG', 80, 80, 50, 50)
				pdf.setFontSize(24)
				pdf.text('NET-PROMOTER-SCORE', 55, 130)
				pdf.setFontSize(20)
				pdf.text(`Reporte de Valoraciones (${this.currentZone.title})`, 35, 150)
				pdf.setFontSize(12)
				pdf.text('Powered by DiwaIT', 80, 280)
				pdf.addImage(DWT_LOGO, 'JPEG', 118, 275, 6, 6)
				pdf.addPage('a4', 'portrait')
				pdf.setFontSize(20)
				pdf.text('Número de Valoraciones e Indicadores', 40, 20)

				async function getCanvas(ID) {
					return await html2canvas(document.getElementById(ID), {scale: 1})
				}

				const zoneFacesData2 = document.getElementById('zoneFaces')

				zoneFacesData2.style.display = "grid"

				zoneFacesData2.childNodes[0].children[1].children[0].innerHTML = `${this.currentZone.stats.veryGood[1]}%`
				zoneFacesData2.childNodes[0].children[1].children[1].innerHTML = `${this.currentZone.stats.veryGood[0]} resp.`

				zoneFacesData2.childNodes[1].children[1].children[0].innerHTML = `${this.currentZone.stats.good[1]}%`
				zoneFacesData2.childNodes[1].children[1].children[1].innerHTML = `${this.currentZone.stats.good[0]} resp.`
				
				zoneFacesData2.childNodes[2].children[1].children[0].innerHTML = `${this.currentZone.stats.bad[1]}%`
				zoneFacesData2.childNodes[2].children[1].children[1].innerHTML = `${this.currentZone.stats.bad[0]} resp.`

				zoneFacesData2.childNodes[3].children[1].children[0].innerHTML = `${this.currentZone.stats.veryBad[1]}%`
				zoneFacesData2.childNodes[3].children[1].children[1].innerHTML = `${this.currentZone.stats.veryBad[0]} resp.`

				const zoneFaces = await getCanvas('zoneFaces')
				pdf.addImage(zoneFaces.toDataURL('image/png'), 'PNG', 11, 35, 195, 30)

				const zonesIndSatisfaction = document.getElementById('satisfactionIndZones')

				zonesIndSatisfaction.style.display = "block"
				zonesIndSatisfaction.childNodes[0].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML = `Satisfacción del Cliente ${this.currentZone.stats.satisfaction}%`

				const satisfactionInd = await getCanvas('satisfactionIndZones')
				pdf.addImage(satisfactionInd.toDataURL('image/png'), 'PNG', 10, 70, 190, 30)

				const zonesIndicators = document.getElementById('indicatorsZones')

				zonesIndicators.style.display = "flex"

				zonesIndicators.childNodes[0].children[0].children[0].children[0]
				.children[0].children[0].children[0].children[0].innerHTML = `Quejas ${this.currentZone.stats.indicatorsGlobal.complain[1]}% - Total ${this.currentZone.stats.indicatorsGlobal.complain[0]}`

				zonesIndicators.childNodes[1].children[0].children[0].children[0]
				.children[0].children[0].children[0].children[0].innerHTML = `Com. Positivos ${this.currentZone.stats.indicatorsGlobal.comment[1]}% - Total ${this.currentZone.stats.indicatorsGlobal.comment[0]}`

				document.getElementById('indicatorsZones').style.display = "flex"
				
				const indicators = await getCanvas('indicatorsZones')
				pdf.addImage(indicators.toDataURL('image/png'), 'PNG', 10, 95, 190, 30)
				pdf.text('Gráficos de Valoraciones por Tiempo', 49, 130)

				const chartHourZone = document.getElementById('chartHourZones')
				chartHourZone.style.display = "block"
				
				const hour = await getCanvas('chartHourZones')
				pdf.addImage(hour.toDataURL('image/png'), 'PNG', 10, 145, 190, 120)
				pdf.addPage('a4', 'portrait')

				const weekChartZone = document.getElementById('weekChartZones')
				weekChartZone.style.display = "block"
				
				const weekChartPDF = await getCanvas('weekChartZones')
				pdf.addImage(weekChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)

				const dayChartZone = document.getElementById('dayChartZones')
				dayChartZone.style.display = "block"

				const dayChartPDF = await getCanvas('dayChartZones')
				pdf.addImage(dayChartPDF.toDataURL('image/png'), 'PNG', 10, 150, 190, 120)
				pdf.addPage('a4', 'portrait')

				const monthChartZone = document.getElementById('monthChartZones')
				monthChartZone.style.display = "block"

				const monthChartPDF = await getCanvas('monthChartZones')
				pdf.addImage(monthChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)

					// const serviceFaces = await getCanvas('serviceFaces')
					// console.log(document.getElementById('serviceFaces'))
					// pdf.addImage(serviceFaces.toDataURL('image/png'), 'PNG', 10, 35, 195, 30)

					// const satisfactionInd = await getCanvas('satisfactionInd')
					// pdf.addImage(satisfactionInd.toDataURL('image/png'), 'PNG', 10, 70, 190, 30)

					// const indicators = await getCanvas('indicators')
					// pdf.addImage(indicators.toDataURL('image/png'), 'PNG', 10, 95, 190, 50)
					// pdf.text('Gráficos de Valoraciones por Tiempo', 49, 160)
					
					// const hour = await getCanvas('hour')
					// pdf.addImage(hour.toDataURL('image/png'), 'PNG', 10, 165, 190, 120)
					// pdf.addPage('a4', 'portrait')
					
					// const weekChartPDF = await getCanvas('weekChart')
					// pdf.addImage(weekChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)

					// const dayChartPDF = await getCanvas('dayChart')
					// pdf.addImage(dayChartPDF.toDataURL('image/png'), 'PNG', 10, 150, 190, 120)
					// pdf.addPage('a4', 'portrait')

					// const monthChartPDF = await getCanvas('monthChart')
					// pdf.addImage(monthChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)
					// pdf.text('Resultados por Categoría', 65, 155)

					// const services = await getCanvas('services')
					// pdf.addImage(services.toDataURL('image/png'), 'PNG', 10, 165, 220, 50)
					
					// const reasons = await getCanvas('reasons')
					// pdf.addImage(reasons.toDataURL('image/png'), 'PNG', 10, 210, 220, 50)
					// pdf.addPage('a4', 'portrait')
					
					// const zones = await getCanvas('zones')
					// pdf.addImage(zones.toDataURL('image/png'), 'PNG', 10, 20, 200, 80)
					// pdf.text('Puntos Débiles y Fuertes', 65, 115)
					
					// const strongPoints = await getCanvas('strongPoints')
					// pdf.addImage(strongPoints.toDataURL('image/png'), 'PNG', 10, 125, 190, 120)

					// const weakPoints = await getCanvas('weakPoints')
					// pdf.addPage('a4', 'portrait')
					// pdf.addImage(weakPoints.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)
					// pdf.text('Gráficos de Valoraciones por Locales', 50, 150)

					// const topLocals = await getCanvas('topLocals')
					// pdf.addImage(topLocals.toDataURL('image/png'), 'PNG', 10, 160, 190, 120)
					// pdf.addPage('a4', 'portrait')

					// const badLocals = await getCanvas('badLocals')
					// pdf.addImage(badLocals.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)
					pdf.save(FILENAME)
					zoneFacesData2.style.display = "none"
					zonesIndSatisfaction.style.display = "none"
					chartHourZone.style.display = "none"
					weekChartZone.style.display = "none"
					dayChartZone.style.display = "none"
					monthChartZone.style.display = "none"
					this.loading2 = false
					this.loader2 = null
			},
			downloadXLSX(data) {
				this.loader2 = 'loading3'
				const wb = XLSX.utils.book_new();
				let y = 0

				wb.Props = {
					Title: "SheetJS Tutorial",
					Subject: "Test",
					Author: "Red Stapler",
					CreatedDate: new Date(2017,12,19)
				};
				
				wb.SheetNames.push("NPS Crudo de Datos");

				const ws_data = [
					['ID' , 'Local', 'Jefe Zonal', 'Fecha', 'Hora', 'Valoración', 'Servicio', 'Motivo', 'Comentario', 'Email', 'Teléfono'],
				]

				for (let assessment of data) {
					ws_data.push(new Array(10).fill(null))
					ws_data[ws_data.length - 1][0] = assessment.id
					ws_data[ws_data.length - 1][1] = this.locals.find(item => item.id == assessment.local).title
					ws_data[ws_data.length - 1][2] = this.zones2.find(item => item.id == assessment.zone).responsable
					ws_data[ws_data.length - 1][3] = `
						${new Date(assessment.date).getDate() > 9 ? new Date(assessment.date).getDate() : "0" + new Date(assessment.date).getDate()}/
						${new Date(assessment.date).getMonth() + 1 > 9 ? new Date(assessment.date).getMonth() + 1 : "0" + (new Date(assessment.date).getMonth() + 1)}/
						${new Date(assessment.date).getFullYear()}
					`
					ws_data[ws_data.length - 1][4] = `
						${new Date(assessment.date).getHours()}:
						${new Date(assessment.date).getMinutes() > 9 ? new Date(assessment.date).getMinutes() : "0" + new Date(assessment.date).getMinutes()}:
						${new Date(assessment.date).getSeconds() > 9 ? new Date(assessment.date).getSeconds() : "0" + new Date(assessment.date).getSeconds()}
					`
					ws_data[ws_data.length - 1][5] = assessment.face
					ws_data[ws_data.length - 1][6] = assessment.justification
					ws_data[ws_data.length - 1][7] = assessment.justificationTwo
					this.$firebase.firestore().collection('tickets').where('assessment', '==', assessment.id).get().then(querySnapshot => {
						querySnapshot.forEach(doc => {
							const a = ws_data.findIndex(item => item[0] == assessment.id)
							ws_data[a][8] = doc.data().description
							ws_data[a][9] = doc.data().email
							ws_data[a][10] = doc.data().telephone
						})
						y++
						if (y == data.length) {
							const ws = XLSX.utils.aoa_to_sheet(ws_data);

							wb.Sheets["NPS Crudo de Datos"] = ws;

							const wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
							
							function s2ab(s) { 
								const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
								const view = new Uint8Array(buf);  //create uint8array as viewer
								for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
								return buf;
							}

							saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'NPS_Datos_Crudos_WU.xlsx');
							this.loading3 = false
							this.loader2 = null
						}
					})
				}
			},
      finalize() {
        this.dynamicDialogAct = false
        this.chartHourGlobal = []
        this.chartDayWGlobal = []
        this.chartDayGlobal = []
        this.chartMonthGlobal = []
      },
			async dynamicDialog(data) {
				if (this.title == "quej.") return false
				this.statsFacesZone = (await this.$axios.post('zones/stats/faces/value-prc', { 
					zone: data.ftitle, condition: data.stats.filter || ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data
				
				this.dynamicDialogAct = !this.dynamicDialogAct
				data.stats.indicatorsGlobal = { 
					faces: this.statsFacesReason,
					satisfaction: null,
					complain: [null, null],
					comment: [null, null]
				}
				this.currentZone = data
				// console.log(this.currentService.stats)
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
			async getChartGlobalDatesHour(data) {
				const hoursStats = (await this.$axios.post('/zones/stats/hour', { zone:  data.ftitle,
				condition: data.stats.filter || ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data

				this.chartHourGlobal = []

				for (let i = 0; i < hoursStats.length; i++) {
					this.chartHourGlobal.push({
						title: i + " hs",
						total: hoursStats[i].total,
						veryGood: this.getPercentage(hoursStats[i].veryGood, hoursStats[i].total),
						good: this.getPercentage(hoursStats[i].good, hoursStats[i].total),
						bad: this.getPercentage(hoursStats[i].bad, hoursStats[i].total),
						veryBad: this.getPercentage(hoursStats[i].veryBad, hoursStats[i].total)
					})
				}

				this.chartHourGlobalZone = this.chartHourGlobal
      },
			async getChartGlobalDatesDayW(data) {
				const dayWStats = (await this.$axios.post('/zones/stats/dayW', { zone:  data.ftitle,
				condition: data.stats.filter || ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data
				
				const CATEGORIES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

				this.chartDayWGlobal = []

				for (let i = 0; i < dayWStats.length; i++) {
					this.chartDayWGlobal.push({
						title: CATEGORIES[i],
						total: dayWStats[i].total,
						veryGood: this.getPercentage(dayWStats[i].veryGood, dayWStats[i].total),
						good: this.getPercentage(dayWStats[i].good, dayWStats[i].total),
						bad: this.getPercentage(dayWStats[i].bad, dayWStats[i].total),
						veryBad: this.getPercentage(dayWStats[i].veryBad, dayWStats[i].total)
					})
				}
      },
			async getChartGlobalDatesMonth(data) {
				const monthStats = (await this.$axios.post('/zones/stats/month', { zone:  data.ftitle })).data
				const CATEGORIES = ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']

				this.chartMonthGlobal = []

				for (let i = 0; i < monthStats.length; i++) {
					this.chartMonthGlobal.push({
						title: CATEGORIES[monthStats[i].month - 1],
						total: monthStats[i].total,
						veryGood: this.getPercentage(monthStats[i].veryGood, monthStats[i].total),
						good: this.getPercentage(monthStats[i].good, monthStats[i].total),
						bad: this.getPercentage(monthStats[i].bad, monthStats[i].total),
						veryBad: this.getPercentage(monthStats[i].veryBad, monthStats[i].total)
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
			async getIndicatorsGlobal(data) {
				const PRC_GOOD_R = 0.25, PRC_BAD_R = 0.50, PRC_VERY_BAD_R = 1
				
        const total = data.value

				const partialGood = data.stats.good.value * PRC_GOOD_R
				const partialBad = data.stats.bad.value * PRC_BAD_R
				const partialVeryBad = data.stats.veryBad.value * PRC_VERY_BAD_R
				
				const partials = partialGood + partialBad + partialVeryBad
				if (!partials) this.currentZone.stats.indicatorsGlobal.satisfaction = 100
				else {
					if (!this.getPercentage(partials, total)) this.currentZone.stats.indicatorsGlobal.satisfaction = 0
					else this.currentZone.stats.indicatorsGlobal.satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
				}
				
				const complains = (await this.$axios.post('/zones/stats/complain', { zone: data.ftitle,
				condition: data.stats.filter || ` AND MONTH(date) = ${new Date().getMonth() + 1 } `})).data[0]
				
				const comments = (await this.$axios.post('/zones/stats/comment', { zone: data.ftitle,
				condition: data.stats.filter || ` AND MONTH(date) = ${new Date().getMonth() + 1 } `})).data[0]

				this.currentZone.stats.indicatorsGlobal.complain = [complains.value, complains.percentage]
				this.currentZone.stats.indicatorsGlobal.comment = [comments.value, comments.percentage]
				
				this.dynamicDialogAct = false
				this.dynamicDialogAct = true
      },
			async getChartGlobalDatesDay(data) {
				const dayStats = (await this.$axios.post('/zones/stats/day', { zone:  data.ftitle,
				condition: data.stats.filter || ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data

				console.log(dayStats)
				
				this.chartDayGlobal = []

				for (let data of dayStats) {
					this.chartDayGlobal.push({
						title: "Día " + data.day,
						total: data.total,
						veryGood: this.getPercentage(data.veryGood, data.total),
						good: this.getPercentage(data.good, data.total),
						bad: this.getPercentage(data.bad, data.total),
						veryBad: this.getPercentage(data.veryBad, data.total)
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
  .indicatorsTwoTitle
    font-size: 20px
  .container
    display: grid
    position: relative
    right: 30px
    grid-template: 1fr / repeat(4, .5fr)
    .justification
      .text
        display: grid
        justify-content: center
        font-size: 14px
        grid-template: .5fr .5fr / 1fr
        span
          font-size: 16px
          text-align: center
  .justification
    display: grid
    justify-content: center
    padding-right: 30px
    img
      cursor: pointer
      padding: 0 !important
      text-align: center
    .justification-span
      justify-self: center
      font-size: 16px
      font-weight: bold
</style>