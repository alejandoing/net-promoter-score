<template lang="pug">
	v-container(grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Nueva Encuesta
					hr
			v-flex(xs12)
				v-text-field(
					label="Pregunta Principal"
					v-model.trim="question"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Local"
					v-model="local"
					:items="items"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegir un Contexto"
					v-model="context"
					:items="items"
					required
				)
			v-flex(xs12 md6)
				v-text-field#background.hidden(type="file" @change.native="writeFile($event)")
				v-btn#uploadFile(block color="primary" @click="uploadClick") Elegir background
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline :loading="loading" @click.native="createPoll" color="primary") CREAR ENCUESTA
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
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	import router from '@/router/'
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
				context: null,
				background: null,
				loader: null,
				loading: false,
				snackbar: false,
				timeout: 6000,
				selectedFile: false,
				text: 'Encuesta creada satisfactoriamente',
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4'
				],
				dialog: false,
				poll: null
			}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			}
		},
		methods: {
			uploadClick() {
				document.getElementById('background').click()
			},

			writeFile(event) {
				this.background = event.srcElement.files[0]
				const BACKGROUND = document.getElementById('background')
				const UPLOAD_FILE = document.getElementById('uploadFile')
				if (!background.value.length) return false
				UPLOAD_FILE.innerHTML = background.files[0].name
				this.selectedFile = true
			},

			createPoll() {
				const POLLS_COLLECTION = this.$firebase.firestore().collection('polls')
				this.loader = 'loading'
				POLLS_COLLECTION.add({
					question: this.question,
					local: this.local,
					context: this.context,
				})
				.then((poll) => {
					this.uploadFile(poll.id)
				})
				.catch((error) => { console.log(error) })
			},

			uploadFile(id) {
				const STORAGE_REF = this.$firebase.storage().ref()
				const POLL_REF = this.$firebase.firestore().doc("polls/" + id)
				const FILE = this.background
				const METADATA = { contentType: FILE.type }
				const UPLOAD = STORAGE_REF.child("polls/backgrounds/" + id).put(FILE, METADATA)
				
				UPLOAD.then(async () => {
					this['loading'] = false
					this.loader = null
					this.poll = id
					this.dialog = true
				})
				UPLOAD.catch((error) => { console.log(error) })
			},

			showSnackbar() {
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
