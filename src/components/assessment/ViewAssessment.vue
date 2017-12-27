<template lang="pug">
	v-app#app(v-if="backgroundImage" :style="{ 'background-image': 'url(' + backgroundImage + ')' }")
		v-stepper#stepper.stepper(v-model="step")
			v-stepper-header
				v-stepper-step(step="1" :complete="step > 1") Encuesta de Satisficación
				v-divider
				v-stepper-step(step="2" :complete="step > 2") Justifique su Respuesta
				v-divider
				v-stepper-step(step="3") Te contactamos
			v-stepper-items
				v-stepper-content(step="1")
					p.question.pb-5 {{ poll.question }}
					v-card.card(class="mb-5")
						div.options
							img(v-for="face in faces" @click="getAssessment(face.title)" :src="face.url")
				v-stepper-content(step="2")
					p.question.pb-5(v-html="justificationLoad.question")
					v-card.card(class="mb-5" style="padding-top: 5px")
						div.options
							v-btn(v-for="option in justificationLoad.options" :key="option" @click="getJustification(option)" color="info" v-html="option")
					v-btn(color="primary" @click.native="step--") Volver
				v-stepper-content(step="3")
					p.question Podés dejarnos tu contacto
					v-card.contact
						v-container
							v-layout(row wrap)
								v-flex(xs12 md6)
									v-text-field(
										label=" Email"
										prepend-icon="email"
										v-model.trim="ticket.email"
										required
									)
								v-flex(xs12 md6)
									v-text-field(
										label="Teléfono"
										prepend-icon="phone"
										v-model.trim="ticket.telephone"
									)
								v-flex.pb-3(xs12)
									v-text-field#puto(
										label="Mensaje"
										v-model.trim="ticket.description"
										multi-line
										style="resize: none !important"
									)
								v-btn(color="primary" :loading="loading" :disabled="loading" @click.native="createAssessment") Enviar datos
									span.custom-loader(slot="loader")
										v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Gracias por tu colaboración. Tu valoración está ayudando a que brindemos un mejor servicio cada día.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="finalize") Entendido
</template>

<script>
export default {
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
			backgroundImage: null,
			step: 1,
			faces: {
				veryGood: { url: "./../../../static/faces/very-good.png", title: 'veryGood' },
				good: { url: "./../../../static/faces/good.png", title: 'good' },
				bad: { url: "./../../../static/faces/bad.png", title: 'bad' },
				veryBad: { url: "./../../../static/faces/very-bad.png", title: 'veryBad' },
			},
			assessment: null,
			justification: null,
			ticket: {
				email: null,
				telephone: null,
				description: null,
			},
			flow: {
				justification: false,
				contact: false
			},
			dialog: false
		}
	},
	watch: {
		loader () {
			const l = this.loader
			this[l] = !this[l]
		},
		step() {
			const STEPPER = document.getElementById("stepper")
		
			STEPPER.style.height = '400px'
			if (this.step == 1) {
				clearInterval(this.timer)
				this.timer = null
				this.i = 0
			}
			else {
				if (!this.timer) this.timer = setInterval(() => { this.waiting(this.i) }, 1000)
				if (this.step == 3) STEPPER.style.height = '80%'
			}
		}
	},

	methods: {
		async waiting(i) {
			console.log(i)
			i++
			if (i == 20) {
				clearInterval(this.timer)
				await this.createAssessment()
				this.i = 0
				this.step = 1
			}
			this.i = i
		},
		getAssessment(option) {
			this.step = 2
			this.assessment = option
			this.justificationLoad = this.poll.justifications[option]
		},

		getJustification(option) {
			this.step = 3
			this.justification = option
			this.flow.justification = true
		},

		createAssessment() {
			if (this.ticket.description) this.flow.contact = true
			const ASSESSMENT_COLLECTION = this.$firebase.firestore().collection('assessments')
			this.loader = 'loading'

			ASSESSMENT_COLLECTION.add({
				face: this.assessment,
				date: new Date(),
				flow: this.flow,
				justification: this.justification,
				poll: this.$route.params.id,
				business: this.userStorage.business,
				local: this.poll.local
			})
			.then(() => {
				if (this.flow.contact) this.createTicket()
				else {
					this['loading'] = false
					this.loader = null
					this.dialog = true
				}
			})
			.catch((error) => { console.log(error) })
		},

		createTicket() {
			const TICKETS_COLLECTION = this.$firebase.firestore().collection('tickets')
			TICKETS_COLLECTION.add({
				date: new Date(),
				description: this.ticket.description,
				email: this.ticket.email,
				telephone: this.ticket.telephone,
				leido: false,
				business: this.userStorage.business,
				local: this.poll.local,
				poll: this.$route.params.id
			})
			.then(() => {
					this['loading'] = false
					this.loader = null
					this.dialog = true

					let resetTicket = {
						email: null,
						telephone: null,
						description: null
					}
					this.ticket = resetTicket
			})
			.catch((error) => { console.log(error) })			
		},

		finalize() {
			this.dialog = false,
			this.step = 1
		}
	},

  async created() {
		console.log(this.routePoll)
		let poll = this.$firebase.firestore().doc('polls/' + this.$route.params.id)
		poll.onSnapshot(doc => this.poll = doc.data())

    let imageRef = this.$firebase.storage().ref().child('polls/backgrounds/' + this.$route.params.id)
		this.backgroundImage = await imageRef.getDownloadURL()
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
			margin: auto
			.question
				display: block
				font-size: 48px
				text-align: center
			.card
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
						width: 300px !important
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
	@media (min-height: 893px)
		.stepper
			height: 80%
</style>

<style lang="sass">
	textarea
		resize: none
</style>



