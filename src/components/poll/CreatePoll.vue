<template lang="pug">
	v-container(grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Nueva Encuesta
					v-divider
			v-flex(xs12 md6)
				v-text-field(
					label="Pregunta Principal"
					v-model.trim="question"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Local"
					v-model="local"
					:items="localsSelect"
					multiple
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Contexto"
					v-model="context"
					:items="contextsSelect"
					required
				)
			v-flex(xs12 md6).mb-5
				v-text-field#background.hidden(type="file" @change.native="writeFile($event)")
				v-btn#uploadFile(block color="primary" @click="uploadClick") Elegir background
		v-layout.pb-5(row wrap)
			v-flex(xs12)
				span.display-1.my-5 Servicios a Medir
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
										)
										div(v-for="(option, index) in 4")
											v-text-field(
												:label="'Opción ' + (index + 1)"
												v-model.trim="justificationsValues[justification.id].options[index]"
												:required="index <= 1"
										)
										v-layout.pa-2(row child-flex justify-center align-center wrap)
											v-flex(fill-height)
												v-btn(
													outline
													:disabled=`!justificationsValues.veryGood.options[0] || !justificationsValues.veryGood.options[1]`
													@click.native="duplicateOptions(0)" 
													color="primary"
													) 
													| Replicar Opciones

		v-layout.pb-5(row wrap)
			v-flex(xs12)
				span.display-1.my-5 Motivos
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
											v-model.trim="justificationsTwoValues[justification.id].question"
											:id="justificationsTwoValues[justification.id].question"
											required
										)
										div(v-for="(option, index) in 4")
											v-text-field(
												:label="'Opción ' + (index + 1)"
												v-model.trim="justificationsTwoValues[justification.id].options[index]"
												:required="index <= 1"
										)
										v-layout.pa-2(row child-flex justify-center align-center wrap)
											v-flex(fill-height)
												v-btn(
													outline
													:disabled=`!justificationsTwoValues.veryGood.options[0] || !justificationsTwoValues.veryGood.options[1]`
													@click.native="duplicateOptions(1)" 
													color="primary"
													) 
													| Replicar Opciones

		div(style="position: relative; bottom: 25px")
			v-layout.pa-5(row child-flex justify-center align-center wrap)
				v-flex(fill-height xs12 offset-xs5)
					v-btn#submit(
						large 
						outline 
						:loading="loading" 
						:disabled=`loading || $v.$invalid || 
							!justificationsValues.veryGood.question || !justificationsValues.good.question || 
							!justificationsValues.bad.question || !justificationsValues.veryBad.question || 
							!justificationsValues.veryGood.options[0] || !justificationsValues.veryGood.options[1] || 
							!justificationsValues.good.options[0] || !justificationsValues.good.options[1] || 
							!justificationsValues.bad.options[0] || !justificationsValues.bad.options[1] || 
							!justificationsValues.veryBad.options[0] || !justificationsValues.veryBad.options[1] ||
							!justificationsTwoValues.veryGood.question || !justificationsTwoValues.good.question || 
							!justificationsTwoValues.bad.question || !justificationsTwoValues.veryBad.question || 
							!justificationsTwoValues.veryGood.options[0] || !justificationsTwoValues.veryGood.options[1] || 
							!justificationsTwoValues.good.options[0] || !justificationsTwoValues.good.options[1] || 
							!justificationsTwoValues.bad.options[0] || !justificationsTwoValues.bad.options[1] || 
							!justificationsTwoValues.veryBad.options[0] || !justificationsTwoValues.veryBad.options[1]`
						@click.native="createPoll" 
						color="primary"
						) 
						| CREAR ENCUESTA
						span.custom-loader(slot="loader")
							v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text La encuesta se ha registrado correctamente
				v-card-actions
					v-spacer
					router-link(:to="'/polls/' + poll")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ver Encuesta
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
		v-dialog(v-model="dialogGuard" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Advertencia!
				v-card-text Antes de crear una encuesta es necesario haber registrado al menos un local. Por favor, registre un local y luego regrese a esta opción.
				v-card-actions
					v-spacer
					router-link(:to="'/locals/new/'")
						v-btn(color="green darken-1" flat @click.native="dialogGuard = false") Registrar Local
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialogGuard = false") Ir al Dashboard
		v-dialog(v-model="dialogFile" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Advertencia!
				v-card-text Solo se permite subir archivos en formato PNG o JPG. Por favor, seleccione un archivo diferente.
				v-card-actions
					v-spacer
					v-btn(color="green darken-1" flat @click.native="uploadClick") Seleccionar Otro Archivo
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialogGuard = false") Ir al Dashboard
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		name: 'Auth',
		mixins: [validationMixin],
		validations: {
			question: { required },
			local: { required },
			context: { required },
			background: { required },
		},
		data () {
			return {
				question: null,
				local: null,
				localId: null,
				localsSelect: [],
				locals: [],
				context: null,
				contextsSelect: [],
				background: null,
				loader: null,
				loading: false,
				justificationsValidation: false,
				justificationsTwoValidation: false,
				selectedFile: false,
				text: 'Encuesta creada satisfactoriamente',
				dialog: false,
				dialogGuard: false,
				dialogFile: false,
				poll: null,
				userStorage: JSON.parse(localStorage.getItem('user')),
				justificationsValues: {
					veryGood: { question: 'Nos alegra saberlo, ¿qué servicio utilizaste?', options: [ null, null ] },
					good: { question: 'Nos alegra saberlo, ¿qué servicio utilizaste?', options: [ null, null ] },
					bad: { question: 'Nos entristece saberlo, ¿qué servicio utilizaste?', options: [ null, null ] },
					veryBad: { question: 'Nos entristece saberlo, ¿qué servicio utilizaste?', options: [ null, null ] },
				},
				justificationsTwoValues: {
					veryGood: { question: '¿Qué fue lo que más te gustó?', options: [ null, null ] },
					good: { question: '¿Qué fue lo que más te gustó?', options: [ null, null ] },
					bad: { question: '¿Qué fue lo que no te gustó?', options: [ null, null ] },
					veryBad: { question: '¿Qué fue lo que no te gustó?', options: [ null, null ] },
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
		created() {
			let locals = this.$firebase.firestore().collection("locals").where("business", "==", this.userStorage.business)
			locals.onSnapshot(querySnapshot => {
				this.locals = []
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					this.locals.unshift(local)
					this.localsSelect.push(local.title)
				})
				if (!this.locals.length) this.dialogGuard = true
			})

			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
			business.onSnapshot(doc => {
				this.contextsSelect = doc.data().contexts
			})
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
			 local() {
				const INDEX = this.locals.findIndex(local => local.title == this.local)
				const LOCAL = this.locals[INDEX]
				this.localId = this.locals[INDEX].id
			},
			justificationsValues() {
				if (!justificationsValues.veryGood.question) return false
				if (!justificationsValues.good.question) return false
				if (!justificationsValues.bad.question) return false
				if (!justificationsValues.veryBad.question) return false
				this.justificationsValidation = true
			}
		},
		methods: {
			uploadClick() {
				document.getElementById('background').click()
				if (this.dialogFile) this.dialogFile = false
			},

			writeFile(event) {
				const BACKGROUND = document.getElementById('background')
				const UPLOAD_FILE = document.getElementById('uploadFile')

				this.background = event.srcElement.files[0]
				if (!background.value.length) return false
				if (background.files[0].type != 'image/jpeg' && background.files[0].type != 'image/png') this.dialogFile = true
				UPLOAD_FILE.innerHTML = background.files[0].name
				this.selectedFile = true
			},

			createPoll() {
				const POLLS_COLLECTION = this.$firebase.firestore().collection('polls')

				this.loader = 'loading'
				POLLS_COLLECTION.add({
					question: this.question,
					local: { title: this.local, id: this.localId },
					context: this.context,
					justifications: this.justificationsValues,
					justificationsTwo: this.justificationsTwoValues,
					business: this.userStorage.business
				})
				.then((poll) => { this.uploadFile(poll.id) })
				.catch((error) => { console.log(error) })
			},

			duplicateOptions(flow) {
				if (!flow) {
					this.justificationsValues.good.options = this.justificationsValues.veryGood.options
					this.justificationsValues.bad.options = this.justificationsValues.veryGood.options
					this.justificationsValues.veryBad.options = this.justificationsValues.veryGood.options
				}
				else if (flow == 1) {
					this.justificationsTwoValues.good.options = this.justificationsTwoValues.veryGood.options
					this.justificationsTwoValues.bad.options = this.justificationsTwoValues.veryGood.options
					this.justificationsTwoValues.veryBad.options = this.justificationsTwoValues.veryGood.options					
				}
			},

			uploadFile(id) {
				const STORAGE_REF = this.$firebase.storage().ref()
				const POLL_REF = this.$firebase.firestore().doc("polls/" + id)
				const FILE = this.background
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

