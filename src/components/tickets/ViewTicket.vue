<template lang="pug">
	v-container(v-if="ticket" grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Ticket Nro: {{ this.$route.params.id }}
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
					v-model.trim="ticket.local.title"
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
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline to="/tickets/") Regresar
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
				ticket: {
					email: null,
					telephone: null,
					description: null,
					local: { title: null, id: null },
					poll: null
				},
			}
		},

		created() {
			let ticket = this.$firebase.firestore().doc('tickets/' + this.$route.params.id)
			ticket.get().then(doc => {
				this.ticket = doc.data()
				if (!this.ticket.leido) {
					ticket.update({
						business: this.ticket.business,
						date: this.ticket.date,
						description: this.ticket.description,
						email: this.ticket.email,
						leido: !this.ticket.leido,
						local: this.ticket.local,
						poll: this.ticket.poll,
						telephone: this.ticket.telephone
					})
					.then(() => console.log('Actualizado correctamente VIEW'))
				}
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

<style lang="sass">
	textarea
		resize: none !important
</style>
