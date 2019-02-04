<template lang="pug">
	v-app#app(v-if="backgroundImage" :style="{ 'background-image': 'url(' + backgroundImage + ')' }")
		v-stepper#stepper.stepper(v-model="step")
			v-stepper-header
				v-stepper-step(step="1" :complete="step > 1") Encuesta de Satisficación
				v-divider
				v-stepper-step(step="2" :complete="step > 2") Servicio Utilizado
				v-divider
				v-stepper-step(step="3" :complete="step > 3") Indicá el Motivo
				v-divider
				v-stepper-step(step="4") Te contactamos
			v-stepper-items
				v-stepper-content(step="1")
					p.question.pb-5 {{ poll.question }}
					v-card.card(class="mb-5")
						div.options
							img(v-for="face in faces" @click="getAssessment(face.title)" :src="face.url")
				v-stepper-content(step="2")
					p.question.pb-5(v-html="justificationLoad.question")
					v-card.card(class="mb-5" style="padding-top: 5px;")
						div.options.justification(v-for="service in services")
							img(@click="getJustification(service.title)" :src="service.url" width=138 height=118)
							span.justification-span {{ service.title }}
					v-btn.back-button(color="primary" @click.native="step--") Volver
				v-stepper-content(step="3")
					p.question.pb-5(v-html="justificationTwoLoad.question")
					v-card.card(class="mb-5" style="padding-top: 5px;")
						div.options
							img(v-for="reason in reasons" @click="getJustificationTwo(reason.title)" :src="reason.url" width=173 height=143)
					v-btn.back-button(color="primary" @click.native="step--") Volver
				v-stepper-content(step="4")
					p.question Dejanos tu comentario
					v-card.contact
						v-container
							v-layout(row wrap)
								v-flex(xs12 md6)
									v-text-field(
										label=" Email"
										prepend-icon="email"
										v-model.trim="email"
										required
										ref="email"
										id="email"
									)
								v-flex(xs12 md6)
									v-text-field(
										label="Teléfono"
										prepend-icon="phone"
										v-model.trim="telephone"
										ref="telephone"
										id="telephone"
									)
								v-flex.pb-3(xs12)
									v-text-field(
										label="Mensaje"
										v-model.trim="description"
										multi-line
										required
										ref="message"
										id="message"
									)
								v-btn(color="primary" :loading="loading" :disabled="loading || $v.$invalid || !description" @click.native="createAssessment") Enviar datos
									span.custom-loader(slot="loader")
										v-icon(light) cached
								v-btn(color="primary" :loading="loading" :disabled="loading" @click.native="createAssessment") Omitir
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Gracias por tu colaboración. Tu valoración está ayudando a que brindemos un mejor servicio cada día.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="finalize") Entendido
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email, sameAs } from 'vuelidate/lib/validators'
	import axios from 'axios'

	export default {
		mixins: [validationMixin],
		validations: {
			email: { email, required },
		},
		data() {
			return {
				i: 0,
				userStorage: JSON.parse(localStorage.getItem('user')),
				timer: null,
				loader: null,
				loading: false,
				poll: { question: null },
				justificationLoad: {
					question: null,
					options: [],
				},
				justificationTwoLoad: {
					question: null,
					options: [],
				},
				backgroundImage: null,
				step: 1,
				faces: {
					veryGood: { url: "./../../../static/faces/very-good.png", title: 'veryGood' },
					good: { url: "./../../../static/faces/good.png", title: 'good' },
					bad: { url: "./../../../static/faces/bad.png", title: 'bad' },
					veryBad: { url: "./../../../static/faces/very-bad.png", title: 'veryBad' },
				},
				services: {
					0: { url: "./../../../static/services/pago-facil.png", title: '' },
					1: { url: "./../../../static/services/envio-internacional.png", title: '' },
					2: { url: "./../../../static/services/pago-facil.png", title: '' },
					3: { url: "./../../../static/services/casa-cambio.png", title: '' },
				},
				reasons: {
					0: { url: "./../../../static/reasons/atencion-cajero.png", title: 'Atención del Cajero' },
					1: { url: "./../../../static/reasons/tiempo-espera.png", title: 'Tiempo de Espera' },
					2: { url: "./../../../static/reasons/estado-local.png", title: 'Estado del Local' },
					3: { url: "./../../../static/reasons/servicio-utilizado.png", title: 'Servicio Utilizado' },
				},
				assessment: null,
				justification: null,
				justificationTwo: null,
				email: null,
				telephone: null,
				description: null,
				complain: 0,
				comment: null,
				flow: {
					justification: false,
					justificationTwo: false,
					contact: false
				},
				dialog: false,
				local: null,
			}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
			step() {
				//console.log("HERE")
				const STEPPER = document.getElementById("stepper")
				STEPPER.style.height = '460px'
				this.i = 0

				//console.log(this.timer)
				
				if (this.step == 1) {
					clearInterval(this.timer)
					this.timer = null
				}
				else {
					if (!this.timer) this.timer = setInterval(() => { this.waiting(this.i) }, 1000)
					this.step == 4 ? STEPPER.style.height = '100%' : STEPPER.style.height = '500px'
				}
			},
			email() { this.i = 0 },
			telephone() { this.i = 0 },
			description() { this.i = 0 },
			dialog() {
				if (this.dialog) {
					this.timer = setInterval(() => { this.waiting(this.i) }, 300)
				}
				else {
					this.timer = null
				}
			}
		},

		destroyed() {
			clearInterval(this.timer)
		},

		methods: {
			async waiting(i) {
				i++
				//console.log(i)
				if (i == 15) {
					clearInterval(this.timer)
					if (!this.dialog) await this.createAssessment()
					else this.finalize()
					this.i = 0
					this.step = 1
				}
				this.i = i
			},
			
			getAssessment(option) {
				this.step = 2
				this.assessment = option
				for (let service in this.services) {
					if (!this.local.exchange && service == 3) {
						delete this.services[3]
						break
					}
					this.services[service].title = this.poll.justifications[option].options[service]
				}
				this.justificationLoad = this.poll.justifications[option]
				this.justificationTwoLoad = this.poll.justificationsTwo[option]
			},

			getJustification(option) {
				this.step = 3
				this.justification = option
				this.flow.justification = true
			},

			getJustificationTwo(option) {
				this.step = 4
				this.justificationTwo = option
				this.flow.justificationTwo = true
			},

			createAssessment() {
				clearInterval(this.timer)
				this.i = 0
				if (this.description) { 
					this.flow.contact = true
					if (this.assessment == "bad" || this.assessment == "veryBad") this.complain = 1
					if (this.assessment == "veryGood" || this.assessment == "good") this.comment = 1
				}
				// const ASSESSMENT_COLLECTION = this.$firebase.firestore().collection('assessments')
				this.loader = 'loading'

				console.log(new Date())

				const urlAssessment = 'http://174.36.119.3:8080/firestore/assessment/add/'
				axios.post(urlAssessment, {
				 	face: this.assessment,
				 	date: new Date(),
				 	flow: this.flow,
				 	justification: this.justification,
				 	justificationTwo: this.justificationTwo,
					poll: 'D2KzOzdiM8dCmUw7idIW',
					zone: this.local.zone,
					region: this.local.region,
				 	business: this.poll.business,
				 	local: this.$route.params.localId,
				 	complain: this.complain,
					comment: this.comment					
				})
				.then(res => {
				 	if (this.flow.contact && this.email) this.createTicket(res.data)
				 	else {
				 		this['loading'] = false
				 		this.loader = null
						this.dialog = true
					}
				})
				.catch(err => console.log(err))

				// ASSESSMENT_COLLECTION.add({
				// 	face: this.assessment,
				// 	date: new Date(),
				// 	flow: this.flow,
				// 	justification: this.justification,
				// 	justificationTwo: this.justificationTwo,
				// 	poll: this.$route.params.id,
				// 	business: this.poll.business,
				// 	local: this.$route.params.localId,
				// 	complain: this.complain,
				// 	comment: this.comment
				// })
				// .then(() => {
				// 	if (this.flow.contact) this.createTicket()
				// 	else {
				// 		this['loading'] = false
				// 		this.loader = null
				// 		this.dialog = true
				// 	}
				// })
				// .catch((error) => { console.log(error) })
			},

			createTicket(assessment) {
				const urlTicket = 'http://174.36.119.3:8080/firestore/ticket/add/'
				axios.post(urlTicket, {
				 	date: new Date(),
				 	description: this.description,
				 	email: this.email,
				 	telephone: this.telephone,
					complain: this.complain,
				 	comment: this.comment,
				 	answer: null,
					status: 0,
					zone: this.local.zone,
					region: this.local.region,
				 	business: this.local.business,
				 	local: this.$route.params.localId,
					poll: 'D2KzOzdiM8dCmUw7idIW',
					assessment: assessment
				})
				// const TICKETS_COLLECTION = this.$firebase.firestore().collection('tickets')
				// TICKETS_COLLECTION.add({
				// 	date: new Date(),
				// 	description: this.description,
				// 	email: this.email,
				// 	telephone: this.telephone,
				// 	complain: this.complain,
				// 	comment: this.comment,
				// 	answer: null,
				// 	status: 0,
				// 	business: this.local.business,
				// 	local: this.$route.params.localId,
				// 	poll: this.$route.params.id
				// })
				.then(() => {
						this['loading'] = false
						this.loader = null
						this.dialog = true

						let resetTicket = {
							email: null,
							telephone: null,
							description: null,
							complain: 0
						}
						this.ticket = resetTicket
				})
				.catch((error) => { console.log(error) })			
			},

			finalize() {
				//console.log("FINALIZE")
				clearInterval(this.timer)
				this.dialog = false,
				this.timer = null,
				this.step = 1
				this.email = null
				this.telephone = null
				this.description = null
				this.complain = 0
				this.comment = 0
				this.flow = { contact: false, justification: false, justificationTwo: false }
				this.i = 0
				//location.reload()
			}
		},

		async created() {
			localStorage.setItem('assessment', 'assessment/' + this.$route.params.id + '/local/' + this.$route.params.localId)
			
			// let poll = this.$firebase.firestore().doc('polls/' + this.$route.params.id)
			// //console.log(poll)
			// poll.onSnapshot(doc => {
			// 	//.log(doc.data())
			// 	//this.poll = doc.data()
			// })

			//console.log(this.$firebase.firestore().doc('locals/' + this.$route.params.localId))

			// let local = this.$firebase.firestore().doc('locals/' + this.$route.params.localId)
			// local.onSnapshot(doc => {
			// 	this.local = doc.data()
			// 	//console.log(doc.data())
			// })

			// const urlPoll = `http://174.36.119.5:443/firestore/poll/${this.$route.params.id}`
			// axios.get(urlPoll)
			// .then(data => {
			// 	console.log(data)
			// 	this.poll = data.data
			// })
			// .catch(err => console.log(err))

			// const urlLocal = `http://174.36.119.5:443/firestore/local/${this.$route.params.localId}`
			// axios.get(urlLocal)
			// .then(data => {
			// 	console.log(data)
			// 	this.local = data.data
			// })
			// .catch(err => console.log(err))

				axios.post('http://174.36.119.3:8080/firestore/all', {
					local: this.$route.params.localId,
					poll: this.$route.params.id
				})
				.then(res => {
					console.log(res)
					this.local = res.data.local
					this.poll = res.data.poll
				})
				.catch(err => console.log(err))
			
			//let imageRef = this.$firebase.storage().ref().child('polls/backgrounds/' + this.$route.params.id)
			//console.log(this.$firebase.storage())
			//this.backgroundImage = await imageRef.getDownloadURL()
			//this.backgroundImage = 'http://174.36.119.5/background'
			this.backgroundImage = 'white'
		},

		mounted() {
			const ELEMENTS = ["email", "telephone", "message"]
			addEventListener('keyup', (event) => {
				let active = ELEMENTS.indexOf(document.activeElement.id) + 1
				if (active === 3) active = 0
				event.preventDefault()
				if (event.keyCode === 13)
					if (!this.description)
						if (this.$v.email.$invalid) {
							this.$refs.email.focus()
						} else
							this.$refs[ELEMENTS[active]].focus()
					else if (!this.$v.$invalid && this.description)
						this.createAssessment()
			})
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
	.justification
		display: grid
		justify-content: center
		padding-right: 30px
		img
			justify-self: center
			padding: 0 !important
		.justification-span
			text-align: center
			font-size: 20px
			font-weight: bold

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
	body, html
		height: 100%
	#app
		background-size: cover
		height: 100%
		position: relative
		.stepper
			position: absolute
			top: 0
			bottom: 0
			left: 0
			right: 0
			height: 400px
			background-color: rgba(255, 255, 255, 0.8)
			margin: auto
			.question
				display: block
				font-size: 36px
				text-align: center
			.card
				background-color: rgba(255, 255, 255, 0.0) !important
				display: flex
				justify-content: center
				align-items: center
				.contact
					input
						padding-left: 20px
				.options
					cursor: pointer
					img
						padding-left: 30px
					button
						font-size: 12px
						width: 200px !important
						height: 50px
	@media (max-width: 750px)
		.stepper
			height: 100% !important
			overflow-y: auto
	@media (max-width: 663px)
		img
			padding-left: 0 !important
	@media (max-width: 663px)
		img
			padding-left: 25px !important
	@media (max-width: 643px) and (min-width: 572px)
		img
			margin-right: 20px
			padding-left: 70px !important
			width: 250px
	@media (max-width: 955px)
		button
			display: block
			padding: 0
			margin: 0 0 20px 0
	@media (max-width: 1264px)
		.card
			display: grid
	@media (max-height: 600px)
		.stepper
			height: 85% !important
	@media (min-height: 730px)
		.stepper
			height: 70% !important
</style>

<style lang="sass">
	textarea
		resize: none
</style>