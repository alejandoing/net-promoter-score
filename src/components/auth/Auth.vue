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
						v-btn(outline :loading="loading" @click.native="signIn" :disabled="loading || $v.$invalid" color="primary") INGRESAR
							span.custom-loader(slot="loader")
								v-icon(light) cached
					v-snackbar(top right :timeout="timeout" v-model="snackbar") {{ text }}
						v-btn(dark flat @click.native="snackbar = false") Close
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	import router from '@/router/'
	export default {
		name: 'Auth',
    mixins: [validationMixin],
    validations: {
      email: { required, email },
      password: { required },
    },
    data () {
      return {
        email: null,
				password: null,
        loader: null,
        loading: false,
        snackbar: false,
        timeout: 6000,
        text: null
      }
		},
    watch: {
      loader () {
				const l = this.loader
        this[l] = !this[l]
				setTimeout(() => (this[l] = false), 3000)
        this.loader = null
      }
    },
    methods: {
      signIn () {
				this.loader = 'loading'
        this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
					console.log(user)
					const GET_USER = this.$firebase.firestore().doc('users/' + user.uid).get()
					GET_USER.then((doc) => {
						let user = doc.data()
						user.id = doc.id
						localStorage.setItem('user', JSON.stringify(user))
						router.push('/dashboard')
					})
				})
				.catch((error) => {
					console.log(error)
					this.showSnackbar(error)
				})
			},
			showSnackbar(error) {
				switch(error.code) {
					case "auth/user-not-found":
						this.text = "El usuario no existe"
					break
					case "auth/wrong-password":
						this.text = "Contraseña incorrecta"
					break
					default:
						this.text = "Ha ocurrido un error en la autenticación. Intente de nuevo."
					break
				}
				this.snackbar = true
			}
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