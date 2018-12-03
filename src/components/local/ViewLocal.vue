<template lang="pug">
	v-container(grid-list-md)
		v-layout(row wrap)
			v-flex(xs12)
				div.pb-5
					span.display-1 {{ local.title }}
					v-divider
			v-flex(xs12 md4)
				v-text-field(
					label="Título"
					v-model.trim="title"
					required
				)
			v-flex(xs12 md4)
				v-select(
					label="Elegí una zona"
					v-model="zoneSelect"
					:items="zones"
					required
				)
			v-flex(xs12 md6)
				v-checkbox(
					label="Casa de Cambio"
					v-model="exchange"
				)
		v-layout(row child-flex justify-center align-center wrap)
			v-flex.py-5(fill-height xs12 offset-xs5)
				v-btn#submit(large outline :loading="loading" :disabled="loading || $v.$invalid" @click.native="updateLocal" color="primary") Guardar Cambios
					span.custom-loader(slot="loader")
						v-icon(light) cached
		v-dialog(v-model="dialog" persistent max-width="500")
			v-card
				v-card-title(class="headline") ¡Enhorabuena!
				v-card-text El local se ha registrado correctamente
				v-card-actions
					v-spacer
						v-btn(color="green darken-1" flat @click.native="dialog = false") Permanecer Aquí
					router-link(:to="'/dashboard'")
						v-btn(color="green darken-1" flat @click.native="dialog = false") Ir al Dashboard
</template>

<script>
	import { validationMixin } from 'vuelidate'
	import { required, maxLength, email } from 'vuelidate/lib/validators'
	export default {
		name: 'Auth',
		mixins: [validationMixin],
		validations: {
			title: { required },
			zone: { required },
		},

		data () {
			return {
				title: null,
				province: null,
				location: null,
				street: null,
				local: false,
				exchange: true,
				loader: null,
				loading: false,
				dialog: false,
				zone: null,
				zoneSelect: null,
				zones: ['Walter Mancho', 'Luciana Bernadotti', 'Cristina Marigomez', 'Dado Ricci',
					'Diego Longo', 'Florencia Casa'],
				zonesID: ['MM3exjMdkKaQ0cUkAkM2', 'MopGQtv8fBJU4Pbad7vD', 'Ngw5aiu8JFFKlHMDeZVd',
				'cRc6N1NsFEXInsBtkB9w', 'mTMi65jxCFXXglPMEARV', 'wk77ITDgnPYUjZ28MxJK'],
				regions: ['Norte', 'AMBA', 'Centro'],
				regionsID: ['0cMke5XHDRu2lLSyiUQw', '0l5DtjJ6UQ1J4DxX0fdY', 'MKITRJYc46G8XLR0Kjsv'],
				userStorage: JSON.parse(localStorage.getItem('user')),
			}
		},

		created() {
			let local = this.$firebase.firestore().doc('locals/' + this.$route.params.id)
			local.onSnapshot(doc => {
				this.local = doc.data()
				this.title = doc.data().title
				this.zone = doc.data().zone
				this.exchange = doc.data().exchange
				this.zoneSelect = this.zones[this.zonesID.indexOf(this.zone)]
			})

		},

		watch: {
			loader () {
				const l = this.loader
				this[l] = !this[l]
			},
			zoneSelect() {
				this.zone = this.zonesID[this.zones.indexOf(this.zoneSelect)]
			}
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
					exchange: this.exchange
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