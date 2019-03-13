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
					v-btn(block color="primary" @click="searchTickets") Filtrar Tickets
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="clearFields") Limpiar
				v-flex(xs12 sm4).pl-2
					v-btn(block color="primary" @click="searchResults") Ver Detalles
			v-flex.mb-5(xs12 sm12 v-if='tickets')
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
									v-list-tile-title.black-text {{ ticket.email }} - ({{ ticket.dateFormat }})
									v-list-tile-sub-title
										span.grey--text.text--darken-2 {{ chunkString(ticket.description, 40) ? chunkString(ticket.description, 40)[0] : null }}...
								v-spacer
								v-btn(v-if="ticket.complain" color="error" small) Queja
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
								span {{ image.value.length }} cant. | {{ image.percentage }}%
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
									template(v-for="local in localsQ")
										v-list-tile(avatar).ticket-content
											v-list-tile-content
												v-list-tile-title.black-text {{ local.title }}
											v-spacer(style="flex-grow: .1 !important")
											v-btn(color="error" small) {{ local.complain }} Quejas
											v-btn(color="success" small dark) {{ local.comment }} Comentarios
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
				complains: null,
				comments: null,
				dynamicDialogAct: false,
				local: null,
				localID: null,
				locals: null,
				localsQ: null,
				localsSelect: [],
				zone: null,
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
				//if (!this.read) this.unread = true
			},
			closed() {
				if (this.closed) {
					this.read = true
					this.unread = false
				}
			},
			unread() {
				this.closed = false
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
			let locals = this.$firebase.firestore().collection("locals")
			locals = locals.where('business', '==', this.userStorage.business).orderBy('title', 'desc')
			locals.onSnapshot(querySnapshot => {
				this.localsQ = []
				querySnapshot.forEach(doc => {
					let local = doc.data()
					local.id = doc.id
					local.complain = 0
					local.comment = 0
					this.localsQ.unshift(local)
				})
			})

			let tickets = this.$firebase.firestore().collection("tickets")
			tickets = tickets.where('business', '==', this.userStorage.business).orderBy("date")
			tickets.onSnapshot(querySnapshot => {
				querySnapshot.forEach(doc => {
					console.log(doc.data())
					let ticket = doc.data()
					ticket.dateFormat = this.convertDate(doc.data().date)
					ticket.kind = ticket.complain == 1 ? 'Queja' : 'Comentario Positivo'
					ticket.id = doc.id
					this.tickets.unshift(ticket)
				})
				this.images[0].value = this.tickets.filter(item => !item.complain)
				this.images[0].percentage = this.getPercentage(this.images[0].value.length, this.tickets.length)
				this.images[1].value = this.tickets.filter(item => item.complain)
				this.images[1].percentage = this.getPercentage(this.images[1].value.length, this.tickets.length)
				this.getStats()
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
			getStats() {
				let zoneWM = 0, zoneLB = 0, zoneDR = 0, zoneDL = 0, zoneCM = 0, zoneFC = 0
				
				let zoneWMComplain = 0, zoneWMComment = 0
				let zoneLBComplain = 0, zoneLBComment = 0
				let zoneDRComplain = 0, zoneDRComment = 0
				let zoneDLComplain = 0, zoneDLComment = 0
				let zoneCMComplain = 0, zoneCMComment = 0
				let zoneFCComplain = 0, zoneFCComment = 0

				let complains = new Array(2).fill(0)
				let comments = new Array(2).fill(0)
				let activeLocals = []
				let setUpLocals = []
				
				for (let ticket of this.tickets) {
					switch(ticket.zone) {
						case 'MM3exjMdkKaQ0cUkAkM2':
							ticket.complain ? zoneWMComplain++ : zoneWMComment++
							zoneWM++
						break
						case 'MopGQtv8fBJU4Pbad7vD':
							ticket.complain ? zoneLBComplain++ : zoneLBComment++
							zoneLB++
						break
						case 'Ngw5aiu8JFFKlHMDeZVd':
							ticket.complain ? zoneCMComplain++ : zoneCMComment++
							zoneCM++
						break
						case 'cRc6N1NsFEXInsBtkB9w':
							ticket.complain ? zoneDRComplain++ : zoneDRComment++
							zoneDR++
						break
						case 'mTMi65jxCFXXglPMEARV':
							ticket.complain ? zoneDLComplain++ : zoneDLComment++
							zoneDL++
						break
						case 'wk77ITDgnPYUjZ28MxJK':
							ticket.complain ? zoneFCComplain++ : zoneFCComment++
							zoneFC++
						break
					}

					ticket.complain ? this.localsQ.find(item => item.id === ticket.local).complain++ : this.localsQ.find(item => item.id === ticket.local).comment++
				}

				this.tickets.stats = {
					zones: {
						0: [
								[zoneWM, this.getPercentage(zoneWM, this.tickets.length)],
								[zoneWMComplain, this.getPercentage(zoneWMComplain, this.tickets.length)],
								[zoneWMComment, this.getPercentage(zoneWMComment, this.tickets.length)]
							],
						1: [
								[zoneLB, this.getPercentage(zoneLB, this.tickets.length)],
								[zoneLBComplain, this.getPercentage(zoneLBComplain, this.tickets.length)],
								[zoneLBComment, this.getPercentage(zoneLBComment, this.tickets.length)] 
							],
						2: [
								[zoneCM, this.getPercentage(zoneCM, this.tickets.length)],
								[zoneCMComplain, this.getPercentage(zoneCMComplain, this.tickets.length)],
								[zoneCMComment, this.getPercentage(zoneCMComment, this.tickets.length)]
							],
						3: [
								[zoneDR, this.getPercentage(zoneDR, this.tickets.length)],
								[zoneDRComplain, this.getPercentage(zoneDRComplain, this.tickets.length)],
								[zoneDRComment, this.getPercentage(zoneDRComment, this.tickets.length)]
							],
						4: [
								[zoneDL, this.getPercentage(zoneDL, this.tickets.length)],
								[zoneDLComplain, this.getPercentage(zoneDLComplain, this.tickets.length)],
								[zoneDLComment, this.getPercentage(zoneDLComment, this.tickets.length)]
							],
						5: [
								[zoneFC, this.getPercentage(zoneFC, this.tickets.length)],
								[zoneFCComplain, this.getPercentage(zoneFCComplain, this.tickets.length)],
								[zoneFCComment, this.getPercentage(zoneFCComment, this.tickets.length)]
							],					
					}
				}

				const sortByProperty = (key) => (x, y) => ((x[key] === y[key]) ? 0 : ((x[key] < y[key]) ? 1 : -1))

				this.localsQ = this.localsQ.sort(sortByProperty('complain'))
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
				function pad(s) { return (s < 10) ? '0' + s : s; }
				let d = new Date(inputFormat)
				let date = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
				let time = [pad(d.getHours()), pad(d.getMinutes())].join(':')
				return `${date} - ${time} hs`
			},

			chunkString(str, length) {
				return str.match(new RegExp('.{1,' + length + '}', 'g'));
			},

			searchTickets() {
				let tickets = this.$firebase.firestore().collection("tickets")
				tickets = tickets.where('business', '==', this.userStorage.business).orderBy("date")
				if (this.read || this.unread || this.closed) {
					if (this.read && !this.unread) tickets = tickets.where('status', '==', 1)
					if (this.unread && !this.read) tickets = tickets.where('status', '==', 0)
					if (this.closed) tickets = tickets.where('status', '==', 2)
				}
				if (this.local) tickets = tickets.where('local', '==', this.localID)
				else {
					if (this.zone) tickets = tickets.where('zone', '==', this.zoneID)
				}
				if (this.complain && !this.comment) {
					tickets = tickets.where('complain', '==', 1)
				}

				if (this.comment && !this.complain) {
					tickets = tickets.where('comment', '==', 1)
				}

				let timeSince = '00:00'
				let timeUntil = '23:59'
				let dateSince = '1999-01-01'
				let dateUntil = '2099-12-31'

				function pad(s) { return (s < 10) ? '0' + s : s }
				function timeSearch(date) { return `${pad(new Date(date).getHours())}:${pad(new Date(date).getMinutes())}` }
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
					.where('date','>=',new Date(`${dateSince} ${timeSince}`).toISOString())
					.where('date','<=',new Date(`${dateUntil} ${timeUntil}`).toISOString())
				}
				
				tickets.onSnapshot(querySnapshot => {
					console.log(querySnapshot)
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
