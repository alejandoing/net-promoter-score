<template lang="pug">
	v-container(grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 Nuevo Local
					v-divider
			v-flex(xs12 md6)
				v-text-field(
					label="Título"
					v-model.trim="title"
					required
				)
			v-flex(xs12 md6)
				v-select(
					label="Elegí una provincia"
					v-model="province"
					:items="provinces"
					required
				)
			v-flex(xs12 md6)
				v-text-field(
					label="Ingresá el nombre de la localidad"
					v-model.trim="location"
					required
				)
			v-flex(xs12 md6)
				v-text-field(
					label="Ingresá el nombre de la calle"
					v-model.trim="street"
					required
				)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline :loading="loading" :disabled="loading || $v.$invalid" @click.native="createLocal" color="primary") CREAR LOCAL
					span.custom-loader(slot="loader")
						v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text El local se ha registrado correctamente
				v-card-actions
					v-spacer
					router-link(:to="'/locals/' + local")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ver Local
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		mixins: [validationMixin],
		validations: {
			title: { required },
			province: { required },
			location: { required },
			street: { required },
		},
		data() {
			return {
				title: null,
				province: null,
				location: null,
				street: null,
				loader: null,
				loading: false,
				select: [],
				provinces: [
					'Buenos Aires - GBA', 'Capital Federal', 'Catamarca',
					'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos',
					'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
					'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
					'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
					'Tierra del Fuego', 'Tucumán' 
				],
				dialog: false,
				local: false,
				userStorage: JSON.parse(localStorage.getItem('user')),
			}
		},
		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			}
		},
		methods: {
			createLocal() {
				const LOCALS_COLLECTION = this.$firebase.firestore().collection('locals')
				this.loader = 'loading'
				LOCALS_COLLECTION.add({
					title: this.title,
					province: this.province,
					location: this.location,
					street: this.street,
					business: this.userStorage.business
				})
				.then((local) => {
					this['loading'] = false
					this.loader = null
					this.local = local.id
					this.dialog = true
				})
				.catch((error) => { console.log(error) })
			},
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

