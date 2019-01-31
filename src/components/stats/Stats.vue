<template lang="pug">
	v-container.mainContainer(fluid v-if="assessments")
		v-layout(row wrap)
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
			v-flex(xs12 sm4 offset-sm2)
				v-select(
					label="Elegí un Jefe Zonal"
					v-model="zone"
					:items="zonesSelect"
				)
			v-flex.ml-3(xs12 sm4)
				v-select(
					label="Elegí un Local"
					v-model="local"
					:items="localsSelect"
				)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs2 offset-xs2)
				v-btn#submit(
					large outline
					:loading="loading"
					:disabled="loading || (!timeSince && !dateSince && !zone)"
					@click.native="searchStats"
					color="primary"
					) Obtener Resultados
					span.custom-loader(slot="loader")
						v-icon(light) cached
			v-flex.py-5.ml-4(fill-height xs3)
				v-btn(large outline @click.native="clearFields" color="primary") Limpiar
				div(style="flex: 1 1 auto;")
			v-flex(xs12)
				div.pb-5
					span.display-1 Resultados Generales Sin Filtro
					v-divider
			v-flex(xs9 offset-xs1)
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
			v-flex(xs6 md3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
			v-flex(xs6 md3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")
			v-flex(xs6 md3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Resp. Servicio: {{ indicatorsGlobal.service[1] }}% - {{ indicatorsGlobal.service[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.service[1]" height="20" color="info")
			v-flex(xs6 md3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Resp. Motivo: {{ indicatorsGlobal.reason[1] }}% - {{ indicatorsGlobal.reason[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.reason[1]" height="20" color="info")
			v-flex(xs6 md3)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas sin Leer: {{ indicatorsGlobal.complainUnread[1] }}% - {{ indicatorsGlobal.complainUnread[0] }} total
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.complainUnread[1]" height="20" color="info")
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
			v-flex(xs12)
				div.pb-5
					span.display-1 Servicios
					v-divider
			v-flex(xs9 offset-xs1)
				Service.pb-5(:data="assessments.stats")
			v-flex(xs12)
				div.pb-5
					span.display-1 Motivos
					v-divider
			v-flex(xs9 offset-xs1)
				Reason.pb-5(:data="assessments.stats")
			v-flex(xs12)
				div.pb-5
					span.display-1 Jefe Zonales
					v-divider
			v-flex(xs9 offset-xs1)
				Zone.pb-5(:data="assessments.stats")
			v-flex(xs12)
				Chart.pb-5(type="barStacked" title="Puntos Fuertes" :data="strongPoints")
			v-flex(xs12)
				Chart.pb-5(type="barStacked" title="Puntos Débiles" :data="weakPoints")
			v-flex(xs12)
				div.pb-5
					span.display-1 Locales
					v-divider
			v-flex(xs12 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Mejores Locales" :data="topLocals")
			v-flex(xs12 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Peores Locales" :data="badLocals")
			//- v-flex(xs12)
			//- 	div.pb-5
			//- 		span.display-1 Resultados por Local
			//- 		v-divider
			//- template(v-if="locals")
			//- 	v-flex(xs4 v-for="local in locals" :key="local.title")
			//- 		v-card.my-1.mr-1(flat tile)
			//- 			v-card-media.white--text.primary(height="100px")
			//- 				v-container(fill-height fluid)
			//- 					v-layout(fill-height)
			//- 						v-flex(xs12 align-end flexbox)
			//- 							span.display-1.headline {{ local.title }}
			//- 							v-divider
			//- 			v-card-title
			//- 				v-layout(row wrap)
			//- 					v-flex(xs12)
			//- 						v-badge(right color="blue")
			//- 							span(slot="badge") {{ local.assessments.total }}
			//- 							span Valoraciones
			//- 					v-flex.my-2(xs12 v-if="local.assessments.total")
			//- 						span Satisfacción de Cliente {{ local.indicators.satisfaction }} %
			//- 						v-progress-linear(:value="local.indicators.satisfaction" height="20" color="info")
			//- 					v-flex.my-2(xs12 v-if="local.assessments.total")
			//- 						span Indice de Justificación {{ local.indicators.justification }} %
			//- 						v-progress-linear(:value="local.indicators.justification" height="20" color="info")
			//- 			v-card-actions
			//- 				v-btn(flat color="primary" @click.native="selectLocal(local)" :disabled="!local.assessments.total") Ver Resultados
			//- 				v-btn(:to="'/locals/' + local.id" flat color="primary") Ir al Local
			//- v-flex(xs12 sm12 v-else) 
			//- 	span.message ¡Aún no se han registrado locales para esta organización!
			//- v-layout.py-5(row child-flex justify-center align-center wrap v-if='!locals')
			//- 	v-flex(fill-height xs12 offset-xs5)
			//- 	v-btn(to="/locals/new/" large outline color="primary") Registrar Local
		v-dialog(v-model="dialogPreResults" persistent max-width="500")
			v-card
				v-card-title.headline(v-html="titleDialogPreResults")
				v-card-text(v-html="textDialogPreResults")
				v-card-actions
					v-spacer
					v-btn(color="green darken-1" flat @click.native="dialogPreResults = false") Entendido
		v-dialog(v-model="dialogResults" persistent max-width="500" fullscreen transition="dialog-bottom-transition" :overlay=false scrollable)
			v-card
				v-toolbar(dark color="primary")
					v-btn(icon dark @click="dialogResults = false")
						v-icon close
					v-toolbar-title Resultados Personalizados
					v-spacer
					v-toolbar-items
						v-btn(dark flat @click="dialogResults = false") Regresar
				v-card-text
					v-flex(xs9 offset-xs2)
						Face.pb-5(:data="results.stats")
					v-flex.pt-3.pb-5(xs12)
						v-card.my-1.mr-1(flat tile)
							v-card-media.white--text.primary(height="75px")
								span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ indicatorsCustom.satisfaction }}%
							v-card-title
								v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")
						v-layout(row wrap)
							v-flex(xs3)
								v-card.my-1.mr-1(flat tile)
									v-card-media.white--text.primary(height="75px")
										span.indicatorsTwoTitle.ml-4.pt-3 Quejas: {{ indicatorsCustom.complain[1] }}% - {{ indicatorsCustom.complain[0] }} total
									v-card-title
										v-progress-linear(:value="indicatorsCustom.complain[1]" height="20" color="info")
							v-flex(xs3)
								v-card.my-1.mr-1(flat tile)
									v-card-media.white--text.primary(height="75px")
										span.indicatorsTwoTitle.ml-4.pt-3 Com. Positivos: {{ indicatorsCustom.comment[1] }}% - {{ indicatorsCustom.comment[0] }} total
									v-card-title
										v-progress-linear(:value="indicatorsCustom.comment[1]" height="20" color="info")
							v-flex(xs3)
								v-card.my-1.mr-1(flat tile)
									v-card-media.white--text.primary(height="75px")
										span.indicatorsTwoTitle.ml-4.pt-3 Resp. Servicio: {{ indicatorsCustom.service[1] }}% - {{ indicatorsCustom.service[0] }} total
									v-card-title
										v-progress-linear(:value="indicatorsCustom.service[1]" height="20" color="info")
							v-flex(xs3)
								v-card.my-1.mr-1(flat tile)
									v-card-media.white--text.primary(height="75px")
										span.indicatorsTwoTitle.ml-4.pt-3 Resp. Motivo: {{ indicatorsCustom.reason[1] }}% - {{ indicatorsCustom.reason[0] }} total
									v-card-title
										v-progress-linear(:value="indicatorsCustom.reason[1]" height="20" color="info")
							v-flex(xs3)
								v-card.my-1.mr-1(flat tile)
									v-card-media.white--text.primary(height="75px")
										span.indicatorsTwoTitle.ml-4.pt-3 Quejas sin Leer: {{ indicatorsCustom.complainUnread[1] }}% - {{ indicatorsCustom.complainUnread[0] }} total
									v-card-title
										v-progress-linear(:value="indicatorsCustom.complainUnread[1]" height="20" color="info")
					v-tabs(fixed centered)
						v-tabs-bar.primary(dark)
							v-tabs-slider(class="yellow")
							v-tabs-item(href="#hourCustom" ripple) Horario
							v-tabs-item(href="#weekCustom" ripple) Día de la Semana
							v-tabs-item(href="#dayCustom" ripple) Día del Mes
							v-tabs-item(href="#monthCustom" ripple) Mensual
						v-tabs-items
							v-tabs-content(id="hourCustom")
								v-flex.py-5(xs12)
									Chart(type="columnStacked" title="Distribución General Horaria" :data="chartHourCustom")
							v-tabs-content(id="weekCustom")
								v-flex.py-5(xs12)
									Chart(type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWCustom")
							v-tabs-content(id="dayCustom")
								v-flex.py-5(xs12)
									Chart(type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayCustom")
							v-tabs-content(id="monthCustom")
								v-flex.py-5(xs12)
									Chart(type="columnStacked" title="Distribución General Mensual" :data="chartMonthCustom")
					v-flex(xs12)
						div.pb-5
							span.display-1 Servicios
							v-divider
					v-flex(xs9 offset-xs2)
						Service.pb-5(:data="results.stats")
					v-flex(xs12)
						div.pb-5
							span.display-1 Motivos
							v-divider
					v-flex(xs9 offset-xs2)
						Reason.pb-5(:data="results.stats")
					v-flex(xs12)
						div.pb-5
							span.display-1 Jefe Zonales
							v-divider
					v-flex(xs9 offset-xs2)
						Zone.pb-5(:data="results.stats")
					v-flex(xs12)
						Chart.pb-5(type="barStacked" title="Puntos Fuertes" :data="strongPointsCustom")
					v-flex(xs12)
						Chart.pb-5(type="barStacked" title="Puntos Débiles" :data="weakPointsCustom")
</template>

<script>
	import Vue from 'vue'
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	import Highcharts from 'highcharts'
	import VueHighcharts from 'vue-highcharts'
	import router from '@/router/'
	import Chart from './Chart.vue'
	import Service from './Service.vue'
	import Reason from './Reason.vue'
	import Face from './Face.vue'
	import Zone from './Zone.vue'

	require('highcharts/modules/exporting')(Highcharts)

  export default {
		components: {
			Chart,
			Face,
			Service,
			Reason,
			Zone
		},
		mixins: [validationMixin],
		validations: {},
    data () {
      return {
				dynamicDialogAct: false,
				chartHourGlobal: null,
				chartDayWGlobal: null,
				chartDayGlobal: null,
				chartMonthGlobal: null,
				chartHourCustom: null,
				chartDayWCustom: null,
				chartDayCustom: null,
				chartMonthCustom: null,
				topLocals: JSON.parse(localStorage.getItem('topLocals')),
				badLocals: [],
				zone: null,
				zoneID: null,
				zonesSelect: [],
				local: null,
				localID: null,
				locals: null,
				localsSelect: [],
				weakPoints: null,
				weakPointsCustom: null,
				strongPoints: null,
				strongPointsCustom: null,
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
				results: {},
        time: null,
				loading: false,
				loader: null,
				dateFormatted2: null,
				currentLocal: { title: null },
				assessments: [],
				indicatorsGlobal: { satisfaction: null, complain: [], comment: [], service: [], reason: [], complainUnread: [] },
				indicatorsCustom: { satisfaction: null, complain: [], comment: [], service: [], reason: [], complainUnread: [] },
				indicatorsLocal: [],
				dialog: false,
				dialogPreResults: false,
				dialogResults: false,
				textDialogPreResults: null,
				titleDialogPreResults: null,
				userStorage: JSON.parse(localStorage.getItem('user')),
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
			local() {
				if (!this.zone) this.localsSelect = []
				else {
					let locals = this.$firebase.firestore().collection("locals")
					.where('business', '==', this.userStorage.business)
					.where('title', '==', this.local)
					locals.onSnapshot(querySnapshot => {
						querySnapshot.forEach(doc => this.localID = doc.id)
					})
				}
			},
			zone() {
				this.localsSelect = []
				let zone = this.$firebase.firestore().collection("zones").where('responsable', '==', this.zone)
				zone.onSnapshot(querySnapshot => {
					querySnapshot.forEach(doc => {
						this.zoneID = doc.id
						let locals = this.$firebase.firestore().collection("locals").where('zone', '==', doc.id)
						locals.onSnapshot(querySnapshot => {
							querySnapshot.forEach(doc => {
								let local = doc.data()
								local.id = doc.id
								this.localsSelect.unshift(local.title)
							})
						})
					})
				})
			}
		},
		
		created() {
			let assessment = null
			let i = 0

			let zones = this.$firebase.firestore().collection("zones").where('business', '==', this.userStorage.business)
			zones.onSnapshot(querySnapshot => {
				this.zones = []
				querySnapshot.forEach(doc => {
					let zone = doc.data()
					zone.id = doc.id
					this.zones.unshift(zone)
					this.zonesSelect.unshift(zone.responsable)
				})
			})

			this.$firebase.firestore().collection('assessments').where('business', '==', this.userStorage.business)
				.onSnapshot(querySnapshot => {
					this.assessments = []
					querySnapshot.forEach(doc => {
						assessment = doc.data()
						assessment.id = doc.id
						this.assessments.unshift(assessment)
					})
					this.$firebase.firestore().collection('locals').where('business', '==', this.userStorage.business)
						.onSnapshot(async querySnapshot => {
							this.locals = []
							await querySnapshot.forEach(doc => {
								let local = doc.data()
								local.id = doc.id
								local.assessments = []
								for (let assesment of this.assessments) {
									if (assesment.local == local.id) {
										local.assessments.push(assesment)
									}
								}
								local.indicators = { satisfaction: null, justification: null }
								this.locals.unshift(local)
							})


							if (!this.locals.length) this.locals = false

							this.getChartGlobal()
							this.getChartGlobalDatesHour()
							this.getChartGlobalDatesDayW()
							this.getChartGlobalDatesDay()
							this.getChartGlobalDatesMonth()
							this.getIndicatorsGlobal()
						})
			})
		},
		methods: {
			dynamicDialog(data) {
				this.dynamicDialogAct = !this.dynamicDialogAct
			},
			searchStats() {
				let timeSince = '00:00:00.000'
				let timeUntil = '23:59:00.000'
				let dateSince = '1999-01-01'
				let dateUntil = '2099-12-31'

				function pad(s) { return (s < 10) ? '0' + s : s }
				
				function timeSearch(date) {
					return `${pad(new Date(date).getHours())}:${pad(new Date(date).getMinutes())}` 
				}
				
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

				let searchSince = new Date(`${dateSince} ${timeSince}`).toISOString()
				let searchUntil = new Date(`${dateUntil} ${timeUntil}`).toISOString()

				let query = this.$firebase.firestore().collection('assessments').where('business','==',this.userStorage.business)
				if (searchSince) {
					query = query.where('date','>=', searchSince).where('date','<=', searchUntil)
				}

				if (this.localID) query = query.where('local','==', this.localID)
				else {
					if (this.zoneID) query = query.where('zone','==', this.zoneID)
				}

				query.onSnapshot(querySnapshot => {
					this.results = []
					querySnapshot.forEach(doc => {
						if (compareTimes(timeSearch(new Date(doc.data().date).toISOString()), timeSearch(searchSince), timeSearch(searchUntil))) {
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
						this.getChartCustomM()
						this.getInidicatorsCustom()
						this.getChartCustomDatesHour()
						this.getChartCustomDatesDayW()
						this.getChartCustomDatesDay()
						this.getChartCustomDatesMonth()
						this.getIndicatorsGlobal()
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

			clearFields() {
				this.zone = null
				this.desactiveDateMenus()
				this.desactiveTimeMenuSince()
				this.desactiveTimeMenuUntil()
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
				let result = parseFloat(((part * 100) / universe).toFixed(2))
				return isNaN(result) ? 0 : result
			},
			
			getChartGlobal() {
				console.log(this.locals)
				const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
				const total = this.assessments.length
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0
				
				let numServ = 0, numServ2 = 0, numServ3 = 0, numServ4 = 0
				let objServ = [], objServ2 = [], objServ3 = [], objServ4 = []
				let servVeryGood = 0, servGood = 0, servBad = 0, servVeryBad = 0
				let serv2VeryGood = 0, serv2Good = 0, serv2Bad = 0, serv2VeryBad = 0
				let serv3VeryGood = 0, serv3Good = 0, serv3Bad = 0, serv3VeryBad = 0
				let serv4VeryGood = 0, serv4Good = 0, serv4Bad = 0, serv4VeryBad = 0
				let servObjVeryGood = [], servObjGood = [], servObjBad = [], servObjVeryBad = []
				let serv2ObjVeryGood = [], serv2ObjGood = [], serv2ObjBad = [], serv2ObjVeryBad = []
				let serv3ObjVeryGood = [], serv3ObjGood = [], serv3ObjBad = [], serv3ObjVeryBad = []
				let serv4ObjVeryGood = [], serv4ObjGood = [], serv4ObjBad = [], serv4ObjVeryBad = []
				
				let numReas = 0, numReas2 = 0, numReas3 = 0, numReas4 = 0
				let objReas = [], objReas2 = [], objReas3 = [], objReas4 = []
				let reasVeryGood = 0, reasGood = 0, reasBad = 0, reasVeryBad = 0
				let reas2VeryGood = 0, reas2Good = 0, reas2Bad = 0, reas2VeryBad = 0
				let reas3VeryGood = 0, reas3Good = 0, reas3Bad = 0, reas3VeryBad = 0
				let reas4VeryGood = 0, reas4Good = 0, reas4Bad = 0, reas4VeryBad = 0
				let reasObjVeryGood = [], reasObjGood = [], reasObjBad = [], reasObjVeryBad = []
				let reas2ObjVeryGood = [], reas2ObjGood = [], reas2ObjBad = [], reas2ObjVeryBad = []
				let reas3ObjVeryGood = [], reas3ObjGood = [], reas3ObjBad = [], reas3ObjVeryBad = []
				let reas4ObjVeryGood = [], reas4ObjGood = [], reas4ObjBad = [], reas4ObjVeryBad = []

				let zoneWM = 0, zoneLB = 0, zoneDR = 0, zoneDL = 0, zoneCM = 0, zoneFC = 0
				let objzoneWM = [], objzoneLB = [], objzoneDR = [], objzoneDL = [], objzoneCM = [], objzoneFC = []
				
				let zoneWMVeryGood = 0, zoneWMGood = 0, zoneWMBad = 0, zoneWMVeryBad = 0
				let zoneLBVeryGood = 0, zoneLBGood = 0, zoneLBBad = 0, zoneLBVeryBad = 0
				let zoneDRVeryGood = 0, zoneDRGood = 0, zoneDRBad = 0, zoneDRVeryBad = 0
				let zoneDLVeryGood = 0, zoneDLGood = 0, zoneDLBad = 0, zoneDLVeryBad = 0
				let zoneCMVeryGood = 0, zoneCMGood = 0, zoneCMBad = 0, zoneCMVeryBad = 0
				let zoneFCVeryGood = 0, zoneFCGood = 0, zoneFCBad = 0, zoneFCVeryBad = 0

				let zoneWMObjVeryGood = [], zoneWMObjGood = [], zoneWMObjBad = [], zoneWMObjVeryBad = []
				let zoneLBObjVeryGood = [], zoneLBObjGood = [], zoneLBObjBad = [], zoneLBObjVeryBad = []
				let zoneDRObjVeryGood = [], zoneDRObjGood = [], zoneDRObjBad = [], zoneDRObjVeryBad = []
				let zoneDLObjVeryGood = [], zoneDLObjGood = [], zoneDLObjBad = [], zoneDLObjVeryBad = []
				let zoneCMObjVeryGood = [], zoneCMObjGood = [], zoneCMObjBad = [], zoneCMObjVeryBad = []
				let zoneFCObjVeryGood = [], zoneFCObjGood = [], zoneFCObjBad = [], zoneFCObjVeryBad = []			

				let complains = new Array(2).fill(0)
				let comments = new Array(2).fill(0)
				let activeLocals = []
				let setUpLocals = []
				
				for (let assessment of this.assessments) {
					for (let local of this.locals) {
						if (local.assessments.length && !setUpLocals.includes(local)) {
							setUpLocals.push(local)
							activeLocals.push(this.getChartLocal(local))
						}
						if (local.id == assessment.local) {
							switch(local.zone) {
								case 'MM3exjMdkKaQ0cUkAkM2':
									zoneWM++
									assessment.face == "veryGood" ? zoneWMVeryGood++ : assessment.face == "good" ? zoneWMGood++ : assessment.face == "bad" ? zoneWMBad++ : assessment.face == "veryBad" ? zoneWMVeryBad++ : null
									assessment.face == "veryGood" ? zoneWMObjVeryGood.push(assessment) : assessment.face == "good" ? zoneLBObjGood.push(assessment) : assessment.face == "bad" ? zoneWMObjBad.push(assessment) : assessment.face == "veryBad" ? zoneWMObjVeryBad.push(assessment) : null
									objzoneWM.push(assessment)
								break
								case 'MopGQtv8fBJU4Pbad7vD':
									zoneLB++
									assessment.face == "veryGood" ? zoneLBVeryGood++ : assessment.face == "good" ? zoneLBGood++ : assessment.face == "bad" ? zoneLBBad++ : assessment.face == "veryBad" ? zoneLBVeryBad++ : null
									assessment.face == "veryGood" ? zoneLBObjVeryGood.push(assessment) : assessment.face == "good" ? zoneLBObjGood.push(assessment) : assessment.face == "bad" ? zoneLBObjBad.push(assessment) : assessment.face == "veryBad" ? zoneLBObjVeryBad.push(assessment) : null
									objzoneLB.push(assessment)
								break
								case 'Ngw5aiu8JFFKlHMDeZVd':
									zoneCM++
									assessment.face == "veryGood" ? zoneCMVeryGood++ : assessment.face == "good" ? zoneCMGood++ : assessment.face == "bad" ? zoneCMBad++ : assessment.face == "veryBad" ? zoneCMVeryBad++ : null
									assessment.face == "veryGood" ? zoneCMObjVeryGood.push(assessment) : assessment.face == "good" ? zoneCMObjGood.push(assessment) : assessment.face == "bad" ? zoneCMObjBad.push(assessment) : assessment.face == "veryBad" ? zoneCMObjVeryBad.push(assessment) : null
									objzoneCM.push(assessment)
								break
								case 'cRc6N1NsFEXInsBtkB9w':
									zoneDR++
									assessment.face == "veryGood" ? zoneDRVeryGood++ : assessment.face == "good" ? zoneDRGood++ : assessment.face == "bad" ? zoneDRBad++ : assessment.face == "veryBad" ? zoneDRVeryBad++ : null
									assessment.face == "veryGood" ? zoneDRObjVeryGood.push(assessment) : assessment.face == "good" ? zoneDRObjGood.push(assessment) : assessment.face == "bad" ? zoneDRObjBad.push(assessment) : assessment.face == "veryBad" ? zoneDRObjVeryBad.push(assessment) : null
									objzoneDR.push(assessment)
								break
								case 'mTMi65jxCFXXglPMEARV':
									zoneDL++
									assessment.face == "veryGood" ? zoneDLVeryGood++ : assessment.face == "good" ? zoneDLGood++ : assessment.face == "bad" ? zoneDLBad++ : assessment.face == "veryBad" ? zoneDLVeryBad++ : null
									assessment.face == "veryGood" ? zoneDLObjVeryGood.push(assessment) : assessment.face == "good" ? zoneDLObjGood.push(assessment) : assessment.face == "bad" ? zoneDLObjBad.push(assessment) : assessment.face == "veryBad" ? zoneDLObjVeryBad.push(assessment) : null
									objzoneDL.push(assessment)
								break
								case 'wk77ITDgnPYUjZ28MxJK':
									zoneFC++
									assessment.face == "veryGood" ? zoneFCVeryGood++ : assessment.face == "good" ? zoneFCGood++ : assessment.face == "bad" ? zoneFCBad++ : assessment.face == "veryBad" ? zoneFCVeryBad++ : null
									assessment.face == "veryGood" ? zoneFCObjVeryGood.push(assessment) : assessment.face == "good" ? zoneFCObjGood.push(assessment) : assessment.face == "bad" ? zoneFCObjBad.push(assessment) : assessment.face == "veryBad" ? zoneFCObjVeryBad.push(assessment) : null
									objzoneFC.push(assessment)
								break
							}
						}
					}

					switch(assessment.face) {
						case 'veryGood':
							numVeryGood++
							assessment.comment ? comments[1]++ : comments[1]
						break
						case 'good':
							numGood++
							assessment.comment ? comments[0]++ : comments[0]
						break
						case 'bad':
							numBad++
							assessment.complain ? complains[0]++ : complains[0]
						break
						case 'veryBad':
							numVeryBad++
							assessment.complain ? complains[1]++ : complains[1]
						break
					}

					switch(assessment.justification) {
						case 'Pago de servicios':
							numServ++
							assessment.face == "veryGood" ? servVeryGood++ : assessment.face == "good" ? servGood++ : assessment.face == "bad" ? servBad++ : assessment.face == "veryBad" ? servVeryBad++ : null
							assessment.face == "veryGood" ? servObjVeryGood.push(assessment) : assessment.face == "good" ? servObjGood.push(assessment) : assessment.face == "bad" ? servObjBad.push(assessment) : assessment.face == "veryBad" ? servObjVeryBad.push(assessment) : null
							objServ.push(assessment)
						break
						case 'Envío internacional':
							numServ2++
							assessment.face == "veryGood" ? serv2VeryGood++ : assessment.face == "good" ? serv2Good++ : assessment.face == "bad" ? serv2Bad++ : assessment.face == "veryBad" ? serv2VeryBad++ : null
							assessment.face == "veryGood" ? serv2ObjVeryGood.push(assessment) : assessment.face == "good" ? serv2ObjGood.push(assessment) : assessment.face == "bad" ? serv2ObjBad.push(assessment) : assessment.face == "veryBad" ? serv2ObjVeryBad.push(assessment) : null
							objServ2.push(assessment)
						break
						case 'Envío nacional':
							numServ3++
							assessment.face == "veryGood" ? serv3VeryGood++ : assessment.face == "good" ? serv3Good++ : assessment.face == "bad" ? serv3Bad++ : assessment.face == "veryBad" ? serv3VeryBad++ : null
							assessment.face == "veryGood" ? serv3ObjVeryGood.push(assessment) : assessment.face == "good" ? serv3ObjGood.push(assessment) : assessment.face == "bad" ? serv3ObjBad.push(assessment) : assessment.face == "veryBad" ? serv3ObjVeryBad.push(assessment) : null
							objServ3.push(assessment)
						break
						case 'Casa de cambio':
							numServ4++
							assessment.face == "veryGood" ? serv4VeryGood++ : assessment.face == "good" ? serv4Good++ : assessment.face == "bad" ? serv4Bad++ : assessment.face == "veryBad" ? serv4VeryBad++ : null
							assessment.face == "veryGood" ? serv4ObjVeryGood.push(assessment) : assessment.face == "good" ? serv4ObjGood.push(assessment) : assessment.face == "bad" ? serv4ObjBad.push(assessment) : assessment.face == "veryBad" ? serv4ObjVeryBad.push(assessment) : null
							objServ4.push(assessment)
						break
					}

					switch(assessment.justificationTwo) {
						case 'Atención del Cajero':
							numReas++
							assessment.face == "veryGood" ? reasVeryGood++ : assessment.face == "good" ? reasGood++ : assessment.face == "bad" ? reasBad++ : assessment.face == "veryBad" ? reasVeryBad++ : null
							assessment.face == "veryGood" ? reasObjVeryGood.push(assessment) : assessment.face == "good" ? reasObjGood.push(assessment) : assessment.face == "bad" ? reasObjBad.push(assessment) : assessment.face == "veryBad" ? reasObjVeryBad.push(assessment) : null
							objReas.push(assessment)
						break
						case 'Tiempo de Espera':
							numReas2++
							assessment.face == "veryGood" ? reas2VeryGood++ : assessment.face == "good" ? reas2Good++ : assessment.face == "bad" ? reas2Bad++ : assessment.face == "veryBad" ? reas2VeryBad++ : null
							assessment.face == "veryGood" ? reas2ObjVeryGood.push(assessment) : assessment.face == "good" ? reas2ObjGood.push(assessment) : assessment.face == "bad" ? reas2ObjBad.push(assessment) : assessment.face == "veryBad" ? reas2ObjVeryBad.push(assessment) : null
							objReas2.push(assessment)
						break
						case 'Estado del Local':
							numReas3++
							assessment.face == "veryGood" ? reas3VeryGood++ : assessment.face == "good" ? reas3Good++ : assessment.face == "bad" ? reas3Bad++ : assessment.face == "veryBad" ? reas3VeryBad++ : null
							assessment.face == "veryGood" ? reas3ObjVeryGood.push(assessment) : assessment.face == "good" ? reas3ObjGood.push(assessment) : assessment.face == "bad" ? reas3ObjBad.push(assessment) : assessment.face == "veryBad" ? reas3ObjVeryBad.push(assessment) : null
							objReas3.push(assessment)
						break
						case 'Servicio Utilizado':
							numReas4++
							assessment.face == "veryGood" ? reas4VeryGood++ : assessment.face == "good" ? reas4Good++ : assessment.face == "bad" ? reas4Bad++ : assessment.face == "veryBad" ? reas4VeryBad++ : null
							assessment.face == "veryGood" ? reas4ObjVeryGood.push(assessment) : assessment.face == "good" ? reas4ObjGood.push(assessment) : assessment.face == "bad" ? reas4ObjBad.push(assessment) : assessment.face == "veryBad" ? reas4ObjVeryBad.push(assessment) : null
							objReas4.push(assessment)
						break
					}
				}

				this.assessments.stats = {
					veryGood: [numVeryGood, this.getPercentage(numVeryGood, total), comments[1]],
					good: [numGood, this.getPercentage(numGood, total), comments[0]],
					bad: [numBad, this.getPercentage(numBad, total), complains[0]],
					veryBad: [numVeryBad, this.getPercentage(numVeryBad, total), complains[1]],
					services: {
						0: [numServ, this.getPercentage(numServ, total), { 
							veryGood: [servObjVeryGood.length, this.getPercentage(servObjVeryGood.length, numServ)],
							good: [servObjGood.length, this.getPercentage(servObjGood.length, numServ)],
							bad: [servObjBad.length, this.getPercentage(servObjBad.length, numServ)],
							veryBad: [servObjVeryBad.length, this.getPercentage(servObjVeryBad.length, numServ)],
							assessments: objServ,
							satisfaction: this.getIndicatorsReason(numServ, servGood, servBad, servVeryBad)
						}],
						1: [numServ2, this.getPercentage(numServ2, total), { 
							veryGood: [serv2ObjVeryGood.length, this.getPercentage(serv2ObjVeryGood.length, numServ2)],
							good: [serv2ObjGood.length, this.getPercentage(serv2ObjGood.length, numServ2)],
							bad: [serv2ObjBad.length, this.getPercentage(serv2ObjBad.length, numServ2)],
							veryBad: [serv2ObjVeryBad.length, this.getPercentage(serv2ObjVeryBad.length, numServ2)],
							assessments: objServ2,
							satisfaction: this.getIndicatorsReason(numServ2, serv2Good, serv2Bad, serv2VeryBad)
						}],
						2: [numServ3, this.getPercentage(numServ3, total), { 
							veryGood: [serv3ObjVeryGood.length, this.getPercentage(serv3ObjVeryGood.length, numServ3)],
							good: [serv3ObjGood.length, this.getPercentage(serv3ObjGood.length, numServ3)],
							bad: [serv3ObjBad.length, this.getPercentage(serv3ObjBad.length, numServ3)],
							veryBad: [serv3ObjVeryBad.length, this.getPercentage(serv3ObjVeryBad.length, numServ3)],
							assessments: objServ3,
							satisfaction: this.getIndicatorsReason(numServ3, serv3Good, serv3Bad, serv3VeryBad)
						}],
						3: [numServ4, this.getPercentage(numServ4, total), { 
							veryGood: [serv4ObjVeryGood.length, this.getPercentage(serv4ObjVeryGood.length, numServ4)],
							good: [serv4ObjGood.length, this.getPercentage(serv4ObjGood.length, numServ4)],
							bad: [serv4ObjBad.length, this.getPercentage(serv4ObjBad.length, numServ4)],
							veryBad: [serv4ObjVeryBad.length, this.getPercentage(serv4ObjVeryBad.length, numServ4)],
							assessments: objServ4,
							satisfaction: this.getIndicatorsReason(numServ4, serv4Good, serv4Bad, serv4VeryBad)
						}]
					},
					reasons: {
						0: [numReas, this.getPercentage(numReas, total), { 
							veryGood: [reasObjVeryGood.length, this.getPercentage(reasObjVeryGood.length, numReas)],
							good: [reasObjGood.length, this.getPercentage(reasObjGood.length, numReas)],
							bad: [reasObjBad.length, this.getPercentage(reasObjBad.length, numReas)],
							veryBad: [reasObjVeryBad.length, this.getPercentage(reasObjVeryBad.length, numReas)],
							assessments: objReas,
							satisfaction: this.getIndicatorsReason(numReas, reasGood, reasBad, reasVeryBad)
						}],
						1: [numReas2, this.getPercentage(numReas2, total), { 
							veryGood: [reas2ObjVeryGood.length, this.getPercentage(reas2ObjVeryGood.length, numReas2)],
							good: [reas2ObjGood.length, this.getPercentage(reas2ObjGood.length, numReas2)],
							bad: [reas2ObjBad.length, this.getPercentage(reas2ObjBad.length, numReas2)],
							veryBad: [reas2ObjVeryBad.length, this.getPercentage(reas2ObjVeryBad.length, numReas2)],
							assessments: objReas2,
							satisfaction: this.getIndicatorsReason(numReas2, reas2Good, reas2Bad, reas2VeryBad)
						}],
						2: [numReas3, this.getPercentage(numReas3, total), { 
							veryGood: [reas3ObjVeryGood.length, this.getPercentage(reas3ObjVeryGood.length, numReas3), 0],
							good: [reas3ObjGood.length, this.getPercentage(reas3ObjGood.length, numReas3), 0],
							bad: [reas3ObjBad.length, this.getPercentage(reas3ObjBad.length, numReas3), 0],
							veryBad: [reas3ObjVeryBad.length, this.getPercentage(reas3ObjVeryBad.length, numReas3), 0],
							assessments: objReas3,
							satisfaction: this.getIndicatorsReason(numReas3, reas3Good, reas3Bad, reas3VeryBad)
						}],
						3: [numReas4, this.getPercentage(numReas4, total), { 
							veryGood: [reas4ObjVeryGood.length, this.getPercentage(reas4ObjVeryGood.length, numReas4)],
							good: [reas4ObjGood.length, this.getPercentage(reas4ObjGood.length, numReas4)],
							bad: [reas4ObjBad.length, this.getPercentage(reas4ObjBad.length, numReas4)],
							veryBad: [reas4ObjVeryBad.length, this.getPercentage(reas4ObjVeryBad.length, numReas4)],
							assessments: objReas4,
							satisfaction: this.getIndicatorsReason(numReas4, reas4Good, reas4Bad, reas4VeryBad)
						}]						
					},
					zones: {
						0: [zoneWM, this.getPercentage(zoneWM, total), { 
							veryGood: [zoneWMObjVeryGood.length, this.getPercentage(zoneWMObjVeryGood.length, zoneWM)],
							good: [zoneWMObjGood.length, this.getPercentage(zoneWMObjGood.length, zoneWM)],
							bad: [zoneWMObjBad.length, this.getPercentage(zoneWMObjBad.length, zoneWM)],
							veryBad: [zoneWMObjVeryBad.length, this.getPercentage(zoneWMObjVeryBad.length, zoneWM)],
							assessments: objzoneWM,
							satisfaction: this.getIndicatorsReason(zoneWM, zoneWMGood, zoneWMBad, zoneWMVeryBad)
							}],
						1: [zoneLB, this.getPercentage(zoneLB, total), { 
							veryGood: [zoneLBObjVeryGood.length, this.getPercentage(zoneLBObjVeryGood.length, zoneLB)],
							good: [zoneLBObjGood.length, this.getPercentage(zoneLBObjGood.length, zoneLB)],
							bad: [zoneLBObjBad.length, this.getPercentage(zoneLBObjBad.length, zoneLB)],
							veryBad: [zoneLBObjVeryBad.length, this.getPercentage(zoneLBObjVeryBad.length, zoneLB)],
							assessments: objzoneLB,
							satisfaction: this.getIndicatorsReason(zoneLB, zoneLBGood, zoneLBBad, zoneLBVeryBad)
							}],
						2: [zoneCM, this.getPercentage(zoneCM, total), { 
							veryGood: [zoneCMObjVeryGood.length, this.getPercentage(zoneCMObjVeryGood.length, zoneCM)],
							good: [zoneCMObjGood.length, this.getPercentage(zoneCMObjGood.length, zoneCM)],
							bad: [zoneCMObjBad.length, this.getPercentage(zoneCMObjBad.length, zoneCM)],
							veryBad: [zoneCMObjVeryBad.length, this.getPercentage(zoneCMObjVeryBad.length, zoneCM)],
							assessments: objzoneCM,
							satisfaction: this.getIndicatorsReason(zoneCM, zoneCMGood, zoneCMBad, zoneCMVeryBad)
							}],
						3: [zoneDR, this.getPercentage(zoneDR, total), { 
							veryGood: [zoneDRObjVeryGood.length, this.getPercentage(zoneDRObjVeryGood.length, zoneDR)],
							good: [zoneDRObjGood.length, this.getPercentage(zoneDRObjGood.length, zoneDR)],
							bad: [zoneDRObjBad.length, this.getPercentage(zoneDRObjBad.length, zoneDR)],
							veryBad: [zoneDRObjVeryBad.length, this.getPercentage(zoneDRObjVeryBad.length, zoneDR)],
							assessments: objzoneDR,
							satisfaction: this.getIndicatorsReason(zoneDR, zoneDRGood, zoneDRBad, zoneDRVeryBad)
							}],
						4: [zoneDL, this.getPercentage(zoneDL, total), { 
							veryGood: [zoneDLObjVeryGood.length, this.getPercentage(zoneDLObjVeryGood.length, zoneDL)],
							good: [zoneDLObjGood.length, this.getPercentage(zoneDLObjGood.length, zoneDL)],
							bad: [zoneDLObjBad.length, this.getPercentage(zoneDLObjBad.length, zoneDL)],
							veryBad: [zoneDLObjVeryBad.length, this.getPercentage(zoneDLObjVeryBad.length, zoneDL)],
							assessments: objzoneDL,
							satisfaction: this.getIndicatorsReason(zoneDL, zoneDLGood, zoneDLBad, zoneDLVeryBad)
							}],
						5: [zoneFC, this.getPercentage(zoneFC, total), { 
							veryGood: [zoneFCObjVeryGood.length, this.getPercentage(zoneFCObjVeryGood.length, zoneFC)],
							good: [zoneFCObjGood.length, this.getPercentage(zoneFCObjGood.length, zoneFC)],
							bad: [zoneFCObjBad.length, this.getPercentage(zoneFCObjBad.length, zoneFC)],
							veryBad: [zoneFCObjVeryBad.length, this.getPercentage(zoneFCObjVeryBad.length, zoneFC)],
							assessments: objzoneFC,
							satisfaction: this.getIndicatorsReason(zoneFC, zoneFCGood, zoneFCBad, zoneFCVeryBad)
						}],						
					},
				}

				let reasonChart = [{
					title: 'Atención del Cajero',
					bad: this.getPercentage(reasBad, numReas),
					veryBad: this.getPercentage(reasVeryBad, numReas),
					total: numReas,
					satisfaction: this.getIndicatorsReason(numReas, reasGood, reasBad, reasVeryBad)
				}, {
					title: 'Tiempo de Espera',
					bad: this.getPercentage(reas2Bad, numReas2),
					veryBad: this.getPercentage(reas2VeryBad, numReas2),
					total: numReas2,
					satisfaction: this.getIndicatorsReason(numReas2, reas2Good, reas2Bad, reas2VeryBad)
				}, {
					title: 'Estado del Local',
					bad: this.getPercentage(reas3Bad, numReas3),
					veryBad: this.getPercentage(reas3VeryBad, numReas3),
					total: numReas3,
					satisfaction: this.getIndicatorsReason(numReas3, reas3Good, reas3Bad, reas3VeryBad)
				}, {
					title: 'Servicio Utilizado',
					bad: this.getPercentage(reas4Bad, numReas4),
					veryBad: this.getPercentage(reas4VeryBad, numReas4),
					total: numReas4,
					satisfaction: this.getIndicatorsReason(numReas4, reas4Good, reas4Bad, reas4VeryBad)
				}]

				let reasonChartStrong = [{
					title: 'Atención del Cajero',
					good: this.getPercentage(reasGood, numReas),
					veryGood: this.getPercentage(reasVeryGood, numReas),
					total: numReas,
					satisfaction: this.getIndicatorsReason(numReas, reasGood, reasBad, reasVeryBad)
				}, {
					title: 'Tiempo de Espera',
					good: this.getPercentage(reas2Good, numReas2),
					veryGood: this.getPercentage(reas2VeryGood, numReas2),
					total: numReas2,
					satisfaction: this.getIndicatorsReason(numReas2, reas2Good, reas2Bad, reas2VeryBad)
				}, {
					title: 'Estado del Local',
					good: this.getPercentage(reas3Good, numReas3),
					veryGood: this.getPercentage(reas3VeryGood, numReas3),
					total: numReas3,
					satisfaction: this.getIndicatorsReason(numReas3, reas3Good, reas3Bad, reas3VeryBad)
				}, {
					title: 'Servicio Utilizado',
					good: this.getPercentage(reas4Good, numReas4),
					veryGood: this.getPercentage(reas4VeryGood, numReas4),
					total: numReas4,
					satisfaction: this.getIndicatorsReason(numReas4, reas4Good, reas4Bad, reas4VeryBad)
				}]

				this.weakPoints = reasonChart.sort(sortByProperty('satisfaction')).map(x => x).reverse()
				this.strongPoints = reasonChartStrong.sort(sortByProperty('satisfaction')).map(x => x).reverse()

				this.topLocals = activeLocals.sort(sortByProperty('satisfaction'))

				function reverseArrayInPlace(arr) {
					for (var i = 0; i <= Math.floor((arr.length - 1) / 2); i++) {
						let el = arr[i]
							arr[i] = arr[arr.length - 1 - i]
							arr[arr.length - 1 - i] = el
					}
					return arr
				}
				
				this.badLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).reverse()
			},

			getChartCustomM() {
				const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
				const total = this.results.length
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0
				
				let numServ = 0, numServ2 = 0, numServ3 = 0, numServ4 = 0
				let objServ = [], objServ2 = [], objServ3 = [], objServ4 = []
				let servVeryGood = 0, servGood = 0, servBad = 0, servVeryBad = 0
				let serv2VeryGood = 0, serv2Good = 0, serv2Bad = 0, serv2VeryBad = 0
				let serv3VeryGood = 0, serv3Good = 0, serv3Bad = 0, serv3VeryBad = 0
				let serv4VeryGood = 0, serv4Good = 0, serv4Bad = 0, serv4VeryBad = 0
				let servObjVeryGood = [], servObjGood = [], servObjBad = [], servObjVeryBad = []
				let serv2ObjVeryGood = [], serv2ObjGood = [], serv2ObjBad = [], serv2ObjVeryBad = []
				let serv3ObjVeryGood = [], serv3ObjGood = [], serv3ObjBad = [], serv3ObjVeryBad = []
				let serv4ObjVeryGood = [], serv4ObjGood = [], serv4ObjBad = [], serv4ObjVeryBad = []
				
				let numReas = 0, numReas2 = 0, numReas3 = 0, numReas4 = 0
				let objReas = [], objReas2 = [], objReas3 = [], objReas4 = []
				let reasVeryGood = 0, reasGood = 0, reasBad = 0, reasVeryBad = 0
				let reas2VeryGood = 0, reas2Good = 0, reas2Bad = 0, reas2VeryBad = 0
				let reas3VeryGood = 0, reas3Good = 0, reas3Bad = 0, reas3VeryBad = 0
				let reas4VeryGood = 0, reas4Good = 0, reas4Bad = 0, reas4VeryBad = 0
				let reasObjVeryGood = [], reasObjGood = [], reasObjBad = [], reasObjVeryBad = []
				let reas2ObjVeryGood = [], reas2ObjGood = [], reas2ObjBad = [], reas2ObjVeryBad = []
				let reas3ObjVeryGood = [], reas3ObjGood = [], reas3ObjBad = [], reas3ObjVeryBad = []
				let reas4ObjVeryGood = [], reas4ObjGood = [], reas4ObjBad = [], reas4ObjVeryBad = []

				let zoneWM = 0, zoneLB = 0, zoneDR = 0, zoneDL = 0, zoneCM = 0, zoneFC = 0
				let objzoneWM = [], objzoneLB = [], objzoneDR = [], objzoneDL = [], objzoneCM = [], objzoneFC = []
				
				let zoneWMVeryGood = 0, zoneWMGood = 0, zoneWMBad = 0, zoneWMVeryBad = 0
				let zoneLBVeryGood = 0, zoneLBGood = 0, zoneLBBad = 0, zoneLBVeryBad = 0
				let zoneDRVeryGood = 0, zoneDRGood = 0, zoneDRBad = 0, zoneDRVeryBad = 0
				let zoneDLVeryGood = 0, zoneDLGood = 0, zoneDLBad = 0, zoneDLVeryBad = 0
				let zoneCMVeryGood = 0, zoneCMGood = 0, zoneCMBad = 0, zoneCMVeryBad = 0
				let zoneFCVeryGood = 0, zoneFCGood = 0, zoneFCBad = 0, zoneFCVeryBad = 0

				let zoneWMObjVeryGood = [], zoneWMObjGood = [], zoneWMObjBad = [], zoneWMObjVeryBad = []
				let zoneLBObjVeryGood = [], zoneLBObjGood = [], zoneLBObjBad = [], zoneLBObjVeryBad = []
				let zoneDRObjVeryGood = [], zoneDRObjGood = [], zoneDRObjBad = [], zoneDRObjVeryBad = []
				let zoneDLObjVeryGood = [], zoneDLObjGood = [], zoneDLObjBad = [], zoneDLObjVeryBad = []
				let zoneCMObjVeryGood = [], zoneCMObjGood = [], zoneCMObjBad = [], zoneCMObjVeryBad = []
				let zoneFCObjVeryGood = [], zoneFCObjGood = [], zoneFCObjBad = [], zoneFCObjVeryBad = []			

				let complains = new Array(2).fill(0)
				let comments = new Array(2).fill(0)
				let activeLocals = []
				let setUpLocals = []
				
				for (let assessment of this.results) {
					for (let local of this.locals) {
						if (local.assessments.length && !setUpLocals.includes(local)) {
							setUpLocals.push(local)
							activeLocals.push(this.getChartLocal(local))
						}
						if (local.id == assessment.local) {
							switch(local.zone) {
								case 'MM3exjMdkKaQ0cUkAkM2':
									zoneWM++
									assessment.face == "veryGood" ? zoneWMVeryGood++ : assessment.face == "good" ? zoneWMGood++ : assessment.face == "bad" ? zoneWMBad++ : assessment.face == "veryBad" ? zoneWMVeryBad++ : null
									assessment.face == "veryGood" ? zoneWMObjVeryGood.push(assessment) : assessment.face == "good" ? zoneLBObjGood.push(assessment) : assessment.face == "bad" ? zoneWMObjBad.push(assessment) : assessment.face == "veryBad" ? zoneWMObjVeryBad.push(assessment) : null
									objzoneWM.push(assessment)
								break
								case 'MopGQtv8fBJU4Pbad7vD':
									zoneLB++
									assessment.face == "veryGood" ? zoneLBVeryGood++ : assessment.face == "good" ? zoneLBGood++ : assessment.face == "bad" ? zoneLBBad++ : assessment.face == "veryBad" ? zoneLBVeryBad++ : null
									assessment.face == "veryGood" ? zoneLBObjVeryGood.push(assessment) : assessment.face == "good" ? zoneLBObjGood.push(assessment) : assessment.face == "bad" ? zoneLBObjBad.push(assessment) : assessment.face == "veryBad" ? zoneLBObjVeryBad.push(assessment) : null
									objzoneLB.push(assessment)
								break
								case 'Ngw5aiu8JFFKlHMDeZVd':
									zoneCM++
									assessment.face == "veryGood" ? zoneCMVeryGood++ : assessment.face == "good" ? zoneCMGood++ : assessment.face == "bad" ? zoneCMBad++ : assessment.face == "veryBad" ? zoneCMVeryBad++ : null
									assessment.face == "veryGood" ? zoneCMObjVeryGood.push(assessment) : assessment.face == "good" ? zoneCMObjGood.push(assessment) : assessment.face == "bad" ? zoneCMObjBad.push(assessment) : assessment.face == "veryBad" ? zoneCMObjVeryBad.push(assessment) : null
									objzoneCM.push(assessment)
								break
								case 'cRc6N1NsFEXInsBtkB9w':
									zoneDR++
									assessment.face == "veryGood" ? zoneDRVeryGood++ : assessment.face == "good" ? zoneDRGood++ : assessment.face == "bad" ? zoneDRBad++ : assessment.face == "veryBad" ? zoneDRVeryBad++ : null
									assessment.face == "veryGood" ? zoneDRObjVeryGood.push(assessment) : assessment.face == "good" ? zoneDRObjGood.push(assessment) : assessment.face == "bad" ? zoneDRObjBad.push(assessment) : assessment.face == "veryBad" ? zoneDRObjVeryBad.push(assessment) : null
									objzoneDR.push(assessment)
								break
								case 'mTMi65jxCFXXglPMEARV':
									zoneDL++
									assessment.face == "veryGood" ? zoneDLVeryGood++ : assessment.face == "good" ? zoneDLGood++ : assessment.face == "bad" ? zoneDLBad++ : assessment.face == "veryBad" ? zoneDLVeryBad++ : null
									assessment.face == "veryGood" ? zoneDLObjVeryGood.push(assessment) : assessment.face == "good" ? zoneDLObjGood.push(assessment) : assessment.face == "bad" ? zoneDLObjBad.push(assessment) : assessment.face == "veryBad" ? zoneDLObjVeryBad.push(assessment) : null
									objzoneDL.push(assessment)
								break
								case 'wk77ITDgnPYUjZ28MxJK':
									zoneFC++
									assessment.face == "veryGood" ? zoneFCVeryGood++ : assessment.face == "good" ? zoneFCGood++ : assessment.face == "bad" ? zoneFCBad++ : assessment.face == "veryBad" ? zoneFCVeryBad++ : null
									assessment.face == "veryGood" ? zoneFCObjVeryGood.push(assessment) : assessment.face == "good" ? zoneFCObjGood.push(assessment) : assessment.face == "bad" ? zoneFCObjBad.push(assessment) : assessment.face == "veryBad" ? zoneFCObjVeryBad.push(assessment) : null
									objzoneFC.push(assessment)
								break
							}
						}
					}

					switch(assessment.face) {
						case 'veryGood':
							numVeryGood++
							assessment.comment ? comments[1]++ : comments[1]
						break
						case 'good':
							numGood++
							assessment.comment ? comments[0]++ : comments[0]
						break
						case 'bad':
							numBad++
							assessment.complain ? complains[0]++ : complains[0]
						break
						case 'veryBad':
							numVeryBad++
							assessment.complain ? complains[1]++ : complains[1]
						break
					}

					switch(assessment.justification) {
						case 'Pago de servicios':
							numServ++
							assessment.face == "veryGood" ? servVeryGood++ : assessment.face == "good" ? servGood++ : assessment.face == "bad" ? servBad++ : assessment.face == "veryBad" ? servVeryBad++ : null
							assessment.face == "veryGood" ? servObjVeryGood.push(assessment) : assessment.face == "good" ? servObjGood.push(assessment) : assessment.face == "bad" ? servObjBad.push(assessment) : assessment.face == "veryBad" ? servObjVeryBad.push(assessment) : null
							objServ.push(assessment)
						break
						case 'Envío internacional':
							numServ2++
							assessment.face == "veryGood" ? serv2VeryGood++ : assessment.face == "good" ? serv2Good++ : assessment.face == "bad" ? serv2Bad++ : assessment.face == "veryBad" ? serv2VeryBad++ : null
							assessment.face == "veryGood" ? serv2ObjVeryGood.push(assessment) : assessment.face == "good" ? serv2ObjGood.push(assessment) : assessment.face == "bad" ? serv2ObjBad.push(assessment) : assessment.face == "veryBad" ? serv2ObjVeryBad.push(assessment) : null
							objServ2.push(assessment)
						break
						case 'Envío nacional':
							numServ3++
							assessment.face == "veryGood" ? serv3VeryGood++ : assessment.face == "good" ? serv3Good++ : assessment.face == "bad" ? serv3Bad++ : assessment.face == "veryBad" ? serv3VeryBad++ : null
							assessment.face == "veryGood" ? serv3ObjVeryGood.push(assessment) : assessment.face == "good" ? serv3ObjGood.push(assessment) : assessment.face == "bad" ? serv3ObjBad.push(assessment) : assessment.face == "veryBad" ? serv3ObjVeryBad.push(assessment) : null
							objServ3.push(assessment)
						break
						case 'Casa de cambio':
							numServ4++
							assessment.face == "veryGood" ? serv4VeryGood++ : assessment.face == "good" ? serv4Good++ : assessment.face == "bad" ? serv4Bad++ : assessment.face == "veryBad" ? serv4VeryBad++ : null
							assessment.face == "veryGood" ? serv4ObjVeryGood.push(assessment) : assessment.face == "good" ? serv4ObjGood.push(assessment) : assessment.face == "bad" ? serv4ObjBad.push(assessment) : assessment.face == "veryBad" ? serv4ObjVeryBad.push(assessment) : null
							objServ4.push(assessment)
						break
					}

					switch(assessment.justificationTwo) {
						case 'Atención del Cajero':
							numReas++
							assessment.face == "veryGood" ? reasVeryGood++ : assessment.face == "good" ? reasGood++ : assessment.face == "bad" ? reasBad++ : assessment.face == "veryBad" ? reasVeryBad++ : null
							assessment.face == "veryGood" ? reasObjVeryGood.push(assessment) : assessment.face == "good" ? reasObjGood.push(assessment) : assessment.face == "bad" ? reasObjVeryBad.push(assessment) : assessment.face == "veryBad" ? reasObjVeryBad.push(assessment) : null
							objReas.push(assessment)
						break
						case 'Tiempo de Espera':
							numReas2++
							assessment.face == "veryGood" ? reas2VeryGood++ : assessment.face == "good" ? reas2Good++ : assessment.face == "bad" ? reas2Bad++ : assessment.face == "veryBad" ? reas2VeryBad++ : null
							assessment.face == "veryGood" ? reas2ObjVeryGood.push(assessment) : assessment.face == "good" ? reas2ObjGood.push(assessment) : assessment.face == "bad" ? reas2ObjBad.push(assessment) : assessment.face == "veryBad" ? reas2ObjVeryBad.push(assessment) : null
							objReas2.push(assessment)
						break
						case 'Estado del Local':
							numReas3++
							assessment.face == "veryGood" ? reas3VeryGood++ : assessment.face == "good" ? reas3Good++ : assessment.face == "bad" ? reas3Bad++ : assessment.face == "veryBad" ? reas3VeryBad++ : null
							assessment.face == "veryGood" ? reas3ObjVeryGood.push(assessment) : assessment.face == "good" ? reas3ObjGood.push(assessment) : assessment.face == "bad" ? reas3ObjBad.push(assessment) : assessment.face == "veryBad" ? reas3ObjVeryBad.push(assessment) : null
							objReas3.push(assessment)
						break
						case 'Servicio Utilizado':
							numReas4++
							assessment.face == "veryGood" ? reas4VeryGood++ : assessment.face == "good" ? reas4Good++ : assessment.face == "bad" ? reas4Bad++ : assessment.face == "veryBad" ? reas4VeryBad++ : null
							assessment.face == "veryGood" ? reas4ObjVeryGood.push(assessment) : assessment.face == "good" ? reas4ObjGood.push(assessment) : assessment.face == "bad" ? reas4ObjBad.push(assessment) : assessment.face == "veryBad" ? reas4ObjVeryBad.push(assessment) : null
							objReas4.push(assessment)
						break
					}
				}

				this.results.stats = {
					veryGood: [numVeryGood, this.getPercentage(numVeryGood, total), comments[1]],
					good: [numGood, this.getPercentage(numGood, total), comments[0]],
					bad: [numBad, this.getPercentage(numBad, total), complains[0]],
					veryBad: [numVeryBad, this.getPercentage(numVeryBad, total), complains[1]],
					services: {
						0: [numServ, this.getPercentage(numServ, total), { 
							veryGood: [servObjVeryGood.length, this.getPercentage(servObjVeryGood.length, numServ)],
							good: [servObjGood.length, this.getPercentage(servObjGood.length, numServ)],
							bad: [servObjBad.length, this.getPercentage(servObjBad.length, numServ)],
							veryBad: [servObjVeryBad.length, this.getPercentage(servObjVeryBad.length, numServ)],
							assessments: objServ
						}],
						1: [numServ2, this.getPercentage(numServ2, total), { 
							veryGood: [serv2ObjVeryGood.length, this.getPercentage(serv2ObjVeryGood.length, numServ2)],
							good: [serv2ObjGood.length, this.getPercentage(serv2ObjGood.length, numServ2)],
							bad: [serv2ObjBad.length, this.getPercentage(serv2ObjBad.length, numServ2)],
							veryBad: [serv2ObjVeryBad.length, this.getPercentage(serv2ObjVeryBad.length, numServ2)],
							assessments: objServ2
						}],
						2: [numServ3, this.getPercentage(numServ3, total), { 
							veryGood: [serv3ObjVeryGood.length, this.getPercentage(serv3ObjVeryGood.length, numServ3)],
							good: [serv3ObjGood.length, this.getPercentage(serv3ObjGood.length, numServ3)],
							bad: [serv3ObjBad.length, this.getPercentage(serv3ObjBad.length, numServ3)],
							veryBad: [serv3ObjVeryBad.length, this.getPercentage(serv3ObjVeryBad.length, numServ3)],
							assessments: objServ3
						}],
						3: [numServ4, this.getPercentage(numServ4, total), { 
							veryGood: [serv4ObjVeryGood.length, this.getPercentage(serv4ObjVeryGood.length, numServ4)],
							good: [serv4ObjGood.length, this.getPercentage(serv4ObjGood.length, numServ4)],
							bad: [serv4ObjBad.length, this.getPercentage(serv4ObjBad.length, numServ4)],
							veryBad: [serv4ObjVeryBad.length, this.getPercentage(serv4ObjVeryBad.length, numServ4)],
							assessments: objServ4
						}]
					},
					reasons: {
						0: [numReas, this.getPercentage(numReas, total), { 
							veryGood: [reasObjVeryGood.length, this.getPercentage(reasObjVeryGood.length, numReas)],
							good: [reasObjGood.length, this.getPercentage(reasObjGood.length, numReas)],
							bad: [reasObjBad.length, this.getPercentage(reasObjBad.length, numReas)],
							veryBad: [reasObjVeryBad.length, this.getPercentage(reasObjVeryBad.length, numReas)],
							assessments: objReas
						}],
						1: [numReas2, this.getPercentage(numReas2, total), { 
							veryGood: [reas2ObjVeryGood.length, this.getPercentage(reas2ObjVeryGood.length, numReas2)],
							good: [reas2ObjGood.length, this.getPercentage(reas2ObjGood.length, numReas2)],
							bad: [reas2ObjBad.length, this.getPercentage(reas2ObjBad.length, numReas2)],
							veryBad: [reas2ObjVeryBad.length, this.getPercentage(reas2ObjVeryBad.length, numReas2)],
							assessments: objReas2
						}],
						2: [numReas3, this.getPercentage(numReas3, total), { 
							veryGood: [reas3ObjVeryGood.length, this.getPercentage(reas3ObjVeryGood.length, numReas3), 0],
							good: [reas3ObjGood.length, this.getPercentage(reas3ObjGood.length, numReas3), 0],
							bad: [reas3ObjBad.length, this.getPercentage(reas3ObjBad.length, numReas3), 0],
							veryBad: [reas3ObjVeryBad.length, this.getPercentage(reas3ObjVeryBad.length, numReas3), 0],
							assessments: objReas3
						}],
						3: [numReas4, this.getPercentage(numReas4, total), { 
							veryGood: [reas4ObjVeryGood.length, this.getPercentage(reas4ObjVeryGood.length, numReas4)],
							good: [reas4ObjGood.length, this.getPercentage(reas4ObjGood.length, numReas4)],
							bad: [reas4ObjBad.length, this.getPercentage(reas4ObjBad.length, numReas4)],
							veryBad: [reas4ObjVeryBad.length, this.getPercentage(reas4ObjVeryBad.length, numReas4)],
							assessments: objReas4
						}]						
					},
					zones: {
						0: [zoneWM, this.getPercentage(zoneWM, total), { 
							veryGood: [zoneWMObjVeryGood.length, this.getPercentage(zoneWMObjVeryGood.length, zoneWM)],
							good: [zoneWMObjGood.length, this.getPercentage(zoneWMObjGood.length, zoneWM)],
							bad: [zoneWMObjBad.length, this.getPercentage(zoneWMObjBad.length, zoneWM)],
							veryBad: [zoneWMObjVeryBad.length, this.getPercentage(zoneWMObjVeryBad.length, zoneWM)],
							assessments: objzoneWM
							}],
						1: [zoneLB, this.getPercentage(zoneLB, total), { 
							veryGood: [zoneLBObjVeryGood.length, this.getPercentage(zoneLBObjVeryGood.length, zoneLB)],
							good: [zoneLBObjGood.length, this.getPercentage(zoneLBObjGood.length, zoneLB)],
							bad: [zoneLBObjBad.length, this.getPercentage(zoneLBObjBad.length, zoneLB)],
							veryBad: [zoneLBObjVeryBad.length, this.getPercentage(zoneLBObjVeryBad.length, zoneLB)],
							assessments: objzoneLB
							}],
						2: [zoneCM, this.getPercentage(zoneCM, total), { 
							veryGood: [zoneCMObjVeryGood.length, this.getPercentage(zoneCMObjVeryGood.length, zoneCM)],
							good: [zoneCMObjGood.length, this.getPercentage(zoneCMObjGood.length, zoneCM)],
							bad: [zoneCMObjBad.length, this.getPercentage(zoneCMObjBad.length, zoneCM)],
							veryBad: [zoneCMObjVeryBad.length, this.getPercentage(zoneCMObjVeryBad.length, zoneCM)],
							assessments: objzoneCM
							}],
						3: [zoneDR, this.getPercentage(zoneDR, total), { 
							veryGood: [zoneDRObjVeryGood.length, this.getPercentage(zoneDRObjVeryGood.length, zoneDR)],
							good: [zoneDRObjGood.length, this.getPercentage(zoneDRObjGood.length, zoneDR)],
							bad: [zoneDRObjBad.length, this.getPercentage(zoneDRObjBad.length, zoneDR)],
							veryBad: [zoneDRObjVeryBad.length, this.getPercentage(zoneDRObjVeryBad.length, zoneDR)],
							assessments: objzoneDR
							}],
						4: [zoneDL, this.getPercentage(zoneDL, total), { 
							veryGood: [zoneDLObjVeryGood.length, this.getPercentage(zoneDLObjVeryGood.length, zoneDL)],
							good: [zoneDLObjGood.length, this.getPercentage(zoneDLObjGood.length, zoneDL)],
							bad: [zoneDLObjBad.length, this.getPercentage(zoneDLObjBad.length, zoneDL)],
							veryBad: [zoneDLObjVeryBad.length, this.getPercentage(zoneDLObjVeryBad.length, zoneDL)],
							assessments: objzoneDL
							}],
						5: [zoneFC, this.getPercentage(zoneFC, total), { 
							veryGood: [zoneFCObjVeryGood.length, this.getPercentage(zoneFCObjVeryGood.length, zoneFC)],
							good: [zoneFCObjGood.length, this.getPercentage(zoneFCObjGood.length, zoneFC)],
							bad: [zoneFCObjBad.length, this.getPercentage(zoneFCObjBad.length, zoneFC)],
							veryBad: [zoneFCObjVeryBad.length, this.getPercentage(zoneFCObjVeryBad.length, zoneFC)],
							assessments: objzoneFC
						}],						
					},
				}

				let reasonChart = [{
					title: 'Atención del Cajero',
					bad: this.getPercentage(reasBad, numReas),
					veryBad: this.getPercentage(reasVeryBad, numReas),
					total: numReas,
					satisfaction: this.getIndicatorsReason(numReas, this.getPercentage(reasGood, numReas), this.getPercentage(reasBad, numReas), this.getPercentage(reasVeryBad, numReas))
				}, {
					title: 'Tiempo de Espera',
					bad: this.getPercentage(reas2Bad, numReas2),
					veryBad: this.getPercentage(reas2VeryBad, numReas2),
					total: numReas2,
					satisfaction: this.getIndicatorsReason(numReas2, this.getPercentage(reas2Good, numReas2), this.getPercentage(reas2Bad, numReas2), this.getPercentage(reas2VeryBad, numReas2))				
				}, {
					title: 'Estado del Local',
					bad: this.getPercentage(reas3Bad, numReas3),
					veryBad: this.getPercentage(reas3VeryBad, numReas3),
					total: numReas3,
					satisfaction: this.getIndicatorsReason(numReas3, this.getPercentage(reas3Good, numReas3), this.getPercentage(reas3Bad, numReas3), this.getPercentage(reas3VeryBad, numReas3))					
				}, {
					title: 'Servicio Utilizado',
					bad: this.getPercentage(reas4Bad, numReas4),
					veryBad: this.getPercentage(reas4VeryBad, numReas4),
					total: numReas4,
					satisfaction: this.getIndicatorsReason(numReas4, this.getPercentage(reas4Good, numReas4), this.getPercentage(reas4Bad, numReas4), this.getPercentage(reas4VeryBad, numReas4))
				}]

				let reasonChartStrong = [{
					title: 'Atención del Cajero',
					good: this.getPercentage(reasGood, numReas),
					veryGood: this.getPercentage(reasVeryGood, numReas),
					total: numReas,
					satisfaction: this.getIndicatorsReason(numReas, this.getPercentage(reasGood, numReas), this.getPercentage(reasBad, numReas), this.getPercentage(reasVeryBad, numReas))
				}, {
					title: 'Tiempo de Espera',
					good: this.getPercentage(reas2Good, numReas2),
					veryGood: this.getPercentage(reas2VeryGood, numReas2),
					total: numReas2,
					satisfaction: this.getIndicatorsReason(numReas2, this.getPercentage(reas2Good, numReas2), this.getPercentage(reas2Bad, numReas2), this.getPercentage(reas2VeryBad, numReas2))				
				}, {
					title: 'Estado del Local',
					good: this.getPercentage(reas3Good, numReas3),
					veryGood: this.getPercentage(reas3VeryGood, numReas3),
					total: numReas3,
					satisfaction: this.getIndicatorsReason(numReas3, this.getPercentage(reas3Good, numReas3), this.getPercentage(reas3Bad, numReas3), this.getPercentage(reas3VeryBad, numReas3))					
				}, {
					title: 'Servicio Utilizado',
					good: this.getPercentage(reas4Good, numReas4),
					veryGood: this.getPercentage(reas4VeryGood, numReas4),
					total: numReas4,
					satisfaction: this.getIndicatorsReason(numReas4, this.getPercentage(reas4Good, numReas4), this.getPercentage(reas4Bad, numReas4), this.getPercentage(reas4VeryBad, numReas4))
				}]

				this.weakPointsCustom = reasonChart.sort(sortByProperty('satisfaction')).map(x => x).reverse()
				this.strongPointsCustom = reasonChartStrong.sort(sortByProperty('satisfaction')).map(x => x).reverse()

				// this.topLocals = activeLocals.sort(sortByProperty('satisfaction'))

				// function reverseArrayInPlace(arr) {
				// 	for (var i = 0; i <= Math.floor((arr.length - 1) / 2); i++) {
				// 		let el = arr[i]
				// 			arr[i] = arr[arr.length - 1 - i]
				// 			arr[arr.length - 1 - i] = el
				// 	}
				// 	return arr
				// }
				
				// this.badLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).reverse()
			},

			async getIndicatorsGlobal() {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1
				
				const total = this.assessments.length
				const stats = this.assessments.stats
				
				let complains = 0, comments = 0, services = 0, reasons = 0
				let complainsUnread = 0
				this.indicatorsGlobal.complainUnread = [0, 0]

				const getNumbers = () => {
					for (let assessment of this.assessments) {
						if (assessment.complain) {
							complains++
							const tickets = this.$firebase.firestore().collection('tickets')
							.where('assessment', '==', assessment.id).where('status', '==', 0)
							.where('complain', '==', 1)
							tickets.onSnapshot(querySnapshot => {
								querySnapshot.forEach(doc => {
									complainsUnread++
									this.indicatorsGlobal.complainUnread = [complainsUnread, this.getPercentage(complainsUnread, complains)]
								})
							})
						}
						assessment.comment ? comments++ : comments
						assessment.flow.justification ? services++ : services
						assessment.flow.justificationTwo ? reasons++ : reasons
					}
				}

				await getNumbers()

				const partialGood = stats.good[0] * PRC_GOOD
				const partialBad = stats.bad[0] * PRC_BAD
				const partialVeryBad = stats.veryBad[0] * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad

				this.indicatorsGlobal.satisfaction = 100 - this.getPercentage(partials, total)
				
				this.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				this.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
				this.indicatorsGlobal.service = [services, this.getPercentage(services, total)]
				this.indicatorsGlobal.reason = [reasons, this.getPercentage(reasons, total)]
			},

			getIndicatorsLocal(local) {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1
				
				const total = local.assessments.stats.total
				const stats = local.assessments.stats
				
				let complains = 0, comments = 0, services = 0, reasons = 0
				local.indicatorsGlobal = {}

				for (let assessment of local.assessments) {
					assessment.complain ? complains++ : complains
					assessment.comment ? comments++ : comments
					assessment.flow.justification ? services++ : services
					assessment.flow.justificationTwo ? reasons++ : reasons
				}

				const partialGood = parseInt(stats.good * total / 100) * PRC_GOOD
				const partialBad = parseInt(stats.bad * total / 100) * PRC_BAD
				const partialVeryBad = parseInt(stats.veryBad * total / 100) * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad

				local.indicatorsGlobal.satisfaction = 100 - this.getPercentage(partials, total)
				
				local.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				local.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
				local.indicatorsGlobal.service = [services, this.getPercentage(services, total)]
				local.indicatorsGlobal.reason = [reasons, this.getPercentage(reasons, total)]

				return local.indicatorsGlobal
			},

			async getInidicatorsCustom() {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1
				
				const total = this.results.length
				const stats = this.results.stats
				
				let complains = 0, comments = 0, services = 0, reasons = 0
				let complainsUnread = 0
				this.indicatorsCustom.complainUnread = [0, 0]

				const getNumbers = () => {
					for (let assessment of this.results) {
						if (assessment.complain) {
							complains++
							const tickets = this.$firebase.firestore().collection('tickets')
							.where('assessment', '==', assessment.id).where('status', '==', 0)
							.where('complain', '==', 1)
							tickets.onSnapshot(querySnapshot => {
								querySnapshot.forEach(doc => {
									complainsUnread++
									this.indicatorsCustom.complainUnread = [complainsUnread, this.getPercentage(complainsUnread, complains)]
								})
							})
						}
						assessment.comment ? comments++ : comments
						assessment.flow.justification ? services++ : services
						assessment.flow.justificationTwo ? reasons++ : reasons
					}
				}

				await getNumbers()

				const partialGood = stats.good[0] * PRC_GOOD
				const partialBad = stats.bad[0] * PRC_BAD
				const partialVeryBad = stats.veryBad[0] * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad

				this.indicatorsCustom.satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
				
				this.indicatorsCustom.complain = [complains, this.getPercentage(complains, total)]
				this.indicatorsCustom.comment = [comments, this.getPercentage(comments, total)]
				this.indicatorsCustom.service = [services, this.getPercentage(services, total)]
				this.indicatorsCustom.reason = [reasons, this.getPercentage(reasons, total)]
			},

			getIndicatorsReason(total, good, bad, veryBad, test = false) {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1

				const partialGood = good * PRC_GOOD
				const partialBad = bad * PRC_BAD
				const partialVeryBad = veryBad * PRC_VERY_BAD

				const partials = partialGood + partialBad + partialVeryBad

				let satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
				if (!this.getPercentage(partials, total)) satisfaction = 0

				return satisfaction
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
						title: i + " hs",
						total,
						veryGood: this.getPercentage(timesVeryGood[i], total),
						good: this.getPercentage(timesGood[i], total),
						bad: this.getPercentage(timesBad[i], total),
						veryBad: this.getPercentage(timesVeryBad[i], total)
					})
				}
			},

			getChartCustomDatesHour() {
				let timesVeryGood = new Array(24).fill(0)
				let timesGood = new Array(24).fill(0)
				let timesBad = new Array(24).fill(0)
				let timesVeryBad = new Array(24).fill(0)

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

				this.chartHourCustom = []

				for (let i = 8; i < 23; i++) {
					let total = timesVeryGood[i] + timesGood[i] + timesBad[i] + timesVeryBad[i]
					this.chartHourCustom.push({
						title: i + " hs",
						total,
						veryGood: this.getPercentage(timesVeryGood[i], total),
						good: this.getPercentage(timesGood[i], total),
						bad: this.getPercentage(timesBad[i], total),
						veryBad: this.getPercentage(timesVeryBad[i], total)
					})
				}
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

			getChartCustomDatesDayW() {
				let daysWVeryGood = new Array(7).fill(0)
				let daysWGood = new Array(7).fill(0)
				let daysWBad = new Array(7).fill(0)
				let daysWVeryBad = new Array(7).fill(0)
				const CATEGORIES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

				for(let assessment of this.results) {
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

				this.chartDayWCustom = []

				for (let i = 0; i < 7; i++) {
					let total = daysWVeryGood[i] + daysWGood[i] + daysWBad[i] + daysWVeryBad[i]
					this.chartDayWCustom.push({
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

				this.chartDayGlobal = []

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

			getChartCustomDatesDay() {
				let daysVeryGood = new Array(31).fill(0)
				let daysGood = new Array(31).fill(0)
				let daysBad = new Array(31).fill(0)
				let daysVeryBad = new Array(31).fill(0)

				for(let assessment of this.results) {
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

				this.chartDayCustom = []

				for (let i = 1; i < 32; i++) {
					let total = daysVeryGood[i] + daysGood[i] + daysBad[i] + daysVeryBad[i]
					this.chartDayCustom.push({
						title: "Día " + i,
						total: isNaN(total) ? 0 : total,
						veryGood: this.getPercentage(daysVeryGood[i], total),
						good: this.getPercentage(daysGood[i], total),
						bad: this.getPercentage(daysBad[i], total),
						veryBad: this.getPercentage(daysVeryBad[i], total)
					})
				}
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

			getChartCustomDatesMonth() {
				let monthsVeryGood = new Array(12).fill(0)
				let monthsGood = new Array(12).fill(0)
				let monthsBad = new Array(12).fill(0)
				let monthsVeryBad = new Array(12).fill(0)
				const CATEGORIES = ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']

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

				this.chartMonthCustom = []

				for (let i = 0; i < 12; i++) {
					let total = monthsVeryGood[i] + monthsGood[i] + monthsBad[i] + monthsVeryBad[i]
					this.chartMonthCustom.push({
						title: CATEGORIES[i],
						total,
						veryGood: this.getPercentage(monthsVeryGood[i], total),
						good: this.getPercentage(monthsGood[i], total),
						bad: this.getPercentage(monthsBad[i], total),
						veryBad: this.getPercentage(monthsVeryBad[i], total)
					})
				}
			},

			getChartLocal(local) {
				let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0
				let numServ = 0, numServ2 = 0, numServ3 = 0, numServ4 = 0
				let numReas = 0, numReas2 = 0, numReas3 = 0, numReas4 = 0
				let zoneWM = 0, zoneLB = 0, zoneDR = 0, zoneDL = 0, zoneCM = 0, zoneFC = 0
				let complains = new Array(2).fill(0)
				let comments = new Array(2).fill(0)
				
				for (let assesment of local.assessments) {
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

					switch(assesment.justification) {
						case 'Pago de servicios':
							numServ++
						break
						case 'Envío internacional':
							numServ2++
						break
						case 'Envío nacional':
							numServ3++
						break
						case 'Casa de cambio':
							numServ4++
						break
					}

					switch(assesment.justificationTwo) {
						case 'Atención del Cajero':
							numReas++
						break
						case 'Tiempo de Espera':
							numReas2++
						break
						case 'Estado del Local':
							numReas3++
						break
						case 'Servicio Utilizado':
							numReas4++
						break
					}
				}

				let total = numVeryGood + numGood + numBad + numVeryBad

				local.assessments.stats = {
					title: local.title,
					veryGood: this.getPercentage(numVeryGood, total),
					good: this.getPercentage(numGood, total),
					bad: this.getPercentage(numBad, total),
					veryBad: this.getPercentage(numVeryBad, total),
					total
				}

				local.assessments.stats.satisfaction = this.getIndicatorsLocal(local).satisfaction

				return local.assessments.stats

				// const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
				// let numVeryGood = 0, numGood = 0, numBad = 0, numVeryBad = 0, activeLocals = []
				
				// for (let local of this.locals) {
				// 	for (let assessment of this.assessments) {
				// 		if(assessment.local == local.id) {
				// 			local.assessments.total++
				// 			local.assessments[assessment.face]++
				// 		}
				// 	}

				// 	if (local.assessments.total)
				// 		activeLocals.push({
				// 			title: local.title,
				// 			veryGood: parseFloat(((local.assessments["veryGood"] * 100) / local.assessments.total).toFixed(2)),
				// 			good: parseFloat(((local.assessments["good"] * 100) / local.assessments.total).toFixed(2)),
				// 			bad: parseFloat(((local.assessments["bad"] * 100) / local.assessments.total).toFixed(2)),
				// 			veryBad: parseFloat(((local.assessments["veryBad"] * 100) / local.assessments.total).toFixed(2)),
				// 			total: local.assessments.total
				// 		})

				// 	this.topLocals = activeLocals.sort(sortByProperty('veryGood')).slice(0,5)

				// 	localStorage.setItem('topLocals', JSON.stringify(this.topLocals))
				// 	this.badLocals = activeLocals.sort(sortByProperty('veryBad'))
				// }
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
		font-size: 18px

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

	@media (max-width: 1242px)
		.indicatorsTwoTitle
			font-size: 16px
</style>