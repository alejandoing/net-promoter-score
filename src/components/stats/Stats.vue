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
			v-flex(xs4 sm1 offset-sm2)
				v-checkbox(
					v-model="AMBA"
					label="AMBA"
					type="checkbox"
					style="position: relative; top: 20px"
				)
			v-flex(xs4 sm1)
				v-checkbox(
					v-model="interior"
					label="Interior"
					type="checkbox"
					style="position: relative; top: 20px"
				)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs2 offset-xs2)
				v-btn#submit(
					large outline
					:loading="loading"
					:disabled="loading || (!timeSince && !dateSince && !zone && !AMBA && !interior)"
					@click.native="searchStats"
					color="primary"
					) Obtener Resultados
					span.custom-loader(slot="loader")
						v-icon(light) cached
			v-flex.py-5.ml-4(fill-height xs3)
				v-btn(large outline @click.native="clearFields" color="primary") Limpiar
				div(style="flex: 1 1 auto;")
			v-flex(xs12)
				.pb-5
					span.display-1 Resultados Generales
					v-divider
			v-flex(xs9 offset-xs1)
				Face#generalesFaces.pb-5(:data="assessments.stats")
			v-flex(xs3 offset-xs10)
				v-btn(
					fab
					color="primary"
					@click="printGeneralReport"
					:loading="loading2"
					:disabled="loading2"
				)
					v-icon(dark) picture_as_pdf
				v-btn(
					fab
					color="primary"
					@click="downloadXLSX"
					:loading="loading3"
					:disabled="loading3"
				)
					v-icon(dark) storage
			v-flex#satisfactionInd.pt-3.pb-5(xs12)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.display-1.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction }}%
					v-card-title
						v-progress-linear(:value="indicatorsGlobal.satisfaction" height="20" color="info")
			v-layout(row wrap)#indicators
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text.primary(height="75px")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
						v-card-title
							v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text.primary(height="75px")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
						v-card-title
							v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text.primary(height="75px")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Resp. Servicio: {{ indicatorsGlobal.service[1] }}% - {{ indicatorsGlobal.service[0] }} total
						v-card-title
							v-progress-linear(:value="indicatorsGlobal.service[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text.primary(height="75px")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Resp. Motivo: {{ indicatorsGlobal.reason[1] }}% - {{ indicatorsGlobal.reason[0] }} total
						v-card-title
							v-progress-linear(:value="indicatorsGlobal.reason[1]" height="20" color="info")
				v-flex(xs6 md4)
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
					v-tabs-item#toWeek(href="#week" ripple) Día de la Semana
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
			v-layout#services(row wrap)
				v-flex(xs12)
					div.pb-5
						span.display-1 Servicios
						v-divider
				v-flex(xs9 offset-xs2)
					Service.pb-5(:data="assessments.stats")
			#reasons
				v-flex(xs12)
					div.pb-5
						span.display-1 Motivos
						v-divider
				v-flex(xs9 offset-xs2)
					Reason.pb-5(:data="assessments.stats")
			#zones
				v-flex(xs12)
					div.pb-5
						span.display-1 Jefe Zonales
						v-divider
				v-flex(xs9 offset-xs2)
					Zone.pb-5(:data="assessments.stats")
			v-flex#strongPoints(xs12)
				Chart.pb-5(type="barStacked" title="Puntos Fuertes" :data="strongPoints")
			v-flex#weakPoints(xs12)
				Chart.pb-5(type="barStacked" title="Puntos Débiles" :data="weakPoints")
			#topLocals
				v-flex(xs12)
					div.pb-5
						span.display-1 Locales
						v-divider
				v-flex(xs12 v-if="assessments")
					Chart.pb-5(type="barStacked" title="Distribución General - Mejores Locales" :data="topLocals")
			v-flex#badLocals(xs12 v-if="assessments")
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
						Face#customFaces.pb-5(:data="results.stats")
					v-flex(xs3 offset-xs10)
						v-btn(
							fab
							color="primary"
							@click="printGeneralReportCustom"
							:loading="loading2"
							:disabled="loading2"
						)
							v-icon(dark) picture_as_pdf
						v-btn(
							fab
							color="primary"
							@click="downloadXLSXCustom"
							:loading="loading3"
							:disabled="loading3"
						)
							v-icon(dark) storage
					v-flex#satisfactionIndCustom.pt-3.pb-5(xs12)
						v-card.my-1.mr-1(flat tile)
							v-card-media.white--text.primary(height="75px")
								span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ indicatorsCustom.satisfaction }}%
							v-card-title
								v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")
					v-layout#indicatorsCustom(row wrap)
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
					#servicesCustom
						v-flex(xs12)
							div.pb-5
								span.display-1 Servicios
								v-divider
						v-flex(xs9 offset-xs2)
							Service.pb-5(:data="results.stats")
					#reasonsCustom
						v-flex(xs12)
							div.pb-5
								span.display-1 Motivos
								v-divider
						v-flex(xs9 offset-xs2)
							Reason.pb-5(:data="results.stats")
					#zonesCustom
						v-flex(xs12)
							div.pb-5
								span.display-1 Jefe Zonales
								v-divider
						v-flex(xs9 offset-xs2)
							Zone.pb-5(:data="results.stats")
					v-flex#strongPointsCustom(xs12)
						Chart.pb-5(type="barStacked" title="Puntos Fuertes" :data="strongPointsCustom")
					v-flex#weakPointsCustom(xs12)
						Chart.pb-5(type="barStacked" title="Puntos Débiles" :data="weakPointsCustom")
		Chart#weekChart(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobal")
		Chart#dayChart(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobal")
		Chart#monthChart(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobal")
		Chart#weekChartCustom(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWCustom")
		Chart#dayChartCustom(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayCustom")
		Chart#monthChartCustom(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthCustom")
</template>

<script lang="javascript" src="xlsx.full.min.js"></script>
<script>
	import jsPDF from 'jspdf'
	import html2canvas from 'html2canvas'
	import Vue from 'vue'
	import XLSX from 'xlsx'
	import { saveAs } from 'file-saver';
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
			Zone,
		},
		mixins: [validationMixin],
		validations: {},
    data () {
      return {
				loading3: false,
        loader2: null,
        loading2: false,
				AMBA: false,
				interior: false,
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
      loader2 () {
				const l = this.loader2
				this[l] = !this[l]
			},
			AMBA() {
				if (this.interior && this.AMBA) this.interior = false
			},
			interior() {
				if (this.interior && this.AMBA) this.AMBA = false
			},
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
		
		async created() {
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
			async downloadXLSX() {
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

				for (let assessment of this.assessments) {
					ws_data.push(new Array(10).fill(null))
					ws_data[ws_data.length - 1][0] = assessment.id
					ws_data[ws_data.length - 1][1] = this.locals.find(item => item.id == assessment.local).title
					ws_data[ws_data.length - 1][2] = this.zones.find(item => item.id == assessment.zone).responsable
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
						if (y == this.assessments.length) {
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
			async downloadXLSXCustom() {
				this.loader2 = 'loading3'
				const wb = XLSX.utils.book_new();
				let y = 0

				wb.Props = {
					Title: "SheetJS Tutorial",
					Subject: "Test",
					Author: "Red Stapler",
					CreatedDate: new Date(2017,12,19)
				}
				
				wb.SheetNames.push("NPS Crudo de Datos")

				const ws_data = [
					['ID' , 'Local', 'Jefe Zonal', 'Fecha', 'Hora', 'Valoración', 'Servicio', 'Motivo', 'Comentario', 'Email', 'Teléfono'],
				]

				for (let assessment of this.results) {
					ws_data.push(new Array(10).fill(null))
					ws_data[ws_data.length - 1][0] = assessment.id
					ws_data[ws_data.length - 1][1] = this.locals.find(item => item.id == assessment.local).title
					ws_data[ws_data.length - 1][2] = this.zones.find(item => item.id == assessment.zone).responsable
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
						if (y == this.results.length) {
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
			async printGeneralReport() {
				this.loader2 = 'loading2'

				const weekChart = document.getElementById('weekChart')
				const dayChart = document.getElementById('dayChart')
				const monthChart = document.getElementById('monthChart')
				
				weekChart.style.display = dayChart.style.display = monthChart.style.display = "block"

				const FILENAME  = 'reporte_general.pdf'
				let pdf = new jsPDF()

				const WU_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nOzdZ5gk2Vkn+n+kL5Plvfe+2nePk0PSlRBIK4GE0BV+BfvgBIhdLuwud7XsrHZBXF1Ae9HCwgq38ICklQQaNCADkkZtqqrLe+99VWZVehtxP/SMZrqzuiOqTmZWReT/9zz5YWKy09eJN97znvcARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER6IplMJhQVFZ3pH7tcLossyw4ANgCmpL4yIiIiOkkMQCg7OzuUnZ196n8ciUTg8XhgaWhowOLiouZ/uLm56RgeHu75q7/6qzd/8YtffC4YDHYBqAHgOPWrICIiotM6ALDS1tY28ta3vvXr733ve+/cvHlzzWw2a/rHL7zwAt71rncBTU1NUBRF9Xb79u3cd7/73T9aU1PzEgA/AIU33njjjTfeeDv32+aNGzf+6KMf/eiNg4MDk9r5/Etf+hIAqAcA4XDY9Bu/8Rtvs9vtowDiF+CN8sYbb7zxxhtviTf/U089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'
				const DWT_LOGO = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUPDxEVFRUVERYVFhUVFRIVFRUVFRcWFxcVFRUYHSggGBolGxcWITEhJSkrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAQcEBQYCAwj/xAA9EAACAQIBCgMFBQgCAwAAAAAAAQIDEQQFBgcSITFBUWGBInGRE1KhscEjMkJicjNzgpKistHwFCQWNIP/xAAaAQEAAgMBAAAAAAAAAAAAAAAAAwQBAgUG/8QAKxEBAAICAQQCAQIGAwAAAAAAAAECAxEEBRIhMUFREyIyFSNSYWKRFCRx/9oADAMBAAIRAxEAPwC8QAAAAAAAAAAAAAAPLB/4+OKxlOlHXqzjCPOTSXxG4hpa9a/ulrYZ04JvVWKp3/UjHdCKOTj/AKm2p1YySlFppq6ad01zTM7T1tE+ntBlIAAAAAAAAAAAAAAAAAAAAAAAAAAANJnVl2ODoOq1eT8MI85tO1+is2/I1tPbCtyuRGGm1M5SyjVxE3VrzcpP0j0iuCKVrTaXl82a+Sd2liGPKHbcZu5wVcHNSptuDfjp8JK+23KXUkpeYlc43LvildWTcbCtTjWpu8ZxTT8+fUtxO3p8WTvrEsoykAAAAAAAAAAAAAAAAAAAAAAAAAAAqvStiG8RSp8IU726ye/+krZ7PP8AVrTN4hw7IIciQMJDK1dFOIcsLOD3QrNLulL5tlrDO4ek6XabYp39u2JnTAAAAAAAAAAAAAAAAAAAAAAAAAAArbSvk+V6WJSvFJ05dG9sX80QZq7cXq2GZ1aFeMrOFMeAMAjctojfhcejnJ0qOETmrSqydSz32dlG/ZL1LmONQ9R0/FOPH5+XUki8AAAAAAAAAAAAAAAAAAAAAAAAAABjY7BwqwlSqrWjJNNPqYmNw0vji8dsqUzoyFLB13Se2D8VOXOPJ9VuKeSnbLyvM484bzHx8NQiOJVdeXa5hZpe3axWIX2Sfgj77T3v8vz+dnFT5l1+Bwu+e+3pakVbYiw9BEajSbhjZcMlwAEgAAAAAAAAAAAAAAAAAAAAAAIaA5bSJktVsJKaXiop1E+iXiXp8jTJHdCh1HDGTFv5hV2QcmvE4inQW6UlrPlBbZP0+hUx03LgcbF+XLFV64ehGEYwgrRjFJJbkluRdjw9XSsVjtj09ykltewyzMxHmVf5x6Q9STpYOMZWdnUltjf8q4+ZXtm16cjldT7Z7af7cz/5zj739v29nSt5fd+pp+aVD+JZ9+3R5vaRHKSp42KV2kqkLpJv34t7PNElM32vcbqm57cn+1hwmmk07p7nzJ4dmJifMPYZAAAAAAAAAAAAAAAAAAAAAAAHwx9NSpzg90oSTXRoxb00yRuswrDRPhr4irN74Uku8pb/AOl+pBijy4nS6byWn6WsWHecbpOyrKlh1Sg7SrNxfPUS8Xziu5HktqHO6jmmlNfapSn7eZmdoDCUPXlmPta2i/KsqtCdCbu6LSX6JX1V2cZLsW8Vtw9J0zPN6an4dsSumAAAAAAAAAAAAAAAAAAAAAAAMXKddU6VSpLdGnKT8km/oYtPhHlntpMq80RT+0xCe906T9HO/wAyHD7cbpM7tdZpO7qudLtJ/wDXnwTqRb6y1Wv7X6EGaNw43VYnUK5KtXAQZEoT6bROlh6I6L1sRU4WpR6NrXb+DXqWMEeHa6RWfMrJLDuAAAAAAAAAAAAARcBrIMd0FwyXAkAAAARcHzpyOkrKypYX2KfirPUS/J+Jvpw7kWW2oc7qWbsxdv24nR5j1SxkVJ2VWLp9204/FW7kOC3lyum5O3KuS5bel3501WcuSI4uhKi9javCXuzW5/7wuYmNwg5GH8tJr8qSyjgZ0KkqNWOrKLs+T5NPinzKVqzWXlMuK2O01ljWNUWmRk/BVK1SNKjHWnJ2S+rfBIzWNzpNhw2y27YXZmvkVYShGitsvvTl70nvflw7F2tdQ9VxsMYqdrcGywAAAAAAAAAAAD4YrERpxlUm1GMY3be5JCZ1DS9opHdKqc4s+69aTjhpOlST2NW15db/AIV0RVvl+nA5fUbWnVPTmnlCte/t6t+ftJ/5I++zn/8AIy73t0Wb2fOIoSUa8nWp8U9s49Yvj5M3rln5XuL1G9Z1f0tjBYqFWEalN60ZK6a5MtRO4ehpet47oZBluAAAGBlfKVPD05Vq0rRXq3wS5s17tR5RZc1cVe6ylM4MsTxdaVaexboR4RhwX1fUp3v3S8tyeRbNbc+mvhNpqSdmmmnyad0zWs9qCt5rPhdWaGX44uipXtUirVI8b+9bk7X9eRdpaLQ9Tw+TGWn92+Zutz6cXpJyGqtB4mK8dFNv81P8V/Lf68yLJTcOb1LjRbH3x7hVSKsR5085FZmdLhzFzdWGoqpOP21RJy/Kt6h249S5jpEQ9PweLGOu59upRuvpAAAAAAAAAAAADhdK2NcaFOjF29pUvLrGCvb1a9CHNMxVyerZJjHEQq5lV56EBhIZWVomxzcKuHe6DU49FO916xb7lnBMzDv9KybiarBJ3YAAACms/wDLEq+KlTT+zovViuGsra0vW68kipmtt5nqHIm9+3fhzDInOkDDY5v5Vlha8K0HsUkpr3oNrWXpu6m+O0xK1xc048kTEr4ozUkpLc0mvJl16ytu6NvOIpKUZRa2Si0/JqzEsXjdZhS+a+StfHwoSWynVk5dVSe591EqUj9bzfGxb5Pb9Lsii29PCQAAAAAAAAAAAAAV/pbwrdOjWS2Rm4t8tdbPiviQZ43DkdWpukWVoytDz8/aAwGNsrG0SYV/b1uD1ILzjdv+5FrBHh3OkUmImyxid2wAAA/P2V4NV6ylvVapf+ZlC/iXjuRGslt/bEZrCAMhLiIny2iPS/8AI0WqFJS3qlC/nqov19PY4Y/lwzGZSq0zKSllTEyXD2rXeaRXpH63D4XnlWWXEsO2kMgAAAAAAAAAAAAYmVMDCvTlRqq8Zqz6dV1W8xMb8I8mOMlZrKkc4cjzwlZ0am1b4S4TjwfnwZSyV7ZeU5HHnBeYlrDVWbPIGRamLqqlS2LfKb3Qje1315LibUp3StcXjTnt2wurIuTKeGpRoUlsit/FvjJ9Wy7EajT1OHFGOvbDPMpQAAAqvSPm7KnVljKSvTqNe0t+CVktZ/ldvUr5afLgdR4k935I9OHZWcefsMsOjzLzfliq0ZOLVGnJSnJrZKzvqLne23oS4se526PB4s5Mnd8LngrFt6aI14YuVMWqNKpVk7KFOUn2VzE+kea/bSZVRo+xtsfFy2e1U1/E/F9GVsVt3cDgZf8AsTP2uJFp6RIAAAAAAAAAAAAAIYYly2kHIyxGGlNLx0r1Ivol4l6fJEd67hS6hg/Jj3Hwp6K5K7e5c77EvVlPW508xETbxC7c0MhrCYeMLeOXiqPnJ8PJbuxepXUPVcPBGOkfbeo2W0gAAAD51IKSaaunvT4iY21msWjUuVyho/wlRuUFKk3v1H4b/pd0uxHOKJUcnTsV/T44XRxhIu85VKnRy1V31bMx+GrSnS8UTt1mEwsKcVTpxUYpWSSskiV0KY4pGofZhtMeFc6Tcvp/9Kk77b1WuW9Q+r7EGW+vDi9T5UailXAYWvKnONSDtKEoyXnFpor1nU7cbFeaXiV75FylDEUYV4bpRu1xT4xfVPYXqzuNvXYMsZaRaGeZTe0gAAAAAAAAAAAAA81Ippp7mrMSxMbiYlTGa+TFLKMKD3U6s32pN6vxSKtI/W8zxcW+TNfpc8UWnp3oAAAAAIsAsGNFgIuByWfmc7wsFSo29rNOz36kfetz5Ed76c/ncr8cdsKknNtuTbbbbbbu23vbZUtO5eatabTMy8mGHS5k5yvCVdSbvRqSSkvcb2a6+pJivMTp0eBypxXis+pXJCSdmuJceljz6ewyAAAAAAAAAAAABDDEquzMqKWVq0v39u04or0/fLg8Od8qy0UWHfSAAAAAAAAA8sfB8qUz7rueOrX/AAuMV0ShH639Snkt5eV595tnloSJSQZYBHttEruzJxDqYKhOW/2erfnqNwv/AEl6k7h6zhTM4YmW+NloAAAAAAAAAAAEMxsa7L+UVh8PUrP8MHbrJ7Ir1sLTqEHJyxixzKosyMb7LG0Zyf3pODb5zVv7rFXHOrPO8LLrPufldyLb1KQAAAAAAAAHlghUOkjJrp4t1beGslJPhrRSjJfBPuVM0TE7eb6lhmuTuj5coQxO3M9w8mWHunBtqMVdtpJLe29iSMxG5b0rN5isL4zdwHsMNSovfCmk/wBW+T9bl6sah67j07ccRLZGU4AAAAAAAAAAAPMmBVGkTONV5rDUnenTleTT2TmtndK77+RVzX+Hneocr8k9lfhxsW1tWxranya4kPztzK2/VErvzTy5HF4eNS6114akeUl9Hv7l2l+6Hq+JnjLjj7btM3WkgAAEBhDYZfCrj6cXadSEXycor5sx3QjnLSPcvpTrKW2LT8nczuG0Xrb1L2G0+IazODI9PF0nRqLrGXGEuEl/u65i0bhBnwxlpqVJZRwM6FWdGorSg7Pk+TXRqz7lG1e2XlMuKcd5rLFsY9+ketzqFn5hZpKko4vER+0avCLX7Nc3+Zp9i1jx6jcu/wADh9kRe3t3iJnXSAAAAAAAAAAAIYFfaR855U3/AMOhK0nG9WS3pPdBcm1tfS3Mgy5NeIcfqPLmn8uvtWqK3vy4Mzvym4atnm9lyphKqq09qeycG9k48uj5M2peaTta43IthtuFw5Ay9QxUNelNX/FBtKcX1j9dxcreLPS4OVTLG9+W2ubLKQFwMfGYuFKLqVJxjFbW5OyG4hHkyRSNyq/OvPmpWbpYWUoUlsc1snU8vdj8Stky/ThcvqNr+Mc6cZLa7va3vb2t+bINy5c3vPuWXk3KlbDyU6FSULPcn4X0cdzRtGSYS4uRfFPiVvZoZxxxlNt2jUhZTj53tKP5XZ/Et4790PScTkxnr/d0BuuQrrStkz9niorj7Ofk9sW+913RXzVcXquLxF4aHR/kdYjEqUleFFKclwcr+BPum/4TXDXztT6dh78m5+FxpFp6b48JDCQyAAAAAAAAAAHlgUVnXNvGYhy3+1kuy2L4WKeT9zyPMmZzW21RGqgBAfXD15wkp05OMlulFtNd0ZiZj0kx5bUn9Lqcm6QsXSSVXUqrnJasvWOx+hLGfXuHQxdTyU8Wjbax0pbNuF2/vlb11CT83zpajq3+LExmkqvJfZUYQ6tubXyNJzyhv1a0+IhyuUsrV8Q9avVlPknZRXlFbERWvMufk5GW/wC+WCzVXQBIHS6PsW6eNpxW6opQa/hcl/aTYZ1Z0enZJrm1C5UWnp3OaQaClga1191RkvNSRpkj9MqXPrvBLWaKcMlhqlXjOq12gkrfP1NcMeFfpVIjFMu3RK6qQAAAAAAAAAAAA8sCqtJmRXTr/wDKin7OrZSaX3aiVtvml6rqVstfO4ef6nxtX74cUQORpIHuhRlOShCLlKTsoxV230QiJltSk3nUQ7/IGjm6U8bP/wCcOH6p/wCPUs0xfbtYOlxreR2WBzbwlL9nh6afNxUpfzSuyWKxDp04uKsaiGbLJ1FqzpQf8Mf8GdQ3nDT6afKWZmCqrbQjBv8AFT8D87LY/Q1nHWUGThYbx6V/nLmTWwydSk/a0ltbS8cFzklvXVFe+KY9OPyem3x+Y8w5UicyY0A0WB4dTo5wLqY2M0tlKLm3wTacUvi/RkuGNzt0umY5tk2uFFp6VzekGvq4Gr+bViu8ka5Z1VS6hbWGYYmi5/8AStyrT+NjGGfCLpnnBp2CJHShIAAAAAAAAAAAAAMfG4SFWDp1IqUZKzTV0zGolpkpF69sq+yvo1ldywlVW9ypfZ5TW/uiC+Hfpx83SvO6S1mG0dYyTtN0oLnrOXwS2mscdBTpWXfmXdZs5qUcGrx8dRqzqNbbcor8K6E9ccVdbjcOuGPuXQG65suCU6yMbY3AZZQ433hrNd+1dZ35iycnXwUVtd5Uti2+9Dht5ehXyYt+nG5nTpn9VHB1sBWg9WdGpF8nCS+hD2zDk2wXr4mGfkrNrFYiSVOjJR4zmnGK9d/Y2jHaUuHh5Lz+1bWbOQYYOl7OHik9s5tWcpfRckWq1ir0fH49cNdQ3DNpWVa6VMqpyhhIP7v2lS3BtWivm+6K+e3jTh9UzeYpD3onygk6uGk99qkOv4Zr+34jDbxo6Rl/dSVkIsO4kAAAAAAAAAAAAAAAAAgDX5aytTw1KVaq9i3Jb5Se6K6s1tbUbQZuRXFXulUuWs8MViG7VHShwhTk1s/NJWcvl0K1ssz6eez8/Je3idQ09PKFaL1o1qifNTmvkzTvlX/5GWJ3t2OauflSElSxsteD2KpulF/mtvXXeS48vny6XE6jPd23WdSqKS1k7p7muJZd2totG4erBmPCNUxpr4+ixnTMbS2GWkzqzhp4Ok5OzqSTVOF9snzf5VxZre0VhU5XKripP2pbF4iVWcqtR3lOTlJ82/puXZFG1ptLy+TJN7TaX1yVj54etCvT3wle3vLjF+aujaltS2wZZxXi0LxyPlSniKUa1J3Ul3T4xfVMuVtuNvV4c1clYmGejZMkAAAAAAAAAAAAAAABDEiq9KmOcq8MP+GFPXtw1ptr1sviVs8/Dz/Vcs9/ZDiCBxwAmGXTZsZ5VsJanJe1pe43Zx/RL6E1cuvEujxeoXxeLeYWJkzPPB1rWrKEvdqeB+r2PsyxF6u1j52K/wAt1DGU3tVSHaSM7hZ/JSfUvji8rUKa1qlanFdZxQ7o+2ts1I+XJZc0iUoJxwq9pLdrO8YLrzl/u0itmiPTncjqlKxqsbVxlDH1K83VrTcpPi9y6JcF0K9r9zh5st8k7tLFNY8ItgNunzAyzKhiYU2/s60lCS4KT2Qklzu0vJk2K0706PT881yRWfS40Wnpvl6AAAAAAAAAAAAAAAAQBU2lLCuOKjVt4Z0kk+sG7/CSK2ePO3neq45jJtxtiBySwBGJZ0ycBgKteWpQpym+UVu83uXc2ikymxYb5PFYdZgdG2Jmk6tSnT6JOb77l8SWuCXSx9Kv8y2C0XbP/b2/utnpr/Uk/En/AIV/k1uP0cYmF5Up06vT7kn67L9zScMq+TpmWP22cni8JUpSdOtCUJLhJW9Oa6ogmsx7cy+O+OdWh8GNI9ANFgw2Gb1FzxVCEd7rw9FK7fZK/Y2xx+pZ4tJnLXS+0Xnr4SAAAAAAAAAAAAAAAAhhifLT50ZBhjKLpSdpJ60JcYys16bdxpendCvyePXNTU+1OZXyNWw0nCvTa5SW2D6qW76lW2OYebzcXJit6a+5rFdq/baZdRmvmbWxMlOqpU6O9yatKfSCe3uSUxTM+XQ43T7XndvS1smZMpUIKnRgoRXJb3zb4vqWa1iHoMWGmKuohmo2SpAhoMaa7LGR6OJg6daCkuD/ABRfOL3pmtqxKLNx6Za6mFQZ0Zu1MHPVl4qcvuVOfSXKXzKt8epeb5XCtit/ZpCPSn7SY9zpiI3Oli6Nc3pJ/wDNqxteNqUWttnvn33LuWsePUbd3pvEmk99liIndqXoAAAAAAAAAAAAAAAAAAeKlKMtkoprqkzGoazWJ9wx6eTaEXeNGmnzUIp/IdsfTT8OP+mGUkZSREQkMgAAAAxsdgqdaDp1YRnFqzTV0YmGl8dbxqYcZjNGlGTvSrTpr3WlNLyvZkc4olzb9JpadxOmbkrR/haTU561Zp38dtX+VbH3uZjHEJMPTMeOd+3WwikrJEjoxGvEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLDyx2wWBpIZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q=='

				pdf.addImage(WU_LOGO, 'JPEG', 80, 80, 50, 50)
				pdf.setFontSize(24)
				pdf.text('NET-PROMOTER-SCORE', 55, 130)
				pdf.setFontSize(20)
				pdf.text('Reporte General de Valoraciones', 53, 150)
				pdf.setFontSize(12)
				pdf.text('Powered by DiwaIT', 80, 280)
				pdf.addImage(DWT_LOGO, 'JPEG', 118, 275, 6, 6)
				pdf.addPage('a4', 'landscape')
				pdf.setFontSize(20)
				pdf.text('Número de Valoraciones e Indicadores', 90, 20)

				async function getCanvas(ID) {
					return await html2canvas(document.getElementById(ID), {scale: 1})
				}

				const generalesFaces = await getCanvas('generalesFaces')
				pdf.addImage(generalesFaces.toDataURL('image/png'), 'PNG', 10, 35, 280, 50)

				const satisfactionInd = await getCanvas('satisfactionInd')
				pdf.addImage(satisfactionInd.toDataURL('image/png'), 'PNG', 10, 85, 275, 50)

				const indicators = await getCanvas('indicators')
				pdf.addImage(indicators.toDataURL('image/png'), 'PNG', 10, 125, 275, 50)
				pdf.addPage('a4', 'landscape')
				pdf.text('Gráficos de Valoraciones por Tiempo', 90, 20)
				
				const hour = await getCanvas('hour')
				pdf.addImage(hour.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')
				
				const weekChartPDF = await getCanvas('weekChart')
				pdf.addImage(weekChartPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const dayChartPDF = await getCanvas('dayChart')
				pdf.addImage(dayChartPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const monthChartPDF = await getCanvas('monthChart')
				pdf.addImage(monthChartPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const services = await getCanvas('services')
				pdf.addImage(services.toDataURL('image/png'), 'PNG', 10, 15, 275, 100)
				
				const reasons = await getCanvas('reasons')
				pdf.addImage(reasons.toDataURL('image/png'), 'PNG', 10, 105, 275, 100)
				pdf.addPage('a4', 'landscape')
				
				const zones = await getCanvas('zones')
				pdf.addImage(zones.toDataURL('image/png'), 'PNG', 10, 15, 275, 120)
				pdf.addPage('a4', 'landscape')
				
				const strongPoints = await getCanvas('strongPoints')
				pdf.addImage(strongPoints.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const weakPoints = await getCanvas('weakPoints')
				pdf.addImage(weakPoints.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const topLocals = await getCanvas('topLocals')
				pdf.addImage(topLocals.toDataURL('image/png'), 'PNG', 10, 15, 275, 150)
				pdf.addPage('a4', 'landscape')

				const badLocals = await getCanvas('badLocals')
				pdf.addImage(badLocals.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.save(FILENAME)
				weekChart.style.display = dayChart.style.display = monthChart.style.display = "none"
				this.loading2 = false
				this.loader2 = null
			},
			async printGeneralReportCustom() {
				this.loader2 = 'loading2'
				const weekChartCustom = document.getElementById('weekChartCustom')
				const dayChartCustom = document.getElementById('dayChartCustom')
				const monthChartCustom = document.getElementById('monthChartCustom')
				
				weekChartCustom.style.display = dayChartCustom.style.display = monthChartCustom.style.display = "block"

				const FILENAME  = 'reporte_personalizado.pdf'
				let pdf = new jsPDF()

				const WU_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nOzdZ5gk2Vkn+n+kL5Plvfe+2nePk0PSlRBIK4GE0BV+BfvgBIhdLuwud7XsrHZBXF1Ae9HCwgq38ICklQQaNCADkkZtqqrLe+99VWZVehtxP/SMZrqzuiOqTmZWReT/9zz5YWKy09eJN97znvcARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER6IplMJhQVFZ3pH7tcLossyw4ANgCmpL4yIiIiOkkMQCg7OzuUnZ196n8ciUTg8XhgaWhowOLiouZ/uLm56RgeHu75q7/6qzd/8YtffC4YDHYBqAHgOPWrICIiotM6ALDS1tY28ta3vvXr733ve+/cvHlzzWw2a/rHL7zwAt71rncBTU1NUBRF9Xb79u3cd7/73T9aU1PzEgA/AIU33njjjTfeeDv32+aNGzf+6KMf/eiNg4MDk9r5/Etf+hIAqAcA4XDY9Bu/8Rtvs9vtowDiF+CN8sYbb7zxxhtviTf/U089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'
				const DWT_LOGO = 'data:image/jpeg;base64,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'

				pdf.addImage(WU_LOGO, 'JPEG', 80, 80, 50, 50)
				pdf.setFontSize(24)
				pdf.text('NET-PROMOTER-SCORE', 55, 130)
				pdf.setFontSize(20)
				pdf.text('Reporte Personalizado de Valoraciones', 44, 150)
				pdf.setFontSize(12)
				pdf.text('Powered by DiwaIT', 80, 280)
				pdf.addImage(DWT_LOGO, 'JPEG', 118, 275, 6, 6)
				pdf.addPage('a4', 'landscape')
				pdf.setFontSize(20)
				pdf.text('Número de Valoraciones e Indicadores', 90, 20)

				async function getCanvas(ID) {
					return await html2canvas(document.getElementById(ID), {scale: 1})
				}

				const customFaces = await getCanvas('customFaces')
				pdf.addImage(customFaces.toDataURL('image/png'), 'PNG', 10, 35, 280, 50)

				const satisfactionIndCustom = await getCanvas('satisfactionIndCustom')
				pdf.addImage(satisfactionIndCustom.toDataURL('image/png'), 'PNG', 10, 85, 275, 50)

				const indicatorsCustom = await getCanvas('indicatorsCustom')
				pdf.addImage(indicatorsCustom.toDataURL('image/png'), 'PNG', 10, 125, 275, 50)
				pdf.addPage('a4', 'landscape')
				pdf.text('Gráficos de Valoraciones por Tiempo', 90, 20)

				const hourCustomPDF = await getCanvas('hourCustom')
				pdf.addImage(hourCustomPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const weekChartCustomPDF = await getCanvas('weekChartCustom')
				pdf.addImage(weekChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const dayChartCustomPDF = await getCanvas('dayChartCustom')
				pdf.addImage(dayChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const monthChartCustomPDF = await getCanvas('monthChartCustom')
				pdf.addImage(monthChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const servicesCustom = await getCanvas('servicesCustom')
				pdf.addImage(servicesCustom.toDataURL('image/png'), 'PNG', 10, 15, 275, 100)
				
				const reasonsCustom = await getCanvas('reasonsCustom')
				pdf.addImage(reasonsCustom.toDataURL('image/png'), 'PNG', 10, 105, 275, 100)
				pdf.addPage('a4', 'landscape')
				
				const zonesCustom = await getCanvas('zonesCustom')
				pdf.addImage(zonesCustom.toDataURL('image/png'), 'PNG', 10, 15, 275, 120)
				pdf.addPage('a4', 'landscape')

				const strongPointsCustom = await getCanvas('strongPointsCustom')
				pdf.addImage(strongPointsCustom.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.addPage('a4', 'landscape')

				const weakPointsCustom = await getCanvas('weakPointsCustom')
				pdf.addImage(weakPointsCustom.toDataURL('image/png'), 'PNG', 10, 35, 275, 150)
				pdf.save(FILENAME)
				weekChartCustom.style.display = dayChartCustom.style.display = monthChartCustom.style.display = "none"
				this.loading2 = false
				this.loader2 = null
			},
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

				if (this.interior) query = query.where('region','==', 'MKITRJYc46G8XLR0Kjsv')

				if (this.AMBA) query = query.where('region','==', '0l5DtjJ6UQ1J4DxX0fdY')

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
				this.AMBA = null
				this.interior = null
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
				this.strongPoints = reasonChartStrong.sort(sortByProperty('satisfaction'))

				this.topLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x)

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

				this.weakPointsCustom = reasonChart.sort(sortByProperty('satisfaction')).map(x => x).reverse()
				this.strongPointsCustom = reasonChartStrong.sort(sortByProperty('satisfaction'))

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

				this.indicatorsGlobal.satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
				
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

				local.indicatorsGlobal.satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
				if (this.getPercentage(partials, total) == 0) local.indicatorsGlobal.satisfaction = 100
				
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

	@media (max-width: 1242px)
		.indicatorsTwoTitle
			font-size: 16px
</style>