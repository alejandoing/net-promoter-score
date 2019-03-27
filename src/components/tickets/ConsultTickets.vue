<template lang="pug">
	v-container
		v-flex(xs12)
			div.pb-5
				span.display-1 Tickets Registrados
				v-divider
			v-layout(row)
				v-flex(xs12 sm4 offset-sm2)
					v-menu(
						lazy
						:close-on-click="false"
						v-model="menuDateSince"
						transition="scale-transition"
						offset-y
						full-width
						:nudge-right="40"
						max-width="290px"
						min-width="290px"
					)
						v-text-field(
							slot="activator" 
							label="Fecha Desde" 
							v-model="dateSinceFormatted" 
							prepend-icon="event" 
							@click="activeDateMenus"
						)
						v-date-picker(
							locale="es-sp"
							v-model="dateSince"
							@input="dateSinceFormatted = formatDate($event)"
							no-title
							scrollable
							actions
						)
							template(slot-scope="{ save, cancel }")
								v-card-actions
									v-spacer
									v-btn(flat color="primary" @click="save") Seleccionar
									v-btn(flat color="primary" @click="desactiveDateMenus") Cancelar
				v-flex(xs12 sm4)
					v-menu(
						lazy
						:close-on-click="false"
						v-model="menuDateUntil"
						transition="scale-transition"
						offset-y
						full-width
						:nudge-right="40"
						max-width="290px"
						min-width="290px"
					)
						v-text-field(
							slot="activator" 
							label="Fecha Hasta" 
							v-model="dateUntilFormatted" 
							prepend-icon="event"
						)
						v-date-picker(
							locale="es-sp" 
							v-model="dateUntil" 
							@input="dateUntilFormatted = formatDate($event)" 
							no-title 
							scrollable
							actions
						)
							template(slot-scope="{ save, cancel }")
								v-card-actions
									v-spacer
									v-btn(flat color="primary" @click="save") Seleccionar
									v-btn(flat color="primary" @click="desactiveDateMenus") Cancelar
			v-layout(row)
				v-flex(xs12 sm4 offset-sm2)
					v-menu(
						lazy
						:close-on-content-click="false"
						v-model="menuTimeSince"
						transition="scale-transition"
						offset-y
						full-width
						:nudge-right="40"
						max-width="290px"
						min-width="290px"
					)
						v-text-field(
							slot="activator"
							label="Hora Desde"
							v-model="timeSince"
							prepend-icon="access_time"
							readonly
						)
						v-time-picker(v-model="timeSince" autosave format="24hr")
							template(slot-scope="{ save, cancel }")
								v-card-actions
									v-btn(flat color="primary" @click="desactiveTimeMenuSince") Cancelar
				v-flex(xs12 sm4)
					v-menu(
						lazy
						:close-on-content-click="false"
						v-model="menuTimeUntil"
						transition="scale-transition"
						offset-y
						full-width
						:nudge-right="40"
						max-width="290px"
						min-width="290px"
					)
						v-text-field(
							slot="activator"
							label="Hora Hasta"
							v-model="timeUntil"
							prepend-icon="access_time"
							readonly
						)
						v-time-picker(v-model="timeUntil" autosave format="24hr")
							template(slot-scope="{ save, cancel }")
								v-card-actions
									v-btn(flat color="primary" @click="desactiveTimeMenuUntil") Cancelar
			v-layout(row)
				v-flex(xs12 sm4 offset-sm2)
					v-select(
						autocomplete
						label="Elegí un Jefe Zonal"
						v-model="zone"
						:items="zonesSelect"
					)
				v-flex.ml-3(xs12 sm4)
					v-select(
						autocomplete
						label="Elegí un Local"
						v-model="local"
						:items="localsSelect"
					)
			v-layout(row)
				v-flex(xs12 sm1 offset-sm2)
					v-checkbox(
						v-model="read"
						label="Leído"
						type="checkbox"
						style="position: relative; top: 20px"
					)
				v-flex(xs12 sm1)
					v-checkbox(
						v-model="unread"
						label="No Leído"
						type="checkbox"
						style="position: relative; top: 20px"
					)
				v-flex.ml-4(xs12 sm1)
					v-checkbox(
						v-model="closed"
						label="Cerrado"
						type="checkbox"
						style="position: relative; top: 20px"
					)
				v-flex.ml-3(xs12 sm1)
					v-checkbox(
						v-model="complain"
						label="Queja"
						type="checkbox"
						style="position: relative; top: 20px"
					)
				v-flex.ml-1(xs12 sm2)
					v-checkbox(
						v-model="comment"
						label="Com. Positivo"
						type="checkbox"
						style="position: relative; top: 20px"
					)
			v-layout(row).mb-5.mt-3
				v-flex(xs12 sm4)
					v-btn(block color="primary" :loading="loading" :disabled="loading" @click="searchTickets") Filtrar Tickets
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="clearFields") Limpiar
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="searchResults") Ver Detalles
			v-flex.mb-5(xs12 sm12 v-if='tickets.length')
				v-card
					v-list
						template(v-for="ticket in tickets")
							v-list-tile(avatar).ticket-content
								v-list-tile-avatar.pr-5(v-if="ticket.status == 2")
									v-btn(color="green darken-4" small dark) Cerrado
								v-list-tile-avatar.pr-5(v-else-if="ticket.status == 0")
									v-btn(color="red darken-4" small dark) Sin Leer
								v-list-tile-avatar.pr-5(v-else)
									v-btn(color="amber darken-4" small dark) Leído
								v-spacer(style="flex-grow: .1 !important")
								v-list-tile-content.pl-5(ripple @click="viewTicket(ticket.id)")
									v-list-tile-title.black-text {{ ticket.email }} - ({{ convertDate(ticket.date) }})
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ chunkString(ticket.description, 40) ? chunkString(ticket.description, 40)[0] : null }}...
								v-spacer
								v-btn(v-if="ticket.complain == 1" color="error" small) Queja
								v-btn(v-else color="success" small) Com. Positivo
							v-divider
			v-flex(xs12 sm12 v-else) 
				span.message Los tickets que se registren en el sistema aparecerán aquí
		v-dialog(v-model="dynamicDialogAct" fullscreen hide-overlay transition="dialog-bottom-transition")
			v-card
				v-toolbar(dark color="primary")
					v-btn(icon dark @click="finalize")
						v-icon close
					v-toolbar-title Detalle - Comentarios
					v-spacer
					v-toolbar-items
						v-btn(dark flat @click="finalize") Regresar
				v-card-text
					v-flex(xs9 offset-xs2)
						v-layout(row)
							v-flex(xs1 offset-xs1 v-if="tickets")
							.images.ml-5(v-for="image in images")
								img(height="200" width="220" :src="image.url")
								span {{ image.value }} cant. | {{ image.percentage }}%
					v-flex(xs12)
						.py-5
							span.display-1 Resumen por Jefe Zonal
							v-divider
					v-flex(xs9 offset-xs2)
						Zone.pb-5(:data="tickets.stats")
					v-flex(xs12)
						.py-5
							span.display-1 Resumen por Locales
							v-divider
					v-container
						v-flex(xs12 sm12)
							v-card
								v-list
									template(v-for="local in ticketsLocals")
										v-list-tile(avatar).ticket-content
											v-list-tile-content
												v-list-tile-title.black-text {{ local.title }}
											v-spacer(style="flex-grow: .1 !important")
											v-btn(color="error" small) {{ local.complains }} Quejas
											v-btn(color="success" small dark) {{ local.comments }} Comentarios
										v-divider
</template>

<script>
	import Zone from '../stats/Zone.vue'
	import router from '@/router/'
  export default {
    data () {
      return {
				images: [
					{ url: './../../../static/tickets/comment.png', value: false, percentage: false }, 
					{ url: './../../../static/tickets/complain.png', value: false, percentage: false }
				],
				tickets: [],
				ticketZones: [],
				ticketsLocals: [],
				complains: null,
				comments: null,
				dynamicDialogAct: false,
				local: null,
				localID: null,
				locals: null,
				localsQ: null,
				localsSelect: [],
				zone: null,
				loader: null,
				loading: false,
				test: null,
				zoneID: null,
				zonesSelect: [],
				read: false,
				unread: false,
				closed: false,
				complain: false,
				comment: false,
				menuDateSince: false,
				menuDateUntil: false,
				dateSince: null,
				dateUntil: null,
				dateSinceFormatted: null,
				dateUntilFormatted: null,
				menuTimeSince: false,
				menuTimeUntil: false,
				timeSince: null,
				timeUntil: null,
				userStorage: JSON.parse(localStorage.getItem('user'))
      }
		},
		watch: {
			unread() {
				this.closed = false
			}
		},
		async created() {
			this.$axios.post('tickets/search',
			{ condition: ` AND MONTH(date) = ${new Date().getMonth() + 1 }` }).then(res => this.tickets = res.data)
			
			const ticketSum = (await this.$axios.post('tickets/sum')).data[0]
			const totalTickets = ticketSum.comments + ticketSum.complains

			this.ticketsLocals = (await this.$axios.post('tickets/stats/locals')).data
			
			this.ticketZones = (await this.$axios.post('tickets/stats/zones')).data
			
			const zonesData = (await this.$axios.post('zones/responsables')).data

			const localsData = (await this.$axios.post('locals/title')).data

			for (let local of localsData) this.localsSelect.push(local.title)

			for (let zone of zonesData) this.zonesSelect.push(zone.responsable)
			
			this.images[0].value = ticketSum.comments
			this.images[0].percentage = this.getPercentage(this.images[0].value, totalTickets)
			this.images[1].value = ticketSum.complains
			this.images[1].percentage = this.getPercentage(this.images[1].value, totalTickets)
			this.getStats()
		},
		methods: {
			getStats() {
				this.tickets.stats = {
					zones: {
						0: [this.ticketZones[2].complains, this.ticketZones[2].comments],
						1: [this.ticketZones[3].complains, this.ticketZones[3].comments],
						2: [this.ticketZones[5].complains, this.ticketZones[5].comments],
						3: [this.ticketZones[1].complains, this.ticketZones[1].comments],
						4: [this.ticketZones[4].complains, this.ticketZones[4].comments],
						5: [this.ticketZones[6].complains, this.ticketZones[6].comments],
						6: [this.ticketZones[0].complains, this.ticketZones[0].comments]					
					}
				}
			},
			searchResults() {
				this.dynamicDialogAct = true
			},
			finalize() {
				this.dynamicDialogAct = false
			},
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
			},

			changeCheckbox(field) {
				if (field == 'unread' && this.read) this.read = !this.read
			},

			activeDateMenus() {
				this.menuDateUntil = true
			},

			desactiveDateMenus() {
				this.menuDateSince = false
				this.dateSinceFormatted = null
				this.dateSince = null
				this.menuDateUntil = false
				this.dateUntill = null
				this.dateUntilFormatted = null
			},

			desactiveTimeMenuSince() {
				this.timeSince = null,
				this.menuTimeSince = false
			},

			getPercentage(part, universe) {
				let result = parseFloat(((part * 100) / universe).toFixed(2))
				return isNaN(result) ? 0 : result
			},

			desactiveTimeMenuUntil() {
				this.timeUntil = null,
				this.menuTimeUntil = false
			},

			viewTicket(id) {
				{ router.push('/ticket/' + id) }
			},

			convertDate(inputFormat) {
				function pad(s) { return (s < 10) ? '0' + s : s }
				let inputFormat3 = new Date(inputFormat)
				let inputFormat2 = new Date(inputFormat3.setHours(new Date(inputFormat3.getHours() - 2)))
				let date = [pad(inputFormat2.getDate()), pad(inputFormat2.getMonth()+1), pad(inputFormat2.getFullYear())].join('/')
				let time = [pad(inputFormat2.getHours()), pad(inputFormat2.getMinutes())].join(':')
				return `${date} - ${time} hs`
			},

			chunkString(str, length) {
				return str.match(new RegExp('.{1,' + length + '}', 'g'));
			},

			async searchTickets() {
				this.loader = 'loading'
				let filter = ''
				
				if (this.read || this.unread || this.closed) {
					if (this.read && !this.unread) filter = `${filter} AND status = 1`
					
					if (this.unread && !this.read) filter = `${filter} AND status = 0`
					if (this.unread && this.read) filter = `AND status in (0,1)`
					if (this.read && this.closed) filter = `AND status in (1,2)`
					if (this.unread && this.closed) filter = `AND status in (0,2)`
					
					if (this.closed) filter = filter = `${filter} AND status = 2`
					if (this.unread && this.read && this.closed) filter = `AND status in (0,1,2)`
				}

				if (this.local) {
					this.localID = (await this.$axios.post('locals/search', { title: this.local })).data[0].id
					filter = `${filter} AND local_id = '${this.localID}'`
				}
				
				if (this.zone) {
					this.zoneID = (await this.$axios.post('zones/search', { responsable: this.zone })).data[0].id
					filter = `${filter} AND zone_id = '${this.zoneID}'`
				}

				if (this.complain && !this.comment) {
					filter = `${filter} AND complain = 1`
				}

				if (this.comment && !this.complain) {
					filter = `${filter} AND comment = 1`
				}

				if (this.comment && this.complain) {
					filter = `${filter} AND comment = 1 OR complain = 1`
				}

				if (this.dateSince) {
					if (this.timeSince) {
						filter = `${filter} AND DATE(date) BETWEEN '${this.dateSince} ${this.timeSince}' 
						AND '${this.dateUntil} ${this.timeUntil}'`
					}
					else {
						filter = `${filter} AND DATE(date) BETWEEN '${this.dateSince}' AND '${this.dateUntil}'`
					}
				}

				if (this.timeSince && !this.dateSince) {
					filter = `${filter} AND HOUR(date) BETWEEN '${this.timeSince}' AND '${this.timeUntil}'`					
				}

				filter = `${filter}`
				this.tickets = (await this.$axios.post('tickets/search', { condition: filter })).data
				
				this['loading'] = false
				this.loader = null
			},

			clearFields() {
				this.local = null
				this.zone = null
				this.read = null
				this.unread = null
				this.closed = null
				this.dateSince = null
				this.dateSinceFormatted = null
				this.dateUntilFormatted = null
				this.dateUntil = null
				this.timeSince = null
				this.timeUntil = null
				this.complain = null
				this.comment = null

				let tickets = this.$firebase.firestore().collection("tickets")
				tickets = tickets.where('business', '==', this.userStorage.business).orderBy("date")
				tickets.onSnapshot(querySnapshot => {
					let ticketsArray = []
					querySnapshot.forEach(doc => {
						let ticket = doc.data()
						ticket.dateFormat = this.convertDate(doc.data().date)
						ticket.id = doc.id
						ticketsArray.unshift(ticket)
					})
					this.tickets = ticketsArray
					if (!this.tickets.length) this.tickets = false
				})
			},

			updateTicket(ticket) {
				let ticketDoc = this.$firebase.firestore().doc("tickets/" + ticket.id)
				ticketDoc.update({
					status: ticket.status == 0 ? 1 : 0
				})
				.then(() => {
					console.log('Actualizado correctamente')
				})
			}
		},
		components: {
			Zone
		}
  }
</script>

<style lang="sass" scoped>
	.ticket-content
		cursor: pointer
		&:hover
			background: rgb(224, 224, 224) !important
		.black-text
			color: black
	.message
		font-size: 20px
	.containerTwo
		display: grid;
		position: relative;
		right: 30px;
		grid-template: 1fr / repeat(4, .5fr);
	.images
		display: grid;
		justify-content: start;
		grid-template: 1fr .1fr / 1fr;
		span
			font-size: 20px
			justify-self: center
</style>
