<template lang="pug">
	v-container(v-if="poll" grid-list-md)
		v-layout.mb-5(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Encuesta: {{ poll.question }}
					v-divider
			v-flex(xs12 md6)
				v-text-field(
					label="Pregunta Principal"
					v-model.trim="question"
					required
					:readonly="employee"
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Local"
					v-model="localNew"
					:items="localsSelect"
					:readonly="employee"
					required
					chips
					multiple
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Contexto"
					v-model="context"
					:items="contextsSelect"
					:readonly="employee"
					required
				)
			v-flex(xs12 md6).mb-5
				v-text-field#background.hidden(type="file" @change.native="writeFile($event)")
				v-btn#uploadFile(block color="primary" @click="uploadClick" v-if="!employee") Elegir nuevo background
			v-flex(xs12 md4)
				v-text-field(
					label="Permalink Encuesta"
					v-model="permalink"
					required
					readonly
				)
			v-flex(xs12 md4).mb-5
				v-btn(block color="primary" @click="selectLocal") Ir a encuesta
			v-flex(xs12)
				img(height="500" width="100%" :src="background")
		v-layout(row wrap)
			v-flex(xs12)
				span.display-1 Justificación
				v-divider
			v-flex(xs12)
				v-tabs(fixed icons centered)
					v-tabs-bar(dark color="primary")
						v-tabs-slider(color="yellow")
						v-tabs-item(v-for="justification in justifications" :key="justification.id" :href="'#' + justification.id")
							v-icon(large) {{ justification.icon }}
							| {{ justification.title }}
					v-tabs-items
						v-tabs-content(v-for="justification in justifications" :key="justification.id" :id="justification.id")
							v-card(flat)
								v-card-text
									v-flex(xs12)
										v-text-field(
											:label="'Pregunta principal: ' + justification.title"
											v-model.trim="justificationsValues[justification.id].question"
											:id="justificationsValues[justification.id].question"
											required
											:readonly="employee"
										)
										div(v-for="(option, index) in 4")
											v-text-field(
												:label="'Opción ' + (index + 1)"
												v-model.trim="justificationsValues[justification.id].options[index]"
												:required="index <= 1"
												:readonly="employee"
											)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex(fill-height xs12 offset-xs5)
				v-btn#submit(v-if="!employee" large outline :loading="loading" :disabled="loading || $v.$invalid" @click.native="updatePoll" color="primary") Guardar cambios
					span.custom-loader(slot="loader")
						v-icon(light) cached
		v-layout.my-5(row wrap)
			v-flex(xs12)
				span.display-1.my-5 Resultados
				v-divider
			v-flex(xs12)
				highcharts(:options="optionsChartGlobal" ref="highcharts")
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Se han guardado todos los cambios
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialog = false") Permanecer aquí
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
		v-dialog(v-model="dialogSelectLocal" persistent max-width="500")
			v-card
				v-card-title(class="headline") Seleccioná un local
				v-card-text
					v-flex(xs12)
						v-select(
							label="Elegir un Local"
							v-model="localAssessment"
							:items="localNew"
							:readonly="employee"
							required
						)
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="toAssessment") Ir a Encuesta
						v-btn(color="green darken-1" flat @click.native="dialogSelectLocal = false") Cancelar
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		mixins: [validationMixin],
		validations: {
			question: { required },
			//local: { required },
			context: { required },
			background: { required },
		},
		data() {
			return {
				poll: false,
				localAssessment: null,
				question: null,
				local: null,
				localNew: [],
				context: null,
				permalink: null,
				locals: [],
				assessments: null,
				localsSelect: [],
				contextsSelect: [],
				localArray: [],
				loader: null,
				loading: false,
				dialog: false,
				dialogSelectLocal: false,
				background: null,
				file: null,
				localId: null,
				employee: true,
				userStorage: JSON.parse(localStorage.getItem('user')),
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
				justificationsValues: {
					veryGood: { question: null, options: [] },
					good: { question: null, options: [] },
					bad: { question: null, options: [] },
					veryBad: { question: null, options: [] },
				},
				justifications: [{
					id: 'veryGood',
					icon: 'sentiment_very_satisfied',
					title: 'Muy Bueno',
					display: 'block',
				}, {
					id: 'good',
					icon: 'sentiment_satisfied',
					title: 'Bueno',
					display: 'none',
				}, {
					id: 'bad',
					icon: 'sentiment_dissatisfied',
					title: 'Malo',
					display: 'none',
				}, {
					id: 'veryBad',
					icon: 'sentiment_very_dissatisfied',
					title: 'Muy Malo',
					display: 'none',
				}
			]}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
			 local() {
				if (this.locals.length) {
					const INDEX = this.locals.findIndex(local => local.title == this.local)
					const LOCAL = this.locals[INDEX]
					//this.localId = this.locals[INDEX].id
				}
			},
			localNew() {
				let localArray = []
				try {
					for(let local of this.localNew) {
						const INDEX = this.locals.findIndex(localDB => localDB.title == local)
						localArray.push({id: this.locals[INDEX].id, title: this.locals[INDEX].title})
					}
					this.localArray = localArray
				}
				catch(e) {}
			}
		},
		async created() {
			this.$firebase.firestore().doc('users/' + this.userStorage.id)
			.onSnapshot(doc => {
				if (doc.data().privileges == "Administrador") this.employee = false
			})

			let assessments = this.$firebase.firestore().collection('assessments').where('poll', '==', this.$route.params.id)
			assessments.onSnapshot(querySnapshot => {
				this.assessments = []
				querySnapshot.forEach(doc => {
					let assessment = doc.data()
					assessment.id = doc.id
					this.assessments.unshift(assessment)
				})
				this.getChartGlobal()
			})

			this.$firebase.firestore().doc('polls/' + this.$route.params.id)
			.onSnapshot(doc => {
				this.poll = doc.data()
				this.question = doc.data().question
				this.local = doc.data().locals
				this.localArray = this.local
				for (let local of this.local) {
					this.localNew.push(local.title)
				}
				//this.localId = doc.data().local.id
				this.context = doc.data().context
				this.justificationsValues = doc.data().justifications
				this.permalink = '/assessment/' + this.$route.params.id
			})

			let imageRef = this.$firebase.storage().ref().child('polls/backgrounds/' + this.$route.params.id)
    	this.background = await imageRef.getDownloadURL()

			let locals = this.$firebase.firestore().collection("locals").where("business", "==", this.userStorage.business)
			locals.onSnapshot(querySnapshot => {
				this.locals = []
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					this.locals.unshift(local)
					this.localsSelect.push(local.title)
				})
			})

			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
			business.onSnapshot(doc => {
				this.contextsSelect = doc.data().contexts
			})
		},
		methods: {
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
				this.optionsChartGlobal.title.text = "Valoraciones realizadas hasta la fecha:" + this.assessments.length
				this.optionsChartGlobal.series[0].data[0].y = numVeryGood
				this.optionsChartGlobal.series[0].data[1].y = numGood
				this.optionsChartGlobal.series[0].data[2].y = numBad
				this.optionsChartGlobal.series[0].data[3].y = numVeryBad
				this.assessments.stats = { veryGood: numVeryGood, good: numGood, bad: numBad, veryBad: numVeryBad }
			},

			uploadClick() {
				document.getElementById('background').click()
			},

			toAssessment() {
				for (let local of this.locals) {
					if (local.title == this.localAssessment) {
						this.dialogSelectLocal = false
						this.$router.push(this.permalink + '/local/' + local.id)
						break
					}
				}
				//this.$router.go(this.permalink)
			},

			writeFile(event) {
				const BACKGROUND = document.getElementById('background')
				const UPLOAD_FILE = document.getElementById('uploadFile')

				this.file = event.srcElement.files[0]
				console.log(this.background)
				if (!background.value.length) return false
				UPLOAD_FILE.innerHTML = background.files[0].name
				this.selectedFile = true
			},

			uploadFile(id) {
				const STORAGE_REF = this.$firebase.storage().ref()
				const POLL_REF = this.$firebase.firestore().doc("polls/" + id)
				const FILE = this.file
				const METADATA = { contentType: FILE.type }
				const UPLOAD = STORAGE_REF.child("polls/backgrounds/" + id).put(FILE, METADATA)
				
				UPLOAD.then(() => {
					this['loading'] = false
					this.loader = null
					this.poll = id
					this.dialog = true
				})
				UPLOAD.catch((error) => { console.log(error) })
			},

			updatePoll() {
				this.loader = 'loading'
				let poll = this.$firebase.firestore().doc("polls/" + this.$route.params.id)
				poll.update({
					question: this.question,
					locals: this.localArray,
					context: this.context,
					justifications: this.justificationsValues,
					business: this.userStorage.business
				})
				.then(() => {
					if (this.file) this.uploadFile(this.$route.params.id)
					else {
						this['loading'] = false
						this.loader = null
						this.dialog = true
					}
				})
			},
			selectLocal() {
				this.dialogSelectLocal = true
			}
		}
	}
</script>

<style lang="sass" scoped>
	a
		text-decoration: none
	.hidden
		display: none
	.custom-loader
		animation: loader 1s infinite
		display: flex

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

