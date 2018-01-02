<template lang="pug">
	v-container(v-if="poll" grid-list-md)
		v-layout(row wrap)
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
					v-model="local"
					:items="localsSelect"
					:readonly="employee"
					required
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
				router-link(:to="permalink")
					v-btn(block color="primary") Ir a encuesta
			v-flex(xs12)
				img(height="500" width="100%" :src="background")
		v-layout.my-5(row wrap)
			v-flex(xs12)
				span.display-1.my-5 Justificación
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
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Se han guardado todos los cambios
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialog = false") Permanecer aquí
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		mixins: [validationMixin],
		validations: {
			question: { required },
			local: { required },
			context: { required },
			background: { required },
		},
		data() {
			return {
				poll: false,
				question: null,
				local: null,
				context: null,
				permalink: null,
				locals: [],
				localsSelect: [],
				contextsSelect: [],
				loader: null,
				loading: false,
				dialog: false,
				background: null,
				file: null,
				localId: null,
				employee: true,
				userStorage: JSON.parse(localStorage.getItem('user')),
				justificationsValues: {
					veryGood: { question: null, options: [] },
					good: { question: null, options: [] },
					bad: { question: null, options: [] },
					veryBad: { question: null, options: [] },
				},
				justifications: [{
					id: 'veryGood',
					icon: 'mood',
					title: 'Muy Bueno',
					display: 'block',
				}, {
					id: 'good',
					icon: 'fa-smile-o',
					title: 'Bueno',
					display: 'none',
				}, {
					id: 'bad',
					icon: 'fa-meh-o',
					title: 'Malo',
					display: 'none',
				}, {
					id: 'veryBad',
					icon: 'fa-frown-o',
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
					this.localId = this.locals[INDEX].id
				}
			},
		},
		async created() {
			this.$firebase.firestore().doc('users/' + this.userStorage.id)
			.onSnapshot(doc => {
				if (doc.data().privileges == "Administrador") this.employee = false
			})
			this.$firebase.firestore().doc('polls/' + this.$route.params.id)
			.onSnapshot(doc => {
				this.poll = doc.data()
				this.question = doc.data().question
				this.local = doc.data().local.title
				this.localId = doc.data().local.id
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
			uploadClick() {
				document.getElementById('background').click()
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
					local: { title: this.local, id: this.localId },
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

