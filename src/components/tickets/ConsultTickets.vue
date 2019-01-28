<template lang="pug">
	v-container
		v-layout(row)
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
						label="Elegí un Jefe Zonal"
						v-model="zone"
						:items="zonesSelect"
					)
				v-flex.ml-3(xs12 sm4)
					v-select(
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
						v-model="closed"
						label="Cerrado"
						type="checkbox"
						style="position: relative; top: 20px"
					)
			v-layout(row).mb-5.mt-3
				v-flex(xs12 sm4 offset-sm2)
					v-btn(block color="primary" @click="searchTickets") Filtrar Tickets
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="clearFields") Limpiar
			v-flex.mb-5(xs12 sm12 v-if='tickets')
				v-card
					v-list
						template(v-for="ticket in tickets")
							v-list-tile(avatar)
								v-list-tile-avatar.pr-5(v-if="ticket.status == 2")
									span Cerrado
									v-checkbox(
										checked
										input-value="true"
										readonly
										color="green"
										hide-details
									)
								v-list-tile-avatar.pr-5(v-else)
									span Leído
									v-checkbox(
										v-model="ticket.status"
										@click="updateTicket(ticket)"
										color="blue"
										hide-details
									)
								v-spacer(style="flex-grow: .1 !important")
								v-list-tile-content.ticket-content(ripple @click="viewTicket(ticket.id)")
									v-list-tile-title.black-text 
										| {{ ticket.email }} - ({{ ticket.dateFormat }})
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ ticket.description }}
								v-spacer(style="flex-grow: .1 !important")
								v-btn(v-if="ticket.complain" color="error" small) Queja
								v-btn(v-else color="success" small) Com. Positivo
							v-divider
			v-flex(xs12 sm12 v-else) 
				span.message Los tickets que se registren en el sistema aparecerán aquí
</template>

<script>
	import router from '@/router/'
  export default {
    data () {
      return {
				tickets: false,
				local: null,
				localID: null,
				locals: null,
				localsSelect: [],
				zone: null,
				zoneID: null,
				zonesSelect: [],
				read: false,
				closed: false,
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
			local() {
				if (!this.zone) this.localsSelect = []
				else {
					let locals = this.$firebase.firestore().collection("locals")
					.where('business', '==', this.userStorage.business)
					.where('title', '==', this.local)
					locals.onSnapshot(querySnapshot => {
						querySnapshot.forEach(doc => this.localID = doc.id)
					})
				}
			},
			read() {
				if (!this.read) this.unread = true
			},
			closed() {
				if (this.closed) this.read = true
			},
			zone() {
				this.localsSelect = []
				let zone = this.$firebase.firestore().collection("zones").where('responsable', '==', this.zone)
				zone.onSnapshot(querySnapshot => {
					querySnapshot.forEach(doc => {
						this.zoneID = doc.id
						let locals = this.$firebase.firestore().collection("locals").where('zone', '==', doc.id)
						locals.onSnapshot(querySnapshot => {
							this.locals = []
							querySnapshot.forEach(doc => {
								let local = doc.data()
								local.id = doc.id
								this.locals.unshift(local)
								this.localsSelect.unshift(local.title)
							})
						})
					})
				})
			}
		},
		created() {
			let tickets = this.$firebase.firestore().collection("tickets").where('business', '==', this.userStorage.business).orderBy("date")
			tickets.onSnapshot(querySnapshot => {
				this.tickets = []
				querySnapshot.forEach(doc => {
					let ticket = doc.data()
					ticket.dateFormat = this.convertDate(doc.data().date)
					ticket.kind = ticket.complain ? 'Queja' : 'Comentario Positivo'
					ticket.id = doc.id
					this.tickets.unshift(ticket)
				})
				if (!this.tickets.length) this.tickets = false
			})

			let zones = this.$firebase.firestore().collection("zones").where('business', '==', this.userStorage.business)
			zones.onSnapshot(querySnapshot => {
				this.zones = []
				querySnapshot.forEach(doc => {
					let zone = doc.data()
					zone.id = doc.id
					this.zones.unshift(zone)
					this.zonesSelect.unshift(zone.responsable)
				})
			})
		},
		methods: {
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

			desactiveTimeMenuUntil() {
				this.timeUntil = null,
				this.menuTimeUntil = false
			},

			viewTicket(id) {
				{ router.push('/ticket/' + id) }
			},

			convertDate(inputFormat) {
				function pad(s) { return (s < 10) ? '0' + s : s; }
				let d = new Date(inputFormat)
				let date = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
				let time = [pad(d.getHours()), pad(d.getMinutes())].join(':')
				return `${date} - ${time} hs`
			},

			searchTickets() {
				let tickets = this.$firebase.firestore().collection("tickets").where('business', '==', this.userStorage.business).orderBy("date")
				let status = this.read ? 1 : 0
				status = this.closed ? 2 : status
				tickets = tickets.where('status', '==', status)
				if (this.local) tickets = tickets.where('local', '==', this.localID)
				else {
					if (this.zone) tickets = tickets.where('zone', '==', this.zoneID)
				}
				

				let timeSince = '00:00'
				let timeUntil = '23:59'
				let dateSince = '1999-01-01'
				let dateUntil = '2099-12-31'

				function pad(s) { return (s < 10) ? '0' + s : s }
				function timeSearch(date) { return `${pad(date.getHours())}:${pad(date.getMinutes())}` }
				function compareTimes(timeRecord, timeSince, timeUntil) {
					let arrayTimeRecord = timeRecord.split(":")
					let arraytimeSince = timeSince.split(":")
					let arraytimeUntil = timeUntil.split(":")

					let recordHour = parseInt(arrayTimeRecord[0],10)
					let recordMinutes = parseInt(arrayTimeRecord[1],10)
					
					let sinceHour = parseInt(arraytimeSince[0],10)
					let sinceMinutes = parseInt(arraytimeSince[1],10)

					let untilHour = parseInt(arraytimeUntil[0],10)
					let untilMinutes = parseInt(arraytimeUntil[1],10)
					
					if (recordHour > sinceHour || (recordHour == sinceHour && recordMinutes >= sinceMinutes)) {
						if (recordHour < untilHour || (recordHour == untilHour && recordMinutes <= untilMinutes)) return true
						else return false
					}
					else return false
				}

				this.loader = 'loading'

				if (this.timeSince) timeSince = this.timeSince
				if (this.timeUntil) timeUntil = this.timeUntil

				if (this.dateSince) {
					dateSince = this.dateSince
					dateUntil = this.dateSince
				}

				if (this.dateUntil) dateUntil = this.dateUntil

				let searchSince = new Date(`${dateSince} ${timeSince}`)
				let searchUntil = new Date(`${dateUntil} ${timeUntil}`)
				
				if (this.dateSince || this.timeSince) {
					tickets = tickets
					.where('date','>=',new Date(`${dateSince} ${timeSince}`))
					.where('date','<=',new Date(`${dateUntil} ${timeUntil}`))
				}
				
				tickets.onSnapshot(querySnapshot => {
					this.tickets = []
					if (!this.timeSince) {
						querySnapshot.forEach(doc => {
							let ticket = doc.data()
							ticket.dateFormat = this.convertDate(doc.data().date)
							ticket.id = doc.id
							this.tickets.unshift(ticket)
						})
					}
					else {
						querySnapshot.forEach(doc => {
							if (compareTimes(timeSearch(doc.data().date), timeSearch(searchSince), timeSearch(searchUntil))) {
								let ticket = doc.data()
								ticket.dateFormat = this.convertDate(doc.data().date)
								ticket.id = doc.id
								this.tickets.unshift(ticket)
							}
						})
					}
					if (!this.tickets.length) this.tickets = false
				})
			},

			clearFields() {
				this.local = null
				this.zone = null
				this.read = null
				this.unread = null
				this.dateSince = null
				this.dateUntil = null
				this.timeSince = null
				this.timeUntil = null

				let tickets = this.$firebase.firestore().collection("tickets").where('business', '==', this.userStorage.business).orderBy("date")
				tickets.onSnapshot(querySnapshot => {
					this.tickets = []
					querySnapshot.forEach(doc => {
						let ticket = doc.data()
						ticket.dateFormat = this.convertDate(doc.data().date)
						ticket.id = doc.id
						this.tickets.unshift(ticket)
					})
					if (!this.tickets.length) this.tickets = false
				})
			},

			updateTicket(ticket) {
				let ticketDoc = this.$firebase.firestore().doc("tickets/" + ticket.id)
				ticketDoc.update({
					business: ticket.business,
					date: ticket.date,
					description: ticket.description,
					email: ticket.email,
					status: ticket.status == 0 ? 1 : 0,
					local: ticket.local,
					poll: ticket.poll,
					telephone: ticket.telephone
				})
				.then(() => {
					console.log('Actualizado correctamente')
				})
			}
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
	#read
		
</style>
