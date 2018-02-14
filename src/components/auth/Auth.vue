<template lang="pug">
	v-app.app
		.container
			.card
			.card
				h1.title NET-PROMOTER-SCORE
				form
					.input-container
						v-text-field(
							label="Email"
							v-model="email"
							:error-messages="emailErrors"
							@input="$v.email.$touch()"
							@blur="$v.email.$touch()"
							required
						)
						v-text-field(
							type="password"
							label="Contraseña"
							v-model="password"
							:error-messages="passwordErrors"
							@input="$v.password.$touch()"
							@blur="$v.password.$touch()"
							required
						)
					.button-container
						v-btn(outline :loading="loading" @click.native="signIn" :disabled="loading || $v.formSignIn.$invalid" color="primary") INGRESAR
							span.custom-loader(slot="loader")
								v-icon(light) cached
					v-snackbar(top right :timeout="timeout" v-model="snackbar") {{ error }}
						v-btn(dark flat @click.native="snackbar = false") Cerrar
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") !Bienvenido!
				v-card-text 
					| Tu cuenta ha sido habilitada correctamente. Para continuar ingresa una nueva contraseña de ocho caracteres como mínimo.
					v-text-field(
						label="Contraseña" 
						v-model="newPassword" 
						type="password"
						:error-messages="newPasswordErrors"
						@input="$v.newPassword.$touch()"
						@blur="$v.newPassword.$touch()"
						required
					)
					v-text-field(
						label="Confirmar Contraseña" 
						v-model="passwordConfirm" 
						type="password"
						:error-messages="passwordConfirmErrors"
						@input="$v.passwordConfirm.$touch()"
						@blur="$v.passwordConfirm.$touch()"
						required
					)
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="continueSignIn" :disabled="$v.formPassword.$invalid") Entendido
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
	import router from '@/router/'
	export default {
		mixins: [validationMixin],
		validations: {
			email: { required, email },
			password: { required },
			newPassword: { required, minLength: minLength(8) },
			passwordConfirm: { required, minLength: minLength(8), sameAs: sameAs('newPassword') },
			formSignIn: ['email', 'password'],
			formPassword: ['newPassword', 'passwordConfirm']
		},

		data () {
			return {
				email: null,
				password: null,
				newPassword: null,
				passwordConfirm: null,
				loader: null,
				loading: false,
				snackbar: false,
				timeout: 6000,
				error: null,
				dialog: false,
				user: null,
			}
		},

		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
				setTimeout(() => (this[l] = false), 3000)
				this.loader = null
			},
		},

		methods: {
			signIn () {
				this.loader = 'loading'
				this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
				.then((user) => this.getUser(user))
				.catch((error) => {
					console.log(error)
					this.showErrors(error)
				})
			},

			getUser(user) {
				this.$firebase.firestore().doc('users/' + user.uid).get()
				.then((doc) => {
					const USER = doc.data()
					USER.id = doc.id
					this.user = USER
					this.saveStorage()
				})
			},

			saveStorage() {
				localStorage.setItem('user', JSON.stringify(this.user))
				localStorage.setItem('assessment', '/polls/')
				this.verifyUser()
			},

			verifyUser() {
				this.user.status == 'Pendiente' ? this.dialog = true : router.push('/dashboard')
			},

			continueSignIn() {
				this.$firebase.auth().onAuthStateChanged((user) => {
          user.updatePassword(this.newPassword)
					this.$firebase.firestore().doc("users/" + user.uid).update({
						name: this.user.name,
						email: this.user.email,
						business: this.user.business,
						privileges: this.user.privileges,
						status: 'Activo'
					})
					
					.then(() => router.push('/dashboard'))
				})
			},

			showErrors(error) {
				switch(error.code) {
					case "auth/user-not-found":
						this.error = "El usuario no existe"
					break
					case "auth/wrong-password":
						this.error = "Contraseña incorrecta"
					break
					default:
						this.error = "Ha ocurrido un error en la autenticación. Intente de nuevo."
					break
				}
				this.snackbar = true
			},
		},

		computed: {
			emailErrors () {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.email && errors.push('El email es inválido')
				!this.$v.email.required && errors.push('El email es obligatorio')
				return errors
			},

			passwordErrors () {
				const errors = []
				if (!this.$v.password.$dirty) return errors
				!this.$v.password.required && errors.push('La contraseña es obligatoria')
				return errors
			},

			newPasswordErrors () {
				const errors = []
				if (!this.$v.newPassword.$dirty) return errors
				!this.$v.newPassword.required && errors.push('La contraseña es obligatoria')
				!this.$v.newPassword.minLength && errors.push('La contraseña debe contener ocho caracteres como mínimo')
				return errors
			},

			passwordConfirmErrors() {
				const errors = []
				if (!this.$v.passwordConfirm.$dirty) return errors
				!this.$v.passwordConfirm.required && errors.push('Debe confirmar la contraseña')
				!this.$v.passwordConfirm.sameAs && errors.push('Las contraseñas no coinciden')
				return errors
			}
		}
	}
</script>

<style lang="sass" scoped>
$accent: null
$white: #ffffff
$black: #000000
$dark-gray: lighten($black, 20%)
$gray: lighten($black, 40%)
$light-gray: lighten($black, 60%)
$lighter-gray: lighten($black, 80%)
$primary: #363636
$accent: #006064
$max-width: 460px

body, html
	height: 100%
body
	background: #000 !important
	color: #fff
	font-family: 'RobotoDraft', 'Roboto', sans-serif
	font-size: 14px
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale
	.app
		background: url('../../../static/background-auth.png') no-repeat center
		background-size: cover
		height: 100%
		.pen-title
			padding: 50px 0
			text-align: center
			letter-spacing: 2px
			h1
				margin: 0 0 20px
				font-size: 48px
				font-weight: 300
			span
				font-size: 12px
		.container
			position: relative
			max-width: $max-width
			width: 100%
			margin: 0 auto 100px
			.card
				position: relative
				background: $white
				border-radius: 5px
				padding: 60px 0 40px 0
				box-sizing: border-box
				transition: .3s ease
				&:first-child
					background: darken($white, 2%)
					height: 10px
					border-radius: 5px 5px 0 0
					margin: 0 10px
					padding: 0
				.title
					position: relative
					z-index: 1
					border-left: 5px solid $accent
					margin: 0 0 35px
					padding: 10px 0 10px 50px
					color: $accent
					font-size: 30px !important
					font-weight: 600
					text-transform: uppercase
				.input-container
					position: relative
					margin: 0 60px 50px
				.button-container
					margin: 0 60px
					text-align: center
					button
						cursor: pointer
						position: relative
						display: inline-block
						background: 0
						width: 240px
						border: 2px solid #e3e3e3
						padding: 20px 0
						font-size: 22px
						font-weight: 600
						line-height: 1
						text-transform: uppercase
						overflow: hidden
						-webkit-transition: .3s ease
						transition: .3s ease
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