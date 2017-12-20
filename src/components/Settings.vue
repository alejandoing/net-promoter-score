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
						v-tabs-item(href="#business") Mi Organización
						v-tabs-item(href="#profile") Mi perfil
						v-tabs-item(href="#users") Crear Usuario
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
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn(large outline :loading="loading" :disabled="loading" @click.native="saveChanges" color="primary") Guardar Cambios
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
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		mixins: [validationMixin],
		validations: {
			inputContext: { required }
		},
		data() {
			return {
				business: null,
				context: null,
				contextsLoad: null,
				contextNew: null,
				inputContext: false,
				local: null,
				loader: null,
				loading: false,
				dialog: false,
				userStorage: JSON.parse(localStorage.getItem('user'))
			}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
			contextsLoad() {
			}
		},
		created() {
			let business = this.$firebase.firestore().doc("business/" + this.userStorage.business).get()
			business.then((doc) => {
				this.business = doc.data().title
				this.contextsLoad = doc.data().contexts
				this.context = doc.data().contexts
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