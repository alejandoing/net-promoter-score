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
				v-flex(xs12 sm8 offset-sm2)
					v-select(
						label="Elegí un Local"
						v-model="local"
						:items="localsSelect"
					)
				v-flex(xs12 sm4)
					v-checkbox(
						v-model="read"
						value="1"
						label="Leído"
						type="checkbox"
						style="position: relative; top: 20px; left: 20px"
					)
			v-layout(row).mb-5
				v-flex(xs12 sm4 offset-sm2)
					v-btn(block color="primary" @click="searchTickets") Filtrar Tickets
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="clearFields") Limpiar
			v-flex(xs12 sm12 v-if='tickets')
				v-card
					v-list
						template(v-for="ticket in tickets")
							v-list-tile(avatar)
								v-list-tile-avatar.pr-5
									span Leído
									v-checkbox(
										v-model="ticket.leido"
										@click="updateTicket(ticket)"
										color="blue"
										hide-details
									)
								v-spacer(style="flex-grow: .1 !important")
								v-list-tile-content.ticket-content(ripple @click="viewTicket(ticket.id)")
									v-list-tile-title.black-text Ticket Nro: {{ ticket.id }} ({{ ticket.dateFormat }})
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ ticket.email }}, {{ ticket.telephone }}
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
				read: false,
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
				let locals = this.$firebase.firestore().collection("locals")
				.where('business', '==', this.userStorage.business)
				.where('title', '==', this.local)
				locals.onSnapshot(querySnapshot => {
					querySnapshot.forEach(doc => this.localID = doc.id)
				})
			}
		},
		created() {
			let tickets = this.$firebase.firestore().collection("tickets").where('business', '==', this.userStorage.business)
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

			let locals = this.$firebase.firestore().collection("locals").where('business', '==', this.userStorage.business)
			locals.onSnapshot(querySnapshot => {
				this.locals = []
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					this.locals.unshift(local)
					this.localsSelect.unshift(local.title)
				})
			})
		},
		methods: {
      formatDate (date) {
        if (!date) return null
        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
			},

			activeDateMenus() {
				this.menuDateUntil = true
			},

			desactiveDateMenus() {
				this.menuDateSince = false
				this.dateSinceFormatted = null
				this.menuDateUntil = false
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
				return date + " a las " + time + " hs"
			},

			searchTickets() {

			},

			clearFiels() {

			},

			updateTicket(ticket) {
				let ticketDoc = this.$firebase.firestore().doc("tickets/" + ticket.id)
				ticketDoc.update({
					business: ticket.business,
					date: ticket.date,
					description: ticket.description,
					email: ticket.email,
					leido: !ticket.leido,
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
