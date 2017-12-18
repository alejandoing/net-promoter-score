<template lang="pug">
	v-container(grid-list-md)
		v-flex(xs-12)
			div.pb-5
				span.display-1 Nueva Encuesta
				hr
		form
			.input-container
				v-layout(row wrap)
					v-flex(xs-6)
						v-text-field(
							label="Pregunta Principal"
							v-model="question"
							required
						)
					v-flex(xs-6)
						v-select(
							label="Elegir un Local"
							v-model="select"
							:items="items"
							required
						)
				v-layout(row wrap)
					v-flex(xs-6)
						v-select(
							label="Elegir un Local"
							v-model="select"
							:items="items"
							required
						)
					v-flex(xs-6)
						v-text-field(
							label="Elegir un local"
							v-model="local"
							required
						)
			.button-container
				v-btn(outline :loading="loading" @click.native="signIn" :disabled="loading || $v.$invalid" color="primary") INGRESAR
					span.custom-loader(slot="loader")
						v-icon(light) cached
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
				text: null,
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4'
        ],
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
				.then((user) => { router.push('/dashboard') })
				.catch((error) => {
					console.log(error)
					this.showSnackbar(error)
					return true
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
</style>
