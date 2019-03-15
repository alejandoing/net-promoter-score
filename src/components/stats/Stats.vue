<template lang="pug">
	v-container.mainContainer(fluid)
		v-layout(row wrap)
			v-flex.hide-on-screen.noPrint(xs12)
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
					:disabled="loading || (!timeSince && !dateSince && !local && !zone && !AMBA && !interior)"
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
			v-flex(xs9 offset-xs1 v-if="statsFaces")
				Face#generalesFaces.pb-5(:data="statsFaces")
			v-flex(xs3 offset-xs10)
				v-tooltip(top)
					v-btn(
						fab
						color="primary"
						slot="activator"
						@click="printGeneralReport"
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
						@click="downloadXLSX"
						:loading="loading3"
						:disabled="loading3"
					)
						v-icon(dark) storage
					span Descargar Crudo de Datos (XLSX)
			v-flex#satisfactionInd.pt-3.pb-5(xs12)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text.primary(height="75px")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.display-4.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction || 'calculando...' }}
					v-card-title
						span.display-1.headline % que representa el grado general de satisfacción del cliente.
						// v-progress-linear(:value="indicatorsGlobal.satisfaction" height="20" color="info")
			v-layout.pb-5(row wrap)#indicators
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text(height="75px" style="background: #26A69A")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] || 'calculando...' }} - {{ indicatorsGlobal.complain[0] || 'calculando...' }}
						v-card-title
							span.display-1.headline % del total de encuestados que dejaron una queja.
							// v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text(height="75px" style="background: #00897B")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] || 'calculando...' }} - {{ indicatorsGlobal.comment[0] || 'calculando...' }}
						v-card-title
							span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
							// v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text(height="75px" style="background: #00796B")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Resp. Servicio: {{ indicatorsGlobal.service[1] || 'calculando...' }} - {{ indicatorsGlobal.service[0] || 'calculando...' }}
						v-card-title
							span.display-1.headline % del total de  encuestados que indicó cuál servicio utilizó.
							// v-progress-linear(:value="indicatorsGlobal.service[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text(height="75px" style="background: #00695C")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Resp. Motivo: {{ indicatorsGlobal.reason[1] || 'calculando...' }} - {{ indicatorsGlobal.reason[0] || 'calculando...' }}
						v-card-title
							span.display-1.headline % del total de encuestados que indico motivo de satisfacción o insatisfacción.
							// v-progress-linear(:value="indicatorsGlobal.reason[1]" height="20" color="info")
				v-flex(xs6 md4)
					v-card.my-1.mr-1(flat tile)
						v-card-media.white--text(height="75px" style="background: #004D40")
							v-container(fill-height fluid)
								v-layout(fill-height)
									v-flex(xs12 align-end flexbox)
										span.indicatorsTwoTitle Quejas sin Leer: {{ indicatorsGlobal.complainUnread[1] || 'calculando...' }} - {{ indicatorsGlobal.complainUnread[0] || 'calculando...' }}
						v-card-title
							span.display-1.headline % del total de quejas que no han sido leídas.
							// v-progress-linear(:value="indicatorsGlobal.complainUnread[1]" height="20" color="info")
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
			v-layout(row wrap)
				v-flex(xs12)#services
					div.pb-5
						span.display-1 Satisfacción por Tipo de Cliente
						v-divider
					v-flex(xs9 offset-xs2)
						Service.pb-5(:data="statsServices")
				v-flex(xs12)#reasons
					div.pb-5
						span.display-1 Aspectos Evaluados
						v-divider
					v-flex(xs9 offset-xs2)
						Reason.pb-5(:data="statsReasons")
				v-flex(xs12)#zones
					div.pb-5
						span.display-1 Resumen por Jefe Zonal
						v-divider
					v-flex(xs9 offset-xs2)
						Zone.pb-5(:data="statsZones")
			v-flex#weakPoints(xs12)
				Chart.pb-5(type="barStacked" title="Puntos Débiles y Fuertes" :data="weakPoints")
			v-flex(xs12)
				div.pb-5
					span.display-1 Locales
					v-divider
			v-flex#topLocals(xs12 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Mejores Locales" :data="topLocals")
			v-flex#badLocals(xs12 v-if="assessments")
				Chart.pb-5(type="barStacked" title="Distribución General - Peores Locales" :data="badLocals")
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
					v-btn(icon dark @click="finalize")
						v-icon close
					v-toolbar-title Resultados Personalizados
					v-spacer
					v-toolbar-items
						v-btn(dark flat @click="finalize") Regresar
				v-card-text
					v-flex(xs9 offset-xs2)
						Face#customFaces.pb-5(:data="results.statsFaces")
					v-flex(xs3 offset-xs10)
						v-tooltip(top)
							v-btn(
								fab
								color="primary"
								slot="activator"
								@click="printGeneralReportCustom"
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
								@click="downloadXLSXCustom"
								:loading="loading3"
								:disabled="loading3"
							)
								v-icon(dark) storage
							span Descargar Crudo de Datos (XLSX)
					v-flex#satisfactionIndCustom.pt-3.pb-5(xs12)
						v-card.my-1.mr-1(flat tile)
							v-card-media.white--text.primary(height="75px")
								span.headline.ml-4.pt-3 Satisfacción de Cliente: {{ results.indicatorsCustom.satisfaction || 'calculando...' }}
							v-card-title
								span.display-1.headline % que representa el grado general de satisfacción del cliente.
								// v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")
					v-layout#indicatorsCustom(row wrap)
						v-flex(xs6 md4)
							v-card.my-1.mr-1(flat tile)
								v-card-media.white--text.primary(height="75px")
									span.indicatorsTwoTitle.ml-4.pt-3 Quejas: {{ results.indicatorsCustom.complain[1] || 'calculando...' }} - {{ results.indicatorsCustom.complain[0] || 'calculando...' }}
								v-card-title
									span.display-1.headline % del total de encuestados que dejaron una queja.
									// v-progress-linear(:value="indicatorsCustom.complain[1]" height="20" color="info")
						v-flex(xs6 md4)
							v-card.my-1.mr-1(flat tile)
								v-card-media.white--text.primary(height="75px")
									span.indicatorsTwoTitle.ml-4.pt-3 Com. Positivos: {{ results.indicatorsCustom.comment[1] || 'calculando...' }} - {{ results.indicatorsCustom.comment[0] || 'calculando...' }}
								v-card-title
									span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
									// v-progress-linear(:value="indicatorsCustom.comment[1]" height="20" color="info")
						v-flex(xs6 md4)
							v-card.my-1.mr-1(flat tile)
								v-card-media.white--text.primary(height="75px")
									span.indicatorsTwoTitle.ml-4.pt-3 Resp. Servicio: {{ results.indicatorsCustom.service[1] || 'calculando...' }} - {{ results.indicatorsCustom.service[0] || 'calculando...' }}
								v-card-title
									span.display-1.headline % del total de  encuestados que indicó cuál servicio utilizó.
									// v-progress-linear(:value="indicatorsCustom.service[1]" height="20" color="info")
						v-flex(xs6 md4)
							v-card.my-1.mr-1(flat tile)
								v-card-media.white--text.primary(height="75px")
									span.indicatorsTwoTitle.ml-4.pt-3 Resp. Motivo: {{ results.indicatorsCustom.reason[1] || 'calculando...' }} - {{ results.indicatorsCustom.reason[0] || 'calculando...' }}
								v-card-title
									span.display-1.headline % del total de encuestados que indico motivo de satisfacción o insatisfacción.
									// v-progress-linear(:value="indicatorsCustom.reason[1]" height="20" color="info")
						v-flex(xs6 md4)
							v-card.my-1.mr-1(flat tile)
								v-card-media.white--text.primary(height="75px")
									span.indicatorsTwoTitle.ml-4.pt-3 Quejas sin Leer: {{ results.indicatorsCustom.complainUnread[1] || 'calculando...' }} - {{ results.indicatorsCustom.complainUnread[0] || 'calculando...' }}
								v-card-title
									span.display-1.headline % del total de quejas que no han sido leídas.
									// v-progress-linear(:value="indicatorsCustom.complainUnread[1]" height="20" color="info")
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
								span.display-1 Satisfacción por Tipo de Cliente
								v-divider
						v-flex(xs9 offset-xs2 v-if="results")
							Service.pb-5(:data="results.statsServices")
					#reasonsCustom
						v-flex(xs12)
							div.pb-5
								span.display-1 Aspectos Evaluados
								v-divider
						v-flex(xs9 offset-xs2)
							Reason.pb-5(:data="results.statsReasons")
					#zonesCustom
						v-flex(xs12)
							div.pb-5
								span.display-1 Resumen por Jefe Zonal
								v-divider
						v-flex(xs9 offset-xs2)
							Zone.pb-5(:data="results.statsZones")
					v-flex#weakPointsCustom(xs12)
						Chart.pb-5(type="barStacked" title="Puntos Fuertes y Débiles" :data="results.weakPoints")
					// v-flex#weakPointsCustom(xs12)
						// Chart.pb-5(type="barStacked" title="Puntos Débiles" :data="weakPointsCustom")
		
		Chart#weekChart(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobal")
		Chart#dayChart(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobal")
		Chart#monthChart(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobal")
		Chart#weekChartCustom(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWCustom")
		Chart#dayChartCustom(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayCustom")
		Chart#monthChartCustom(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthCustom")
		
		Face#serviceFaces2.pb-5(style="display: none" :data="assessments.stats")
		v-flex#satisfactionIndService.pt-3.pb-5(xs12 style="display: none")
			v-card.my-1.mr-1(flat tile)
				v-card-media.white--text.primary(height="75px")
					v-container(fill-height fluid)
						v-layout(fill-height)
							v-flex(xs12 align-end flexbox)
								span.display-4.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction }}%
				v-card-title
					span.display-1.headline % que representa el grado general de satisfacción del cliente.
					// v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")

		v-layout.pb-5(row wrap style="display: none")#indicatorsService
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #26A69A")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron una queja.
						// v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #00897B")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
						// v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")

		Chart#chartHourService(style="display: none" type="columnStacked" title="Distribución General Horaria" :data="chartHourGlobalService")
		Chart#weekChartService(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobalService")
		Chart#dayChartService(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobalService")
		Chart#monthChartService(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobalService")

		Face#reasonFaces.pb-5(style="display: none" :data="assessments.stats")
		v-flex#satisfactionIndReasons.pt-3.pb-5(xs12 style="display: none")
			v-card.my-1.mr-1(flat tile)
				v-card-media.white--text.primary(height="75px")
					v-container(fill-height fluid)
						v-layout(fill-height)
							v-flex(xs12 align-end flexbox)
								span.display-4.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction }}%
				v-card-title
					span.display-1.headline % que representa el grado general de satisfacción del cliente.
					// v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")

		v-layout.pb-5(row wrap style="display: none")#indicatorsReasons
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #26A69A")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron un comentario una queja.
						// v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #00897B")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
						// v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")

		Chart#chartHourReasons(style="display: none" type="columnStacked" title="Distribución General Horaria" :data="chartHourGlobalReason")
		Chart#weekChartReasons(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobalReason")
		Chart#dayChartReasons(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobalReason")
		Chart#monthChartReasons(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobalReason")

		Face#zoneFaces.pb-5(style="display: none" :data="assessments.stats")
		v-flex#satisfactionIndZones.pt-3.pb-5(xs12 style="display: none")
			v-card.my-1.mr-1(flat tile)
				v-card-media.white--text.primary(height="75px")
					v-container(fill-height fluid)
						v-layout(fill-height)
							v-flex(xs12 align-end flexbox)
								span.display-4.headline Satisfacción de Cliente: {{ indicatorsGlobal.satisfaction }}%
				v-card-title
					span.display-1.headline % que representa el grado general de satisfacción del cliente.
					// v-progress-linear(:value="indicatorsCustom.satisfaction" height="20" color="info")

		v-layout.pb-5(row wrap style="display: none")#indicatorsZones
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #26A69A")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Quejas: {{ indicatorsGlobal.complain[1] }}% - {{ indicatorsGlobal.complain[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron una queja.
						// v-progress-linear(:value="indicatorsGlobal.complain[1]" height="20" color="info")
			v-flex(xs6)
				v-card.my-1.mr-1(flat tile)
					v-card-media.white--text(height="75px" style="background: #00897B")
						v-container(fill-height fluid)
							v-layout(fill-height)
								v-flex(xs12 align-end flexbox)
									span.indicatorsTwoTitle Com. Positivos: {{ indicatorsGlobal.comment[1] }}% - {{ indicatorsGlobal.comment[0] }} total
					v-card-title
						span.display-1.headline % del total de encuestados que dejaron un comentario positivo.
						// v-progress-linear(:value="indicatorsGlobal.comment[1]" height="20" color="info")

		Chart#chartHourZones(style="display: none" type="columnStacked" title="Distribución General Horaria" :data="chartHourGlobalZone")
		Chart#weekChartZones(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Semana)" :data="chartDayWGlobalZone")
		Chart#dayChartZones(style="display: none" type="columnStacked" title="Distribución General Diaria (Visión Mes)" :data="chartDayGlobalZone")
		Chart#monthChartZones(style="display: none" type="columnStacked" title="Distribución General Mensual" :data="chartMonthGlobalZone")
		#canvas
</template>

<script lang="javascript" src="xlsx.full.min.js"></script>
<script>
	import jsPDF from 'jspdf'
	import rasterizeHTML from 'rasterizehtml'
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
				totalAssessmentsCustom: null,
				totalAssessments: JSON.parse(localStorage.getItem('totalAssessments')),
				statsFaces: JSON.parse(localStorage.getItem('statsFaces')),
				statsReasons: null,
				statsZones: null,
				statsServices: null,
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
				chartHourGlobalService: null,
				chartDayWGlobalService: null,
				chartDayGlobalService: null,
				chartMonthGlobalService: null,
				chartHourGlobalReason: null,
				chartDayWGlobalReason: null,
				chartDayGlobalReason: null,
				chartMonthGlobalReason: null,
				chartHourGlobalZone: null,
				chartDayWGlobalZone: null,
				chartDayGlobalZone: null,
				chartMonthGlobalZone: null,
				//topLocals: JSON.parse(localStorage.getItem('topLocals')),
				topLocals: [],
				badLocals: [],
				zone: null,
				zoneID: null,
				zonesSelect: [],
				local: null,
				localID: null,
				locals: [],
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
				results: { indicatorsCustom: { satisfaction: null, complain: [], comment: [], service: [], reason: [], complainUnread: [] } },
        time: null,
				loading: false,
				loader: null,
				dateFormatted2: null,
				currentLocal: { title: null },
				assessmentsStorage: JSON.parse(localStorage.getItem('assessmentsX')),
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
			}
		},
		
		async mounted() {
			const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))

			this.getIndicatorsGlobal()

			this.$axios.post('zones/responsables').then(res => {
				const zonesData = res.data
				for (let zone of zonesData) this.zonesSelect.push(zone.responsable)
			})

			this.$axios.post('locals/title').then(res => {
				const localsData = res.data
				for (let local of localsData) this.localsSelect.push(local.title)
			})
			
			this.$axios.post('assessments/stats/service',
			{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(async res => {
				
				const { pagoServicio, pagoServicioVeryGood, pagoServicioGood, pagoServicioBad,
				pagoServicioVeryBad, casaDeCambio, casaDeCambioVeryGood, casaDeCambioGood, 
				casaDeCambioBad, casaDeCambioVeryBad, envioInternacional, envioInternacionalVeryGood, 
				envioInternacionalGood, envioInternacionalBad, envioInternacionalVeryBad, envioNacional, 
				envioNacionalVeryGood, envioNacionalGood, envioNacionalBad, envioNacionalVeryBad, total } = res.data[0]

				this.statsServices = [
					[
						pagoServicio, this.getPercentage(pagoServicio, total), {
							veryGood: { face: 'veryGood', value: pagoServicioVeryGood, percentage: this.getPercentage(pagoServicioVeryGood, pagoServicio) },
							good: { face: 'good', value: pagoServicioGood, percentage: this.getPercentage(pagoServicioGood, pagoServicio) },
							bad: { face: 'bad', value: pagoServicioBad, percentage: this.getPercentage(pagoServicioBad, pagoServicio) },
							veryBad: { face: 'veryBad', value: pagoServicioVeryBad, percentage: this.getPercentage(pagoServicioVeryBad, pagoServicio) },
							assessments: 0,
							satisfaction: this.getIndicatorsReason(pagoServicio, pagoServicioGood, pagoServicioBad, pagoServicioVeryBad)
						}
					],
					[
						envioInternacional, this.getPercentage(envioInternacional, total), {
						veryGood: { face: 'veryGood', value: envioInternacionalVeryGood, percentage: this.getPercentage(envioInternacionalVeryGood, envioInternacional) },
						good: { face: 'good', value: envioInternacionalGood, percentage: this.getPercentage(envioInternacionalGood, envioInternacional) },
						bad: { face: 'bad', value: envioInternacionalBad, percentage: this.getPercentage(envioInternacionalBad, envioInternacional) },
						veryBad: { face: 'veryBad', value: envioInternacionalVeryBad, percentage: this.getPercentage(envioInternacionalVeryBad, envioInternacional) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(envioInternacional, envioInternacionalGood, envioInternacionalBad, envioInternacionalVeryBad)
					}],
					[
						envioNacional, this.getPercentage(envioNacional, total), {
						veryGood: { face: 'veryGood', value: envioNacionalVeryGood, percentage: this.getPercentage(envioNacionalVeryGood, envioNacional) },
						good: { face: 'good', value: envioNacionalGood, percentage: this.getPercentage(envioNacionalGood, envioNacional) },
						bad: { face: 'bad', value: envioNacionalBad, percentage: this.getPercentage(envioNacionalBad, envioNacional) },
						veryBad: { face: 'veryBad', value: envioNacionalVeryBad, percentage: this.getPercentage(envioNacionalVeryBad, envioNacional) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(envioNacional, envioNacionalGood, envioNacionalBad, envioNacionalVeryBad)
					}],
					[
						casaDeCambio, this.getPercentage(casaDeCambio, total), {
						veryGood: { face: 'veryGood', value: casaDeCambioVeryGood, percentage: this.getPercentage(casaDeCambioVeryGood, casaDeCambio) },
						good: { face: 'good', value: casaDeCambioGood, percentage: this.getPercentage(casaDeCambioGood, casaDeCambio) },
						bad: { face: 'bad', value: casaDeCambioBad, percentage: this.getPercentage(casaDeCambioBad, casaDeCambio) },
						veryBad: { face: 'veryBad', value: casaDeCambioVeryBad, percentage: this.getPercentage(casaDeCambioVeryBad, casaDeCambio) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(casaDeCambio, casaDeCambioGood, casaDeCambioBad, casaDeCambioVeryBad)
					}]
				]
			})

			this.$axios.post('assessments/stats/reason',
			{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(async res => {
				
				const { atencionDelCajero, atencionDelCajeroVeryGood, atencionDelCajeroGood, atencionDelCajeroBad,
				atencionDelCajeroVeryBad, estadoDelLocal, estadoDelLocalVeryGood, estadoDelLocalGood, 
				estadoDelLocalBad, estadoDelLocalVeryBad, servicioUtilizado, servicioUtilizadoVeryGood, 
				servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad, tiempoDeEspera, 
				tiempoDeEsperaVeryGood, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad, totalR } = res.data[0]

				this.statsReasons = [
					[
						atencionDelCajero, this.getPercentage(atencionDelCajero, totalR), {
							veryGood: { face: 'veryGood', value: atencionDelCajeroVeryGood, percentage: this.getPercentage(atencionDelCajeroVeryGood, atencionDelCajero) },
							good: { face: 'good', value: atencionDelCajeroGood, percentage: this.getPercentage(atencionDelCajeroGood, atencionDelCajero) },
							bad: { face: 'bad', value: atencionDelCajeroBad, percentage: this.getPercentage(atencionDelCajeroBad, atencionDelCajero) },
							veryBad: { face: 'veryBad', value: atencionDelCajeroVeryBad, percentage: this.getPercentage(atencionDelCajeroVeryBad, atencionDelCajero) },
							assessments: 0,
							satisfaction: this.getIndicatorsReason(atencionDelCajero, atencionDelCajeroGood, atencionDelCajeroBad, atencionDelCajeroVeryBad)
						}
					],
					[
						tiempoDeEspera, this.getPercentage(tiempoDeEspera, totalR), {
						veryGood: { face: 'veryGood', value: tiempoDeEsperaVeryGood, percentage: this.getPercentage(tiempoDeEsperaVeryGood, tiempoDeEspera) },
						good: { face: 'good', value: tiempoDeEsperaGood, percentage: this.getPercentage(tiempoDeEsperaGood, tiempoDeEspera) },
						bad: { face: 'bad', value: tiempoDeEsperaBad, percentage: this.getPercentage(tiempoDeEsperaBad, tiempoDeEspera) },
						veryBad: { face: 'veryBad', value: tiempoDeEsperaVeryBad, percentage: this.getPercentage(tiempoDeEsperaVeryBad, tiempoDeEspera) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(tiempoDeEspera, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad)
					}],
					[
						estadoDelLocal, this.getPercentage(estadoDelLocal, totalR), {
						veryGood: { face: 'veryGood', value: estadoDelLocalVeryGood, percentage: this.getPercentage(estadoDelLocalVeryGood, estadoDelLocal) },
						good: { face: 'good', value: estadoDelLocalGood, percentage: this.getPercentage(estadoDelLocalGood, estadoDelLocal) },
						bad: { face: 'bad', value: estadoDelLocalBad, percentage: this.getPercentage(estadoDelLocalBad, estadoDelLocal) },
						veryBad: { face: 'veryBad', value: estadoDelLocalVeryBad, percentage: this.getPercentage(estadoDelLocalVeryBad, estadoDelLocal) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(estadoDelLocal, estadoDelLocalGood, estadoDelLocalBad, estadoDelLocalVeryBad)
					}],
					[
						servicioUtilizado, this.getPercentage(servicioUtilizado, totalR), {
						veryGood: { face: 'veryGood', value: servicioUtilizadoVeryGood, percentage: this.getPercentage(servicioUtilizadoVeryGood, servicioUtilizado) },
						good: { face: 'good', value: servicioUtilizadoGood, percentage: this.getPercentage(servicioUtilizadoGood, servicioUtilizado) },
						bad: { face: 'bad', value: servicioUtilizadoBad, percentage: this.getPercentage(servicioUtilizadoBad, servicioUtilizado) },
						veryBad: { face: 'veryBad', value: servicioUtilizadoVeryBad, percentage: this.getPercentage(servicioUtilizadoVeryBad, servicioUtilizado) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(servicioUtilizado, servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad)
					}]
				]

				let reasonChart = [{
					title: 'Atención del Cajero',
					bad: this.getPercentage(atencionDelCajeroBad, atencionDelCajero),
					veryBad: this.getPercentage(atencionDelCajeroVeryBad, atencionDelCajero),
					good: this.getPercentage(atencionDelCajeroGood, atencionDelCajero),
					veryGood: this.getPercentage(atencionDelCajeroVeryGood, atencionDelCajero),
					total: atencionDelCajero,
					satisfaction: this.getIndicatorsReason(atencionDelCajero, atencionDelCajeroGood, atencionDelCajeroBad, atencionDelCajeroVeryBad)
				}, {
					title: 'Tiempo de Espera',
					bad: this.getPercentage(tiempoDeEsperaBad, tiempoDeEspera),
					veryBad: this.getPercentage(tiempoDeEsperaVeryBad, tiempoDeEspera),
					good: this.getPercentage(tiempoDeEsperaGood, tiempoDeEspera),
					veryGood: this.getPercentage(tiempoDeEsperaVeryGood, tiempoDeEspera),
					total: tiempoDeEspera,
					satisfaction: this.getIndicatorsReason(tiempoDeEspera, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad)
				}, {
					title: 'Estado del Local',
					bad: this.getPercentage(estadoDelLocalBad, estadoDelLocal),
					veryBad: this.getPercentage(estadoDelLocalVeryBad, estadoDelLocal),
					good: this.getPercentage(estadoDelLocalGood, estadoDelLocal),
					veryGood: this.getPercentage(estadoDelLocalVeryGood, estadoDelLocal),
					total: estadoDelLocal,
					satisfaction: this.getIndicatorsReason(estadoDelLocal, estadoDelLocalGood, estadoDelLocalBad, estadoDelLocalVeryBad)
				}, {
					title: 'Servicio Utilizado',
					bad: this.getPercentage(servicioUtilizadoBad, servicioUtilizado),
					veryBad: this.getPercentage(servicioUtilizadoVeryBad, servicioUtilizado),
					good: this.getPercentage(servicioUtilizadoGood, servicioUtilizado),
					veryGood: this.getPercentage(servicioUtilizadoVeryGood, servicioUtilizado),
					total: servicioUtilizado,
					satisfaction: this.getIndicatorsReason(servicioUtilizado, servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad)
				}]

				this.weakPoints = reasonChart.sort(sortByProperty('satisfaction')).map(x => x).reverse()
			})

			const objectZone = this.$axios.post('assessments/stats/zone',
			{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(async res => {
				
				const { eduardoCesio, eduardoCesioVeryGood, eduardoCesioGood, eduardoCesioBad,
				eduardoCesioVeryBad, walterMancho, walterManchoVeryGood, walterManchoGood, 
				walterManchoBad, walterManchoVeryBad, lucianaBernadotti, lucianaBernadottiVeryGood, 
				lucianaBernadottiGood, lucianaBernadottiBad, lucianaBernadottiVeryBad, cristinaMarigomez, 
				cristinaMarigomezVeryGood, cristinaMarigomezGood, cristinaMarigomezBad, cristinaMarigomezVeryBad,
				dardoRicci, dardoRicciVeryGood, dardoRicciGood, dardoRicciBad, dardoRicciVeryBad, diegoLongo, diegoLongoVeryGood,
				diegoLongoGood, diegoLongoBad, diegoLongoVeryBad, florenciaCasa, florenciaCasaVeryGood, florenciaCasaGood,
				florenciaCasaBad, florenciaCasaVeryBad, totalZ } = res.data[0]

				this.statsZones = [
					[
						walterMancho, this.getPercentage(walterMancho, totalZ), {
						veryGood: { face: 'veryGood', value: walterManchoVeryGood, percentage: this.getPercentage(walterManchoVeryGood, walterMancho) },
						good: { face: 'good', value: walterManchoGood, percentage: this.getPercentage(walterManchoGood, walterMancho) },
						bad: { face: 'bad', value: walterManchoBad, percentage: this.getPercentage(walterManchoBad, walterMancho) },
						veryBad: { face: 'veryBad', value: walterManchoVeryBad, percentage: this.getPercentage(walterManchoVeryBad, walterMancho) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(walterMancho, walterManchoGood, walterManchoBad, walterManchoVeryBad)
					}],
					[
						lucianaBernadotti, this.getPercentage(lucianaBernadotti, totalZ), {
						veryGood: { face: 'veryGood', value: lucianaBernadottiVeryGood, percentage: this.getPercentage(lucianaBernadottiVeryGood, lucianaBernadotti) },
						good: { face: 'good', value: lucianaBernadottiGood, percentage: this.getPercentage(lucianaBernadottiGood, lucianaBernadotti) },
						bad: { face: 'bad', value: lucianaBernadottiBad, percentage: this.getPercentage(lucianaBernadottiBad, lucianaBernadotti) },
						veryBad: { face: 'veryBad', value: lucianaBernadottiVeryBad, percentage: this.getPercentage(lucianaBernadottiVeryBad, lucianaBernadotti) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(lucianaBernadotti, lucianaBernadottiGood, lucianaBernadottiBad, lucianaBernadottiVeryBad)
					}],
					[
						cristinaMarigomez, this.getPercentage(cristinaMarigomez, totalZ), {
						veryGood: { face: 'veryGood', value: cristinaMarigomezVeryGood, percentage: this.getPercentage(cristinaMarigomezVeryGood, cristinaMarigomez) },
						good: { face: 'good', value: cristinaMarigomezGood, percentage: this.getPercentage(cristinaMarigomezGood, cristinaMarigomez) },
						bad: { face: 'bad', value: cristinaMarigomezBad, percentage: this.getPercentage(cristinaMarigomezBad, cristinaMarigomez) },
						veryBad: { face: 'veryBad', value: cristinaMarigomezVeryBad, percentage: this.getPercentage(cristinaMarigomezVeryBad, cristinaMarigomez) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(cristinaMarigomez, cristinaMarigomezGood, cristinaMarigomezBad, cristinaMarigomezVeryBad)
					}],
					[
						dardoRicci, this.getPercentage(dardoRicci, totalZ), {
						veryGood: { face: 'veryGood', value: dardoRicciVeryGood, percentage: this.getPercentage(dardoRicciVeryGood, dardoRicci) },
						good: { face: 'good', value: dardoRicciGood, percentage: this.getPercentage(dardoRicciGood, dardoRicci) },
						bad: { face: 'bad', value: dardoRicciBad, percentage: this.getPercentage(dardoRicciBad, dardoRicci) },
						veryBad: { face: 'veryBad', value: dardoRicciVeryBad, percentage: this.getPercentage(dardoRicciVeryBad, dardoRicci) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(dardoRicci, dardoRicciGood, dardoRicciBad, dardoRicciVeryBad)
					}],
					[
						diegoLongo, this.getPercentage(diegoLongo, totalZ), {
						veryGood: { face: 'veryGood', value: diegoLongoVeryGood, percentage: this.getPercentage(diegoLongoVeryGood, diegoLongo) },
						good: { face: 'good', value: diegoLongoGood, percentage: this.getPercentage(diegoLongoGood, diegoLongo) },
						bad: { face: 'bad', value: diegoLongoBad, percentage: this.getPercentage(diegoLongoBad, diegoLongo) },
						veryBad: { face: 'veryBad', value: diegoLongoVeryBad, percentage: this.getPercentage(diegoLongoVeryBad, diegoLongo) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(diegoLongo, diegoLongoGood, diegoLongoBad, diegoLongoVeryBad)
					}],
					[
						florenciaCasa, this.getPercentage(florenciaCasa, totalZ), {
						veryGood: { face: 'veryGood', value: florenciaCasaVeryGood, percentage: this.getPercentage(florenciaCasaVeryGood, florenciaCasa) },
						good: { face: 'good', value: florenciaCasaGood, percentage: this.getPercentage(florenciaCasaGood, florenciaCasa) },
						bad: { face: 'bad', value: florenciaCasaBad, percentage: this.getPercentage(florenciaCasaBad, florenciaCasa) },
						veryBad: { face: 'veryBad', value: florenciaCasaVeryBad, percentage: this.getPercentage(florenciaCasaVeryBad, florenciaCasa) },
						assessments: 0,
						satisfaction: this.getIndicatorsReason(florenciaCasa, florenciaCasaGood, florenciaCasaBad, florenciaCasaVeryBad)
					}],
					[
						eduardoCesio, this.getPercentage(eduardoCesio, totalZ), {
							veryGood: { face: 'veryGood', value: eduardoCesioVeryGood, percentage: this.getPercentage(eduardoCesioVeryGood, eduardoCesio) },
							good: { face: 'good', value: eduardoCesioGood, percentage: this.getPercentage(eduardoCesioGood, eduardoCesio) },
							bad: { face: 'bad', value: eduardoCesioBad, percentage: this.getPercentage(eduardoCesioBad, eduardoCesio) },
							veryBad: { face: 'veryBad', value: eduardoCesioVeryBad, percentage: this.getPercentage(eduardoCesioVeryBad, eduardoCesio) },
							assessments: 0,
							satisfaction: this.getIndicatorsReason(eduardoCesio, eduardoCesioGood, eduardoCesioBad, eduardoCesioVeryBad)
						}
					]
				]
			})

			this.$axios.post('locals/stats/faces',
			{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(async res => {
				
				const statsLocals = res.data
				let activeLocals = []

				for (let local of statsLocals) activeLocals.push(this.getChartLocal(local))

				this.topLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).slice(0,5)
				this.badLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).reverse().slice(0,5)
			})
			
			this.getChartGlobalDatesHour()
			this.getChartGlobalDatesDayW()
			this.getChartGlobalDatesDay()
			this.getChartGlobalDatesMonth()
		},

		methods: {
			async finalize() {
				this.dialogResults = false
				this.results = { indicatorsCustom: { complain: [], comment: [], complainUnread: [], reason: [], service: [] } }
			},
			async downloadXLSX() {
				this.loader2 = 'loading3'
				const wb = XLSX.utils.book_new();

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

				const assessmentsXLS = (await this.$axios.post('/assessments/xls', 
				{ condition: ` AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data

				for (let i in assessmentsXLS) {
					ws_data.push(new Array(10).fill(null))
					ws_data[ws_data.length - 1][0] = assessmentsXLS[i].id
					ws_data[ws_data.length - 1][1] = assessmentsXLS[i].local
					ws_data[ws_data.length - 1][2] = assessmentsXLS[i].zone
					ws_data[ws_data.length - 1][3] = assessmentsXLS[i].date
					ws_data[ws_data.length - 1][4] = assessmentsXLS[i].time
					ws_data[ws_data.length - 1][5] = assessmentsXLS[i].face
					ws_data[ws_data.length - 1][6] = assessmentsXLS[i].justification
					ws_data[ws_data.length - 1][7] = assessmentsXLS[i].justificationtwo
					ws_data[ws_data.length - 1][8] = assessmentsXLS[i].description
					ws_data[ws_data.length - 1][9] = assessmentsXLS[i].email
					ws_data[ws_data.length - 1][10] = assessmentsXLS[i].telephone
				}

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
				};
				
				wb.SheetNames.push("NPS Crudo de Datos");

				const ws_data = [
					['ID' , 'Local', 'Jefe Zonal', 'Fecha', 'Hora', 'Valoración', 'Servicio', 'Motivo', 'Comentario', 'Email', 'Teléfono'],
				]


				const assessmentsXLS = (await this.$axios.post('/assessments/xls', { condition: this.results.filter })).data

				for (let i in assessmentsXLS) {
					ws_data.push(new Array(10).fill(null))
					ws_data[ws_data.length - 1][0] = assessmentsXLS[i].id
					ws_data[ws_data.length - 1][1] = assessmentsXLS[i].local
					ws_data[ws_data.length - 1][2] = assessmentsXLS[i].zone
					ws_data[ws_data.length - 1][3] = assessmentsXLS[i].date
					ws_data[ws_data.length - 1][4] = assessmentsXLS[i].time
					ws_data[ws_data.length - 1][5] = assessmentsXLS[i].face
					ws_data[ws_data.length - 1][6] = assessmentsXLS[i].justification
					ws_data[ws_data.length - 1][7] = assessmentsXLS[i].justificationtwo
					ws_data[ws_data.length - 1][8] = assessmentsXLS[i].description
					ws_data[ws_data.length - 1][9] = assessmentsXLS[i].email
					ws_data[ws_data.length - 1][10] = assessmentsXLS[i].telephone
				}

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
			},
			async printGeneralReport() {
				//window.print()
				this.loader2 = 'loading2'

				const weekChart = document.getElementById('weekChart')

				const dayChart = document.getElementById('dayChart')
				const monthChart = document.getElementById('monthChart')
				
				weekChart.style.display = dayChart.style.display = monthChart.style.display = "block"

				const FILENAME  = 'reporte_general.pdf'
				let pdf = new jsPDF()

				const WU_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAgAElEQVR4nOzdZ5gk2Vkn+n+kL5Plvfe+2nePk0PSlRBIK4GE0BV+BfvgBIhdLuwud7XsrHZBXF1Ae9HCwgq38ICklQQaNCADkkZtqqrLe+99VWZVehtxP/SMZrqzuiOqTmZWReT/9zz5YWKy09eJN97znvcARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER6IplMJhQVFZ3pH7tcLossyw4ANgCmpL4yIiIiOkkMQCg7OzuUnZ196n8ciUTg8XhgaWhowOLiouZ/uLm56RgeHu75q7/6qzd/8YtffC4YDHYBqAHgOPWrICIiotM6ALDS1tY28ta3vvXr733ve+/cvHlzzWw2a/rHL7zwAt71rncBTU1NUBRF9Xb79u3cd7/73T9aU1PzEgA/AIU33njjjTfeeDv32+aNGzf+6KMf/eiNg4MDk9r5/Etf+hIAqAcA4XDY9Bu/8Rtvs9vtowDiF+CN8sYbb7zxxhtviTf/U089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'
				const DWT_LOGO = 'data:image/jpeg;base64,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'
				const YELLOW_TOP = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa4AAABGCAYAAACUlXDBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEmSURBVHhe7dVBDQAgEMCwA/8S8QIfTCxpP5Owdc/cAYCI/QsACcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAKcYFQIpxAZBiXACkGBcAITMPuuMDZpstp84AAAAASUVORK5CYII='

				const VERY_GOOD = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAX1klEQVR42u2deZRcVZ3HP2+r6u6XFRIICSYBAkHDGlBW2TK4gDOjnEHFDbVU3HfFUcejxzV6jnpmjnocqXHcxmUUEQdk0QAiICoEZQ0QkjRkI5Kt87qWt9z541Z3ern31XtV71VVh/6eU6e66213+b3f/e3X4tkFB5gDFIEAiLrdoG7D6HYDMoIJLAaObXyWNz7zgBnAzManOOG6KjA05rMdWAc80visAzZ3u3N5YqoSwAzghcAFwPnACqAvp2cNAX8F1gC3AHcBtW4PQFaYSgRwGvAy5KS/ALC71I4KcCeSIH4FPNjtgTmQsRj4OJIdix793AO8F5jf7cE6UFAA3gD8DimkdXuCk3584FrgFUiZZBopMQB8AHiKbCcmAvYBW4FHkW/sWuAxYBvgZfw8gRQe34TUOnoavSADzAbeDbwfKbW3girwMPsl95HvJ5CT30zds4BZwDKk9nDshO9WJ3IQ+ApwVaON0xgDB/gYsIf0b1gNuB34DHAek9W7LOECLwFWA39G2g/Stncb8BZ644XrCZwPPES6QawAPwYuRi4X3cJs4FLg18h1P00f7gRO7GLbu44FwI9IN2h/AN6KHPhewyFIuWVtiv4EwFeRhqmuo5Ms6Y3A10k2kT7wQyTbXZdlI9ySO5P9lsLlwCLk+j9zwjfAXqQhaOz35kab1gHrvLI31Dj3VKTK+vKE47oZKSjenO0wp0MnCMAFvolU7ZqhCpSRgtOmth9ccovAGUjj0VnAc4HDMu7fVqQAegewZvinw7vFPvFh4NVI4TIOEfAl4FNAmHG7EiFvAjgO+Bly4OMQIonkC0iBqWW4JfdE4CL2T3p/zn2ciApwR7gtvK+2prZCVMRLE1zzB+AypArcUeRJACXgP2g+AXcC70Ta21uCW3IXAa9BcpnjcuxTaoRPhhtqv6+5oioOaXLqM8DlwHWdbF9eBPBFpIoXhx3AR4HvIYWjVHBLrg28CilbXEAvW98i8B/wRf3eekQYuyxEwHuQ3LAjyJoALODbyLc/Dr9snLMr7QPcktsHvBlJPEs6MEaZQewTVG+pEj3dNAzhM8CnO9GmLAmgD/gJ8M8x5/jIift62pu7JXcG8A7gg0h1cmoigvpf6vj3+83O/BbSQppr0EpWBDALaRg5J+acTUiWfXeaG7sl10Byiy8BB+c5GJ1EOBhS+30NUYtd/f4XeC3yxckFzdSUJCgiBZdzY865BVgFPJ7mxm7JPQm5XLyT7lr/Moc528Q+0ibcEiKqWiJYARzVGINc0C4BmEi2f1HMOb8ALkE6ZRLBLbmzCisLX0Y6URbn1fluwygY2EfZRNsjhKclguORHPbGPNrQLgF8g3gDz7eRUnqQ9IZuyT0DGW3zInpZss8IhtUggp0RYo+WCM6gYV/I+vntEMCngI/EHP8s8CESqnhuyTUKKwsfRvoK5mbd0Z6GCfaRNsITRM9oZb4LgY20YS9RoVUh8NVIz5wOnwc+mfRmbsk9GGkPuDjLzk1F1G6rETyuZZgB0v2dGSdohQCOAf6C3pv1HeBtSW/mltzjkULkc7Lq1JRGBNWbq4RPaV0DTwEnIS2HbSPtEtAH3IReMPsl0pyZlO2fhfSGHZpFZw4IGGAvtQm3hjrBcBZSO/hxuhurkZYAvole4r8N6QpNpLO6JfdlSNtBT/jFewpmgwgGtSriMchYxjvbfVSaJeC1SB+9CpuBk5H2/aZwS+4bkG7fbsX2TwlEeyKqv6oifAURGIQIzgb+2M4zkhLAPGQAxEGKYyEyxOv2JDdyS+7lwHdTPPtZjWB9QO1WdSKSUTS2iJpYShuWwqR69mrUkw9SHUw6+RcjjTvTk58Q9lE29nI1oxQ1sdA6zPpOO/dPIgOcifTrqybtRuDtSR7kltwzkWt+nhG8ByTsRQ15oDJ5KRBVcVLx7OL94abw4Vbu3YwDWEjBTzX5e5BWvqYSv1tyn4ec/APKnt8xWFA8r6ierQCCJ4KfNMY4NZoRwLvQhzH/GwnCtxpGnt+gX0KmkQDmXBPneer8lPCp0Ak2BLc2xjrdfWOODaC35q0lQdRKw5X7fQ5gh04n4ax0MAbU4pO/1p+P4PuNMU+MOAK4AnXGq0C6Z5NEsV5JvKdwGilgOAaF0wvKY9GuiHAwvAg55omhEwKLyGhelZHmuyR7+1+ItO8f8B69TsKca0r38dBk0SsainCWO+cVVhZu9df6g4nup/m9hDp+PkB6+WLhltyDkKbK9g09AqLdUbPAie4harx9W8Nm0T2ZwVmplgWiHRHhltAGftyYg6ZQTZCDno38D9Il2QyrkRk36RGA/5hPtCMi2hkR7Y7GLTbGDANrnoU5z8Q63MI8uLMMRviC4NGA6O9j2jfGg2vOMjHnyY+12MKcnX37rEMtrAUW4bbJq7B/n4+10FqEnIO3NruXSmB4FTLKZyIipBPikbgbuiX3dKSNOrWxx3/Ix7/PV+q7OthH2DinOLkM9MTe+/f7+Pf7yd90QxpyCqcUMGZka/sKN4dUb1BnnPe/vB/zYFMAZ3plL9ZUrJIBViOdDRPxC2SkqhZuybWQVTJSpV+JuqC2pkbwYJAidkgi2h0RPBpgzjYx5+ZDBKIiqN1UI3gsSJ3AFe2MCB4LMA82MWdl1z5zlkn4ZIgYnkyMhm1gHW4ZwKmFlYWr/LW+lmIntugQ4MWac1cnaNe7kL7qVKheXyUcbCM1LoDamhr+gzkEz4ZQubZCuL319om6oHpTlWB9SupuAucEtSwQrA9GlqWTkHOixUQCeDVqueABZBCIFg0jRFMBcSLCLWFcGFQq+Gv91BykGYKNAWJfBsKdgPo99RZyoPSwl9gYxclLi6gIws2jBPvZOAPRRAJ4vea87yVoz/vYn1adGOGWmDfLkKzOWmLhPNfBOtSK9V6ImiB4MlsKaNq+OSb2ETb2sTbmfDO+fUOC8OkMk4BNKWOoEDw2Og6zkHOj68IojkWmOU8aA2S41lbdTRo595toIZgz2hVRuboy6XdrgUXh7MJk4S6SnavfXZ/sJzdh4LIBjL7sBC6dsGUttiieWcSYaHiLwH/Ql2/7hLk2igYDlw1kk40x8rgdEZVrJ48fFgy8ZgCjYIBMwVsyppbB2CEbhS6N+SZiJr+Bd9JiJK8518Q5wcFwjNH/i+cU6bu4Ty3Zm2Avt+m/pB9r8ZiRNMBZ4WQ6+QDWIku6YxsvmjnfpLiqSN+FfZMnv9E+53iH/lf0Yy20xv9+gpPp5I+0x5yjGKcQoq2jS+tc5BxNwtgeXAv8o+Kc1yFDtZVoJGtupM24PuELxF6RWq8XQ4JgMMBebGPMzC/MQNQFwhOpNY0RI5a91Nba8duFf1+D40yA8zyHwhmjpuPtwFKv7I1jZyO9sdCndv22yfPfRAZBnYZjtGTUMWYa8s3PcfJBZvG0omaac6QXL6/JB8mlVAi3jluDDkXO1fj2Nb5PQS3APYiknDi8ObeeTSMRzHnm6BI6FtGuaKJRbdJcjRDABZp73xL34EYQwqndHoBnPQwwD1Nzpwlc4NSJgSMjV+nY/5omj768232fhoR1WKJlACbM2QgBHK+4ViBj/ZVomH1f1+2OT0NCRwBi1yTL0+sacwdIApiB2nP3FLAz5pn/ACzsdsenIWHONZXut2jPJCvrQuTcyeuQxRJViPX6MZ3I2VswwZw5WQ4QVaHyXl485jKO1dyyWYXO87vd52mMhzFHrWpGuydxgdG5iyMALQdwS+58ZGzANHoIupgIReGJFY05xETt+4d4DnAu09k9PQcdASjkAIOG5meij9ePq9U7zf57ELqoI00E0/kgCUCXnr035llnd7uz05iMhudvMtRxMmfDfjVQhSHVj27JjdMcptFNaDa2EeqIsOVuyTV1HCAChjWPWcJ0gmdPwrBTcYAisERHAHE1/abf/l5FOg4AsFxHAEPoMU0APQqVRxCIKx+x3EQdRhmX0TNNAL0K3YuuD2NYbqJ+2+MKN01n+vYotKxev+vhYh0BDKCnm9SRv9PoEDSsXrs0wCwdAYBePZwu69ajaIEDzDTRS/y6iZ7mAD0KHQFo1cMmHEAX5p0rBxDDIvPsnmcNaprfYziAjT7mfxkyJWzSRXm0XewT1O+uEwwGGLaBfYxN4QWFqe1yCiHYEMjk0ENNnOWOOpcgI0RD6hQ7c0CrBswy0bt9dW7ijFMbJPz7fYKNMqlR1AX+A357CaM9gNpdNWq31Qi3hPhrfSq/rOS6PaTC7w/o4wQA00Tv9tXp+3FGohZbPi6XbRT+I7ltlZM7hC8mZQOLmpBEntczNRtOxNROGGqFA8R5CVuDCSJU1LzZleuGWbki2hYpZZno7/n1SckBjFgC2GsC61FrkJ3jAIDRr05znqrQ7QGUV4aQqAvleBmuEbdoD42YgtcrDs5FCoITkT0H0A1MRG8WhkqAaFizHudEADrOokwc3Y+9I0fv1ZygyhjqGAcAEHunJgHoikrkRQC6OgZN8i2HRo7qMoBUoV9b8uiAOUPd0GBwahoFxlToGAcdobf9vK3q541LUZ+MLa0QQLNw8ZZgHa5Jbdo49VTBaEekLt7Ub+RSzUz4Qr0EWLKkXAzWjbRmA+og0EOBiVWo8yGAhZbSCR3tiaacNhBsUnMta7GVi2Er2hYpdxi25lvNrDbrxpKjjgu8bOJF2XcBSa2aPHd/7dSxB4i6IFinJgB7ST475IRPtsT+ISEBTNwZdD052bN0AxRsCIh2TA0u4K/1lZqL4RhJJiQ9IgieUBOcuTB2uQmB9WPPuB6oK05cgSwgAYBX9nzgiex7Iqt+6qTk+p/qKe/WeUR7IvyH1NzKXmbnYkQPBgNl3L/Rb2AdEvvAJ7yy548lgJ3IDRxVmFgH4K7suwLYUDhFXQ493BZS/0vvEoHwBbXf1ZRrseEYOCc76W+aACoTOjQILl7euAsmR/38QHPyZYx3KsZWDmkH9tG2thaP/1c/blvV7kHISqU6YdU53slF/RNVod1h1F7WVN64BSYTwHXImnITMQ+5BfwIbs28NyMwkG5gDWp/qBFu6iHVMILa7TXtRBgDBs7xOb39jwZKjmMebGIe1FTdvBUmE0Ad+Knmgn8d+cMrextJVja+JViHy8qgSoRQ/W2V+r3dXw7EsKB6fVXLhjGgeFYxn+0xQ/AfiJE34rGxMYfKwM//1lx0IuNVwtyWAYDC6YVYqdlf61O9uarcOaMTCAdDKtfEF5EunFYYX8wyQ/jrNGX1LX352DEYnTsVAdyNnsV/YszfN+bSszEtK15QjC2xHg6GDP98mPpd9Y55DsMtIZVfVyTxxTzTea6DsyIf1k8E/t80b//RdhJ5Y3TudGeuQl8gchWwxi25/cht43INEo32RFR/U9W6V0dhyaXDfo6N9RwrU6dLtCMifCokGAwS+fOtJRZ9q/pyC2cLHg2o3a4IADRg4NKBZkUz9wILvLJXaVyixV3A6Yrf/wScAURuyf0O8JZ8urkfoiJVrDQ1+81ZJsaAgeEakhjSrMNV6c4VFVm+No1L2jnRkapsXqF/AQz/YljpbbSX2RTPbZq3e5VX9ka3kokbls+itgu8ALkXzbeRZeRzJwCj36Dvoj5qd9Sk5JsA0d4op8gFTRsdg8I5Beyl+W6IXr+vrnU1OycmWnLGlf5vRqf3ACsVv+9ERgz93S25jwNH5drrMQgeDajfU1d627oF6zCLwpmFZsEXbSPaHcnAUsUqZC+1Ka5q+vav98reuCCfZi3+oOb3g4AvN/5OsplEZrCPsRl45QCF5xeUu2V0EuZ8k76X9tF3UV/ukw9Qv6uunHwscJ6f/u2HZCvVD1BXBBXAuW7JfQjpSnZzH4GJDagLggcDgo0B0c4OOYss6WVzjnVyU/FUCB4PqN2mzvxwTnYorCw0u4WH3DTimbE/JiGAQ5Eu4NmKY08CJ7sl9xPABzo2GgoITxA+GRI8KT2HmamFhgysHNUwNHELeSLaG1G9pqpM/TJnmfRf0p/E0fQ1r+xN4uhJeeh7gH/XHLvOvdy9Apv19FLpmEZAqRiW0bIxVTImjYhRNDD6G5+MdyBJjRAqv65oN9bqe3GfNppqDGrAkV7ZmxTOl7R3FvBn4GTN8SvdknsU8LbujtaBh/qddfyHNUafI2yKFyR65/7TK3tXqA4klVxCpBygKxz1+erN1d8yndaZKYINgXbyjQGDwplN132Qc6Ld8zGN6PoQ8A7NMTscDL8Rbgs7qhEcyAi3h1qhDwOK5xeTLk9f98qeNoAnrRj7V2SJGNVS4AaPB/OcY5xho2BMF5FoA9GuiNoNNW3Fj8KphSQeP5Al/y/11/pa12kryuu7UaeNg2Bx5eqKL+q9Y6SZahD7BNUbqtoNqq1FVlKLH8AHvLIXV/KvJQKoAJcCe5QdqIvF1euqu6elgfQQlcbka6ychmtQPC+xonWjV/Z+3uykVs1XjwD/BCj3L492RnMq11eixNusT0O++f9XVVX2BqRq2veSvqTrvofk1E3RjilrE1Iw/BcUhCSGhREOhnKD48JULvORP6JdEdXrq/pNqm3of0l/mn0V3+KVvVuTnNiuLfMRZEyAasdRRFUQbAiwDre6b1DpUYTbQ2q/qeldzib0repLk1NQ9sre55KenIUx+x6kX0C9h4AP4ROhDFSclb/DZCoheDygtqYWaz0pvrCIfURi2/P9wCX+Wj+xBJaVN+M2pNKySnk0RJZLEXJX8Cld+CkLhFC7o4Z/rx9b3rV4ThH76MSTvw+40Ct729I0JUt31u3AZuSOVMpXPdoWEW2P5JLgPDupINodUb2hqk0fB8CWbD/Fmx8Al3hl749p25O1P/Ne4G/Ay9H4zMSQIHg8wJxj5pIq3csI1kmWHxffaBQN6eBJvuYL4I1e2bu6lTbl9RqeC/wKtQt5FNYSi+LpRe1eNwcKop0RtTtqRE/HxywYrpz8lLuUf8gre19ttW15jvyRwM8Yk1iqhAWFkwoye6Zz8RUdgfAF/j2+TBhtFtR8uEXx3MT2/RF8xSt7H22njXkO+S5kkskc4DT9KMnyJuETIUbB0G6BOqUQgP+wT21NTVu7ZxSmtO0XzyrG1fRV4avAR9utndCpoX4F8F9IYohv0AwD5wQH55ipxxGELwgeCvAf8BOFkhszDPrO78M8JLUs9DGv7K1Oe5GyDR0cn6XIUPIXJWrYgIGzwkma6dJViCGB/6hP8FBAUkeYvcymcHrqwNYQuMIre+Ws2t6Nkb0U+BrqHcuVLbQOt7CPtrEX51NkoRUIXxBuCAkeCwi3pUhYmWNSOKsg7SHpUAUu88reNVn2o1uv1gzg08D7SBFiaRQMrCMsrEUW1mGdNy+LYUG4JZRpYpuCdPFPNhROLuAc57TiglsHvNIre3/Luk/d5q3HAZ9DehZTt8U8yMQ6zMJaaGEeZGarTgpZfj16JiLcEhJtjbSeuvhGgn2kTeGUQqvt+xHw9mZ+/VbRbQIYwXHAx4FX0g6Tt2VhZHO2iTHbkPmBjgEO479FY3cNX34LX0Bdhl+LPUKWptsbtVcKy5KZuoUTW574CvBer+xdlefA9woBjGAZcCWyJlFOudU5w26khh/ntJOh/HvkW/9w3s3tNQIYwTzgMqPP+KCoiqXdbkwSWAukoGod0ZafYzvwEa/s/aDVG6RFrxLAKKwF1mlGv/HNcHu4spcSQkFm5djLbKmqtid/RMC3gE96ZW93J/vQ8wQwAvdy9/hwW/jlaGf0onBraIbbwo5nIRhFA3OBibWwIXi2nxAaImsyfcErew92tjeNPnXjoe2gkYF0JRGXhzvCQrQ1ItopJfRoT5uC29iBcQwpSM6RFbdGNI2MRqyOzNRd7ZW99e3erK1+dvPh7cAtuYuA9yMzlhaM/C72CaLdkhhEbb+kP/YbgEJjP72xGkKjmrc5x8yrrv824IfIZI3N3R5DmMIEMAK35FrAhcDrkXEIA91u0wQMA9cg0+xv9speDxU5PAAIYCzckjsTWdDyImSM4vwuNWUHshTb9cDVXtnLZZeVLHBAEcBYuCXXQBqYViG3vjkLWdkkD+wE7kBWXP8d8IBXblbWrDdwwBKACm7JPQRZ22jsZxGy1N3Mxnf/hMsqyHJTQ43vzUjb/OjHK3tPd7tvreJZRQBJ4JZcm/3b4w55Ze+ATnL7f9xgntDPcjvDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTExVDIxOjI5OjU2KzAyOjAwSrF87QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMVQyMToyOTo1NiswMjowMDvsxFEAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'
				const GOOD = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAU3ElEQVR42u2de7xVVbXHv3PtPRWDg0iiiBKIBfgi8IEFioIIUQqKj8zn/VS3a2bdSrleKW+3q9VVK2+3bl3Nj6mgVyMwFMVHgoGZio8CKl7yiIcKpHhADPY5e9w/xtlwztlz7r32Y621z2H/Pp/5OeusvdZ8jbHGHHPOMcZMse/BAF1b/jYnXZmkYZKuQBWRAo4EBrWkwcBRQA+gG9DQknLEB8gA21vSjpa/bwLL26W/Jd24qNCRGeBgYDRwJnAq8BFgv4jK+hvwB2A+MA9YBDQl3QHVQEdiAAuMBc4CxgBDEqz/dmAhygxzUClRR0Q4BfgJsAWQGk0vAV9GpVIdVUBf4EZgBckTt5S0G3gEuABIJ92JHREDgJ+jHVlt4uwCtgJrgaWo2N4INKKzgWqXtxr4AtHpJVVBregAg4CpwCWU/+VsB5bRVntfAaxHNfzdRfrhA+iM4cPsnUnk0gAgKLNeG4BbgbuA92Pqzw6DI4D7Ke8L3AHMBaYAJ1I+gcLgIOBc4EfAEiBbRn3fBL4UcT1LRlISIA18FfgWOkcPi7eAB4EZqOKVKat0sQehX/YRQHf2rhHkrtOoRGlk7zpBI7AZWEG3zG7e4yzgUmAcugYRFq8CVwMvRt7LIZAEA4wCfgocG/L594HZwDTgKUqZf4u1wHB0nSAnzgdSuba+Ex1eVvAX2cjXmrvzGxlOM8eHrRmq69wAvF2FPu0Q6A7cQ3iRuQn4OvpFhoNYg9ihiL0WsY8jdjtiJabUxO/SSzjF/BkTeojYguo9nR4nAqtCdspf0bGyS+jcxQ5B7PcRuylGgvvTX9LCpUETQWhG+DlwQNJEigpfRqdgYb74fyTstElsH8Reh9g/Jk5wX3o9LVwZCCYUEyxG9y86DXoAs0I0PAP8EB0iikPssYidjtimxAkcNj2fFoaaMEywHbgsacJVA0cSbhVvAYRUnMSehNhZiM0mTtByUpMVfpwSeoSSBrdRO2s0JWMIKs4LNfA94LMhCT8EsU8mTsBqpbesMDEIwwTT0A2wDoXTgW1FGvZnwkwBxXZD7A8Qm0mcaFGk76cEW5QJnqC0dZJEMRn4e5EGTUcNMooR/wLEbkicSHHoBn2L6gaLgF5JE7cYzkUXaAopeleFIHxvdP6ePHHiSlutMK4oEyxBleqqoxqKxmnoCp1v3v4ecCG6bl+I+GNRCXFoFA2taTQBn22GadlCTy1El53/Xs2iK92YOB7d//YRfwtqtuUnvtgUYm8CnmRfJD7ozsO9KbiuIDlOAx6gyptJpWxitEd/1EbONz6tQYm/xJuD2MOAR4HL6cDTnqrAAOMCaDDwtPieOhr9SB6rVrHlMsCB6By+v+f3NcBIYJ03B7GDgN+i08Y6chhh4FADj3mZ4CR0ZfW5ahRXLgNMR0WSCzmxX4j4w4FngMOq0YhOh5MMpAzM9zLBaPTjWRc+UzfKGU+uQW3eXNgBfBJY6X1b7HjUmrZuQFkINwZwjZc8KVQfOKTSYkqVACcCD+E228oAkygkmsR+GjXmCL/Tty9jQqCGbUudkqAB+CjKCFJKtq1RCgMcCDyNX+m7GiWuG2I/2fJ7h1veTAwGmBioUrjR+cRR6CRyQSVFhMUvgH/w/PYg8Bnvm2JHoMzzgSj7q9NircCwJl1kbw9DFmE48Eo5WYdlgNNQpcP1/Ep0aNjufFPscSiHHhRvr3Uy/DoL53l8WXuzhjf5MGqsWhLCDAFpdK7uWqTZBYxHrXjyIbYf8CxVUFb2eQw28A7womO438FBnBccyjIpeX0gzCzgn4HjPL9djzpN5kPsfuiY3yeRDuuMuC0FH/UI7fnZf+K+1CmlZllsCDgcdbZwbUm+glrcusWO2NtR0+86qonnBU5tcuv9FwZv88tUH0xmV9jsikmA7+Imfhb4In7iT6JO/GgwwsCVHrL9KtuTOTK9lOwKSYCcWZdrzn8Hvu1dsR9Ch4W60hcVNgODMu5ZwbkBPJy6CJOZESarQhLgetzE34I6NORDrEGXievEjxKHADd79PfZWfij3I3YULqXjwH64J/z34zqoy5cgX+PoI5q4qoAPuIQ4AJ8L9sNuD1MNj4GuA7Y33F/M+rE4CjY9kC9YOuIAylgqod8M7KwXC5C7FnFsnHl0BP1a3fhh/hdnG+iPt+PF5cF0N8hBbLAf2YBfoLY/Qtl4VICrwF+7Lj/DtAP14qf2GGo8WIlBiZtsQ14SeBlga0Cw4xukx5dQ3Yjf2tVx3cFTmip48AY63hHFq5yrBAeALxloYEbMZmbS8lyEW7DxG973xA7r2pGklkr/DQldPMYSI43woZ0soaczVa4LSV08dRxciBsjqkuu6xwhMeo9O6UIHYnYkOb2h3jIX4TPuMNsSOr1pjdVglczGmiB8L8hJjgPSuMDFHHXggvxVTHb6fcdRhtcs/cEpYBbvE06PECX/8TVWvIN0N5zGg6wgjvJMAA15RQx4FG2BlDnVan3Q6oBuGvaUHd5Hu6yBe0u/Y5Jt7jIf7J6GZQ5XhN4HslbGZtELg25kivCwT+p4Q6rhD4Zgx1PNLAqZ4p4XQBXc39iuvV1gwwCvfGzTbU9NuFG6vWiNnZ0iP3zspWYAtTBsopb2ZMFbzcMyV8aA/DfgWxecE2Wr811pP1Q7icEcQOBs6pWgNeLqOjtgGvx8gB5dRxnWhwuqhxUeA2tFssunarq7Ofa/9zawYY48l6puf+FVVtQLnBVuMM0rq8TGYr971ScCAwxjMMzN8jBfJolmOAbsDJjmx3A7/Lz9Qaqh3IYFDM75VVVpnz+3LfKxVjPMPAvD0MOAyxbTyzc2+Mwr3x8yIaEas9zkDDuVYPJ5XRST2Ao2JcdCmnjv1MfAbwoz31m9dGArWRAjkG8In/eZ77l1e98pOC0tcRJwfxOpSVU975MVZwqHHvw64UnTUpLkXsHlGRuxjpyXJ+3h2xXfA7hpSPYQZuKMFP5QgDP6jeynMojDLwpRLqOND4t22jQACc7qnf7/YwwOGoBN/zCrijU2WAFxz3R1BK7L5S8G8pGB/ii+kBTEtF5DFfBLekYGSIOvYCpqfiD/42ylO3ZW3+m5C7CNAdvB6OV15HrX7bY3RklbfA3DT8NOUPjDLewNI0nJHQptAHgAVpNdD0+TdNDuBPFk5OoI7HeMpsOxM5M3dhUAXwt45XZqORP9pC7HP4h4zqYRv13cBysFbgSEc03WEGXt2j52eBXpjM2wYNzninI6tbUbOwvRDbFd0Wrrt31SqyQNdM/tJdV2C7ba3EXoDJzAzwz6RdSyynUid+bSPAbSr2HrCxzTAwJvf4UZ6sfAxQR63Dt/D0epv/TgNlAF+I1k2Oe0cn3bY6QsBnD9zYRgIMRGwQ4J/S7XDc61TBjDstfJ90W2O+/YF+hRig7eNiU+h5OnXUOrp7hoB8a86BAe4ZdxP5emR/3KbiddQafBIgX6YP8kmAuvjvyPAOAXnb0l4J4GKA/km3q46QaPAMAflU7RfgPk/PdWpHuAMd6kgeuz0GKPlU7R7gDu3SEPJeHbWIdz338yVDg48BDiB/d77OAB0FjZ77+RRsCHCP95CvG9SHgI4CHwPka3veIQDy+aUuAToKGj06gEcC+BigvXFRfROoo8B3Fmm+DmAD4A3P4x9p979vqKij1rDSIwHyvTt3BPgt69tvE/tGljpqDS4/BPc2cWMpDOAbKuqoJWxD47i0x4eMy4RteyEGGNj+4aTbVkcIrPCIf7fZz/YANRNoCvFKfEPA+5Vnsc/C54Y22Lk83Big5t+rHT/2BAa0+j96F8dFAuc2Q/cMjG6CuXG6/lYRzwtc3gyXNcPCmNuwyCcBnAywNWcm+hr5Ih/UbizHHNG7YX62ee/hCM8K/KEJNtmOdbD60wLjWgnU+7MwJw2fislSeJ6HAYY5y1+ZcwzxuYC1dhmLlgGek/yTMbahIc86ElwBJO6IqQ1vAX9yMEADPr/G5cUYYK8TiMm8i3/NoHK84+HcVzrYMPCEg9hxtWG+h9FGGbfrL6zIMcAq3DH/e6OBo3KITgoc7hGRm0rLJlG8g9uXKq6z0Xzif4zXn3FF6198UmBCq+tlRIU+HgbY2IEkwBueuvaOoWwBnvSUf6azb9/AZLaHYYDW/uSvRtaAQ3CLqeVSeuygpLDac/+wGBTABQJ/dTDAwcAQZ/mvQtsQMXPRKWF7DAGGtlzPJyr4PFreJv6pVLmY4xmDPxQDA/gOnj7bG9NgHrRlgK34z6S9EgCTWQWsj6wRkzwdNbsDzASyBeo5LmIGeB//bOkK7/j/DOQHi77P8/Al7BXQ0UmByb7o11LlQ9MjwLMCbzru9zEwPGIGmJ11r9P2NT43+i3AYshngDmo03N7HAJMbLn26QqV4ySjkT/aY6PAj2tcCkz1KCqTTPRhbO729M2l3rLnYzIC+QyQAf7PU0zOVTw6BjDApz299d1m/zEVSeOXWfdxbgDnlXM8cwl4WfzHzfvF/29yF64n7vG8NBwYi8msxx06pjq4PuU2PtsGXF2D04G3gOs8X+DJBsZG/Pl/x1O2P5hGBng494+LAV7BHTEEYGrLX5+uUDl6oUzgwoNZuKmGhoL3gUlNsN7zBd6ailb8LxW/4jnF+/XPxWSKbuydhT8K9scQ2xOxuyKLfr3TCod7QrIbhPtSyZ4XkIvTP7lA5PBPmejrcLGn/EFGzzRwvxc6wttLnsY9BYDYhyNt3K9S/s4FYWpQqJHRpk1WGFHgzIADEP4U8VkBS9JC4Cn/Xu8H8g7tjpAppKF8p4B0uBCYFpaTysL5AdxYoHrfzcLEptYBEOPB0wInZnTP3wUD3JPyR+uqFq5udh/bOcDAJd5+m1HKqaIGWIKbyzcwMfggYtdHyuVZK5xf5ICGLgjXBsLWiL/636eFMSFOCrkphuHp3gLS8c6C5Z/gInIhnIP/rIDbEbsG+O+IeFyxExjT5J9m5dAVGB/A2QYmBJVvwAg6xZorMDcLL4SQNFcEcG/EkUG3oaeGugw/BxtYnPZ5cDyByUxofzOMnHoE97kAzQwwI3g9/Qjuo+Wrh/eBzzfDAyFnAAZdujrMaLycg0MuxuxCd/Q2AZtEI2uFLW9qAP+RCnceeyW4ptl/askzaXfIeMVpmMxz5RTZH/0OXSJnMVvt1NiUr1tSfsUnqdQNYWZMs5KnCih+nwkKvbugUr77hrcDuvALxG6NjQmeSus0J2nCg/BxIyyN6WSwTVY4xFOP7ujv/vcrPtdpP9QayF2BKcH9sU7DmqwqO30SYoQhRngkxrWIZqtHwPnq818F67KwUuLncCrqP+CqRCNL0ytjZQKxumB0e0q/xKiHhv0QzjLCAymdncTZzm8VmAmNMPpBuN/NIPb4QkQtdbI6Fd/6QANrWG+P5MBq8VuJeAs1yHhU4M+iO4g7K8ivO6pEfszAOQbGBck4yD+ShfM8c/4PAq+lddvXje9jMlMKZV8qAxjUcsg9phxnNrMofYg3jHrceBfV5rfg7sD26ILOZ3qb2vBFWCjqY+CyhTDAowX9DdYDx2AyBb26y1mu6oU6khzu/HVikGFWylbxGOl9E4sFTm/Seb8LUwLdbPLjfExmVrFiyl2vPA21DHLX4AsB3FHngLKxRmBkk98LY4SB36Z9tv4AD2EyF4cpqtxli4XAF72/3pmFrzXHe6pnZ8FqgbHNfuIPMDCrIPFXAV8IW1wln+mrqMG2+8SxF0Srck4Zp4Htq/ij6LK3z+y2F/BsupCV8S5gAiazNmyRlZJmAWp5Ptz56xLRI1XOC9yhJ+vYiwUC45vcFpmgEb6eTsNxBUftr2Eys0spthp7lgFqR3iR94mTDTyWVg6uIx+/zsJnmv2WzxbV+AufqDYDk7mIElGNrYssepDkHO8TiwROaGp9dl0doMtqU5thchHiTy96nN5CyjzLuVqjczMwA+jHXi+itmgE7stCF6NabA0d/pUINgic0wwPFPgougKz0zCx4He6BBhXbL7vQzXVsyx61FxX9HBJ9xO/EZUInwj0DL59EY+3jPeFfK0PRsf8UQW/lLXA6DBGnj5EoZ8/jS7CnuV9YiXqy9bHwPH7kCjYCny5Gf6lufAydT+j2v6Qgn2zGSX+ukqqFNUE7Xl0EvgJfPYpO4CZosudpxg12uisEOCuLJzb5LclzOHjBp5MQf+C/bEOGIPJrEy6acVwNH67wrY7bTcEwo6Yd9niSK+khVNCbFubFtvG3UXzXILYPiVTIkEcANxVtANAOBjhOylhWw0QrtL0UlqYFChhi7W7J2HtCxYitkfSBC0Xl6LBJot3yIEI3wiELTVAyFLTs2m1GyjFqmhdKKuimYithT3KitAXmBm6c7oifC7QTo3bCKOU9LYV/jcVTtS3NuP6UaqQMUcu7Ubs15MmXLUxAVUSw3dYP6PeQH+JyQavWNpthdkp9VvYv0TroksC4Y1Q5axD7MeSJlZU6AJ8CzX6Lq0DjzPCVwPh0bTQGCPRV6SFn6WECwIdt0ut99FGmBeagR9BbM+oiVALc6++wBTg85Rjh5NGI3CcYeBYoyFRB5rKzLcEXalbjgapelngGfF7ARfDIAP/GsBlQaFt3Bw2A1Mwmeg8sFuhFhggh0OBa1E7g24V5qWLTANRe7luKEM0tFx3Q73kd6CHKe5A1dNtwCrRAxfCOoUUwlCjDiPnB2F2XZqBnwHfbAnKuc+iJ/DvwAaStvsvJxnUh3BOSbrK84gdmnTH1xoCYCwwjcDrmVQ7aaARbk6FndLl0u8Re3bSHd0R0A24km4swJIhaWLnUl8jXBWo53BpCuU8xJ6ZdKd2VOzH6WYyFwcLGGH+XvIUrJJ0uBEuDYS7UsKqkom+E7H3I3ZE2IbGgVpSAkuH2ICNMoEX5Cts5QxWyn4sb9HeV0v5IWYPRDX3PQn4qHFHMi1SQ9RY417UYqfmjt3p2AzQGmIbgMnoDuQZZOjNWtHQco3oYYqNLdfbURvFBtQDqLtp+Yt6A1Xm7L4T3Q19BjXPXpN01xRC52GA9hB7DHrewWhgJNHF7N4BvIz6ScwHXsRkdleWZXzovAzQHrqLNhgV6INbUl/2rgzkUs5GQtDVgB2t0hY0ZP4ydKBZhslsTLpplWDfYYCwENsFZYKduXCqnRn/D714TQLGTOIPAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEwLTExVDIxOjMwOjQxKzAyOjAwfie29wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMC0xMVQyMTozMDo0MSswMjowMA96DksAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC'
				const BAD = 'data:image/png;base64,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'
				const VERY_BAD = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAZhElEQVR42u2daZQbxbWAv26pJc1IM3aDMYtBNkswOyQkYOwQs+NgdjskBLP48YBg9i0QQgiEACGsCQGCCQkcJ0AgmCVAAmYLiwlb2MJiwMZRMLYfS3skzWjr5f0ojRnPdLVaUmuksec7R2fmSK1WddWtqlu37r0VYs1CA0YCUcAE7GYXqNkozS5AQKhAEtii/Bpffo0CEkBH+RXt9708kOnzWg4sAN4rvxYAS5r9cI1kqApAAtgV2APYHdgaiDXotzLAG8CTwFPAC0Ch2RUQFENJAHYG9kc0+k5AuEnlyAHzEQLxAPB2sytmdSYJnI8Yjp0Wfb0KnAqs0+zKWl2IAEcBTyCUtGY3sN9XCXgQOAShkwxTJe3AGcDHBNswNpAFlgLvI3rsa8AHwDKgO+DfcxDK40zEqqOlaQUdYARwMnA6QmuvhTzwLl9q7r1/FyEav9JyLwR0ApshVg9b9Ptba0OmgCuB35XLOEwfNOA8oIvqe1gBeBa4GNiNgcu7IIkDU4ArgJcR9oNqy7sM+F9ao8O1BLsD71BdJeaAO4GpiOmiWYwAvgP8FTHvV/MM84Htm1j2prMe8Ceqq7TngOMQFd9qjEboLa9V8TwmcA3CMNV0BnNIOga4Dn8NWQL+iBh2FwRZiJSud/ClpXA8MAYx/3f0+wuQRhiC+v5dUi7TAmBB0jAy5Wu/jliyHuyzXpcgFMV5wVZzdQyGAMSBGxFLu0rkgVsRitN/6v3hlK5HgV0QxqNJwJbA+gE/31KEAvo88OTErq4VH9v22cD3EMqlFzbwC+BCwAq4XL5otABsA9yNqHgvLISQXIZQmGompevbA/vxZaO3NfgZ+5MDnn/RNF+f1d299ae2/W0f33kOOByxBB5UGikAxwLXU7kB5gOzEPb2mkjp+obAEcAMhNC1DE+WSh+d2d0d/8JxRle49HPgaODhwSxfowTgcsQSz4tPgR8CtyOUo6pI6bqG6DVHI5aCLWt9M4HZ+bxzbT5vFxzHa1qwgVMQo+GgELQAhICbEb3fi/vK1xjV/kBK19sQa+pzgI0GoY4CY4ltc3J3N6+aZqVLLwYuGowyBSkAMeAu4CCPa0qIXn9dtTcva+8nAmcC6w5G5TQCE7gil2N2Pl9p2LsJYSFtqNNKUALQiTCMfMvjmv8A3wVerObGKV1XEKPFL4C1G1kZg8njpRJndnezwvEUg3sQuk2pUeUIQgCiwN8R87CMp4DpwBfV3Dil6zsgesKERlVAM1li28zMZnnP8lwB3oFQbqvWk/xQrwCoiGXeNI9r7kVIsW8vmpSudwKXACdReS09pEk7DjOzWV721guuRUx9gVNv5d6At4HnZoQFsKLW00tK13dBeNvsQwtr9kERVRQOikR417JYZEun+10o2xeC/v16BOBChCYu4xLgLHwOXSldV85oazsbsVegB/2grUxYUdg/EmGpbfO2fDrYG1hMHfYSN2qdAr6H2JmTcSlwgd+bpXR9bYQ9YGqQDzfUcIAzuruZWyzKLjERulZgI0EtArA58Ary3axbgOP93iyl69sirF9Dak3fKEzg2GyWp0pSxf9jYAeE5bBuqp1jY4iliazx70Os1X2R0vVJwDMMN/5KwsBv43G+FpY6PW+IGC0DWcJXqwPciNhoceMfiK1QX2vWlK7vj7AdtMS+eCuhKQpTIhHmlUp84W4n2Bzhyzi/3t+qRoqOQOzRu7EE+CrCvl+RlK4fhdj2bZZv/5BgkWUxNZOh20UIFLAc+Cbwz3p+w68AjEI4QKzl8pmFcPF61s+NUrp+NPCHKn57jeb+YpFTu7tdPxuhKJ90Oc446rAU+p0CrgcmSj77CWLpVpGUrk9FWLZWa+NOkGwRCrHccXjLZXlYgI4J4XDyY9u+v9b7++mFExEOC27XPgp8Gx9r/ZSuT0S4PzXToXNIUnAcDsxkeNdFCNoUhZ+3t087q7t7bi33riQAIUQghZsnaxfCb76iB09K17dCTBFrya55pLz2HRsKsXVo9Rgg8o7D65bFUttmY1Vlh3DtKs97lsV+6bSrSXV3TSvdnkjskDSMd6q9b6USnYTcjfkn+Gv8tYG/IWn8nONwbk8P9/cxfkwIh7mwvZ1thqggOMB9xSJX5HIsLZt3w8DP2tuZEa0thGGLUIiZsRi35AfGlzxVKmkPF4tPp3R9y6RhVGUf8BoB2hGmR7egx9eAb1DBkbG8lfsQ8qUjfy0WOclFyVGAQyIRzm1rY3116GwJvGia/Kynx3XOBvhg5EiiSm36b9Zx2D2dZrnLnsH4UIjHOjsfUWD/pGH43jn0qtkTcG98B+HD58eL9Vw8Gh/gE8kGiAPMLRaZnE5zZS7nuhRqJRbbNsdns3wnk5E2PsDSOp4joSj8tM3dxXKBZTGvVNoPUee+kQlAFPlGzx/wsfZM6fquiA0hT7YKhTylMO84XJ/Ps2s6zR2FQnN8pz1Y4Thc3NPDHl1d/L3kvRpbX1XRa+z9vewfiTBRokv8RkwPl5Tr3heyuj8Wd/95Ex+NmtL1tRCbRRW1nl01jXPaKntuf2bbnNfTw5R02stOPmgUgVsLBXbt6uLWQqHifncEuDkeZ0SdAgBwlqS+XjdNniuVwsCd5TaoiJsAaMiHkTsQekElrkBE3PjipFiM2xIJNvOh9C2wLI7OZtkrnea2QoHMIE8NH9k2l+Zy7LRiBRf39NDl4/f30jQe6+ysaxXQl2+Ew+wsudf1YhQYg2iDirgJwKGIzBz9sRHu3p6kdH0Clb2CB7BDOMwGVSh771sWF/b0sFNXF/fKt08Do1BerezW1cXN+bzMRj8ABTHNjQt4RXNKzD0l0gum2etTcGy5LTxxq/EjJdfORcTdS0npegjhw1fVOPeKaTIlneaZGob2bsfhjO5uzuvpoVFikLJtDs5kuLNQqNoxzwF+nc8zI5vl8wBHq29pGttJhKrcIRTgpnKbSOkvAKOBfSXX+hlSTkLsVfumx3E4KptlmV2f9/MdhYLUZl4PWcfhgHTay1PHF8+VSvwo4PLNkowC9xeLvTrJDog2kdJfAL6Hu+L2b4QTiJSywaeiguhW2GxAPePvxSIf1SlI/bmjUMAIqHzzSiWWBFi+vSMR11XFZ7bddzS9pNw2rvRvbNnwf7uP8pzGl2HVvvFa32+oqhwRjZJQFGKILa/Z+TyLJZVoA4sti40DNBwtrtBge2gaB0YiFByHPMLVe06hQM7luSxwfb9WNODASITbCwMdru8pFtlD00C0yWkIH84B9BWfLRBhzm7l3ggRBu1KOWrnP9TgzGk4Dt9YsWKV+TumKMyKxTgxGh1gNTOBOYUCv8rlBihiUUXhrREjiAWw1OrlyVKJY7LZAe9vHQpxQXs7k1y08U9sm5/ncjzUTzmdGA5zV0ew/i9vmCYHZDID3o8Ar40cSYeoCwMY2yeXwUr6dhVZGPNjeDR+mVnU6MmrKwpzOjqYommMUVVOi8V4prOT02MxV5NpGJgZjfLsiBGcGIuRKF/Tpihc3d4eaOMDTNY0jolGV/aUpKpydTzOw52dro0PsIGqcmM8zoMdHUyLRFhPVTkuFuPqeDzQsgFsHw67Lp+LwPNfxhroiDYaQN/aehA4wOWaGXjs96d0PYawDTQlXs9CDPvJUKihOdnSjsMKxyHZgvsS1+fzXJnLDXh/ZjTKxe0rd9+XA+OShrHKblLv04SAyZL7P17h92fSxGDNELBpgxsfoFNRWrLxAXaVjETPrxpttC6irVah94l2xF2BexshOV78T7MrYE1n23B45VTYl/cti89WVWIHtFWvAOwhufdTXj9cdvT4erMrYE0nBFLT8PxVR4Gvl9tsJb0CIBv+n6zw20c3++GHEcgU0n8ODDpdpc16BWBbl+86CF9/V8omxhnNfvBhBLto7lqQS+j5jL7mYRVx+ILbzt3HeMfz7wVs0OwHH0aweSjk6mq9aKAAbIBoO0AIwHjJPT03fljDAzlbDQ1cVylfOI6bKXtl26kIC6AblTJ07t7shx5mVTaR7A4uHDgKrGw7LwGQjgApXV8HcU7PMC2EzKHmw4ECsHW5DVERgYZueI0AkxkO7Wo5NpEYqlx2SBXKKz8VebCGV67e4eG/BdlQIgCSTGS7gxAA2fZU2uO3vtnshx1mIAnJRpjE3+Kb8OUy0I2M25spXfdaOQzTRGQCIPG5GJ/SdVU2AthAj+R3xtLYI1qGqZH26gQgCoyVCUAWOcO9v0WpcgoAGC8TgAxyhgWgRYlXNwJAWQDcglq8IhiGBaBFsSQNHZJ7SY1Xce/tXo5rSYZpSWTzdkIuAEmZALQjjxus2vN3mMFBNtR7eCJ2ygQA5MvD4bRuLYpMADxGgI4w8pGjA3dj0JAbARyg6NMfP6QoQzZ3nXQEkAtAZxj5CKAj8v/1p2VHgBLwbKnEc6bJUttmmW2zvPyqJuqwU1FYT1VZV1VZT1EYGwqxp6a1fO6iruoFoCOM3Od/M0RI2IAvNftB+1JwHJ4yTf5WLDKvVAokzCztOKQti/f77KJdlcsxRlXZV9PYNxJhQjjccrthsiim0XJv5s4w8m1f2TZxS3SD3hQyV+RydQeW+mWJbfP7QoHfFwpsV44MmhBQzH8QfCgJYN1MLgCqinzbV7be9zISDQqvmCYHpNOc0d09aI3fnzcti8MyGWZms9KKH2wWScqxiXzqyqhUPwJ47RI2FBM4r6eHQzMZ3myRSn+iVGLvdJrfuqRvG2w+dOkMKnI/ASAdBhYi9Kf+bqUtNQKscByOz2bd3Jw9CQGjVNVrKbQKtuPwmeNUlXrGAi7L5fjAsvhFPN7wKCU3Mo7Dpy4CsIGqesVLZsKIjrWQgT1eRyiCH/Z7f9BHgIWWxcxstmKoNogwsf01jd3LwaajVLUmpSXnOCxzHD6wLB4rFnlcnrp9JfeU8xPckkiwdsBBqpV4Q9IxKuRdSvdqMP/Cfcjfg4ECMKgjwAeWxaGZjGcyJgWYFolwfCzGFgEt1doUhY0VhY1VlX00DQuRBPLqXM7zhK9XTJPDMhke6OjwPeoEwfOSMlXItprpnRxkEUBurl+fDNZDdTkOx2azno2/czjMQ52dXBOPB9b4boQQ8f33dnRwcyLBOI9A0Q8si9O6uxtz0J+EFyQCMEnznJA+qUUAKrmLB4IFnNTdLR32VeCn7e3c09HBtoNsoPm2pjGvs5ODIhHpNfNKJa52CdluBFnH4U0XAYgAO3rXzYJeAfgIdyfQdYGt+n9pMB7q8lxOmjUsrijcmkhwbI2Jl4MgqihcH49zVlub1CB0fT7Po4OQ1PIl03Td0/9aOFwpYcaCvuOYbBTYv/+XGv1Ar5smsyXLqoSi8JeODvbUmqFrD+S0WIzL292PQHCAC3t6KDQ4meUTEiGbWLmOfAlA/5NBF+IvUXTNXCYZOhXgmni85Wzy349GmSkZjZbaNn8o+D41t2pKiIzrbkzytlJawMK+AvAIuOZa3BqRQAKApGGUgEWNeqAnSyXpWv/kWIwpLdLz+/OT9nZpEucb8nnSDRoF5hWLrn7/66iq19FzAIuShlHqKwBfIA5wdKN/HoAXGvEwNmLud2O7UEiaJLkVCANXx+O4qYVdjsONDbIU/kXS+w+JRCrZP16AgV4/cyQXH86qlkLPzCG18mypxAKJiff89vaWP0l6jKpylCR7558LBYLetfjccXhaMv9P81ihlHkKBgrAw4iccv0ZhUgi3cvTAT8LAI9JHmaypkmH11bjlD6p6/ryuePwWpVm7ErcLUlTv3UoxJaV9aSnYaAAFIE/S77wo95/koaxGH9p46vicYkAnC7pVa2IrihMl/S+xwJcEuYdh1skyqWP3r+43Iauo+ptki9tz6pLwkCngX+XT9fqz+jKykzLsY9EUQ1SAO4qFvtnAAOE8eeQyvaRlW3nJgAvIh/if9zn/0cDexrkvX8vTWs5z5tKTNC03hStq7DQsqRnJFWDCdLt5+nRqJ+NqJVtJ9Orfi57Nr5MKfcgAe4MypwZ9mnRZZ8XYcRROG4sDUAA7i0UXAUphDyFfB/SiLYD5ALwBPKDoS4H1KRh5IC7g6q05ZKKGd9iRh+/jJVsFi2vUwByjsN1kt5/UCTiJ5vp3eW2A7yPjZPl/t8JOK78v5808r5Y7n5CtpdDY0uznqTc/1enQehX+bzrmQMK4uwlH6zSZl61+wjCT8CNy4BRScN4DmEarhs33z5dUZriXRME60rm4U/rGAEWWpZ0j2SKpvGVyqPlwnKbraRS9zpT8v5awC/L/9c9CpRwD9xIDtHhH5D6JtR6aijAj3t6XNf9EeC8dl9ncg9oq0oC8A/gj5LPjgF2BW4E6joMRwPX3T0f69mWZZNQiJ36LV9DILURVGJusdg/7+9KZsVifk5J6Ua01Sr4mWDPRpwU3h8F+FPSMABm11thx8VirNWnd2weCg1pAQC4oK1tpQVzI1Xlp+3tVR2N18ti2+aCHveELWNV1e/cP9vtYGm/49EpwK8lnz38/siRJ8QUZSF1po4pIQ5+Gq2q0uzXQ5Glts26qlrTXkYROMjj1LI5iQSTKy+VC8AmScMY4M7nVwBCwMvAVyWfn5vS9U2B4xtQf2s0P+7pYY7E5Ds1EuEmf8fQzE4axgluH/gVSguRGVyWOOrSY7PZx6HiEbrDVMFDxaK08ddTVS71p/iZeJz5WM2o9A5wouSz8LxS6YYXTTMwu8CazqumyZmSeT8E/CYeX0Vn8uC6pGFIHXhqWZPciuSYGAVSL4wYoW2gqutXec9h+rDAspjuEQvxw7Y2Tvan+H0MbJk0DGnWt1r0kpNxDxvHgeS+6XSpUe5PawJLbJsjPWIhvqVpfrV+gDO8Gh9qT/i8BWKvYITrh6HQigc6Oka2DXJ41FDnc8dheibjlt4dEHF+D3d2+g07ezRpGFMqXVSrof094EDA1S75nmWN/G42a68YHgl887Ftc2g6LW38kYrCH/3HHHYjRuqK1LPT8gzwfSQu4q+bpnpoJhPI9ufqznuWxSGZjPTg6zZF4bZEolKgZ19OTBrGh34urHer7T4kR5KCyFhxSCbTMgkUWpGXTZPpmYx0mzgM3BSPV+MVdWvSMOb4vTiI3ZZXEUEwrmcIZByHB4tFtgmFGDuEN3cawdxikVnd3dLsXgpwVTzOVP8m8beAQ6/N533bY4JqkX8gLLl7un2YB+4vFrGBnYegi1fQ5B2H83M5rsrlpJaz3jiDKjaPssDeScNYVk1ZguySzyLSyk3FZWpxEIcYvmSa7KZp0tTmqzsLLYsZ2azUnx/EnD87kaim55vAoUnD+KffL/QS9Jj8L+BN4GAkCaf/a9vMLZX4SijExmvQlOAAdxUKnNDd7akYj1AU5iQSleL6+9/6mKRhzK2lXI3qhpOBB5DYCXrZR9O4qL1detbN6sI7lsWPe3p4tUJgyPqqypxEgs2r6xhnJQ3jmlrL1shxeBOE0+iOXhfFFIWTYzF+EIsxtHf/B5J1HK7K5bi9UKgYTr2bpnFtPF5tbqErk4bxw3rK2OiJOAJchfAn8GScqnJqWxsHRyJDNldvLznH4c5ikRvy+Yo+gGHgnLY2fhCLVdsY1wBnJw2jLmvbYGlihwC/B0ZWunCMqjIrFuO70eiQGxGyjsPthQK/y+f53IcVdIyq8pt4nB2rd345L2kYV1T7JTcGUxUfB9wM7OPn4tGqyrHRKNMjEdZpcR3hv7bNXYUCtxcKvvMATItEuKi9nRHVDfkWcELSMG4NquzNWIt9B7gW9xPLBxBCRAdPj0TYW9Pq8qoNkqzj8HCxyF+KRV4yTd8Zwb4SCnFpbTmG88DhScO4P8jnaFZtJoCLgNPA/5TfqShMjUSYHA4zQdP8OkQExjLbZr5p8nSpxKOlErkqNrvaFIXTYzGOi8Vq0XEWAIclDePNoJ+p2d1pG0Qc4oHVlkVB+N7vEg4zSdPYKhRiA1UN7IFsxND+lmnyvGnygmlK4xe9CCNCts5ua2NMbVPZn4AfVNrXr5VmC0Av2wDnA4dRh3GqTVHYRFXZNBRiU1UlGQqRUBTiiNRyCUUhrig4iNM1so4j/iL2LBZbFotsmw8ti8WWRbHWgiCWP4dFo8yKxWq1c+SAU5OG8buG1TqtIwC9bAacq8DRDkMzKqxdUZgRjXJ8NFpPXOMziF7/bqPL22oC0Mso4PC1FeXMzx1nXLMLUwkFkbJ2WiTC1EiknhzBy4FzqtnODaLsLc3O4fDOo1T1xldN82vNOhxCxjhVZVo0yrRIpF5ztg3cBFyQNIwVg/kMLS8Avbw3cuR2L5vmL9+1rL3nm6b6kmnSM8guZyMVhQnhMBM1jUnhsJ9o3EpYiJxMlyUN4+1BfZgyQ0YAeknp+mbAj0pw5Bumqc03Td6zLBaVFbh8QEKRKCuUm4VCbBUKMUnT2DIUCipVXRERqXtF0jACCa+vlSEnAL2kdH0j4AzgCGA0iH3RJbbNwrIwfGHbdNNP43ccVMSqoO/KIIE4WaR3BbFuY6yPyxDR1tclDWNJvTcLgiErAL2kdD2MMC8fCRwEtFo60R7gfkQSznlJw2gpB8khLwB9Sel6ByKh5X4IH8V1mlSUTxGp2B4B5iYNo+knrclYrQSgLyldVxAGpj0Rmc0mITKbNIIvgOcRGdefAP5d7zbtYLHaCoAbKV0fjTgNre9rDOI85I7y3/5TSA6RWi1T/rsEYZtf+Uoaxv81+9lqZY0SAD+UdYre43EzScNYrUPe/x/Npzmh4u0iBAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0xMC0xMVQyMTozMjoyNSswMjowMEjyS14AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMTAtMTFUMjE6MzI6MjUrMDI6MDA5r/PiAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg=='

				const SATISFACTION = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPwAAAAoCAIAAABVZgAJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACISURBVHhe7dIxAQAgDMCwgVIO/GvgwUWTpwa65tyBkv0LGaYnx/TkmJ4c05NjenJMT47pyTE9OaYnx/TkmJ4c05NjenJMT47pyTE9OaYnx/TkmJ4c05NjenJMT47pyTE9OaYnx/TkmJ4c05NjenJMT47pyTE9OaYnx/TkmJ4c05NjenJMT8zMA4UfARRKfRS8AAAAAElFTkSuQmCC'
				const COMPLAINS = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAAAsCAIAAADdDMCuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB/SURBVGhD7dAxAcAgEMDAp2IQjQB0dkHCjbkle9a+Z0J9r3F66vXU66nXU6+nXk+9nno99Xrq9dTrqddTr6deT72eej31eur11Oup11Ovp15PvZ56PfV66vXU66nXU6+nXk+9nno99Xrq9dTrqddTr6deT72eej31eur1VJv5AQB0Ab5G6xLnAAAAAElFTkSuQmCC'
				const COMMENTS = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAAAvCAIAAAAUxbHQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVGhD7c8xAQAgDMCwgW0U4JoHF2me3l1zz2D2r6RnQ8+Gng09G3o29Gzo2dCzoWdDz4aeDT0bejb0bOjZ0LOhZ0PPhp4NPRt6NvRs8J5nHuYIAWJzGv1lAAAAAElFTkSuQmCC'
				const SERVICES = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAAyCAIAAACBPVE6AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABYSURBVGhD7c8xEcAwDMBAN3SLoOy7hIR8/4tmPfO9s8653cVVh6sOVx2uOlx1uOpw1eGqw1WHqw5XHa46XHW46nDV4arDVYerDlcdrjpcdbjqcNXhqmLmB43EAUjydsFbAAAAAElFTkSuQmCC'
				const REASONS = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAtCAIAAACWIyQYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABTSURBVGhD7c4xDcBADMDAfHGWQPkT+KUcrEh3i1ef+d5Z6/m7k/uO+477jvuO+477jvuO+477jvuO+477jvuO+477jvuO+477jvuO+477zub7mQuzvQEfrxFp+QAAAABJRU5ErkJggg=='
				const COMPLAINS_UNREAD = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAtCAIAAABgaqGAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABUSURBVGhD7c8xAcAwDMCwdMhGYPzp9BkKR3p8+8z3zhrP3x3cdrntctvltsttl9sut11uu9x2ue1y2+W2y22X2y63XW673Ha57XLb5bbLbdem25kLj7oA50ryYlMAAAAASUVORK5CYII='
				
				// pdf.addImage(WU_LOGO, 'JPEG', 80, 80, 50, 50)
				// pdf.setFontSize(24)
				// pdf.text('NET-PROMOTER-SCORE', 55, 130)
				// pdf.setFontSize(20)
				// pdf.text('Informe Mensual de Valoraciones', 53, 150)
				// pdf.setFontSize(12)
				// pdf.text('Powered by DiwaIT', 80, 280)
				// pdf.addImage(DWT_LOGO, 'JPEG', 118, 275, 6, 6)
				
				// pdf.addPage('a4', 'portrait')
				// pdf.addImage(YELLOW_TOP, 'JPEG', 0, 0, 230, 22)
				// pdf.setFontSize(20)
				// pdf.text('Informe Mensual', 5, 10)
				// pdf.setFontSize(14)
				// pdf.text('Marzo 2019', 5, 18)
				// pdf.text('NPS', 195, 10)
				// pdf.setFontSize(14)
				// pdf.text('35 sitios', 188, 18)

				// pdf.setFontSize(16)
				// pdf.text('Resultados Generales', 10, 35)

				// // HORIZONTAL, VERTICAL
				
				// pdf.addImage(VERY_GOOD, 'JPEG', 25, 45, 20, 20)
				// pdf.setFontSize(10)
				// pdf.text('42.77%', 47, 53)
				// pdf.text('5869 resp.', 47, 59)

				// pdf.addImage(GOOD, 'JPEG', 65, 45, 20, 20)
				// pdf.text('42.77%', 87, 53)
				// pdf.text('5869 resp.', 87, 59)

				// pdf.addImage(BAD, 'JPEG', 105, 45, 20, 20)
				// pdf.text('42.77%', 127, 53)
				// pdf.text('5869 resp.', 127, 59)

				// pdf.addImage(VERY_BAD, 'JPEG', 145, 45, 20, 20)
				// pdf.text('42.77%', 167, 53)
				// pdf.text('5869 resp.', 167, 59)

				// pdf.addImage(SATISFACTION, 'JPEG', 10, 75, 188, 10)
				// pdf.text(`Satisfacción de Cliente: 69.71%`, 15, 81)

				pdf.addImage(WU_LOGO, 'JPEG', 80, 80, 50, 50)
				pdf.setFontSize(24)
				pdf.text('NET-PROMOTER-SCORE', 55, 130)
				pdf.setFontSize(20)
				pdf.text('Reporte General de Valoraciones', 53, 150)
				pdf.setFontSize(12)
				pdf.text('Powered by DiwaIT', 80, 280)
				pdf.addImage(DWT_LOGO, 'JPEG', 118, 275, 6, 6)
				pdf.addPage('a4', 'portrait')
				pdf.setFontSize(20)
				pdf.text('Número de Valoraciones e Indicadores', 45, 20)

				async function getCanvas(ID) {
					return await html2canvas(document.getElementById(ID), {scale: 1})
				}

				const generalesFaces = await getCanvas('generalesFaces')
				pdf.addImage(generalesFaces.toDataURL('image/png'), 'PNG', 10, 35, 195, 30)

				const satisfactionInd = await getCanvas('satisfactionInd')
				pdf.addImage(satisfactionInd.toDataURL('image/png'), 'PNG', 10, 70, 190, 30)

				const indicators = await getCanvas('indicators')
				pdf.addImage(indicators.toDataURL('image/png'), 'PNG', 10, 95, 190, 50)
				pdf.text('Gráficos de Valoraciones por Tiempo', 49, 160)
				
				const hour = await getCanvas('hour')
				pdf.addImage(hour.toDataURL('image/png'), 'PNG', 10, 165, 190, 120)
				pdf.addPage('a4', 'portrait')
				
				const weekChartPDF = await getCanvas('weekChart')
				pdf.addImage(weekChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)

				const dayChartPDF = await getCanvas('dayChart')
				pdf.addImage(dayChartPDF.toDataURL('image/png'), 'PNG', 10, 150, 190, 120)
				pdf.addPage('a4', 'portrait')

				const monthChartPDF = await getCanvas('monthChart')
				pdf.addImage(monthChartPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)
				pdf.text('Resultados por Categoría', 65, 155)

				const services = await getCanvas('services')
				pdf.addImage(services.toDataURL('image/png'), 'PNG', 10, 165, 220, 50)
				
				const reasons = await getCanvas('reasons')
				pdf.addImage(reasons.toDataURL('image/png'), 'PNG', 10, 210, 220, 50)
				pdf.addPage('a4', 'portrait')
				
				const zones = await getCanvas('zones')
				pdf.addImage(zones.toDataURL('image/png'), 'PNG', 10, 20, 200, 80)
				pdf.text('Puntos Débiles y Fuertes', 65, 115)

				const weakPoints = await getCanvas('weakPoints')
				pdf.addImage(weakPoints.toDataURL('image/png'), 'PNG', 10, 125, 190, 120)
				pdf.addPage('a4', 'portrait')
				pdf.text('Gráficos de Valoraciones por Locales', 49, 20)

				const topLocals = await getCanvas('topLocals')
				pdf.addImage(topLocals.toDataURL('image/png'), 'PNG', 10, 35, 190, 100)

				const badLocals = await getCanvas('badLocals')
				pdf.addImage(badLocals.toDataURL('image/png'), 'PNG', 10, 120, 190, 100)
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
				pdf.addPage('a4', 'portrait')
				pdf.setFontSize(20)
				pdf.text('Número de Valoraciones e Indicadores', 45, 20)

				async function getCanvas(ID) {
					return await html2canvas(document.getElementById(ID), {scale: 1})
				}

				const customFaces = await getCanvas('customFaces')
				pdf.addImage(customFaces.toDataURL('image/png'), 'PNG', 10, 35, 195, 30)

				const satisfactionIndCustom = await getCanvas('satisfactionIndCustom')
				pdf.addImage(satisfactionIndCustom.toDataURL('image/png'), 'PNG', 10, 70, 190, 30)

				const indicatorsCustom = await getCanvas('indicatorsCustom')
				pdf.addImage(indicatorsCustom.toDataURL('image/png'), 'PNG', 10, 95, 190, 50)
				pdf.text('Gráficos de Valoraciones por Tiempo', 49, 160)

				const hourCustomPDF = await getCanvas('hourCustom')
				pdf.addImage(hourCustomPDF.toDataURL('image/png'), 'PNG', 10, 165, 190, 120)
				pdf.addPage('a4', 'portrait')

				const weekChartCustomPDF = await getCanvas('weekChartCustom')
				pdf.addImage(weekChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)

				const dayChartCustomPDF = await getCanvas('dayChartCustom')
				pdf.addImage(dayChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 150, 190, 120)
				pdf.addPage('a4', 'portrait')

				const monthChartCustomPDF = await getCanvas('monthChartCustom')
				pdf.addImage(monthChartCustomPDF.toDataURL('image/png'), 'PNG', 10, 20, 190, 120)
				pdf.text('Resultados por Categoría', 65, 155)

				const servicesCustom = await getCanvas('servicesCustom')
				pdf.addImage(servicesCustom.toDataURL('image/png'), 'PNG', 10, 165, 220, 50)
				
				const reasonsCustom = await getCanvas('reasonsCustom')
				pdf.addImage(reasonsCustom.toDataURL('image/png'), 'PNG', 10, 210, 220, 50)
				pdf.addPage('a4', 'portrait')
				
				const zonesCustom = await getCanvas('zonesCustom')
				pdf.addImage(zonesCustom.toDataURL('image/png'), 'PNG', 10, 20, 200, 80)
				pdf.text('Puntos Débiles y Fuertes', 65, 115)

				const weakPointsCustom = await getCanvas('weakPointsCustom')
				pdf.addImage(weakPointsCustom.toDataURL('image/png'), 'PNG', 10, 125, 190, 120)

				pdf.save(FILENAME)
				weekChartCustom.style.display = dayChartCustom.style.display = monthChartCustom.style.display = "none"
				this.loading2 = false
				this.loader2 = null
			},
			dynamicDialog(data) {
				this.dynamicDialogAct = !this.dynamicDialogAct
			},
			async searchStats() {
				this.loader = 'loading'

				this.results.filter = ''
				this.results.filterB = ''

				if (this.AMBA) {
					this.results.filter = ` AND (assessments.region_id) = '0l5DtjJ6UQ1J4DxX0fdY'`
					this.results.filterB = ` AND (tickets.region_id) = '0l5DtjJ6UQ1J4DxX0fdY'`					
				}

				if (this.interior) {
					this.results.filter = ` AND (assessments.region_id) = 'MKITRJYc46G8XLR0Kjsv'`
					this.results.filterB = ` AND (tickets.region_id) = 'MKITRJYc46G8XLR0Kjsv'`					
				}

				if (this.zone) {
					this.zoneID = (await this.$axios.post('zones/search', { responsable: this.zone })).data[0].id
					this.results.filter = ` AND (assessments.zone_id) = '${this.zoneID}'`
					this.results.filterB = ` AND (tickets.zone_id) = '${this.zoneID}'`
				}

				if (this.local) {
					this.localID = (await this.$axios.post('locals/search', { title: this.local })).data[0].id
					this.results.filter = `${this.results.filter} AND (assessments.local_id) = '${this.localID}'`
					this.results.filterB = `${this.results.filterB} AND (tickets.local_id) = '${this.localID}'`
				}

				if (this.dateSince) {
					if (this.timeSince) {
						this.results.filter = `${this.results.filter} AND (assessments.date) BETWEEN '${this.dateSince} ${this.timeSince}' 
						AND '${this.dateUntil} ${this.timeUntil}'`
						
						this.results.filterB = `${this.results.filterB}
						 AND (tickets.date) BETWEEN '${this.dateSince} ${this.timeSince}' 
						AND '${this.dateUntil} ${this.timeUntil}'`
					}
					else {
						this.results.filter = `${this.results.filter} AND DATE(assessments.date) BETWEEN '${this.dateSince}' AND '${this.dateUntil}'`
						this.results.filterB = `${this.results.filterB} AND DATE(tickets.date) BETWEEN '${this.dateSince}' AND '${this.dateUntil}'`
					}
				}

				if (this.timeSince && !this.dateSince) {
					this.results.filter = `${this.results.filter} AND HOUR(assessments.date) BETWEEN '${this.timeSince}' AND '${this.timeUntil}'`
					this.results.filterB = `${this.results.filterB} AND HOUR(tickets.date) BETWEEN '${this.timeSince}' AND '${this.timeUntil}'`					
				}

				const queryFaces = (await this.$axios.post('assessments/stats/faces/value-prc', { condition: this.results.filter })).data

				this.results.statsFaces = queryFaces
				this.results.totalAssessments = (await this.$axios.post('assessments/stats/total', { condition: this.results.filter })).data[0].total
				
				this['loading'] = false
				this.loader = null
				
				if (!this.results.totalAssessments) {
					this.textDialogPreResults = "La búsqueda no ha devuelto ningún resultado. Intentá con otros valores."
					this.titleDialogPreResults = "¡Advertencia!"
					this.dialogPreResults = true
				}
				else {
					this.getChartCustomM(this.results.filter)
					this.getIndicatorsCustom()
					this.getChartCustomDatesHour()
					this.getChartCustomDatesDayW()
					this.getChartCustomDatesDay()
					this.getChartCustomDatesMonth()
					this.dialogResults = true
				}
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
				this.local = null
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

				this.topLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).slice(0,20)

				function reverseArrayInPlace(arr) {
					for (var i = 0; i <= Math.floor((arr.length - 1) / 2); i++) {
						let el = arr[i]
						arr[i] = arr[arr.length - 1 - i]
						arr[arr.length - 1 - i] = el
					}
					return arr
				}
				
				this.badLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).reverse().slice(0,20)
			},

			async getChartCustomM(filter) {
				const objectService = (await this.$axios.post('assessments/stats/service', { condition: filter })).data[0]

				const { pagoServicio, pagoServicioVeryGood, pagoServicioGood, pagoServicioBad,
				pagoServicioVeryBad, casaDeCambio, casaDeCambioVeryGood, casaDeCambioGood, 
				casaDeCambioBad, casaDeCambioVeryBad, envioInternacional, envioInternacionalVeryGood, 
				envioInternacionalGood, envioInternacionalBad, envioInternacionalVeryBad, envioNacional, 
				envioNacionalVeryGood, envioNacionalGood, envioNacionalBad, envioNacionalVeryBad, total } = objectService

				this.results.statsServices = [
				[
					pagoServicio, this.getPercentage(pagoServicio, total), {
						veryGood: { face: 'veryGood', value: pagoServicioVeryGood, percentage: this.getPercentage(pagoServicioVeryGood, pagoServicio) },
						good: { face: 'good', value: pagoServicioGood, percentage: this.getPercentage(pagoServicioGood, pagoServicio) },
						bad: { face: 'bad', value: pagoServicioBad, percentage: this.getPercentage(pagoServicioBad, pagoServicio) },
						veryBad: { face: 'veryBad', value: pagoServicioVeryBad, percentage: this.getPercentage(pagoServicioVeryBad, pagoServicio) },
						filter,
						satisfaction: this.getIndicatorsReason(pagoServicio, pagoServicioGood, pagoServicioBad, pagoServicioVeryBad)
					}
				],
				[
					envioInternacional, this.getPercentage(envioInternacional, total), {
					veryGood: { face: 'veryGood', value: envioInternacionalVeryGood, percentage: this.getPercentage(envioInternacionalVeryGood, envioInternacional) },
					good: { face: 'good', value: envioInternacionalGood, percentage: this.getPercentage(envioInternacionalGood, envioInternacional) },
					bad: { face: 'bad', value: envioInternacionalBad, percentage: this.getPercentage(envioInternacionalBad, envioInternacional) },
					veryBad: { face: 'veryBad', value: envioInternacionalVeryBad, percentage: this.getPercentage(envioInternacionalVeryBad, envioInternacional) },
					filter,
					satisfaction: this.getIndicatorsReason(envioInternacional, envioInternacionalGood, envioInternacionalBad, envioInternacionalVeryBad)
				}],
				[
					envioNacional, this.getPercentage(envioNacional, total), {
					veryGood: { face: 'veryGood', value: envioNacionalVeryGood, percentage: this.getPercentage(envioNacionalVeryGood, envioNacional) },
					good: { face: 'good', value: envioNacionalGood, percentage: this.getPercentage(envioNacionalGood, envioNacional) },
					bad: { face: 'bad', value: envioNacionalBad, percentage: this.getPercentage(envioNacionalBad, envioNacional) },
					veryBad: { face: 'veryBad', value: envioNacionalVeryBad, percentage: this.getPercentage(envioNacionalVeryBad, envioNacional) },
					filter,
					satisfaction: this.getIndicatorsReason(envioNacional, envioNacionalGood, envioNacionalBad, envioNacionalVeryBad)
				}],
				[
					casaDeCambio, this.getPercentage(casaDeCambio, total), {
					veryGood: { face: 'veryGood', value: casaDeCambioVeryGood, percentage: this.getPercentage(casaDeCambioVeryGood, casaDeCambio) },
					good: { face: 'good', value: casaDeCambioGood, percentage: this.getPercentage(casaDeCambioGood, casaDeCambio) },
					bad: { face: 'bad', value: casaDeCambioBad, percentage: this.getPercentage(casaDeCambioBad, casaDeCambio) },
					veryBad: { face: 'veryBad', value: casaDeCambioVeryBad, percentage: this.getPercentage(casaDeCambioVeryBad, casaDeCambio) },
					filter,
					satisfaction: this.getIndicatorsReason(casaDeCambio, casaDeCambioGood, casaDeCambioBad, casaDeCambioVeryBad)
					}]
				]

				const objectReason = (await this.$axios.post('assessments/stats/reason', { condition: filter })).data[0]

				const { atencionDelCajero, atencionDelCajeroVeryGood, atencionDelCajeroGood, atencionDelCajeroBad,
				atencionDelCajeroVeryBad, estadoDelLocal, estadoDelLocalVeryGood, estadoDelLocalGood, 
				estadoDelLocalBad, estadoDelLocalVeryBad, servicioUtilizado, servicioUtilizadoVeryGood, 
				servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad, tiempoDeEspera, 
				tiempoDeEsperaVeryGood, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad, totalR } = objectReason

				this.results.statsReasons = [
					[
						atencionDelCajero, this.getPercentage(atencionDelCajero, totalR), {
							veryGood: { face: 'veryGood', value: atencionDelCajeroVeryGood, percentage: this.getPercentage(atencionDelCajeroVeryGood, atencionDelCajero) },
							good: { face: 'good', value: atencionDelCajeroGood, percentage: this.getPercentage(atencionDelCajeroGood, atencionDelCajero) },
							bad: { face: 'bad', value: atencionDelCajeroBad, percentage: this.getPercentage(atencionDelCajeroBad, atencionDelCajero) },
							veryBad: { face: 'veryBad', value: atencionDelCajeroVeryBad, percentage: this.getPercentage(atencionDelCajeroVeryBad, atencionDelCajero) },
							filter,
							satisfaction: this.getIndicatorsReason(atencionDelCajero, atencionDelCajeroGood, atencionDelCajeroBad, atencionDelCajeroVeryBad)
						}
					],
					[
						tiempoDeEspera, this.getPercentage(tiempoDeEspera, totalR), {
						veryGood: { face: 'veryGood', value: tiempoDeEsperaVeryGood, percentage: this.getPercentage(tiempoDeEsperaVeryGood, tiempoDeEspera) },
						good: { face: 'good', value: tiempoDeEsperaGood, percentage: this.getPercentage(tiempoDeEsperaGood, tiempoDeEspera) },
						bad: { face: 'bad', value: tiempoDeEsperaBad, percentage: this.getPercentage(tiempoDeEsperaBad, tiempoDeEspera) },
						veryBad: { face: 'veryBad', value: tiempoDeEsperaVeryBad, percentage: this.getPercentage(tiempoDeEsperaVeryBad, tiempoDeEspera) },
						filter,
						satisfaction: this.getIndicatorsReason(tiempoDeEspera, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad)
					}],
					[
						estadoDelLocal, this.getPercentage(estadoDelLocal, totalR), {
						veryGood: { face: 'veryGood', value: estadoDelLocalVeryGood, percentage: this.getPercentage(estadoDelLocalVeryGood, estadoDelLocal) },
						good: { face: 'good', value: estadoDelLocalGood, percentage: this.getPercentage(estadoDelLocalGood, estadoDelLocal) },
						bad: { face: 'bad', value: estadoDelLocalBad, percentage: this.getPercentage(estadoDelLocalBad, estadoDelLocal) },
						veryBad: { face: 'veryBad', value: estadoDelLocalVeryBad, percentage: this.getPercentage(estadoDelLocalVeryBad, estadoDelLocal) },
						filter,
						satisfaction: this.getIndicatorsReason(estadoDelLocal, estadoDelLocalGood, estadoDelLocalBad, estadoDelLocalVeryBad)
					}],
					[
						servicioUtilizado, this.getPercentage(servicioUtilizado, totalR), {
						veryGood: { face: 'veryGood', value: servicioUtilizadoVeryGood, percentage: this.getPercentage(servicioUtilizadoVeryGood, servicioUtilizado) },
						good: { face: 'good', value: servicioUtilizadoGood, percentage: this.getPercentage(servicioUtilizadoGood, servicioUtilizado) },
						bad: { face: 'bad', value: servicioUtilizadoBad, percentage: this.getPercentage(servicioUtilizadoBad, servicioUtilizado) },
						veryBad: { face: 'veryBad', value: servicioUtilizadoVeryBad, percentage: this.getPercentage(servicioUtilizadoVeryBad, servicioUtilizado) },
						filter,
						satisfaction: this.getIndicatorsReason(servicioUtilizado, servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad)
					}]
				]

				const objectZone = (await this.$axios.post('assessments/stats/zone', { condition: filter })).data[0]

				const { eduardoCesio, eduardoCesioVeryGood, eduardoCesioGood, eduardoCesioBad,
				eduardoCesioVeryBad, walterMancho, walterManchoVeryGood, walterManchoGood, 
				walterManchoBad, walterManchoVeryBad, lucianaBernadotti, lucianaBernadottiVeryGood, 
				lucianaBernadottiGood, lucianaBernadottiBad, lucianaBernadottiVeryBad, cristinaMarigomez, 
				cristinaMarigomezVeryGood, cristinaMarigomezGood, cristinaMarigomezBad, cristinaMarigomezVeryBad,
				dardoRicci, dardoRicciVeryGood, dardoRicciGood, dardoRicciBad, dardoRicciVeryBad, diegoLongo, diegoLongoVeryGood,
				diegoLongoGood, diegoLongoBad, diegoLongoVeryBad, florenciaCasa, florenciaCasaVeryGood, florenciaCasaGood,
				florenciaCasaBad, florenciaCasaVeryBad, totalZ } = objectZone

				this.results.statsZones = [
					[
						walterMancho, this.getPercentage(walterMancho, totalZ), {
						veryGood: { face: 'veryGood', value: walterManchoVeryGood, percentage: this.getPercentage(walterManchoVeryGood, walterMancho) },
						good: { face: 'good', value: walterManchoGood, percentage: this.getPercentage(walterManchoGood, walterMancho) },
						bad: { face: 'bad', value: walterManchoBad, percentage: this.getPercentage(walterManchoBad, walterMancho) },
						veryBad: { face: 'veryBad', value: walterManchoVeryBad, percentage: this.getPercentage(walterManchoVeryBad, walterMancho) },
						filter,
						satisfaction: this.getIndicatorsReason(walterMancho, walterManchoGood, walterManchoBad, walterManchoVeryBad)
					}],
					[
						lucianaBernadotti, this.getPercentage(lucianaBernadotti, totalZ), {
						veryGood: { face: 'veryGood', value: lucianaBernadottiVeryGood, percentage: this.getPercentage(lucianaBernadottiVeryGood, lucianaBernadotti) },
						good: { face: 'good', value: lucianaBernadottiGood, percentage: this.getPercentage(lucianaBernadottiGood, lucianaBernadotti) },
						bad: { face: 'bad', value: lucianaBernadottiBad, percentage: this.getPercentage(lucianaBernadottiBad, lucianaBernadotti) },
						veryBad: { face: 'veryBad', value: lucianaBernadottiVeryBad, percentage: this.getPercentage(lucianaBernadottiVeryBad, lucianaBernadotti) },
						filter,
						satisfaction: this.getIndicatorsReason(lucianaBernadotti, lucianaBernadottiGood, lucianaBernadottiBad, lucianaBernadottiVeryBad)
					}],
					[
						cristinaMarigomez, this.getPercentage(cristinaMarigomez, totalZ), {
						veryGood: { face: 'veryGood', value: cristinaMarigomezVeryGood, percentage: this.getPercentage(cristinaMarigomezVeryGood, cristinaMarigomez) },
						good: { face: 'good', value: cristinaMarigomezGood, percentage: this.getPercentage(cristinaMarigomezGood, cristinaMarigomez) },
						bad: { face: 'bad', value: cristinaMarigomezBad, percentage: this.getPercentage(cristinaMarigomezBad, cristinaMarigomez) },
						veryBad: { face: 'veryBad', value: cristinaMarigomezVeryBad, percentage: this.getPercentage(cristinaMarigomezVeryBad, cristinaMarigomez) },
						filter,
						satisfaction: this.getIndicatorsReason(cristinaMarigomez, cristinaMarigomezGood, cristinaMarigomezBad, cristinaMarigomezVeryBad)
					}],
					[
						dardoRicci, this.getPercentage(dardoRicci, totalZ), {
						veryGood: { face: 'veryGood', value: dardoRicciVeryGood, percentage: this.getPercentage(dardoRicciVeryGood, dardoRicci) },
						good: { face: 'good', value: dardoRicciGood, percentage: this.getPercentage(dardoRicciGood, dardoRicci) },
						bad: { face: 'bad', value: dardoRicciBad, percentage: this.getPercentage(dardoRicciBad, dardoRicci) },
						veryBad: { face: 'veryBad', value: dardoRicciVeryBad, percentage: this.getPercentage(dardoRicciVeryBad, dardoRicci) },
						filter,
						satisfaction: this.getIndicatorsReason(dardoRicci, dardoRicciGood, dardoRicciBad, dardoRicciVeryBad)
					}],
					[
						diegoLongo, this.getPercentage(diegoLongo, totalZ), {
						veryGood: { face: 'veryGood', value: diegoLongoVeryGood, percentage: this.getPercentage(diegoLongoVeryGood, diegoLongo) },
						good: { face: 'good', value: diegoLongoGood, percentage: this.getPercentage(diegoLongoGood, diegoLongo) },
						bad: { face: 'bad', value: diegoLongoBad, percentage: this.getPercentage(diegoLongoBad, diegoLongo) },
						veryBad: { face: 'veryBad', value: diegoLongoVeryBad, percentage: this.getPercentage(diegoLongoVeryBad, diegoLongo) },
						filter,
						satisfaction: this.getIndicatorsReason(diegoLongo, diegoLongoGood, diegoLongoBad, diegoLongoVeryBad)
					}],
					[
						florenciaCasa, this.getPercentage(florenciaCasa, totalZ), {
						veryGood: { face: 'veryGood', value: florenciaCasaVeryGood, percentage: this.getPercentage(florenciaCasaVeryGood, florenciaCasa) },
						good: { face: 'good', value: florenciaCasaGood, percentage: this.getPercentage(florenciaCasaGood, florenciaCasa) },
						bad: { face: 'bad', value: florenciaCasaBad, percentage: this.getPercentage(florenciaCasaBad, florenciaCasa) },
						veryBad: { face: 'veryBad', value: florenciaCasaVeryBad, percentage: this.getPercentage(florenciaCasaVeryBad, florenciaCasa) },
						filter,
						satisfaction: this.getIndicatorsReason(florenciaCasa, florenciaCasaGood, florenciaCasaBad, florenciaCasaVeryBad)
					}],
					[
						eduardoCesio, this.getPercentage(eduardoCesio, totalZ), {
							veryGood: { face: 'veryGood', value: eduardoCesioVeryGood, percentage: this.getPercentage(eduardoCesioVeryGood, eduardoCesio) },
							good: { face: 'good', value: eduardoCesioGood, percentage: this.getPercentage(eduardoCesioGood, eduardoCesio) },
							bad: { face: 'bad', value: eduardoCesioBad, percentage: this.getPercentage(eduardoCesioBad, eduardoCesio) },
							veryBad: { face: 'veryBad', value: eduardoCesioVeryBad, percentage: this.getPercentage(eduardoCesioVeryBad, eduardoCesio) },
							filter,
							satisfaction: this.getIndicatorsReason(eduardoCesio, eduardoCesioGood, eduardoCesioBad, eduardoCesioVeryBad)
						}
					]
				]

					let reasonChart = [{
						title: 'Atención del Cajero',
						bad: this.getPercentage(atencionDelCajeroBad, atencionDelCajero),
						veryBad: this.getPercentage(atencionDelCajeroVeryBad, atencionDelCajero),
						good: this.getPercentage(atencionDelCajeroGood, atencionDelCajero),
						veryGood: this.getPercentage(atencionDelCajeroVeryGood, atencionDelCajero),
						total: atencionDelCajero,
						satisfaction: this.getIndicatorsReason(atencionDelCajero, atencionDelCajeroGood, atencionDelCajeroBad, atencionDelCajeroVeryBad)
					}, {
						title: 'Tiempo de Espera',
						bad: this.getPercentage(tiempoDeEsperaBad, tiempoDeEspera),
						veryBad: this.getPercentage(tiempoDeEsperaVeryBad, tiempoDeEspera),
						good: this.getPercentage(tiempoDeEsperaGood, tiempoDeEspera),
						veryGood: this.getPercentage(tiempoDeEsperaVeryGood, tiempoDeEspera),
						total: tiempoDeEspera,
						satisfaction: this.getIndicatorsReason(tiempoDeEspera, tiempoDeEsperaGood, tiempoDeEsperaBad, tiempoDeEsperaVeryBad)
					}, {
						title: 'Estado del Local',
						bad: this.getPercentage(estadoDelLocalBad, estadoDelLocal),
						veryBad: this.getPercentage(estadoDelLocalVeryBad, estadoDelLocal),
						good: this.getPercentage(estadoDelLocalGood, estadoDelLocal),
						veryGood: this.getPercentage(estadoDelLocalVeryGood, estadoDelLocal),
						total: estadoDelLocal,
						satisfaction: this.getIndicatorsReason(estadoDelLocal, estadoDelLocalGood, estadoDelLocalBad, estadoDelLocalVeryBad)
					}, {
						title: 'Servicio Utilizado',
						bad: this.getPercentage(servicioUtilizadoBad, servicioUtilizado),
						veryBad: this.getPercentage(servicioUtilizadoVeryBad, servicioUtilizado),
						good: this.getPercentage(servicioUtilizadoGood, servicioUtilizado),
						veryGood: this.getPercentage(servicioUtilizadoVeryGood, servicioUtilizado),
						total: servicioUtilizado,
						satisfaction: this.getIndicatorsReason(servicioUtilizado, servicioUtilizadoGood, servicioUtilizadoBad, servicioUtilizadoVeryBad)
					}]

				const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))
				this.results.weakPoints = reasonChart.sort(sortByProperty('satisfaction')).map(x => x).reverse()

				const statsLocals = (await this.$axios.post('locals/stats/faces', { condition: filter })).data

				let activeLocals = []

				for (let local of statsLocals) {
					activeLocals.push(this.getChartLocal(local))
				}

				this.results.topLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).slice(0,5)
					
				this.results.badLocals = activeLocals.sort(sortByProperty('satisfaction')).map(x => x).reverse().slice(0,5)

				this.dialogResults = true
			},

			async getIndicatorsGlobal() {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1

				const partialGood = this.statsFaces[1].value * PRC_GOOD
				const partialBad = this.statsFaces[0].value * PRC_BAD
				const partialVeryBad = this.statsFaces[2].value * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad
				
				this.indicatorsGlobal.satisfaction = (100 - this.getPercentage(partials, this.totalAssessments)).toFixed(2) + '%'

				const complains = this.$axios.post('/assessments/stats/complain',
				{ condition: ` AND MONTH(tickets.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					this.indicatorsGlobal.complain = [`${res.data[0].value} total`, `${res.data[0].percentage}%`]
				})
				
				const comments = this.$axios.post('/assessments/stats/comment',
				{ condition: ` AND MONTH(tickets.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					this.indicatorsGlobal.comment = [`${res.data[0].value} total`, `${res.data[0].percentage}%`]
				})
				
				const complainsUnread = this.$axios.post('/assessments/stats/complainUnread',
				{ condition: ` AND MONTH(tickets.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					this.indicatorsGlobal.complainUnread = [`${res.data[0].value} total`, `${res.data[0].percentage}%`]
				})

				const services = this.$axios.post('/assessments/stats/service',
				{ condition: ` AND justification != 'null' AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					console.log(res)
					this.indicatorsGlobal.service = [`${res.data[0].total} total`, `${this.getPercentage(res.data[0].total, this.totalAssessments)}%`]
				})
				
				const reasons = this.$axios.post('/assessments/stats/reason',
				{ condition: ` AND justificationtwo != 'null' AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `}).then(res => {
					console.log(res)
					this.indicatorsGlobal.reason = [`${res.data[0].totalR} total`, `${this.getPercentage(res.data[0].totalR, this.totalAssessments)}%`]
				})
			},

			getIndicatorsLocal(local) {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1

				const partialGood = local.good * PRC_GOOD
				const partialBad = local.bad * PRC_BAD
				const partialVeryBad = local.veryBad * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad

				local.indicatorsGlobal.satisfaction = (100 - this.getPercentage(partials, local.total)).toFixed(2)
				if (this.getPercentage(partials, local.total) == 0) local.indicatorsGlobal.satisfaction = 100
				
				// local.indicatorsGlobal.complain = [complains, this.getPercentage(complains, total)]
				// local.indicatorsGlobal.comment = [comments, this.getPercentage(comments, total)]
				// local.indicatorsGlobal.service = [services, this.getPercentage(services, total)]
				// local.indicatorsGlobal.reason = [reasons, this.getPercentage(reasons, total)]

				return local.indicatorsGlobal
			},

			async getIndicatorsCustom() {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1

				if (!this.results.statsFaces[0]) this.results.statsFaces[0] = { value: 0 }
				if (!this.results.statsFaces[1]) this.results.statsFaces[1] = { value: 0 }
				if (!this.results.statsFaces[2]) this.results.statsFaces[2] = { value: 0 }

				const partialGood = this.results.statsFaces[1].value * PRC_GOOD
				const partialBad = this.results.statsFaces[0].value * PRC_BAD
				const partialVeryBad = this.results.statsFaces[2].value || 0 * PRC_VERY_BAD
				
				const partials = partialGood + partialBad + partialVeryBad

				const services = (await this.$axios.post('/assessments/stats/service/ind', { condition: this.results.filter })).data[0].total
				const reasons = (await this.$axios.post('/assessments/stats/reason/ind', { condition: this.results.filter })).data[0].total

				const complains = (await this.$axios.post('/assessments/stats/complain', { condition: this.results.filterB, conditionB: this.results.filter })).data[0]
				const comments = (await this.$axios.post('/assessments/stats/comment', { condition: this.results.filterB, conditionB: this.results.filter })).data[0]
				const complainsUnread = (await this.$axios.post('/assessments/stats/complainUnread', { condition: this.results.filterB })).data[0]

				this.results.indicatorsCustom.satisfaction = (100 - this.getPercentage(partials, this.results.totalAssessments)).toFixed(2) + '%'
				
				this.results.indicatorsCustom.complain = [`${complains.value} total`, `${complains.percentage}%`]
				this.results.indicatorsCustom.comment = [`${comments.value} total`, `${comments.percentage}%`]
				this.results.indicatorsCustom.complainUnread = [`${complainsUnread.value} total`, `${complainsUnread.percentage}%`]
				
				this.results.indicatorsCustom.service = [`${services} total`, `${this.getPercentage(services, this.results.totalAssessments)}%`]
				this.results.indicatorsCustom.reason = [`${reasons} total`, `${this.getPercentage(reasons, this.results.totalAssessments)}%`]
			},

			getIndicatorsReason(total, good, bad, veryBad) {
				const PRC_GOOD = 0.25, PRC_BAD = 0.50, PRC_VERY_BAD = 1
				let satisfaction = null

				const partialGood = good * PRC_GOOD
				const partialBad = bad * PRC_BAD
				const partialVeryBad = veryBad * PRC_VERY_BAD

				const partials = partialGood + partialBad + partialVeryBad
				if (!partials && total) satisfaction = 100
				else {
					satisfaction = (100 - this.getPercentage(partials, total)).toFixed(2)
					if (!this.getPercentage(partials, total)) satisfaction = 0
				}

				return satisfaction
			},

			async getChartGlobalDatesHour() {

				const hoursStats = (await this.$axios.post('/assessments/stats/hour',
				{ condition: ` AND justification != 'null' AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data

				this.chartHourGlobal = []

				for (let i = 0; i < hoursStats.length; i++) {
					this.chartHourGlobal.push({
						title: hoursStats[i].hour + " hs",
						total: hoursStats[i].total,
						veryGood: this.getPercentage(hoursStats[i].veryGood, hoursStats[i].total),
						good: this.getPercentage(hoursStats[i].good, hoursStats[i].total),
						bad: this.getPercentage(hoursStats[i].bad, hoursStats[i].total),
						veryBad: this.getPercentage(hoursStats[i].veryBad, hoursStats[i].total)
					})
				}

				this.chartHourGlobalService = this.chartHourGlobal
			},

			async getChartCustomDatesHour() {
				const hoursStats = (await this.$axios.post('/assessments/stats/hour', { condition: this.results.filter })).data

				this.chartHourCustom = []

				for (let i = 0; i < hoursStats.length; i++) {
					this.chartHourCustom.push({
						title: hoursStats[i].hour + " hs",
						total: hoursStats[i].total,
						veryGood: this.getPercentage(hoursStats[i].veryGood, hoursStats[i].total),
						good: this.getPercentage(hoursStats[i].good, hoursStats[i].total),
						bad: this.getPercentage(hoursStats[i].bad, hoursStats[i].total),
						veryBad: this.getPercentage(hoursStats[i].veryBad, hoursStats[i].total)
					})
				}
			},

			async getChartGlobalDatesDayW() {
				const dayWStats = (await this.$axios.post('/assessments/stats/dayW',
				{ condition: ` AND justification != 'null' AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data
				
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

			async getChartCustomDatesDayW() {
				const dayWStats = (await this.$axios.post('/assessments/stats/dayW', { condition: this.results.filter })).data
				const CATEGORIES = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

				this.chartDayWCustom = []

				for (let i = 0; i < dayWStats.length; i++) {
					this.chartDayWCustom.push({
						title: CATEGORIES[i],
						total: dayWStats[i].total,
						veryGood: this.getPercentage(dayWStats[i].veryGood, dayWStats[i].total),
						good: this.getPercentage(dayWStats[i].good, dayWStats[i].total),
						bad: this.getPercentage(dayWStats[i].bad, dayWStats[i].total),
						veryBad: this.getPercentage(dayWStats[i].veryBad, dayWStats[i].total)
					})
				}
			},

			async getChartGlobalDatesDay() {
				const dayStats = (await this.$axios.post('/assessments/stats/day',
				{ condition: ` AND justification != 'null' AND MONTH(assessments.date) = ${new Date().getMonth() + 1 } `})).data

				let nextDay = 1

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

			async getChartCustomDatesDay() {
				const dayStats = (await this.$axios.post('/assessments/stats/day', { condition: this.results.filter })).data

				let nextDay = 1

				this.chartDayCustom = []

				for (let data of dayStats) {
					this.chartDayCustom.push({
						title: "Día " + data.day,
						total: data.total,
						veryGood: this.getPercentage(data.veryGood, data.total),
						good: this.getPercentage(data.good, data.total),
						bad: this.getPercentage(data.bad, data.total),
						veryBad: this.getPercentage(data.veryBad, data.total)
					})
				}
			},

			async getChartGlobalDatesMonth() {
				const monthStats = (await this.$axios.post('/assessments/stats/month')).data
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

			async getChartCustomDatesMonth() {
				const monthStats = (await this.$axios.post('/assessments/stats/month', { condition: this.results.filter })).data
				const CATEGORIES = ['Ene', 'Feb', 'Mar', 'Abr', 'May',
							'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dec']

				this.chartMonthCustom = []

				for (let i = 0; i < monthStats.length; i++) {
					this.chartMonthCustom.push({
						title: CATEGORIES[monthStats[i].month - 1],
						total: monthStats[i].total,
						veryGood: this.getPercentage(monthStats[i].veryGood, monthStats[i].total),
						good: this.getPercentage(monthStats[i].good, monthStats[i].total),
						bad: this.getPercentage(monthStats[i].bad, monthStats[i].total),
						veryBad: this.getPercentage(monthStats[i].veryBad, monthStats[i].total)
					})
				}
			},

			getChartLocal(local) {
				local.stats = {
					title: local.title,
					veryGood: this.getPercentage(local.veryGood, local.total),
					good: this.getPercentage(local.good, local.total),
					bad: this.getPercentage(local.bad, local.total),
					veryBad: this.getPercentage(local.veryBad, local.total),
					total: local.total,
				}

				local.indicatorsGlobal = {}

				local.stats.satisfaction = this.getIndicatorsLocal(local).satisfaction

				return local.stats

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
	@media print
		.hide-on-screen,
		.noPrint
			display: block

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