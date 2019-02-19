<template lang="pug">
	v-container(v-if="ticket" grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 
						| Ticket Nro: {{ this.$route.params.id }} -
						v-btn(v-if="ticket.complain" color="error") Queja
						v-btn(v-else color="success") Com. Positivo
			v-flex(xs12 md6)
				v-text-field(
					label="Email"
					v-model.trim="ticket.email"
					readonly
				)
			v-flex(xs12 md6)
				v-text-field(
					label="Teléfono"
					v-model.trim="ticket.telephone"
					readonly
				)
			v-flex(xs12 md6)
				v-text-field(
					label="Local"
					v-model.trim="localTitle"
					readonly
				)
			v-flex(xs12 md6)
				v-text-field(
					label="Código de Encuesta"
					v-model.trim="ticket.poll"
					readonly
				)
			v-flex(xs12)
				v-text-field(
					label="Descripción"
					v-model.trim="ticket.description"
					multi-line
					readonly
				)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs4)
				v-btn.action(large outline @click.native="dialog = true" v-if="ticket.answer") Ver Comentario
				v-btn.action(large outline @click.native="dialog = true" v-else) Comentar
				v-btn.action(large outline to="/tickets/") Regresar
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") Escribí tu comentario
				v-card-text
					v-flex(xs12)
						v-text-field(
							label="Comentario"
							v-model.trim="ticket.answer"
							:readonly="comment"
							multi-line
						)
				v-card-actions
					v-spacer
						v-btn(v-if="!comment" color="green darken-1" flat :loading="loading" @click.native="uploadComment") Enviar
							span.custom-loader(slot="loader")
								v-icon(light) cached
						v-btn(color="green darken-1" flat @click.native="dialog = false") Regresar
		v-dialog(v-model="dialogConfirm" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Tu comentario ha sido registrado
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="finalize") Entendido
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		name: 'Auth',
		mixins: [validationMixin],
		validations: {
			title: { required },
			province: { required },
			location: { required },
			street: { required },
		},

		data () {
			return {
				loader: null,
				loading: false,
				ticket: {
					email: null,
					telephone: null,
					description: null,
					local: null,
					poll: null
				},
				localTitle: null,
				dialog: null,
				dialogConfirm: null,
				comment: false
			}
		},

		async created() {
			let ticket = this.$firebase.firestore().doc('tickets/' + this.$route.params.id)
			await ticket.get().then(async doc => {
				this.ticket = doc.data()
				if (this.ticket.answer) this.comment = true
					ticket.update({
						status: 1
					})
					.then(() => console.log(''))
			})

			let localTitle = this.$firebase.firestore().doc('locals/' + this.ticket.local)
			localTitle.get().then(doc => {
				this.localTitle = doc.data().title
			})
		},

		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
		},

		methods: {
			updateLocal() {
				this.loader = 'loading'
				let local = this.$firebase.firestore().doc("locals/" + this.$route.params.id)
				local.update({
					title: this.title,
					province: this.province,
					location: this.location,
					street: this.street,
				})
				.then(() => {
					this['loading'] = false
					this.loader = null
					this.dialog = true
				})
			},

			async uploadComment() {
				this.loader = 'loading'
				let ticket = this.$firebase.firestore().doc('tickets/' + this.$route.params.id)
				await ticket.get().then(async doc => {
					if (this.ticket.answer) {
						ticket.update({
							assessment: this.ticket.assessment,
							business: this.ticket.business,
							date: this.ticket.date,
							description: this.ticket.description,
							email: this.ticket.email,
							local: this.ticket.local,
							poll: this.ticket.poll,
							telephone: this.ticket.telephone,
							comment: this.ticket.comment,
							answer: this.ticket.answer,
							status: 2
						})
						.then(() => {
							this['loading'] = false
							this.loader = null
							this.dialogConfirm = true
							this.comment = true
						})
					}
				})
			},

			finalize() {
				this.dialogConfirm = false
				this.dialog = false
			}
		}
	}
</script>

<style lang="sass" scoped>
	.action
		width: 200px
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

<style lang="sass">
	textarea
		resize: none !important
</style>
