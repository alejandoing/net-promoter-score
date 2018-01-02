<template lang="pug">
	v-container(grid-list-md v-if="business")
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Configuración
					v-divider
			v-flex(xs12)
				v-tabs(fixed icons centered)
					v-tabs-bar(dark color="primary")
						v-tabs-slider(color="yellow")
						v-tabs-item(href="#business")
							v-icon business
							| Mi Organización
						v-tabs-item(href="#profile")
							v-icon person
							| Mi Perfil
						v-tabs-item(href="#users")
							v-icon person_add
							| Crear Usuario
					v-tabs-items
						v-tabs-content(id="business")
							v-card(flat)
								v-card-text
									v-flex(xs12)
										v-text-field(
											label="Razón Social"
											v-model.trim="business"
											required
										)
									v-flex(xs12)
										p Contextos:
										v-tooltip(v-for="context in contextsLoad" :key="context" top)
											v-chip(style="cursor: pointer" slot="activator" @click="remove(context)" color="info" text-color="white") {{ context }}
											span Eliminar contexto: {{ context }}
									v-flex(xs12 md6)
										v-text-field(
											v-if="inputContext"
											label="Nuevo Contexto"
											v-model.trim="contextNew"
											required
										)
									v-flex(xs12 md6)
										v-btn(v-if="!inputContext" @click.native="addContext(1)" color="primary") Agregar Contexto
										v-btn(v-if="inputContext" :disabled="!contextNew" @click.native="addContext(2)" color="primary") Guardar Contexto
							v-layout(row child-flex justify-center align-center wrap)
								v-flex.py-2(fill-height xs12 offset-xs5)
									v-btn(large outline :loading="loading" :disabled="loading" @click.native="saveChanges" color="primary") Guardar Cambios
										span.custom-loader(slot="loader")
											v-icon(light) cached
						v-tabs-content(id="profile")
							v-card(flat)
								v-card-text
									v-layout(row wrap)
										v-flex(xs12 md6)
											v-text-field(
												label="Nombre"
												v-model.trim="name"
												required
											)
										v-flex(xs12 md6)
											v-select(
												label="Privilegios"
												v-model.trim="privileges"
												:items="privilegesSelect"
												required
											)
										v-flex(xs12 md6)
											v-text-field(
												label="Email"
												v-model.trim="email"
												required
											)
										v-flex(xs12 md6).mb-5
											v-btn(block color="primary" @click="dialogPassword = true") Cambiar contraseña
							v-layout(row child-flex justify-center align-center wrap)
								v-flex(fill-height xs12 offset-xs5)
									v-btn(large outline :loading="loading" :disabled="loading || !email || !name" @click.native="updateUser" color="primary") Guardar Cambios
										span.custom-loader(slot="loader")
											v-icon(light) cached
						v-tabs-content(id="users")
							v-card(flat)
								v-card-text
									v-layout(row wrap)
										v-flex(xs12 md6)
											v-text-field(
												label="Nombre"
												v-model.trim="nameNew"
												required
											)
										v-flex(xs12 md6)
											v-select(
												label="Privilegios"
												v-model.trim="privilegesNew"
												:items="privilegesSelect"
												required
											)
										v-flex(xs12 md6)
											v-text-field(
												label="Email"
												v-model.trim="emailNew"
												required
											)
							v-layout(row child-flex justify-center align-center wrap)
								v-flex(fill-height xs12 offset-xs5)
									v-btn(large outline :loading="loading" :disabled="loading || !emailNew || !nameNew" @click.native="createUser" color="primary") Crear Usuario
										span.custom-loader(slot="loader")
											v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Se han guardados todos los cambios
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialog = false") Permanecer aquí
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
		v-dialog(v-model="dialogError" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Error!
				v-card-text El cambio de contraseña o de email son operaciones delicadas que requieren un inicio de sesión reciente. Por favor, ingrese de nuevo.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialogError = false") Permanecer aquí
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Cerrar Sesión
		v-dialog(v-model="dialogPassword" persistent max-width="500")
			v-card
				v-card-title(class="headline") Por favor, escriba la dirección de correo de su cuenta
				v-card-text
					v-flex(xs12)
						v-text-field(
							label="Email"
							v-model.trim="emailReset"
							required
						)
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="resetPassword" :disabled="!emailReset || $v.$invalid") Confirmar
						v-btn(color="green darken-1" flat @click.native="dialogPassword = false") Cancelar
		v-dialog(v-model="dialogConfirm" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text Se ha enviado un email de cambio de contraseña a la dirección de correo: {{ emailReset }}
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialogConfirm = false") Entendido
		v-dialog(v-model="dialogErrorTwo" persistent max-width="500")
			v-card
				v-card-title(class="headline") !Error!
				v-card-text La dirección de correo ingresada es inválida. Asegúrese de escribir la misma dirección de correo que utiliza para iniciar sesión.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialogErrorTwo = false") Entendido
		v-dialog(v-model="dialogUserConfirm" persistent max-width="500")
			v-card
				v-card-title(class="headline") !Enhorabuena!
				v-card-text El usuario {{ emailNew }} se ha creado satisfactoriamente. Para ingresar la primera vez debe colocar la contraseña: '12345678'.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialogUserConfirm = false") Entendido
		v-dialog(v-model="dialogUserError" persistent max-width="500")
			v-card
				v-card-title(class="headline") !Error!
				v-card-text Ha ocurrido un error a la hora de crear el usuario. Asegúrese de que la dirección de correo esté escrita correctamente.
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialogUserError = false") Entendido
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email, sameAs } from 'vuelidate/lib/validators'
	export default {
		mixins: [validationMixin],
		validations: {
			emailReset: { email },
			emailNew: { email },
		},
		data() {
			return {
				name: null,
				email: null,
				emailReset: null,
				business: null,
				privileges: null,
				privilegesSelect: ['Administrador', 'Empleado'],
				context: null,
				contextsLoad: null,
				contextNew: null,
				inputContext: false,
				local: null,
				loader: null,
				loading: false,
				dialog: false,
				dialogError: false,
				dialogPassword: false,
				dialogConfirm: false,
				dialogErrorTwo: false,
				dialogUserConfirm: false,
				dialogUserError: false,
				userStorage: JSON.parse(localStorage.getItem('user')),
				nameNew: null,
				emailNew: null,
				privilegesNew: null
			}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
		},
		created() {
			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
			business.onSnapshot(doc => {
				this.business = doc.data().title
				this.contextsLoad = doc.data().contexts
				this.context = doc.data().contexts
			})

			let user = this.$firebase.firestore().doc("users/" + this.userStorage.id)
			user.onSnapshot(doc => {
				this.email = doc.data().email
				this.name = doc.data().name
				this.privileges = doc.data().privileges
			})
		},
		methods: {
			addContext(step) {
				if (step == 2) {
					this.contextsLoad.push(this.contextNew)
					this.contextNew = null
				}
				this.inputContext = !this.inputContext
			},

			saveChanges() {
				this.loader = 'loading'
				let business = this.$firebase.firestore().doc("business/" + this.userStorage.business)
				business.update({
					title: this.business,
					contexts: this.contextsLoad
				})
				.then(() => {
					this.loader = null,
					this['loading'] = false,
					this.dialog = true
				})
			},

			remove(context) {
				let index = this.contextsLoad.indexOf(context)
				this.contextsLoad.splice(index, 1)
			},
			
			updateUser() {
				const USER_REF = this.$firebase.firestore().doc("users/" + this.userStorage.id)
				const UPDATE_USER  = USER_REF.update({ name: this.name, email: this.email, privileges: this.privileges })
				
				this.loader = 'loading'
				UPDATE_USER.then(() => {
					this.$firebase.auth().onAuthStateChanged((user) => {
						user.updateEmail(this.email).then(() => {
							this.loader = null
							this['loading'] = false
							this.dialog = true
						})
						.catch((error) => {
							this.loader = null
							this['loading'] = false
							this.dialogError = true
						})
					})
				})
			},
			resetPassword() {
				this.dialogPassword = false
				this.$firebase.auth().sendPasswordResetEmail(this.emailReset)
				.then(() => this.dialogConfirm = true)
				.catch((error) => this.dialogErrorTwo = true)
				this.loader = null
				this['loading'] = false
			},

			createUser() {
				const USERS_COLLECTION = this.$firebase.firestore().collection('users')
				const PASSWORD = '12345678'
				this.loader = 'loading'
				if (!this.privilegesNew) this.privilegesNew = 'Empleado'
				this.$firebase.auth().createUserWithEmailAndPassword(this.emailNew, PASSWORD)
				.then((user) => {			
					USERS_COLLECTION.doc(user.uid).set({
						name: this.nameNew,
						business: this.userStorage.business,
						email: this.emailNew,
						status: 'Pendiente',
						privileges: this.privilegesNew
					})
					.then(() => this.dialogUserConfirm = true)
				})
				.catch((error) => this.dialogUserError = true)
				this.loader = null
				this['loading'] = false
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