<template lang="pug">
	v-container.mainContainer(fluid v-if="assessments")
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Resultados Generales
					v-divider
			v-flex(xs9 offset-xs2)
				Face.pb-5(:data="assessments.stats")
			v-flex.pt-3.pb-5(xs12)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.display-1.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction }}%
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.satisfaction" height="20" color="info")
			v-flex(xs3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
			v-flex(xs3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Comentarios: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")
			v-flex(xs3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Just. Servicio: {{ indicatorsGlobal.service[1] }}% - {{ indicatorsGlobal.service[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.satisfaction" height="20" color="info")
			v-flex(xs3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Just. Motivo: {{ indicatorsGlobal.reason[1] }}% - {{ indicatorsGlobal.reason[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.satisfaction" height="20" color="info")
			v-tabs(fixed centered)
				v-tabs-bar.primary(dark)
					v-tabs-slider(class="yellow")
					v-tabs-item(href="#hour" ripple) Horario
					v-tabs-item(href="#week" ripple) Día de la Semana
					v-tabs-item(href="#day" ripple) Día del Mes
					v-tabs-item(href="#month" ripple) Mensual
				v-tabs-items
					v-tabs-content(id="hour")
						v-flex.py-5(xs12 v-if="assessments")
							Chart(type="columnStacked" title="Distribución General Horaria" :data="chartHourGlobal")
					v-tabs-content(id="week")
						v-flex.py-5(xs12 v-if="assessments")
							Chart(type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobal")
					v-tabs-content(id="day")
						v-flex.py-5(xs12 v-if="assessments")
							Chart(type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobal")
					v-tabs-content(id="month")
						v-flex.py-5(xs12 v-if="assessments")
							Chart(type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobal")
			v-flex.pt-5(xs6 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Mejores Locales" :data="topLocals")
			v-flex.pt-5(xs6 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Peores Locales" :data="topLocals")
			v-flex(xs12)
				div.pb-5
					span.display-1 Resultados por Local
					v-divider
			template(v-if="locals")
				v-flex(xs4 v-for="local in locals" :key="local.title")
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text.primary(height="100px")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.display-1.headline {{ local.title }}
										v-divider
						v-card-title
							v-layout(row wrap)
								v-flex(xs12)
									v-badge(right color="blue")
										span(slot="badge") {{ local.assessments.total }}
										span Valoraciones
								v-flex.my-2(xs12 v-if="local.assessments.total")
									span Satisfacción de Cliente {{ local.indicators.satisfaction }} %
									v-progress-linear(:value="local.indicators.satisfaction" height="20" color="info")
								v-flex.my-2(xs12 v-if="local.assessments.total")
									span Indice de Justificación {{ local.indicators.justification }} %
									v-progress-linear(:value="local.indicators.justification" height="20" color="info")
						v-card-actions
							v-btn(flat color="primary" @click.native="selectLocal(local)" :disabled="!local.assessments.total") Ver Resultados
							v-btn(:to="'/locals/' + local.id" flat color="primary") Ir al Local
			v-flex(xs12 sm12 v-else) 
				span.message ¡Aún no se han registrado locales para esta organización!
			v-layout.py-5(row child-flex justify-center align-center wrap v-if='!locals')
				v-flex(fill-height xs12 offset-xs5)
					v-btn(to="/locals/new/" large outline color="primary") Registrar Local
			v-flex(xs12)
				div.pb-5
					span.display-1 Resultados Personalizados
					v-divider
			v-flex(xs12 sm4 offset-sm2)
				v-menu(
					lazy
					:close-on-click="false"
					v-model="menuDateSince"
					transition="scale-transition"
					offset-y
					full-width
					:nudge-right="40"
					max-width="290px"
					min-width="290px"
				)
					v-text-field(
						slot="activator" 
						label="Fecha Desde" 
						v-model="dateSinceFormatted" 
						prepend-icon="event" 
						@click="activeDateMenus"
					)
					v-date-picker(
						locale="es-sp"
						v-model="dateSince"
						@input="dateSinceFormatted = formatDate($event)"
						no-title
						scrollable
						actions
					)
						template(slot-scope="{ save, cancel }")
							v-card-actions
								v-spacer
								v-btn(flat color="primary" @click="save") Seleccionar
								v-btn(flat color="primary" @click="desactiveDateMenus") Cancelar
			v-flex(xs12 sm4)
				v-menu(
					lazy
					:close-on-click="false"
					v-model="menuDateUntil"
					transition="scale-transition"
					offset-y
					full-width
					:nudge-right="40"
					max-width="290px"
					min-width="290px"
				)
					v-text-field(
						slot="activator" 
						label="Fecha Hasta" 
						v-model="dateUntilFormatted" 
						prepend-icon="event"
					)
					v-date-picker(
						locale="es-sp" 
						v-model="dateUntil" 
						@input="dateUntilFormatted = formatDate($event)" 
						no-title 
						scrollable
						actions
					)
						template(slot-scope="{ save, cancel }")
							v-card-actions
								v-spacer
								v-btn(flat color="primary" @click="save") Seleccionar
								v-btn(flat color="primary" @click="desactiveDateMenus") Cancelar
			v-flex(xs12 sm4 offset-sm2)
				v-menu(
					lazy
					:close-on-content-click="false"
					v-model="menuTimeSince"
					transition="scale-transition"
					offset-y
					full-width
					:nudge-right="40"
					max-width="290px"
					min-width="290px"
				)
					v-text-field(
						slot="activator"
						label="Hora Desde"
						v-model="timeSince"
						prepend-icon="access_time"
						readonly
					)
					v-time-picker(v-model="timeSince" autosave format="24hr")
						template(slot-scope="{ save, cancel }")
							v-card-actions
								v-btn(flat color="primary" @click="desactiveTimeMenuSince") Cancelar
			v-flex(xs12 sm4)
				v-menu(
					lazy
					:close-on-content-click="false"
					v-model="menuTimeUntil"
					transition="scale-transition"
					offset-y
					full-width
					:nudge-right="40"
					max-width="290px"
					min-width="290px"
				)
					v-text-field(
						slot="activator"
						label="Hora Hasta"
						v-model="timeUntil"
						prepend-icon="access_time"
						readonly
					)
					v-time-picker(v-model="timeUntil" autosave format="24hr")
						template(slot-scope="{ save, cancel }")
							v-card-actions
								v-btn(flat color="primary" @click="desactiveTimeMenuUntil") Cancelar
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline :loading="loading" :disabled="loading || (!timeSince && !dateSince)" @click.native="searchStats" color="primary") Obtener Resultados
					span.custom-loader(slot="loader")
						v-icon(light) cached
				div(style="flex: 1 1 auto;")
		v-dialog(v-model="dialog" persistent max-width="500" fullscreen transition="dialog-bottom-transition" :overlay=false scrollable)
			v-card
				v-toolbar(style="flex: 0 0 auto;" dark class="primary")
					v-btn(icon @click.native="dialog = false" dark)
						v-icon close
					v-toolbar-title Resultados de local: {{ currentLocal.title }}
				v-card-text
					v-flex(xs12)
						highcharts(:options="optionsChartLocal" ref="highcharts")
					v-tabs(fixed centered)
						v-tabs-bar(class="primary" dark)
							v-tabs-slider(class="yellow")
							v-tabs-item(href="#hour-local" ripple) Por hora
							v-tabs-item(href="#day-local" ripple) Por día
							v-tabs-item(href="#month-local" ripple) Por mes
						v-tabs-items
							v-tabs-content(id="hour-local")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartLocalDatesHour" ref="highcharts")
							v-tabs-content(id="day-local")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartLocalDatesDay" ref="highcharts")
							v-tabs-content(id="month-local")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartLocalDatesMonth" ref="highcharts")
				div(style="flex: 1 1 auto;")
		v-dialog(v-model="dialogPreResults" persistent max-width="500")
			v-card
				v-card-title.headline(v-html="titleDialogPreResults")
				v-card-text(v-html="textDialogPreResults")
				v-card-actions
					v-spacer
					v-btn(color="green darken-1" flat @click.native="dialogPreResults = false") Entendido
		v-dialog(v-model="dialogResults" persistent max-width="500" fullscreen transition="dialog-bottom-transition" :overlay=false scrollable)
			v-card
				v-toolbar(style="flex: 0 0 auto;" dark class="primary")
					v-btn(icon @click.native="dialogResults = false" dark)
						v-icon close
					v-toolbar-title Resultados personalizados:
				v-card-text
					v-flex(xs12)
						highcharts(:options="optionsChartCustom" ref="highcharts")
					v-tabs(fixed centered)
						v-tabs-bar(class="primary" dark)
							v-tabs-slider(class="yellow")
							v-tabs-item(href="#hour-custom" ripple) Por hora
							v-tabs-item(href="#day-custom" ripple) Por día
							v-tabs-item(href="#month-custom" ripple) Por mes
						v-tabs-items
							v-tabs-content(id="hour-custom")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartCustomDatesHour" ref="highcharts")
							v-tabs-content(id="day-custom")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartCustomDatesDay" ref="highcharts")
							v-tabs-content(id="month-custom")
								v-flex.py-5(xs12)
									highcharts(:options="optionsChartCustomDatesMonth" ref="highcharts")
				div(style="flex: 1 1 auto;")
</template>

<script>
	import Vue from 'vue'
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'
	import router from '@/router/'
	import Chart from './Chart.vue'
	import Face from './Face.vue'

	require('highcharts/modules/exporting')(Highcharts)

  export default {
		components: {
			Chart,
			Face
		},
		mixins: [validationMixin],
		validations: {},
    data () {
      return {
				chartHourGlobal: null,
				chartDayWGlobal: null,
				chartDayGlobal: null,
				chartMonthGlobal: null,
				topLocals: JSON.parse(localStorage.getItem('topLocals')),
				badLocals: [],
				menuDateSince: false,
				menuDateUntil: false,
				dateSince: null,
				dateUntil: null,
				dateSinceFormatted: null,
				dateUntilFormatted: null,
				menuTimeSince: false,
				menuTimeUntil: false,
				timeSince: null,
				timeUntil: null,
				results: null,
        time: null,
				loading: false,
				loader: null,
				dateFormatted2: null,
				locals: false,
				currentLocal: { title: null },
				assessments: [],
				indicatorsGlobal: { satisfaction: null, complain: [], comment: [], service: [], reason: [] },
				indicatorsLocal: [],
				dialog: false,
				dialogPreResults: false,
				dialogResults: false,
				textDialogPreResults: null,
				titleDialogPreResults: null,
				userStorage: JSON.parse(localStorage.getItem('user')),
				optionChartGlobalStacked2: {
					chart: {
						type: 'column',
						height: '600'
					},
					title: {
							text: 'Todas las Unidades Combinandas - Distribución Diaria'
					},
					xAxis: {
							categories: ['01/07', '02/07', '03/07',
							'04/07', '05/07', '06/07', '07/07', '08/07', '09/07', '10/07', '11/07', '12/07',
							'13/07', '14/07', '15/07', '16/07', '17/07', '18/07', '19/07', '20/07', '21/07',
							'22/07', '23/07', '24/07', '25/07', '26/07', '27/07', '28/07', '29/07', '30/07',
							'31/07']
					},
					yAxis: {
							min: 0,
							max: 100,
							title: {
									text: 'Promedio de Valoraciones'
							}
					},
					legend: {
							reversed: true
					},
					plotOptions: {
							series: {
									stacking: 'normal',
									dataLabels: {
											useHTML: true,
											enabled: true,
											color: '#000000',
											format: '{y}%',
											rotation: 270,
											style: {
													fontWeight: 'bold',
													fontSize: '10px',
													fill: 'black'
											}
									}
							}
					},
					series: [{
							name: 'Muy Bueno',
							data: [30, 20, 30, 10, 20, 30, 20, 40, 40, 20, 40, 20, 40, 40, 20,
							30, 40, 30, 10, 40, 30, 20, 40, 10, 20, 40, 20, 30, 40, 20, 40]
					}, {
							name: 'Bueno',
							data: [30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
							30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
					}, {
							name: 'Malo',
							data: [30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
							30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
					}, {
							name: 'Muy Malo',
							data: [10, 40, 10, 30, 40, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30,
							30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 30, 20, 30, 20]
					}],
					colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
				},
				optionChartGlobalStacked3: {
					chart: {
						type: 'column',
						height: '600'
					},
					title: {
							text: 'Todas las Unidades Combinadas - Distribución por Día Laboral'
					},
					xAxis: {
							categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
					},
					yAxis: {
							min: 0,
							max: 100,
							title: {
									text: 'Promedio de Valoraciones'
							}
					},
					legend: {
							reversed: true
					},
					plotOptions: {
							series: {
									stacking: 'normal',
									dataLabels: {
											useHTML: true,
											enabled: true,
											color: '#000000',
											format: '{y}%',
											style: {
													fontWeight: 'bold',
													fontSize: '12px',
													fill: 'black'
											}
									}
							}
					},
					series: [{
							name: 'Muy Bueno',
							data: [30, 20, 30, 20, 20, 20, 30]
					}, {
							name: 'Bueno',
							data: [20, 20, 30, 20, 20, 20, 30]
					}, {
							name: 'Malo',
							data: [30, 20, 20, 30, 20, 30, 20]
					}, {
							name: 'Muy Malo',
							data: [20, 40, 20, 30, 40, 30, 20]
					}],
					colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
				},
				optionChartGlobalStacked5: {
					title: {
							text: 'Todas las Unidades Combinadas - Distribución Mensual'
					},
					chart: {
						type: 'column',
						height: '600'
					},
					xAxis: {
							categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']
					},
					yAxis: {
							min: 0,
							max: 100,
							title: {
									text: 'Promedio de Valoraciones'
							}
					},
					legend: {
							reversed: true
					},
					plotOptions: {
							series: {
									stacking: 'normal',
									dataLabels: {
											useHTML: true,
											enabled: true,
											color: '#000000',
											format: '{y}%',
											rotation: 270,
											style: {
													fontWeight: 'bold',
													fontSize: '12px',
													fill: 'black'
											}
									}
							}
					},
					series: [{
							name: 'Muy Bueno',
							data: [30, 20, 30, 10, 20, 30, 20, 30, 10, 20, 30, 20]
					}, {
							name: 'Bueno',
							data: [30, 20, 30, 10, 20, 30, 20, 30, 10, 20, 30, 20]
					}, {
							name: 'Malo',
							data: [30, 20, 30, 10, 20, 30, 20, 30, 10, 20, 30, 20]
					}, {
							name: 'Muy Malo',
							data: [10, 40, 10, 70, 40, 10, 40, 10, 70, 40, 10, 40]
					}],
					colors: ['#26A500', '#25F16C', '#F2E41D', '#DE4D3A']
				},
				optionsChartGlobal: {
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
				optionsChartLocal: {
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
				optionsChartLocalDatesHour: {
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
				optionsChartLocalDatesDay: {
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
				optionsChartLocalDatesMonth: {
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
				optionsChartCustom: {
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
				optionsChartCustomDatesHour: {
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
				optionsChartCustomDatesDay: {
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
				optionsChartCustomDatesMonth: {
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
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
		},
		
		created() {
			this.$firebase.firestore().collection('assessments').where('business', '==', this.userStorage.business)
			.onSnapshot(querySnapshot => { 
				this.assessments = []
				querySnapshot.forEach(doc => this.assessments.push(doc.data()) )
				this.getChartGlobal()
				this.getChartGlobalDatesHour()
				this.getChartGlobalDatesDayW()
				this.getChartGlobalDatesDay()
				this.getChartGlobalDatesMonth()
				this.getIndicatorsGlobal()
				this.$firebase.firestore().collection('locals').where('business', '==', this.userStorage.business)
				.onSnapshot(querySnapshot => {
					this.locals = []
					querySnapshot.forEach(doc => {
						let local = doc.data()
						local.id = doc.id
						local.assessments = { total: 0, veryGood: 0, good: 0, bad: 0, veryBad: 0, percentages: [] }
						local.indicators = { satisfaction: null, justification: null }
						this.locals.unshift(local)
					})
					if (!this.locals.length) this.locals = false
					this.getChartLocal()
					this.getChartLocalDatesHour()
					this.getIndicatorsLocal()
				})
			})
		},
		methods: {
			searchStats() {
				let timeSince = '00:00'
				let timeUntil = '23:59'
				let dateSince = '1999-01-01'
				let dateUntil = '2099-12-31'

				function pad(s) { return (s < 10) ? '0' + s : s }
				function timeSearch(date) { return `${pad(date.getHours())}:${pad(date.getMinutes())}` }
				function compareTimes(timeRecord, timeSince, timeUntil) {
					let arrayTimeRecord = timeRecord.split(":")
					let arraytimeSince = timeSince.split(":")
					let arraytimeUntil = timeUntil.split(":")

					let recordHour = parseInt(arrayTimeRecord[0],10)
					let recordMinutes = parseInt(arrayTimeRecord[1],10)
					
					let sinceHour = parseInt(arraytimeSince[0],10)
					let sinceMinutes = parseInt(arraytimeSince[1],10)

					let untilHour = parseInt(arraytimeUntil[0],10)
					let untilMinutes = parseInt(arraytimeUntil[1],10)
					
					if (recordHour > sinceHour || (recordHour == sinceHour && recordMinutes >= sinceMinutes)) {
						if (recordHour < untilHour || (recordHour == untilHour && recordMinutes <= untilMinutes)) return true
						else return false
					}
					else return false
				}

				this.loader = 'loading'

				if (this.timeSince) timeSince = this.timeSince
				if (this.timeUntil) timeUntil = this.timeUntil

				if (this.dateSince) {
					dateSince = this.dateSince
					dateUntil = this.dateSince
				}

				if (this.dateUntil) dateUntil = this.dateUntil

				let searchSince = new Date(`${dateSince} ${timeSince}`)
				let searchUntil = new Date(`${dateUntil} ${timeUntil}`)
				
				this.$firebase.firestore().collection('assessments')
				.where('business','==',this.userStorage.business)
				.where('date','>=',new Date(`${dateSince} ${timeSince}`))
				.where('date','<=',new Date( `${dateUntil} ${timeUntil}`))
				.onSnapshot(querySnapshot => {
					this.results = []
					querySnapshot.forEach(doc => {
						if (compareTimes(timeSearch(doc.data().date), timeSearch(searchSince), timeSearch(searchUntil))) {
							let assessment = doc.data()
							assessment.id = doc.id
							this.results.unshift(assessment)
						}
					})
					this['loading'] = false
					this.loader = null
					if (!this.results.length) {
						this.textDialogPreResults = "La búsqueda no ha devuelto ningún resultado. Intentá con otros valores."
						this.titleDialogPreResults = "¡Advertencia!"
						this.dialogPreResults = true
					}
					else {
						this.getChartCustom()
						this.getChartCustomDatesHour()
						this.getChartCustomDatesDay()
						this.getChartCustomDatesMonth()
						this.dialogResults = true
					}
				})
			},

      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
			},
			
			activeDateMenus() {
				this.menuDateUntil = true
			},

			desactiveDateMenus() {
				this.menuDateSince = false
				this.dateSinceFormatted = null
				this.menuDateUntil = false
				this.dateUntilFormatted = null
			},

			desactiveTimeMenuSince() {
				this.timeSince = null,
				this.menuTimeSince = false
			},

			desactiveTimeMenuUntil() {
				this.timeUntil = null,
				this.menuTimeUntil = false
			},

   		converTime(date) {
				function pad(s) { return (s < 10) ? '0' + s : s }
				var d = new Date(date)
				return d.getHours()
			},

			getDayOfWeek(date) {
				var d = new Date(date)
				return d.getDay() - 1
			},

   		getMonth(date) {
				var d = new Date(date)
				return d.getMonth()
			},

			getPercentage(part, universe) {
				let result = parseFloat(((part * 100) / universe).toFixed(0)) 
				return isNaN(result) ? 0 : result
			},
			
			getChartGlobal() {
				const total = this.assessments.length
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

				this.assessments.stats = {
					veryGood: [numVeryGood, this.getPercentage(numVeryGood, total)],
					good: [numGood, this.getPercentage(numGood, total)],
					bad: [numBad, this.getPercentage(numBad, total)],
					veryBad: [numVeryBad, this.getPercentage(numVeryBad, total)]
				}

				console.log(this.assessments.stats)
			},

			getChartCustom() {
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0
				for (let assesment of this.results) {
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
				this.optionsChartCustom.title.text = "Encuestas realizadas hasta la fecha:" + this.results.length
				this.optionsChartCustom.series[0].data[0].y = numVeryGood
				this.optionsChartCustom.series[0].data[1].y = numGood
				this.optionsChartCustom.series[0].data[2].y = numBad
				this.optionsChartCustom.series[0].data[3].y = numVeryBad
				this.results.stats = { veryGood: numVeryGood, good: numGood, bad: numBad, veryBad: numVeryBad }				
			},

			getIndicatorsGlobal() {
				let total = this.assessments.length
				let complains = 0, comments = 0, services = 0, reasons = 0

				for (let assessment of this.assessments) {
					assessment.complain ? complains++ : complains
					assessment.comment ? comments++ : comments
					assessment.flow.justification ? services++ : services
					assessment.flow.justificationTwo ? reasons++ : reasons
				}

				let partialsGood = ((this.assessments.stats.veryGood[0] * 2) + this.assessments.stats.good[0]) + (comments * 3)
				let partialsBad =  ((this.assessments.stats.veryBad[0] * 2) + this.assessments.stats.bad[0]) + (complains * 3)
				let partials = partialsGood + partialsBad

				this.indicatorsGlobal.satisfaction = this.getPercentage(partialsGood, partials)
				if (isNaN(this.indicatorsGlobal.satisfaction)) this.indicatorsGlobal.satisfaction = 0.00
				
				this.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				if (isNaN(this.indicatorsGlobal.complain[0])) this.indicatorsGlobal.complain[0] = 0.00
				
				this.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
				if (isNaN(this.indicatorsGlobal.comment[0])) this.indicatorsGlobal.comment[0] = 0.00

				this.indicatorsGlobal.service = [services, this.getPercentage(services, total)]
				if (isNaN(this.indicatorsGlobal.service[0])) this.indicatorsGlobal.service[0] = 0.00

				this.indicatorsGlobal.reason = [reasons, this.getPercentage(reasons, total)]
				if (isNaN(this.indicatorsGlobal.reason[0])) this.indicatorsGlobal.reason[0] = 0.00
			},

			getIndicatorsLocal() {
				for (const [index, local] of this.locals.entries()) {
					let total = local.assessments.total
					let justification = 0
					let partialsGood = (local.assessments.veryGood * 2) + local.assessments.good
					let partialsBad =  (local.assessments.veryBad * 2) + local.assessments.bad
					let partials = partialsGood + partialsBad

					for (let assessment of this.assessments) {
						if (assessment.local.id == local.id) {
							if (assessment.flow.justification) justification++
						}
					}

					local.indicators.satisfaction = ((partialsGood * 100) / partials).toFixed(2)
					local.indicators.justification = ((justification * 100) / total).toFixed(2)
				}
			},

			getChartGlobalDatesHour() {
				let timesVeryGood = new Array(24).fill(0)
				let timesGood = new Array(24).fill(0)
				let timesBad = new Array(24).fill(0)
				let timesVeryBad = new Array(24).fill(0)

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

				this.chartHourGlobal = []

				for (let i = 8; i < 23; i++) {
					let total = timesVeryGood[i] + timesGood[i] + timesBad[i] + timesVeryBad[i]
					this.chartHourGlobal.push({
						title: i,
						total,
						veryGood: this.getPercentage(timesVeryGood[i], total),
						good: this.getPercentage(timesGood[i], total),
						bad: this.getPercentage(timesBad[i], total),
						veryBad: this.getPercentage(timesVeryBad[i], total)
					})
				}
			},

			getChartCustomDatesHour() {
				let timesVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

				for(let assessment of this.results) {
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
				this.optionsChartCustomDatesHour.series[0].data = timesVeryGood
				this.optionsChartCustomDatesHour.series[1].data = timesGood
				this.optionsChartCustomDatesHour.series[2].data = timesBad
				this.optionsChartCustomDatesHour.series[3].data = timesVeryBad
			},

			getChartGlobalDatesDayW() {
				let daysWVeryGood = new Array(7).fill(0)
				let daysWGood = new Array(7).fill(0)
				let daysWBad = new Array(7).fill(0)
				let daysWVeryBad = new Array(7).fill(0)
				const CATEGORIES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

				for(let assessment of this.assessments) {
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

				this.chartDayWGlobal = []

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

			getChartGlobalDatesDay() {
				let daysVeryGood = new Array(31).fill(0)
				let daysGood = new Array(31).fill(0)
				let daysBad = new Array(31).fill(0)
				let daysVeryBad = new Array(31).fill(0)

				for(let assessment of this.assessments) {
					let currentDay = assessment.date.getDate()
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

				this.chartDayGlobal = []

				for (let i = 1; i < 32; i++) {
					let total = daysVeryGood[i] + daysGood[i] + daysBad[i] + daysVeryBad[i]
					this.chartDayGlobal.push({
						title: i,
						total,
						veryGood: this.getPercentage(daysVeryGood[i], total),
						good: this.getPercentage(daysGood[i], total),
						bad: this.getPercentage(daysBad[i], total),
						veryBad: this.getPercentage(daysVeryBad[i], total)
					})
				}
			},

			getChartCustomDatesDay() {
				let daysVeryGood = [0,0,0,0,0,0,0]
				let daysGood = [0,0,0,0,0,0,0]
				let daysBad = [0,0,0,0,0,0,0]
				let daysVeryBad = [0,0,0,0,0,0,0]

				for(let assessment of this.results) {
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
				this.optionsChartCustomDatesDay.series[0].data = daysVeryGood
				this.optionsChartCustomDatesDay.series[1].data = daysGood
				this.optionsChartCustomDatesDay.series[2].data = daysBad
				this.optionsChartCustomDatesDay.series[3].data = daysVeryBad
			},

			getChartGlobalDatesMonth() {
				let monthsVeryGood = new Array(12).fill(0)
				let monthsGood = new Array(12).fill(0)
				let monthsBad = new Array(12).fill(0)
				let monthsVeryBad = new Array(12).fill(0)
				const CATEGORIES = ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']

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
				}

				this.chartMonthGlobal = []

				for (let i = 1; i < 13; i++) {
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

			getChartCustomDatesMonth() {
				let monthsVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsBad = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0]

				for(let assessment of this.results) {
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
				this.optionsChartCustomDatesMonth.series[0].data = monthsVeryGood
				this.optionsChartCustomDatesMonth.series[1].data = monthsGood
				this.optionsChartCustomDatesMonth.series[2].data = monthsBad
				this.optionsChartCustomDatesMonth.series[3].data = monthsVeryBad
			},

			getChartLocal() {
				const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0, activeLocals = []
				
				for (let local of this.locals) {
					for (let assessment of this.assessments) {
						if(assessment.local.id == local.id || assessment.local == local.id) {
							local.assessments.total++
							local.assessments[assessment.face]++
						}
					}

					if (local.assessments.total)
						activeLocals.push({
							title: local.title,
							veryGood: parseFloat(((local.assessments["veryGood"] * 100) / local.assessments.total).toFixed(2)),
							good: parseFloat(((local.assessments["good"] * 100) / local.assessments.total).toFixed(2)),
							bad: parseFloat(((local.assessments["bad"] * 100) / local.assessments.total).toFixed(2)),
							veryBad: parseFloat(((local.assessments["veryBad"] * 100) / local.assessments.total).toFixed(2)),
							total: local.assessments.total
						})

					this.topLocals = activeLocals.sort(sortByProperty('veryGood')).slice(0,5)

					localStorage.setItem('topLocals', JSON.stringify(this.topLocals))
					this.badLocals = activeLocals.sort(sortByProperty('veryBad'))
				}
			},

			selectLocal(local) {
				this.currentLocal = local
				this.optionsChartLocal.title.text = "Encuestas realizadas hasta la fecha:" + local.assessments.total
				this.optionsChartLocal.series[0].data[0].y = local.assessments.veryGood
				this.optionsChartLocal.series[0].data[1].y = local.assessments.good
				this.optionsChartLocal.series[0].data[2].y = local.assessments.bad
				this.optionsChartLocal.series[0].data[3].y = local.assessments.veryBad
				this.getChartLocalDatesHour()
				this.getChartLocalDatesDay()
				this.getChartLocalDatesMonth()
				this.dialog = true
			},

			getChartLocalDatesHour() {
				let timesVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesGood = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				let timesVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

				for(let assessment of this.assessments) {
					if (assessment.local.id == this.currentLocal.id) {
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
				}

				this.optionsChartLocalDatesHour.series[0].data = timesVeryGood
				this.optionsChartLocalDatesHour.series[1].data = timesGood
				this.optionsChartLocalDatesHour.series[2].data = timesBad
				this.optionsChartLocalDatesHour.series[3].data = timesVeryBad				
			},

			getChartLocalDatesDay() {
				let daysVeryGood = [0,0,0,0,0,0,0]
				let daysGood = [0,0,0,0,0,0,0]
				let daysBad = [0,0,0,0,0,0,0]
				let daysVeryBad = [0,0,0,0,0,0,0]

				for(let assessment of this.assessments) {
					if (assessment.local.id == this.currentLocal.id) {
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
				}
				this.optionsChartLocalDatesDay.series[0].data = daysVeryGood
				this.optionsChartLocalDatesDay.series[1].data = daysGood
				this.optionsChartLocalDatesDay.series[2].data = daysBad
				this.optionsChartLocalDatesDay.series[3].data = daysVeryBad			
			},

			getChartLocalDatesMonth() {
				let monthsVeryGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsGood = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsBad = [0,0,0,0,0,0,0,0,0,0,0,0]
				let monthsVeryBad = [0,0,0,0,0,0,0,0,0,0,0,0]

				for(let assessment of this.assessments) {
					if (assessment.local.id == this.currentLocal.id) {
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
				}

				this.optionsChartLocalDatesMonth.series[0].data = monthsVeryGood
				this.optionsChartLocalDatesMonth.series[1].data = monthsGood
				this.optionsChartLocalDatesMonth.series[2].data = monthsBad
				this.optionsChartLocalDatesMonth.series[3].data = monthsVeryBad			
			}
		}
	}
</script>

<style lang="sass" scoped>
	.mainContainer
		padding: 50px
	.message
		font-size: 20px
	a
		text-decoration: none
	.progress-linear
		margin-top: 0
		margin-bottom: 0

	.custom-loader
		animation: loader 1s infinite
		display: flex

	.indicatorsTwoTitle
		font-size: 20px

	@-moz-keyframes loader
		from
			transform: rotate(0)
		to
			transform: rotate(360deg)

	@-webkit-keyframes loader
		from
			transform: rotate(0)
		to
			transform: rotate(360deg)

	@-o-keyframes loader
		from
			transform: rotate(0)
		to
			transform: rotate(360deg)

	@keyframes loader
		from
			transform: rotate(0)
		to
			transform: rotate(360deg)
</style>